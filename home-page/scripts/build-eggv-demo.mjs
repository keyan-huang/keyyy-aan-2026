import { execFile } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const sourceRoot = new URL(
  '../design-options/assets/eggv-demo/',
  import.meta.url,
);
const outputRoot = new URL('../public/eggv/', import.meta.url);
const sources = [1, 2, 3].map(
  (stage) => new URL(`stage-${stage}.png`, sourceRoot),
);
const screens = await Promise.all(
  sources.map((source) =>
    sharp(fileURLToPath(source))
      .flatten({ background: '#ffffff' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true }),
  ),
);
const { width, height, channels } = screens[0].info;
if (
  screens.some(
    ({ info }) =>
      info.width !== width ||
      info.height !== height ||
      info.channels !== channels,
  )
) {
  throw new Error(
    'EggV demo screens must have matching dimensions and channels.',
  );
}

function blend(from, to, amount) {
  const result = Buffer.alloc(from.length);
  for (let index = 0; index < result.length; index += 1) {
    result[index] = Math.round(from[index] * (1 - amount) + to[index] * amount);
  }
  return result;
}

const white = Buffer.alloc(width * height * channels, 255);
const frames = [];
const delays = [];
let previous = white;
for (const { data } of screens) {
  for (const amount of [0.25, 0.5, 0.75]) {
    frames.push(blend(previous, data, amount));
    delays.push(80);
  }
  frames.push(data);
  delays.push(1500);
  previous = data;
}
for (const amount of [0.25, 0.5, 0.75, 1]) {
  frames.push(blend(previous, white, amount));
  delays.push(80);
}

await mkdir(new URL('media/', outputRoot), { recursive: true });
await mkdir(new URL('images/', outputRoot), { recursive: true });
await sharp(Buffer.concat(frames), {
  raw: {
    width,
    height: height * frames.length,
    channels,
    pageHeight: height,
  },
})
  .gif({ loop: 0, delay: delays, colours: 256, dither: 0, effort: 10 })
  .toFile(fileURLToPath(new URL('media/eggv-demo.gif', outputRoot)));
await copyFile(sources[0], new URL('images/demo-poster.png', outputRoot));
await promisify(execFile)('ffmpeg', [
  '-hide_banner',
  '-loglevel',
  'error',
  '-y',
  '-i',
  fileURLToPath(new URL('media/eggv-demo.gif', outputRoot)),
  '-an',
  '-vf',
  'fps=50,scale=out_color_matrix=bt709:out_range=tv',
  '-c:v',
  'libx264',
  '-crf',
  '18',
  '-pix_fmt',
  'yuv420p',
  '-colorspace',
  'bt709',
  '-color_primaries',
  'bt709',
  '-color_trc',
  'iec61966-2-1',
  '-color_range',
  'tv',
  '-movflags',
  '+faststart',
  fileURLToPath(new URL('media/eggv-demo.mp4', outputRoot)),
]);
console.log(
  `Built EggV GIF and MP4: ${width} x ${height}, ${screens.length} screens, ` +
    `${frames.length} frames, ${delays.reduce((total, delay) => total + delay, 0)}ms.`,
);
