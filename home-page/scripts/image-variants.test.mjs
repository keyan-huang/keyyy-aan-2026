import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import {
  mkdir,
  readFile,
  readdir,
  rmdir,
  stat,
  unlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { inspectPng } from './lib/lossless-png.mjs';
import { generateImages } from './lib/image-variants.mjs';

const generated = fileURLToPath(
  new URL('../public/generated/images/', import.meta.url),
);

async function removeFixture(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await removeFixture(filename);
    else await unlink(filename);
  }
  await rmdir(directory);
}

async function fixture(t) {
  await mkdir(generated, { recursive: true });
  const directory = path.join(generated, `.test-fixture-${randomUUID()}`);
  await mkdir(directory);
  t.after(() => removeFixture(directory));
  return directory;
}

function rgba(width, height, shift = 0) {
  const data = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      data[index] = (x * 5 + shift) % 256;
      data[index + 1] = (y * 3 + shift) % 256;
      data[index + 2] = (Math.floor(x / 8) * 20 + shift) % 256;
      data[index + 3] = [0, 64, 128, 192, 255][(x + y) % 5];
    }
  }
  return data;
}

async function png(filename, width = 81, height = 57, shift = 0) {
  const data = rgba(width, height, shift);
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 0 })
    .toFile(filename);
  return data;
}

function candidateFile(publicDir, candidate) {
  return path.join(
    publicDir,
    ...candidate.src.slice(1).split('/').map(decodeURIComponent),
  );
}

