import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { parse } from 'parse5';
import sharp from 'sharp';

const homepage = parse(
  await readFile(new URL('../static/index.html', import.meta.url), 'utf8'),
);
const experiment = parse(
  await readFile(new URL('../public/eggv/index.html', import.meta.url), 'utf8'),
);
const site = JSON.parse(
  await readFile(
    new URL('../public/content/site.json', import.meta.url),
    'utf8',
  ),
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
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes ?? []).map(text).join('');
}

function byClass(node, name) {
  return findAll(node, (child) =>
    attr(child, 'class')?.split(' ').includes(name),
  );
}

await test('landing-page hero preserves its three lines and existing emphasis', () => {
  const [hero] = byClass(homepage, 'hero-story');
  const headings = findAll(hero, (node) => node.tagName === 'h1');
  assert.equal(headings.length, 1);
  assert.deepEqual(
    byClass(headings[0], 'hero-line').map((line) =>
      text(line).replace(/\s+/g, ' ').trim(),
    ),
    [
      'Keyan Huang designs for',
      'clarity and confidence',
      'in complex experiences',
    ],
  );
  assert.deepEqual(byClass(headings[0], 'hero-emphasis').map(text), [
    'Keyan Huang',
    'clarity',
    'confidence',
    'complex',
  ]);
  assert.equal(
    text(byClass(hero, 'availability')[0]).replace(/\s+/g, ' ').trim(),
    'Open to opportunities',
  );
  assert.equal(byClass(hero, 'hero-story-art').length, 12);
  assert.equal(byClass(hero, 'hero-story-summary').length, 1);
  assert.equal(byClass(homepage, 'portfolio-loader').length, 0);
});

await test('Additional Projects groups the Dashboard study, EggV, and Plastic Universe', () => {
  const sections = findAll(homepage, (node) => node.tagName === 'section');
  const index = sections.findIndex((node) => attr(node, 'id') === 'fun');
  assert.ok(index > 0);
  const fun = sections[index];
  assert.equal(attr(sections[index - 1], 'id'), 'work');
  assert.equal(attr(sections[index + 1], 'id'), 'me');
  assert.equal(attr(fun, 'hidden'), undefined);
  assert.equal(attr(fun, 'class'), 'additional-projects section-wide');
  assert.equal(
    text(findAll(fun, (node) => node.tagName === 'h2')[0]),
    'Additional Projects',
  );
  assert.equal(byClass(fun, 'project--compact').length, 3);
  const links = findAll(fun, (node) => node.tagName === 'a');
  assert.deepEqual(
    links.map((link) => attr(link, 'href')),
    [
      '/dashboard-customization-user-testing/index.html',
      '/eggv/index.html',
      '/plastic-universe/index.html',
    ],
  );
  const featured = byClass(sections[index - 1], 'project');
  assert.equal(featured.length, 2);
  assert.deepEqual(
    featured.map((card) => attr(byClass(card, 'project-card-link')[0], 'href')),
    ['/performance-discussion-form/index.html', '/paf-redesign/index.html'],
  );
  assert.equal(byClass(sections[index - 1], 'project--compact').length, 0);
  assert.doesNotMatch(text(homepage), /Fun experiments|Design Experiments/);
  assert.doesNotMatch(text(fun), /Second place/);
  assert.equal(byClass(fun, 'experiment-meta').length, 0);
  assert.doesNotMatch(text(fun), /24-hour hackathon/);
});

await test('shared and static navigation omit Additional without removing the project section', () => {
  assert.deepEqual(site.navigation, [
    { label: 'Work', section: 'work' },
    { label: 'About', section: 'me' },
  ]);
  const [navigation] = findAll(homepage, (node) => node.tagName === 'nav');
  assert.deepEqual(
    findAll(navigation, (node) => node.tagName === 'a').map(text),
    ['Work', 'About'],
  );
  assert.equal(
    findAll(homepage, (node) => attr(node, 'id') === 'fun').length,
    1,
  );
});

