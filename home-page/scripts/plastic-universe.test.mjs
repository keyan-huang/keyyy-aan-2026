import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { parse } from 'parse5';
import sharp from 'sharp';

const projectRoot = new URL('../public/plastic-universe/', import.meta.url);
const document = parse(
  await readFile(new URL('index.html', projectRoot), 'utf8'),
);
const homepage = parse(
  await readFile(new URL('../static/index.html', import.meta.url), 'utf8'),
);

function attr(node, name) {
  return node.attrs?.find((attribute) => attribute.name === name)?.value;
}

function findAll(node, predicate) {
  return [
    ...(predicate(node) ? [node] : []),
    ...(node.childNodes ?? []).flatMap((child) => findAll(child, predicate)),
  ];
}

function text(node) {
  return (
    node.value ?? (node.childNodes ?? []).map((child) => text(child)).join('')
  );
}

function hasClass(node, name) {
  return attr(node, 'class')?.split(' ').includes(name);
}

await test('Plastic Universe is a compact additional card with the same introduction as the case study', () => {
  const [section] = findAll(homepage, (node) => attr(node, 'id') === 'fun');
  const cards = findAll(section, (node) => hasClass(node, 'project'));
  const card = cards.find(
    (node) =>
      findAll(
        node,
        (child) => attr(child, 'href') === '/plastic-universe/index.html',
      ).length,
  );
  assert.ok(card);
  assert.ok(hasClass(card, 'project--compact'));
  const [heading] = findAll(card, (node) => node.tagName === 'h3');
  assert.equal(text(heading), 'Plastic Universe');
  const [summary] = findAll(card, (node) => node.tagName === 'p');
  const [intro] = findAll(document, (node) => hasClass(node, 'hero-summary'));
  assert.equal(
    text(summary).replace(/\s+/g, ' ').trim(),
    text(intro).replace(/\s+/g, ' ').trim(),
  );
  const [thumbnail] = findAll(card, (node) => node.tagName === 'img');
  assert.equal(attr(thumbnail, 'src'), '/plastic-universe/thumbnail.png');
  assert.equal(attr(thumbnail, 'width'), '1734');
  assert.equal(attr(thumbnail, 'height'), '675');
  assert.match(attr(thumbnail, 'alt'), /seven Plastic Pals characters/);
  assert.equal(attr(thumbnail, 'loading'), 'lazy');
});

await test('homepage thumbnail preserves the selected Figma artwork without replacing the case-study hero', async () => {
  const metadata = await sharp(
    await readFile(new URL('thumbnail.png', projectRoot)),
  ).metadata();
  assert.equal(metadata.width, 1734);
  assert.equal(metadata.height, 675);
  const [hero] = findAll(document, (node) => hasClass(node, 'hero'));
  const [heroImage] = findAll(hero, (node) => node.tagName === 'img');
  assert.equal(attr(heroImage, 'src'), 'images/exhibition-overview.png');
});

await test('case study follows the source character-design process and credits the collaborators', () => {
  const headings = findAll(document, (node) => node.tagName === 'h1');
  assert.equal(headings.length, 1);
  assert.equal(text(headings[0]), 'Plastic Universe');
  const steps = findAll(document, (node) => hasClass(node, 'process-step'));
  assert.deepEqual(
    steps.map((step) =>
      text(findAll(step, (node) => node.tagName === 'h3')[0]),
    ),
    [
      '01 / Start with familiar shapes',
      '02 / Explore silhouettes and expressions',
      '03 / Build a shared visual language',
    ],
  );
  const [characters] = findAll(document, (node) =>
    hasClass(node, 'character-gallery'),
  );
  assert.equal(findAll(characters, (node) => node.tagName === 'img').length, 7);
  const [posters] = findAll(document, (node) => hasClass(node, 'poster-grid'));
  assert.equal(findAll(posters, (node) => node.tagName === 'img').length, 4);
  const content = text(document).replace(/\s+/g, ' ');
  assert.match(content, /Keyan Huang, Thao Nguyen, and Helen Prum/);
  assert.match(content, /Fall 2023 – Spring 2024/);
  assert.doesNotMatch(content, /Photo by|Exhibition photography credited/i);
  assert.doesNotMatch(content, /A collaborative project by/);
  assert.equal(
    findAll(document, (node) => hasClass(node, 'project-credit')).length,
    0,
  );
  assert.doesNotMatch(content, /placeholder|coming soon|lorem ipsum/i);
});

