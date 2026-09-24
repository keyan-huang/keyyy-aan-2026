import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import {
  lstat,
  mkdir,
  open,
  readFile,
  readdir,
  realpath,
  rename,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { inspectPng, recompressPng } from './lossless-png.mjs';

export const MAX_INPUT_PIXELS = 64 * 1024 * 1024;

const OUTPUT_DIRECTORY = path.join('generated', 'images');
const INPUT_OPTIONS = { failOn: 'warning', limitInputPixels: MAX_INPUT_PIXELS };

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function fileDigest(filename) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(filename)) hash.update(chunk);
  return hash.digest('hex');
}

function siteUrl(relativePath) {
  return `/${relativePath.split(path.sep).map(encodeURIComponent).join('/')}`;
}

function validDimension(value) {
  return Number.isSafeInteger(value) && value > 0;
}

async function statIfPresent(filename) {
  try {
    return await lstat(filename);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function regularFileIfPresent(filename) {
  const info = await statIfPresent(filename);
  if (info && !info.isFile()) {
    throw new Error(
      `Refusing to read or overwrite a non-regular file: ${filename}`,
    );
  }
  return info;
}

async function ensureDirectory(root, relativeDirectory) {
  let current = root;
  for (const segment of relativeDirectory.split(path.sep).filter(Boolean)) {
    if (segment === '..' || path.isAbsolute(segment)) {
      throw new Error(`Unsafe output directory: ${relativeDirectory}`);
    }
    current = path.join(current, segment);
    try {
      await mkdir(current);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    const info = await lstat(current);
    if (!info.isDirectory() || info.isSymbolicLink()) {
      throw new Error(
        `Refusing to traverse a non-directory or symbolic link: ${current}`,
      );
    }
  }
}

async function atomicWrite(filename, contents) {
  await regularFileIfPresent(filename);
  const staging = `${filename}.${process.pid}-${randomUUID()}.part`;
  try {
    await writeFile(staging, contents, { flag: 'wx' });
    await rename(staging, filename);
  } finally {
    await unlink(staging).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}

async function writeTextIfChanged(filename, contents) {
  if (await regularFileIfPresent(filename)) {
    if ((await readFile(filename, 'utf8')) === contents) return;
  }
  await atomicWrite(filename, contents);
}

async function writeJsonIfChanged(filename, data) {
  await writeTextIfChanged(filename, `${JSON.stringify(data, null, 2)}\n`);
}

async function readCache(filename) {
  if (!(await regularFileIfPresent(filename))) return {};
  try {
    return JSON.parse(await readFile(filename, 'utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(`Rebuilding invalid image cache: ${filename}`);
      return {};
    }
    throw error;
  }
}

async function findSources(publicDir, relativeDirectory = '') {
  const sources = [];
  const directory = path.join(publicDir, relativeDirectory);
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const relative = path.join(relativeDirectory, entry.name);
    if (relative === OUTPUT_DIRECTORY) continue;
    if (entry.isDirectory()) {
      sources.push(...(await findSources(publicDir, relative)));
    } else if (entry.isFile() && /\.(?:png|jpe?g|gif)$/i.test(entry.name)) {
      sources.push(relative);
    } else if (
      entry.isSymbolicLink() &&
      /\.(?:png|jpe?g|gif)$/i.test(entry.name)
    ) {
      throw new Error(`Image sources must not be symbolic links: ${relative}`);
    }
  }
  return sources;
}

function candidatePath(relative, key, width, format) {
  return path.join(OUTPUT_DIRECTORY, `${relative}.${key}-${width}.${format}`);
}

function manifestEntry(entry) {
  return {
    width: entry.width,
    height: entry.height,
    bytes: entry.bytes,
    candidates: entry.candidates.map(({ src, width, height, bytes }) => ({
      src,
      width,
      height,
      bytes,
    })),
  };
}

async function validCacheEntry(entry, key, sourceBytes, relative, publicDir) {
  if (
    !entry ||
    entry.key !== key ||
    entry.bytes !== sourceBytes ||
    !validDimension(entry.width) ||
    !validDimension(entry.height) ||
    !Array.isArray(entry.candidates)
  ) {
    return false;
  }
  let previousWidth = 0;
  for (const candidate of entry.candidates) {
    const format = path.extname(candidate.src).slice(1);
    const output = candidatePath(relative, key, candidate.width, format);
    if (
      format !== 'png' ||
      candidate.width !== entry.width ||
      candidate.width <= previousWidth ||
      candidate.height !==
        Math.max(
          1,
          Math.round((entry.height * candidate.width) / entry.width),
        ) ||
      candidate.src !== siteUrl(output) ||
      !validDimension(candidate.bytes) ||
      candidate.bytes >= sourceBytes ||
      !/^[a-f0-9]{64}$/.test(candidate.hash)
    ) {
      return false;
    }
    previousWidth = candidate.width;
    const filename = path.join(publicDir, output);
    const info = await regularFileIfPresent(filename);
    if (
      !info ||
      info.size !== candidate.bytes ||
      (await fileDigest(filename)) !== candidate.hash
    ) {
      return false;
    }
  }
  return true;
}

function configuration() {
  return {
    version: 4,
    input: INPUT_OPTIONS,
    compression: 'png-idat-deflate-level-9',
    resolution: 'native-only-no-resampling',
    orientation: 'auto-orient',
    colour: 'preserve-png-color-chunks-and-verify-decoded-rgba',
    encoder: Object.fromEntries(
      Object.entries(sharp.versions).sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
}

// The public manifest is deliberately just URL -> dimensions, bytes and candidates.
// Private cache entries also retain rejected attempts via the content/config key.
export async function generateImages({
  publicDir = fileURLToPath(new URL('../../public/', import.meta.url)),
} = {}) {
  publicDir = await realpath(publicDir);
  const configHash = digest(JSON.stringify(configuration()));
  const outputDir = path.join(publicDir, OUTPUT_DIRECTORY);
  await ensureDirectory(publicDir, OUTPUT_DIRECTORY);
  const lockFile = path.join(outputDir, '.lock');
  let lock;
  try {
    lock = await open(lockFile, 'wx');
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error(
        `Image generation is already locked: ${lockFile}. If an interrupted process left this file, remove only that lock after confirming no generator is running.`,
      );
    }
    throw error;
  }

  const previousConcurrency = sharp.concurrency();
  const previousCache = sharp.cache();
  // One source and one variant at a time, with a hard input-pixel limit and no
  // retained libvips image cache. Large native images must not run concurrently.
  sharp.concurrency(1);
  sharp.cache(false);
  try {
    await lock.writeFile(`${process.pid}\n`);
    const oldCache = await readCache(path.join(outputDir, '.cache.json'));
    const oldImages =
      oldCache?.configHash === configHash ? oldCache.images : {};
    const images = {};
    const manifest = {};
    const summary = {
      sources: 0,
      candidates: 0,
      sourceBytes: 0,
      largestCandidateOrOriginalBytes: 0,
      variantBytes: 0,
      cacheHits: 0,
      encodedVariants: 0,
      rejectedVariants: 0,
      retainedOriginals: /** @type {{ src: string, reason: string }[]} */ ([]),
    };
    for (const relative of await findSources(publicDir)) {
      const source = path.join(publicDir, relative);
      const url = siteUrl(relative);
      try {
        const sourceInfo = await regularFileIfPresent(source);
        const sourceHash = await fileDigest(source);
        const key = digest(`${configHash}:${sourceHash}`);
        let entry = oldImages?.[url];
        if (
          await validCacheEntry(
            entry,
            key,
            sourceInfo.size,
            relative,
            publicDir,
          )
        ) {
          summary.cacheHits++;
        } else {
          const metadata = await sharp(source, INPUT_OPTIONS).metadata();
          if (!['png', 'jpeg', 'gif'].includes(metadata.format)) {
            throw new Error(
              `Expected PNG, JPEG or GIF content, found ${metadata.format}.`,
            );
          }
          const swapped = [5, 6, 7, 8].includes(metadata.orientation);
          const width = swapped ? metadata.height : metadata.width;
          const height = swapped
            ? metadata.width
            : (metadata.pageHeight ?? metadata.height);
          const sourceData =
            metadata.format === 'png' ? await readFile(source) : null;
          const png = sourceData ? inspectPng(sourceData) : null;
          // Metadata parsing alone does not detect truncated image data. Decode
          // even images with no usable candidates before publishing a manifest.
          await sharp(source, INPUT_OPTIONS).stats();
          entry = {
            key,
            width,
            height,
            bytes: sourceInfo.size,
            candidates: [],
          };
          if (
            metadata.format === 'gif' ||
            metadata.pages > 1 ||
            png?.animated
          ) {
            entry.reason = 'Animation retained byte-for-byte';
          } else if (metadata.format === 'jpeg') {
            entry.reason = 'Original JPEG encoding retained';
          }
          for (const candidateWidth of entry.reason ? [] : [width]) {
            const data = recompressPng(sourceData, png.chunks);
            const info = await sharp(data, INPUT_OPTIONS).metadata();
            const candidateSwapped = [5, 6, 7, 8].includes(info.orientation);
            const candidateHeight = candidateSwapped ? info.width : info.height;
            const actualWidth = candidateSwapped ? info.height : info.width;
            summary.encodedVariants++;
            if (actualWidth !== candidateWidth || candidateHeight !== height) {
              throw new Error(
                `Unexpected encoded dimensions: ${info.width} × ${info.height}.`,
              );
            }
            if (data.length >= sourceInfo.size) {
              summary.rejectedVariants++;
              entry.reason = 'Original is smaller than the lossless copy';
              continue;
            }
            const originalPixels = await sharp(source, INPUT_OPTIONS)
              .autoOrient()
              .ensureAlpha()
              .raw()
              .toBuffer();
            const candidatePixels = await sharp(data, INPUT_OPTIONS)
              .autoOrient()
              .ensureAlpha()
              .raw()
              .toBuffer();
            const candidateMetadata = await sharp(
              data,
              INPUT_OPTIONS,
            ).metadata();
            if (
              !originalPixels.equals(candidatePixels) ||
              !(metadata.icc ?? Buffer.alloc(0)).equals(
                candidateMetadata.icc ?? Buffer.alloc(0),
              )
            ) {
              summary.rejectedVariants++;
              entry.reason =
                'Original retained: decoded pixels or color profile differ';
              continue;
            }
            const output = candidatePath(relative, key, actualWidth, 'png');
            await ensureDirectory(publicDir, path.dirname(output));
            await atomicWrite(path.join(publicDir, output), data);
            entry.candidates.push({
              src: siteUrl(output),
              width: actualWidth,
              height: candidateHeight,
              bytes: data.length,
              hash: digest(data),
            });
          }
          if ((await fileDigest(source)) !== sourceHash) {
            throw new Error(
              'Source changed during generation; rerun against a stable source tree.',
            );
          }
        }
        images[url] = entry;
        if (entry.reason) {
          summary.retainedOriginals.push({ src: url, reason: entry.reason });
        }
        manifest[url] = manifestEntry(entry);
        summary.sources++;
        summary.sourceBytes += entry.bytes;
        summary.candidates += entry.candidates.length;
        summary.variantBytes += entry.candidates.reduce(
          (sum, candidate) => sum + candidate.bytes,
          0,
        );
        summary.largestCandidateOrOriginalBytes +=
          entry.candidates.at(-1)?.bytes ?? entry.bytes;
      } catch (error) {
        throw new Error(`Failed to prepare image ${url}: ${error.message}`, {
          cause: error,
        });
      }
    }
    await writeJsonIfChanged(path.join(outputDir, '.cache.json'), {
      configHash,
      images,
    });
    await writeJsonIfChanged(path.join(outputDir, 'manifest.json'), manifest);
    await writeTextIfChanged(
      path.join(outputDir, 'manifest.js'),
      `export default ${JSON.stringify(manifest, null, 2)};\n`,
    );
    summary.savedBytes =
      summary.sourceBytes - summary.largestCandidateOrOriginalBytes;
    return { manifest, summary };
  } finally {
    sharp.concurrency(previousConcurrency);
    sharp.cache({
      memory: previousCache.memory.max,
      files: previousCache.files.max,
      items: previousCache.items.max,
    });
    await lock.close();
    await unlink(lockFile);
  }
}
