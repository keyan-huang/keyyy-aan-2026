import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.argv[2] ?? 'github-pages');
const errors = [];
let referenceCount = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    }),
  );
  return nested.flat();
}

function isLocalReference(reference) {
  return !/^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(reference);
}

function resolveReference(source, reference) {
  const cleanReference = reference.split(/[?#]/, 1)[0];
  if (!cleanReference || !isLocalReference(cleanReference)) return;

  let decodedReference;
  try {
    decodedReference = decodeURIComponent(cleanReference);
  } catch {
    errors.push(`${path.relative(root, source)} has an invalid URL: ${reference}`);
    return;
  }

  const target = decodedReference.startsWith('/')
    ? path.join(root, decodedReference.slice(1))
    : path.resolve(path.dirname(source), decodedReference);

  referenceCount += 1;
  return target;
}

async function verifyReference(source, reference) {
  const target = resolveReference(source, reference);
  if (!target) return;

  const relativeTarget = path.relative(root, target);
  if (relativeTarget.startsWith(`..${path.sep}`) || path.isAbsolute(relativeTarget)) {
    errors.push(`${path.relative(root, source)} points outside the site: ${reference}`);
    return;
  }

  try {
    await stat(target);
  } catch {
    errors.push(`${path.relative(root, source)} references missing ${relativeTarget}`);
  }
}

function collectJsonReferences(value, references = []) {
  if (typeof value === 'string') {
    if (/\.(?:avif|css|gif|html?|jpe?g|js|json|mp4|png|svg|webm|webp)(?:[?#].*)?$/i.test(value)) {
      references.push(value.startsWith('.') || value.startsWith('/') ? value : `/${value}`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectJsonReferences(item, references));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectJsonReferences(item, references));
  }
  return references;
}

const files = await walk(root);
for (const file of files) {
  const details = await stat(file);
  const relativeFile = path.relative(root, file);
  if (details.size === 0 && path.basename(file) !== '.nojekyll') {
    errors.push(`${relativeFile} is empty`);
  }

  const extension = path.extname(file).toLowerCase();
  if (!['.css', '.html', '.js', '.json'].includes(extension)) continue;

  const source = await readFile(file, 'utf8');
  const references = [];
  if (extension === '.html') {
    references.push(...source.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi).map((match) => match[1]));
    references.push(...source.matchAll(/\bfrom\s+["']([^"']+)["']/g).map((match) => match[1]));
  } else if (extension === '.css') {
    references.push(...source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi).map((match) => match[1]));
  } else if (extension === '.js') {
    references.push(...source.matchAll(/\bfrom\s+["']([^"']+)["']/g).map((match) => match[1]));
    references.push(...source.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g).map((match) => match[1]));
  } else {
    try {
      references.push(...collectJsonReferences(JSON.parse(source)));
    } catch {
      errors.push(`${relativeFile} is not valid JSON`);
    }
  }

  await Promise.all(references.map((reference) => verifyReference(file, reference)));
}

if (errors.length) {
  console.error(`Static site audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Static site audit passed: ${files.length} files and ${referenceCount} local references checked.`);
}