async function decoded(filename) {
  return sharp(filename)
    .autoOrient()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

await test('PNG inspection rejects invalid input explicitly', () => {
  assert.throws(
    () => inspectPng(Buffer.from('not a PNG')),
    /Invalid PNG signature/,
  );
});

await test('native transparent PNG is pixel-exact, including RGB under fully transparent pixels', async (t) => {
  const publicDir = await fixture(t);
  const original = path.join(publicDir, 'transparent.png');
  const pixels = await png(original);
  const originalBytes = await readFile(original);
  const { manifest } = await generateImages({ publicDir });
  const entry = manifest['/transparent.png'];
  assert.deepEqual(Object.keys(entry), [
    'width',
    'height',
    'bytes',
    'candidates',
  ]);
  assert.equal(entry.bytes, originalBytes.length);
  assert.equal(entry.candidates.length, 1);
  const native = entry.candidates[0];
  assert.ok(native.src.endsWith('.png'));
  assert.equal(native.width, 81);
  assert.equal(native.height, 57);
  assert.ok(native.bytes < entry.bytes);
  assert.deepEqual(
    (await decoded(candidateFile(publicDir, native))).data,
    pixels,
  );
  assert.deepEqual(await readFile(original), originalBytes);
});

await test('EXIF orientation is preserved visually without reducing resolution', async (t) => {
  const publicDir = await fixture(t);
  const original = path.join(publicDir, 'rotated.jpg');
  await sharp({
    create: { width: 40, height: 80, channels: 3, background: '#ca421d' },
  })
    .withMetadata({ orientation: 6 })
    .jpeg({ quality: 95 })
    .toFile(original);
  const originalBytes = await readFile(original);
  const { manifest } = await generateImages({ publicDir });
  const entry = manifest['/rotated.jpg'];
  assert.equal(entry.width, 80);
  assert.equal(entry.height, 40);
  assert.deepEqual(entry.candidates, []);
  assert.deepEqual(await readFile(original), originalBytes);
});

await test('wide-gamut PNG retains its ICC profile and native rendered colors', async (t) => {
  const publicDir = await fixture(t);
  const original = path.join(publicDir, 'profile.png');
  await sharp(rgba(81, 57), { raw: { width: 81, height: 57, channels: 4 } })
    .withIccProfile('p3')
    .png({ compressionLevel: 0 })
    .toFile(original);
  const { manifest } = await generateImages({ publicDir });
  const native = candidateFile(
    publicDir,
    manifest['/profile.png'].candidates.at(-1),
  );
  assert.deepEqual(
    (await sharp(native).metadata()).icc,
    (await sharp(original).metadata()).icc,
  );
  const sourceChunks = inspectPng(await readFile(original)).chunks.filter(
    ({ type }) => type !== 'IDAT',
  );
  const outputChunks = inspectPng(await readFile(native)).chunks.filter(
    ({ type }) => type !== 'IDAT',
  );
  assert.deepEqual(
    outputChunks.map(({ type, data }) => ({ type, data })),
    sourceChunks.map(({ type, data }) => ({ type, data })),
  );
  assert.deepEqual(
    (await decoded(native)).data,
    (await decoded(original)).data,
  );
});

await test('oversized images stay native-resolution PNGs rather than being downscaled to WebP', async (t) => {
  const publicDir = await fixture(t);
  await png(path.join(publicDir, 'wide.png'), 20000, 4);
  await png(path.join(publicDir, 'tall.png'), 2, 20000);
  const { manifest } = await generateImages({ publicDir });
  assert.equal(manifest['/tall.png'].height, 20000);
  assert.equal(manifest['/wide.png'].width, 20000);
  for (const [src, entry] of Object.entries(manifest)) {
    assert.equal(entry.candidates.length, 1);
    const candidate = entry.candidates[0];
    assert.equal(candidate.width, entry.width);
    assert.equal(candidate.height, entry.height);
    assert.ok(candidate.src.endsWith('.png'));
    assert.deepEqual(
      (await decoded(path.join(publicDir, src))).data,
      (await decoded(candidateFile(publicDir, candidate))).data,
    );
  }
});

await test('corrupt headers and truncated pixels fail explicitly without publishing a manifest', async (t) => {
  const publicDir = await fixture(t);
  const source = path.join(publicDir, 'broken.png');
  await writeFile(source, 'not an image');
  await assert.rejects(
    generateImages({ publicDir }),
    /Failed to prepare image \/broken\.png:/,
  );
  await png(source);
  const contents = await readFile(source);
  await writeFile(
    source,
    contents.subarray(0, Math.floor(contents.length / 2)),
  );
  await assert.rejects(
    generateImages({ publicDir }),
    /Failed to prepare image \/broken\.png:/,
  );
  await assert.rejects(
    readFile(path.join(publicDir, 'generated/images/manifest.json')),
    { code: 'ENOENT' },
  );
  await assert.rejects(
    readFile(path.join(publicDir, 'generated/images/.lock')),
    { code: 'ENOENT' },
  );
});

await test('cache avoids all re-encoding; source bytes and configuration invalidate it without deleting old outputs', async (t) => {
  const publicDir = await fixture(t);
  const source = path.join(publicDir, 'cache.png');
  await png(source);
  const originalStat = await stat(source);
  const first = await generateImages({ publicDir });
  const candidate = first.manifest['/cache.png'].candidates[0];
  const output = candidateFile(publicDir, candidate);
  const outputStat = await stat(output);
  const manifestFile = path.join(publicDir, 'generated/images/manifest.json');
  const manifestStat = await stat(manifestFile);
  const second = await generateImages({ publicDir });
  assert.equal(second.summary.cacheHits, 1);
  assert.equal(second.summary.encodedVariants, 0);
  assert.deepEqual(first.manifest, second.manifest);
  assert.equal((await stat(output)).mtimeMs, outputStat.mtimeMs);
  assert.equal((await stat(manifestFile)).mtimeMs, manifestStat.mtimeMs);
  await png(source, 81, 57, 1);
  await utimes(source, originalStat.atime, originalStat.mtime);
  assert.equal((await stat(source)).size, originalStat.size);
  const changed = await generateImages({ publicDir });
  assert.equal(changed.summary.cacheHits, 0);
  assert.notEqual(
    changed.manifest['/cache.png'].candidates[0].src,
    candidate.src,
  );
  assert.equal((await stat(output)).size, candidate.bytes);
  const cacheFile = path.join(publicDir, 'generated/images/.cache.json');
  const cache = JSON.parse(await readFile(cacheFile, 'utf8'));
  cache.configHash = 'outdated-encoder-settings';
  await writeFile(cacheFile, JSON.stringify(cache));
  const reconfigured = await generateImages({ publicDir });
  assert.equal(reconfigured.summary.cacheHits, 0);
  assert.equal(reconfigured.summary.encodedVariants, 1);
  assert.equal(
    reconfigured.manifest['/cache.png'].candidates.at(-1).src,
    changed.manifest['/cache.png'].candidates.at(-1).src,
  );
});

await test('manifest module exports the JSON data and is restored without re-encoding', async (t) => {
  const publicDir = await fixture(t);
  const source = path.join(publicDir, 'module.png');
  await png(source);
  const first = await generateImages({ publicDir });
  const filename = path.join(publicDir, 'generated/images/manifest.js');
  const moduleUrl = pathToFileURL(filename).href;
  const contents = await readFile(filename, 'utf8');
  const originalStat = await stat(filename);
  const json = JSON.parse(
    await readFile(
      path.join(publicDir, 'generated/images/manifest.json'),
      'utf8',
    ),
  );
  assert.deepEqual((await import(moduleUrl)).default, json);
  assert.deepEqual(json, first.manifest);
  await generateImages({ publicDir });
  assert.equal((await stat(filename)).mtimeMs, originalStat.mtimeMs);
  await unlink(filename);
  const restored = await generateImages({ publicDir });
  assert.equal(restored.summary.encodedVariants, 0);
  assert.equal(await readFile(filename, 'utf8'), contents);
  await png(source, 81, 57, 1);
  const changed = await generateImages({ publicDir });
  assert.deepEqual(
    (await import(`${moduleUrl}?changed`)).default,
    changed.manifest,
  );
  assert.notDeepEqual(changed.manifest, first.manifest);
});

await test('corrupted cached output is detected even when its byte length is unchanged', async (t) => {
  const publicDir = await fixture(t);
  await png(path.join(publicDir, 'cache.png'));
  const first = await generateImages({ publicDir });
  const candidate = first.manifest['/cache.png'].candidates[0];
  const filename = candidateFile(publicDir, candidate);
  const bytes = await readFile(filename);
  await writeFile(filename, Buffer.alloc(bytes.length));
  const repaired = await generateImages({ publicDir });
  assert.equal(repaired.summary.cacheHits, 0);
  assert.equal(repaired.summary.encodedVariants, 1);
  assert.deepEqual(await readFile(filename), bytes);
});

await test('JPEGs keep their original encoding and do not get re-encoded on repeat runs', async (t) => {
  const publicDir = await fixture(t);
  const source = path.join(publicDir, 'compact.jpg');
  await sharp(rgba(200, 150), { raw: { width: 200, height: 150, channels: 4 } })
    .removeAlpha()
    .jpeg({ quality: 40 })
    .toFile(source);
  const first = await generateImages({ publicDir });
  assert.deepEqual(first.manifest['/compact.jpg'].candidates, []);
  assert.equal(first.summary.encodedVariants, 0);
  const second = await generateImages({ publicDir });
  assert.equal(second.summary.cacheHits, 1);
  assert.equal(second.summary.encodedVariants, 0);
  assert.equal(
    second.manifest['/compact.jpg'].bytes,
    (await stat(source)).size,
  );
});

await test('manifest includes GIF dimensions without converting animations or documents', async (t) => {
  const publicDir = await fixture(t);
  await mkdir(path.join(publicDir, 'nested'));
  const source = path.join(publicDir, 'nested', 'color #1.PNG');
  await png(source, 700, 351);
  const before = createHash('sha256')
    .update(await readFile(source))
    .digest('hex');
  for (const name of ['vector.svg', 'document.pdf', 'photo.webp']) {
    await writeFile(
      path.join(publicDir, name),
      'untouched non-PNG/JPEG resource',
    );
  }
  const animation = path.join(publicDir, 'animation.gif');
  await sharp({
    create: { width: 20, height: 30, channels: 3, background: '#abcdef' },
  })
    .gif()
    .toFile(animation);
  const originalGif = await readFile(animation);
  const { manifest } = await generateImages({ publicDir });
  assert.deepEqual(Object.keys(manifest), [
    '/animation.gif',
    '/nested/color%20%231.PNG',
  ]);
  assert.equal(manifest['/animation.gif'].width, 20);
  assert.equal(manifest['/animation.gif'].height, 30);
  assert.deepEqual(manifest['/animation.gif'].candidates, []);
  assert.deepEqual(await readFile(animation), originalGif);
  const entry = manifest['/nested/color%20%231.PNG'];
  assert.ok(entry.candidates.length > 0);
  assert.deepEqual(
    entry.candidates.map(({ width }) => width),
    [700],
  );
  for (const candidate of entry.candidates) {
    assert.deepEqual(Object.keys(candidate), [
      'src',
      'width',
      'height',
      'bytes',
    ]);
    assert.match(
      candidate.src,
      /^\/generated\/images\/nested\/color%20%231\.PNG\.[a-f0-9]{64}-\d+\.png$/,
    );
    const filename = candidateFile(publicDir, candidate);
    const { info } = await decoded(filename);
    assert.equal(info.width, candidate.width);
    assert.equal(info.height, candidate.height);
    assert.equal((await stat(filename)).size, candidate.bytes);
    assert.ok(candidate.bytes > 0 && candidate.bytes < entry.bytes);
    assert.ok(
      candidate.width === entry.width && candidate.height === entry.height,
    );
  }
  assert.equal(
    createHash('sha256')
      .update(await readFile(source))
      .digest('hex'),
    before,
  );
  assert.deepEqual(
    JSON.parse(
      await readFile(
        path.join(publicDir, 'generated/images/manifest.json'),
        'utf8',
      ),
    ),
    manifest,
  );
});
