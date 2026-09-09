import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.argv[2] ?? path.join(projectRoot, 'github-pages'));
const version = process.env.GITHUB_SHA;

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });
await cp(path.join(projectRoot, 'public'), output, { recursive: true });
await cp(path.join(projectRoot, 'static/index.html'), path.join(output, 'index.html'));
await cp(path.join(projectRoot, 'app/home.css'), path.join(output, 'home.css'));
await cp(
  path.join(projectRoot, 'components/home/project-card.css'),
  path.join(output, 'project-card.css'),
);

if (version) {
  async function stampHtml(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) return stampHtml(target);
        if (path.extname(target) !== '.html') return;
        const source = await readFile(target, 'utf8');
        const stamped = source
          .replaceAll('site-shell.css"', `site-shell.css?v=${version}"`)
          .replaceAll('site-shell.js"', `site-shell.js?v=${version}"`);
        await writeFile(target, stamped);
      }),
    );
  }
  await stampHtml(output);
}

await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Prepared static site in ${output}`);