await test('research, persona, and original branding appear before the character process', () => {
  const [main] = findAll(document, (node) => node.tagName === 'main');
  const sections = main.childNodes.filter((node) => node.tagName === 'section');
  assert.deepEqual(
    sections.slice(0, 5).map((node) => attr(node, 'aria-labelledby')),
    ['overview', 'research', 'persona', 'branding', 'character-design'],
  );
  const research = text(sections[1]).replace(/\s+/g, ' ');
  assert.match(research, /secondary sources/);
  for (const theme of ['Complexity', 'Contamination', 'Everyday habits']) {
    assert.ok(research.includes(theme));
  }
  const persona = text(sections[2]).replace(/\s+/g, ' ');
  const [card] = findAll(sections[2], (node) => hasClass(node, 'persona-card'));
  assert.equal(card.tagName, 'details');
  assert.equal(attr(card, 'open'), undefined);
  const elements = card.childNodes.filter((node) => node.tagName);
  assert.equal(elements[0].tagName, 'summary');
  assert.equal(text(elements[0]), 'Persona - Noah');
  assert.equal(attr(elements[0], 'id'), 'persona');
  assert.ok(hasClass(elements[1], 'persona-content'));
  assert.equal(
    findAll(elements[1], (node) => hasClass(node, 'persona-grid')).length,
    1,
  );
  assert.equal(
    findAll(elements[1], (node) => hasClass(node, 'design-response')).length,
    1,
  );
  assert.match(persona, /Noah Travis/);
  assert.match(persona, /8 years old \/ Third grader \/ Austin, Texas/);
  assert.match(persona, /research persona/);
  assert.match(persona, /Challenges/);
  assert.match(persona, /Goals/);
  assert.match(persona, /What this meant for the design/);
  assert.doesNotMatch(persona, /Designing for Noah/);
  const branding = text(sections[3]).replace(/\s+/g, ' ');
  assert.match(branding, /Paralucent Bold/);
  assert.match(branding, /Azo Sans Medium/);
  assert.deepEqual(
    findAll(sections[3], (node) => node.tagName === 'img').map((node) =>
      attr(node, 'src'),
    ),
    [
      'images/brand-typography.png',
      'images/character-color-palette.png',
      'images/brand-color-palette.png',
    ],
  );
});

await test('all 33 original visuals are used at their native dimensions with descriptive alternatives', async () => {
  const images = findAll(document, (node) => node.tagName === 'img');
  assert.equal(images.length, 33);
  const used = new Set();
  for (const image of images) {
    const source = attr(image, 'src');
    assert.ok(source.startsWith('images/'));
    const metadata = await sharp(
      await readFile(new URL(source, projectRoot)),
    ).metadata();
    assert.equal(Number(attr(image, 'width')), metadata.width, source);
    assert.equal(Number(attr(image, 'height')), metadata.height, source);
    assert.ok(attr(image, 'alt')?.length >= 30, source);
    if (source === 'images/exhibition-overview.png') {
      assert.equal(attr(image, 'fetchpriority'), 'high');
    } else {
      assert.equal(attr(image, 'loading'), 'lazy', source);
    }
    used.add(source.slice('images/'.length));
  }
  assert.deepEqual(
    [...used].sort((left, right) => left.localeCompare(right)),
    (await readdir(new URL('images/', projectRoot))).sort((left, right) =>
      left.localeCompare(right),
    ),
  );
});

await test('exhibition photos form orientation-matched rows and include the girl touching the globe', () => {
  const expectedRows = [
    ['concept-gallery', ['exhibition-concept.png', 'exhibition-mockup.png']],
    ['room-gallery', ['main-wall.png', 'panels-green.png']],
    [
      'detail-gallery',
      [
        'panels-yellow.png',
        'panels-red.png',
        'globe-installation.png',
        'visitor-globe.png',
      ],
    ],
    ['opening-gallery', ['opening-night.png', 'visitors.png']],
  ];
  for (const [className, filenames] of expectedRows) {
    const [row] = findAll(document, (node) => hasClass(node, className));
    assert.ok(hasClass(row, 'exhibition-gallery'));
    assert.deepEqual(
      findAll(row, (node) => node.tagName === 'img').map((node) =>
        attr(node, 'src'),
      ),
      filenames.map((filename) => `images/${filename}`),
    );
  }
  const [girl] = findAll(
    document,
    (node) => attr(node, 'src') === 'images/visitor-globe.png',
  );
  assert.match(attr(girl, 'alt'), /girl.*touch.*globe/);
  assert.equal(attr(girl, 'width'), '449');
  assert.equal(attr(girl, 'height'), '788');
  const [exhibition] = findAll(
    document,
    (node) => attr(node, 'aria-labelledby') === 'exhibition',
  );
  assert.ok(findAll(exhibition, (node) => node === girl).length);
});

await test('shared shell and in-page anchors are wired without extra interaction scripts', () => {
  assert.ok(
    findAll(document, (node) => attr(node, 'data-site-header') !== undefined)
      .length,
  );
  assert.ok(
    findAll(document, (node) => attr(node, 'data-site-footer') !== undefined)
      .length,
  );
  assert.deepEqual(
    findAll(document, (node) => node.tagName === 'script').map((node) =>
      attr(node, 'src'),
    ),
    ['../scripts/site-shell.js'],
  );
  const ids = findAll(document, (node) => attr(node, 'id')).map((node) =>
    attr(node, 'id'),
  );
  assert.equal(ids.length, new Set(ids).size);
  for (const node of findAll(document, (child) =>
    attr(child, 'aria-labelledby'),
  )) {
    assert.ok(ids.includes(attr(node, 'aria-labelledby')));
  }
  const [skip] = findAll(document, (node) => hasClass(node, 'skip-link'));
  assert.equal(attr(skip, 'href'), '#case-study');
});
