import { parse, serialize } from 'parse5';
import {
  getImageAttributes,
  imageSizes,
} from '../../public/scripts/responsive-images.js';

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value;
}

function hasClass(node, name) {
  return attribute(node, 'class')?.split(/\s+/).includes(name);
}

function within(node, className) {
  for (let parent = node; parent; parent = parent.parentNode) {
    if (hasClass(parent, className)) return true;
  }
  return false;
}

function setAttribute(node, name, value) {
  const existing = node.attrs.find((item) => item.name === name);
  if (existing) existing.value = String(value);
  else node.attrs.push({ name, value: String(value) });
}

function imageSize(node, pathname) {
  if (hasClass(node, 'logo')) return imageSizes.logo;
  if (hasClass(node, 'binoculars')) return imageSizes.binoculars;
  if (within(node, 'art-row')) return imageSizes.illustration;
  if (within(node, 'project-thumbnail')) return imageSizes.project;
  if (within(node, 'portrait-frame')) return imageSizes.portrait;
  if (within(node, 'tool-icons')) return '76px';
  if (within(node, 'education-item')) return '52px';
  if (within(node, 'experience-item')) return '48px';
  if (within(node, 'photo-card')) return imageSizes.gallery;
  if (within(node, 'related-project-card')) return imageSizes.related;
  if (
    pathname.includes('dashboard-customization-user-testing') &&
    within(node, 'hero-media')
  ) {
    return imageSizes.studyHero;
  }
  return imageSizes.study;
}

export function optimizeHtmlImages(source, pathname) {
  const document = parse(source);
  let studyImage = 0;
  function visit(node) {
    if (node.tagName === 'img') {
      const src = attribute(node, 'src');
      if (src && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) {
        const url = new URL(src, `https://portfolio.invalid${pathname}`);
        const attributes = getImageAttributes(
          `${url.pathname}${url.search}`,
          imageSize(node, pathname),
        );
        const inStudy = within(node, 'case-study');
        const isStudyHero = inStudy && studyImage++ === 0;
        const eager =
          hasClass(node, 'logo') ||
          hasClass(node, 'binoculars') ||
          within(node, 'first-row') ||
          isStudyHero;
        for (const [name, value] of Object.entries(attributes)) {
          if (name === 'src' || value === undefined) continue;
          if (['width', 'height'].includes(name) && attribute(node, name))
            continue;
          setAttribute(node, name.toLowerCase(), value);
        }
        setAttribute(node, 'decoding', 'async');
        setAttribute(node, 'loading', eager ? 'eager' : 'lazy');
        if (isStudyHero || hasClass(node, 'binoculars')) {
          setAttribute(node, 'fetchpriority', 'high');
        }
      }
    }
    node.childNodes?.forEach(visit);
  }
  visit(document);
  return serialize(document);
}