await test('all homepage project actions sit with the introduction before the thumbnail', () => {
  const cards = byClass(homepage, 'project');
  assert.equal(cards.length, 5);
  const destinations = [
    '/performance-discussion-form/index.html',
    '/paf-redesign/index.html',
    '/dashboard-customization-user-testing/index.html',
    '/eggv/index.html',
    '/plastic-universe/index.html',
  ];
  cards.forEach((card, index) => {
    const children = card.childNodes.filter((node) => node.tagName);
    assert.equal(children.length, 3);
    const [cardLink, description, thumbnail] = children;
    assert.equal(attr(cardLink, 'class'), 'project-card-link');
    assert.equal(attr(cardLink, 'href'), destinations[index]);
    assert.equal(attr(description, 'class'), 'project-description');
    assert.ok(
      attr(thumbnail, 'class').split(' ').includes('project-thumbnail'),
    );
    assert.deepEqual(
      description.childNodes
        .filter((node) => node.tagName)
        .map((node) => node.tagName),
      ['h3', 'p', 'span'],
    );
    const [action] = byClass(description, 'project-action');
    assert.equal(action.tagName, 'span');
    assert.equal(text(action).replace(/\s+/g, ' ').trim(), 'Explore');
    assert.equal(byClass(card, 'project-action').length, 1);
    assert.equal(byClass(card, 'project-card-link').length, 1);
  });
});

await test('PAF titles keep End-to-End together across homepage and case studies', async () => {
  const documents = [
    homepage,
    ...(await Promise.all(
      [
        'paf-redesign',
        'performance-discussion-form',
        'dashboard-customization-user-testing',
      ].map(async (project) =>
        parse(
          await readFile(
            new URL(`../public/${project}/index.html`, import.meta.url),
            'utf8',
          ),
        ),
      ),
    )),
  ];
  for (const document of documents) {
    const headings = findAll(
      document,
      (node) =>
        ['h1', 'h3'].includes(node.tagName) &&
        text(node).includes('Re-architecting'),
    );
    assert.equal(headings.length, 1);
    assert.ok(text(headings[0]).includes('End\u2011to\u2011End'));
    assert.doesNotMatch(text(headings[0]), /End-to-End/);
  }
});

await test('EggV uses the compact shared layout and requested title and action', () => {
  const card = byClass(homepage, 'project--compact').find(
    (node) =>
      attr(byClass(node, 'project-card-link')[0], 'href') ===
      '/eggv/index.html',
  );
  assert.ok(attr(card, 'class').split(' ').includes('project'));
  const [description] = byClass(card, 'project-description');
  const [summary] = findAll(description, (node) => node.tagName === 'p');
  assert.equal(
    summary.childNodes
      .filter((node) => node.nodeName === '#text')
      .map(text)
      .join('')
      .replace(/\s+/g, ' ')
      .trim(),
    text(byClass(experiment, 'hero-summary')[0]).replace(/\s+/g, ' ').trim(),
  );
  const [title] = findAll(description, (node) => node.tagName === 'h3');
  assert.equal(
    text(title).replace(/\s+/g, ' ').trim(),
    'Hackathon Toyota Challenge Winner - EggV',
  );
  const [thumbnail] = byClass(card, 'project-thumbnail');
  assert.ok(
    attr(thumbnail, 'class').split(' ').includes('project-thumbnail-eggv'),
  );
  const images = findAll(thumbnail, (node) => node.tagName === 'img');
  assert.equal(images.length, 1);
  assert.equal(attr(images[0], 'src'), '/eggv/thumbnail.png');
  assert.equal(attr(images[0], 'width'), '1512');
  assert.equal(attr(images[0], 'height'), '982');
  assert.equal(attr(images[0], 'loading'), 'lazy');
  assert.match(attr(images[0], 'alt'), /EggV artwork with a green dinosaur/);
  assert.doesNotMatch(text(thumbnail), /placeholder/i  );
  const [action] = byClass(card, 'project-action');
  assert.equal(action.tagName, 'span');
  assert.equal(text(action).replace(/\s+/g, ' ').trim(), 'Explore');
  const [cardLink] = byClass(card, 'project-card-link');
  assert.equal(attr(cardLink, 'href'), '/eggv/index.html');
});

