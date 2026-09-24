import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { optimizeHtmlImages } from './lib/static-images.mjs';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const output = path.resolve(
  process.argv[2] ?? path.join(projectRoot, 'github-pages'),
);
const version = process.env.GITHUB_SHA;

if (output !== path.join(projectRoot, 'github-pages')) {
  throw new Error(
    'Static output must be home-page/github-pages, never a source directory.',
  );
}

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });
const publicRoot = path.join(projectRoot, 'public');
const generatedRoot = path.join(publicRoot, 'generated');
const manifest = JSON.parse(
  await readFile(path.join(generatedRoot, 'images/manifest.json'), 'utf8'),
);
const generatedFiles = [
  'generated/images/manifest.json',
  'generated/images/manifest.js',
  ...Object.values(manifest).flatMap((image) =>
    image.candidates.map((candidate) =>
      decodeURIComponent(candidate.src.slice(1)),
    ),
  ),
];
const publishedGenerated = new Set();
for (const filename of generatedFiles) {
  let target = path.join(publicRoot, filename);
  while (target.startsWith(`${generatedRoot}${path.sep}`)) {
    publishedGenerated.add(target);
    target = path.dirname(target);
  }
}
await cp(publicRoot, output, {
  recursive: true,
  filter: (source) =>
    !source.startsWith(`${generatedRoot}${path.sep}`) ||
    publishedGenerated.has(source),
});
await cp(
  path.join(projectRoot, 'static/index.html'),
  path.join(output, 'index.html'),
);
await cp(path.join(projectRoot, 'app/home.css'), path.join(output, 'home.css'));
await cp(
  path.join(projectRoot, 'components/home/project-card.css'),
  path.join(output, 'project-card.css'),
);

async function prepareHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return prepareHtml(target);
      if (path.extname(target) !== '.html') return;
      const source = await readFile(target, 'utf8');
      const optimized = optimizeHtmlImages(
        source,
        `/${path.relative(output, target).split(path.sep).join('/')}`,
      );
      const stamped = version
        ? optimized.replace(
            /((?:href|src)=["'])(?!https?:\/\/|\/\/|data:)([^"'?#]+\.(?:css|js))(?:\?[^"']*)?(["'])/g,
            `$1$2?v=${version}$3`,
          )
        : optimized;
      await writeFile(target, stamped);
    }),
  );
}
await prepareHtml(output);

await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Prepared static site in ${output}`);
