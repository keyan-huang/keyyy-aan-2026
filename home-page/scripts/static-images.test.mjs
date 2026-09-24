import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parse } from 'parse5';
import { optimizeHtmlImages } from './lib/static-images.mjs';
import {
  getImageAttributes,
  imageSizes,
} from '../public/scripts/responsive-images.js';

function images(source, pathname = '/paf-redesign/index.html') {
  const result = [];
  function visit(node) {
    if (node.tagName === 'img') {
      result.push(
        Object.fromEntries(node.attrs.map(({ name, value }) => [name, value])),
      );
    }
    node.childNodes?.forEach(visit);
  }
  visit(parse(optimizeHtmlImages(source, pathname)));
  return result;
}

await test('case-study hero is eager and responsive without changing its original URL', () => {
  const [hero] = images(
    '<main class="case-study"><img src="images/paf-hero.png?v=original" alt="A &amp; B"></main>',
  );
  assert.equal(hero.src, 'images/paf-hero.png?v=original');
  assert.equal(hero.alt, 'A & B');
  assert.equal(hero.loading, 'eager');
  assert.equal(hero.fetchpriority, 'high');
  assert.equal(hero.decoding, 'async');
  assert.equal(hero.width, '3082');
  assert.equal(hero.height, '2026');
  assert.match(hero.srcset, /^\/generated\/images\/.+ \d+w/);
});

await test('below-fold media is lazy and existing display dimensions are preserved', () => {
  const [image] = images(
    '<div class="project-thumbnail"><img src="/paf-redesign/thumbnail.png" width="1000" height="750"></div>',
    '/index.html',
  );
  assert.equal(image.loading, 'lazy');
  assert.equal(image.width, '1000');
  assert.equal(image.height, '750');
  assert.equal(image.sizes, imageSizes.project);
});

await test('animations retain their original URL and do not receive still-image candidates', () => {
  const [animation] = images('<img src="media/step-1-employee-selection.gif">');
  assert.equal(animation.src, 'media/step-1-employee-selection.gif');
  assert.equal(animation.loading, 'lazy');
  assert.equal(animation.srcset, undefined);
  assert.ok(Number(animation.width) > 0);
  assert.ok(Number(animation.height) > 0);
});

await test('React and static image delivery share the same candidate set', () => {
  const [image] = images(
    '<img src="../paf-redesign/images/paf-hero.png">',
    '/performance-discussion-form/index.html',
  );
  const props = getImageAttributes(
    '/paf-redesign/images/paf-hero.png',
    imageSizes.study,
  );
  assert.equal(image.srcset, props.srcSet);
  assert.equal(image.width, String(props.width));
  assert.equal(image.sizes, props.sizes);
});

await test('related project links and escaped text survive HTML preparation', () => {
  const source =
    '<a class="related-project-card" href="../paf-redesign/index.html"><h3>First<br>Second &amp; Third</h3><img src="../paf-redesign/images/paf-hero.png" alt=""></a>';
  const optimized = optimizeHtmlImages(
    source,
    '/dashboard-customization-user-testing/index.html',
  );
  assert.match(optimized, /href="\.\.\/paf-redesign\/index.html"/);
  assert.match(optimized, /First<br>Second &amp; Third/);
  assert.equal(
    images(source, '/dashboard-customization-user-testing/index.html')[0].sizes,
    imageSizes.related,
  );
});

await test('external and embedded images are not rewritten', () => {
  const [external, embedded] = images(
    '<img src="https://example.com/photo.png"><img src="data:image/png;base64,AAA">',
  );
  assert.deepEqual(external, { src: 'https://example.com/photo.png' });
  assert.deepEqual(embedded, { src: 'data:image/png;base64,AAA' });
});

await test('a missing local raster reports a stale manifest rather than silently degrading', () => {
  assert.throws(
    () => getImageAttributes('/images/missing-original.png', '320px'),
    /Image missing from manifest.*Run pnpm images:prepare/,
  );
});