await test('EggV thumbnail retains the native Figma export dimensions', async () => {
  const image = await readFile(
    new URL('../public/eggv/thumbnail.png', import.meta.url),
  );
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(image.readUInt32BE(16), 1512);
  assert.equal(image.readUInt32BE(20), 982);
});

await test('EggV begins with the award and documents hackathon duration and team', () => {
  const [hero] = byClass(experiment, 'hero');
  assert.equal(
    text(findAll(hero, (node) => node.tagName === 'h1')[0]),
    'Hackathon Toyota Challenge Winner - EggV',
  );
  assert.equal(
    text(byClass(hero, 'hero-summary')[0]).replace(/\s+/g, ' ').trim(),
    'Designed and delivered within 24 hours to empower EV owners with energy insights and gamified motivation.',
  );
  assert.match(text(hero), /24 hours/);
  assert.match(text(hero), /1 designer \+ 3 engineers/);
  const headings = findAll(experiment, (node) => node.tagName === 'h2').map(
    text,
  );
  assert.deepEqual(headings, [
    'A 24-hour hackathon',
    'Inspiration',
    'What it does',
    'Your impact, trip by trip',
    'Everyday EV care',
    'From the hackathon to Toyota',
  ]);
  assert.doesNotMatch(
    text(experiment),
    /Building EggV|How we built it|Back to fun experiments|What's next for EggV/,
  );
});

await test('EggV ends with a university news card using the original title without a date', () => {
  const [main] = findAll(experiment, (node) => node.tagName === 'main');
  const sections = findAll(main, (node) => node.tagName === 'section');
  const finalSection = sections.at(-1);
  const [link] = byClass(finalSection, 'university-recognition');
  const [headline] = byClass(link, 'university-news-title');
  assert.equal(
    text(headline).replace(/\s+/g, ' ').trim(),
    'Students Accelerate Engineering, Tech Skills at Toyota Hackathon',
  );
  assert.equal(findAll(link, (node) => node.tagName === 'time').length, 0);
  assert.doesNotMatch(text(link), /Aug\. 12, 2022/);
  assert.doesNotMatch(attr(link, 'aria-label'), /Aug\. 12, 2022/);
  const [logo] = byClass(link, 'university-logo');
  assert.equal(attr(logo, 'src'), 'images/ut-dallas-logo.png');
  assert.equal(attr(logo, 'alt'), 'The University of Texas at Dallas');
  assert.match(text(link), /Read the full article/);
  assert.equal(
    attr(link, 'href'),
    'https://news.utdallas.edu/students-teaching/toyota-hackathon-2022/',
  );
  assert.equal(attr(link, 'target'), '_blank');
  assert.equal(attr(link, 'rel'), 'noopener noreferrer');
  assert.equal(
    finalSection.childNodes.filter((node) => node.tagName).at(-1),
    link,
  );
});

await test('EggV uses all requested event, feature, and Toyota photos in order', () => {
  const images = findAll(experiment, (node) => node.tagName === 'img');
  assert.deepEqual(
    images.map((image) => attr(image, 'src')),
    [
      'images/hackathon-event.png',
      'images/hackathon-team.png',
      'images/charging-map.png',
      'images/maintenance.png',
      'images/technical-details.png',
      'images/vehicle-advice.png',
      'images/toyota-challenge-award.png',
      'images/toyota-headquarters-team.png',
      'images/toyota-hackathon.png',
      'images/ut-dallas-logo.png',
    ],
  );
  assert.equal(byClass(experiment, 'media-placeholder').length, 0);
  const [overview] = byClass(experiment, 'overview-grid');
  assert.deepEqual(
    findAll(overview, (node) => node.tagName === 'h2').map(text),
    ['Inspiration', 'What it does'],
  );
  assert.equal(byClass(experiment, 'feature-card').length, 4);
  assert.match(
    text(experiment).replace(/\s+/g, ' '),
    /We won the Toyota Challenge and were invited to the Toyota hackathon at their North American headquarters\./,
  );
});

