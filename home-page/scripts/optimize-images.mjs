import { generateImages } from './lib/image-variants.mjs';

try {
  const { summary } = await generateImages();
  console.log(
    `Images: ${summary.sources} originals, ${summary.candidates} pixel-verified native-resolution copies, ` +
      `${summary.cacheHits} cached originals, ${summary.encodedVariants} encodes.`,
  );
  console.log(
    `Full-resolution delivery (original retained when needed): ` +
      `${summary.largestCandidateOrOriginalBytes.toLocaleString('en-US')} / ` +
      `${summary.sourceBytes.toLocaleString('en-US')} bytes ` +
      `(${summary.savedBytes.toLocaleString('en-US')} bytes saved).`,
  );
  console.log(
    'Originals preserved. JPEG, GIF, SVG and PDF files are never converted. Stale generations are retained.',
  );
  for (const { src, reason } of summary.retainedOriginals) {
    console.log(`Original retained: ${src} (${reason}).`);
  }
} catch (error) {
  console.error(`Image generation failed: ${error.message}`);
  process.exitCode = 1;
}
