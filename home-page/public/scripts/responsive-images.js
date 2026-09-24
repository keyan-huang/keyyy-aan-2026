import manifest from '../generated/images/manifest.js';

/**
 * @typedef {{ src: string, width: number, height: number, bytes: number }} Candidate
 * @typedef {{ width: number, height: number, bytes: number, candidates: Candidate[] }} ImageEntry
 */

/** @type {Record<string, ImageEntry>} */
const images = manifest;

export const imageSizes = {
  logo: '44px',
  illustration: '(max-width: 700px) 22vw, 250px',
  binoculars: '(max-width: 700px) 180px, 344px',
  footer: '(max-width: 700px) 310px, 460px',
  project:
    '(max-width: 760px) calc(100vw - 98px), (max-width: 1199px) 42vw, 550px',
  portrait: '(max-width: 760px) calc(100vw - 48px), 420px',
  gallery: '(max-width: 700px) 85vw, 520px',
  related: '(max-width: 720px) calc(100vw - 48px), 544px',
  study: '(max-width: 850px) calc(100vw - 48px), 1120px',
  studyHero: '(max-width: 720px) calc((100vw - 48px) / 2), 450px',
};

/**
 * Keeps the original URL as a fallback and full-resolution lightbox source.
 * @param {string} src Absolute site URL, optionally with a cache query.
 * @param {string} sizes
 */
export function getImageAttributes(src, sizes) {
  const pathname = src.split(/[?#]/, 1)[0];
  const image = images[pathname];
  if (!image && /\.(?:png|jpe?g|gif)$/i.test(pathname)) {
    throw new Error(
      `Image missing from manifest: ${pathname}. Run pnpm images:prepare.`,
    );
  }
  const candidates = image?.candidates ?? [];
  if (
    image &&
    candidates.some(
      (candidate) =>
        candidate.width !== image.width || candidate.height !== image.height,
    )
  ) {
    throw new Error(
      `Reduced-resolution image rejected: ${pathname}. Run pnpm images:prepare.`,
    );
  }
  const sourceSet = candidates.map(
    (candidate) => `${candidate.src} ${candidate.width}w`,
  );
  return {
    src,
    ...(image && { width: image.width, height: image.height }),
    ...(sourceSet.length && {
      sizes,
      srcSet: sourceSet.join(', '),
    }),
  };
}

/**
 * @param {string} src
 * @param {string} sizes
 * @param {'eager' | 'lazy'} loading
 */
export function createResponsiveImage(src, sizes, loading = 'lazy') {
  const image = document.createElement('img');
  const {
    src: fallback,
    srcSet,
    ...attributes
  } = getImageAttributes(src, sizes);
  Object.assign(image, attributes);
  if (srcSet) image.srcset = srcSet;
  image.loading = loading;
  image.decoding = 'async';
  image.src = fallback;
  return image;
}