await test('EggV image dimensions match their saved exports and every image has alt text', async () => {
  for (const image of findAll(experiment, (node) => node.tagName === 'img')) {
    const source = attr(image, 'src');
    const buffer = await readFile(
      new URL(`../public/eggv/${source}`, import.meta.url),
    );
    assert.equal(
      buffer.subarray(0, 8).toString('hex'),
      '89504e470d0a1a0a',
      source,
    );
    assert.equal(Number(attr(image, 'width')), buffer.readUInt32BE(16), source);
    assert.equal(
      Number(attr(image, 'height')),
      buffer.readUInt32BE(20),
      source,
    );
    assert.ok(attr(image, 'alt')?.length > 20, source);
  }
});

await test('demo GIF has three readable 1.5-second holds, short fades, and native dimensions', async () => {
  const animation = await readFile(
    new URL('../public/eggv/media/eggv-demo.gif', import.meta.url),
  );
  const metadata = await sharp(animation, { animated: true }).metadata();
  assert.equal(metadata.format, 'gif');
  assert.equal(metadata.width, 1512);
  assert.equal(metadata.pageHeight, 982);
  assert.equal(metadata.pages, 16);
  assert.equal(metadata.loop, 0);
  assert.deepEqual(
    metadata.delay,
    [80, 80, 80, 1500, 80, 80, 80, 1500, 80, 80, 80, 1500, 80, 80, 80, 80],
  );
  assert.ok(animation.length < 2 * 1024 * 1024, 'GIF should stay below 2 MiB');

  for (const [stage, page] of [
    [1, 3],
    [2, 7],
    [3, 11],
  ]) {
    const actual = await sharp(animation, { page, pages: 1 })
      .removeAlpha()
      .raw()
      .toBuffer();
    const expected = await sharp(
      await readFile(
        new URL(
          `../design-options/assets/eggv-demo/stage-${stage}.png`,
          import.meta.url,
        ),
      ),
    )
      .flatten({ background: '#ffffff' })
      .removeAlpha()
      .raw()
      .toBuffer();
    assert.equal(actual.length, expected.length);
    let difference = 0;
    for (let index = 0; index < actual.length; index += 1) {
      difference += Math.abs(actual[index] - expected[index]);
    }
    assert.ok(
      difference / actual.length < 3,
      `Stage ${stage} should preserve readable source artwork`,
    );
  }
});

await test('demo provides native playback, a clickable surface, and right-hand controls', async () => {
  const [video] = findAll(
    experiment,
    (node) => attr(node, 'id') === 'demo-video',
  );
  assert.equal(video.tagName, 'video');
  assert.equal(attr(video, 'src'), 'media/eggv-demo.mp4');
  assert.equal(attr(video, 'poster'), 'images/demo-poster.png');
  for (const attribute of ['muted', 'loop', 'playsinline', 'controls']) {
    assert.equal(attr(video, attribute), '');
  }
  assert.equal(attr(video, 'autoplay'), undefined);
  const [annotation] = byClass(experiment, 'demo-annotation');
  const [button] = findAll(
    annotation,
    (node) => attr(node, 'data-demo-toggle') !== undefined,
  );
  assert.equal(button.tagName, 'button');
  assert.equal(attr(button, 'aria-controls'), 'demo-video');
  const [surface] = findAll(
    experiment,
    (node) => attr(node, 'data-demo-surface') !== undefined,
  );
  assert.equal(surface.tagName, 'button');
  assert.equal(attr(surface, 'aria-controls'), 'demo-video');
  assert.equal(attr(surface, 'aria-label'), 'Resume demo');
  const poster = await readFile(
    new URL('../public/eggv/images/demo-poster.png', import.meta.url),
  );
  assert.equal(poster.readUInt32BE(16), Number(attr(video, 'width')));
  assert.equal(poster.readUInt32BE(20), Number(attr(video, 'height')));
  const mp4 = await readFile(
    new URL('../public/eggv/media/eggv-demo.mp4', import.meta.url),
  );
  assert.equal(mp4.subarray(4, 8).toString(), 'ftyp');
  assert.ok(mp4.length < 2 * 1024 * 1024, 'MP4 should stay below 2 MiB');
  assert.equal(
    findAll(experiment, (node) => attr(node, 'href') === 'media/eggv-demo.gif')
      .length,
    0,
  );
});
