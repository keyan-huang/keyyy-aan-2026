import { crc32, deflateSync, inflateSync } from 'node:zlib';

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const colorChunks = new Set(['gAMA', 'cHRM', 'sRGB', 'iCCP', 'cICP']);

export function inspectPng(data) {
  if (!data.subarray(0, 8).equals(signature)) {
    throw new Error('Invalid PNG signature.');
  }
  const chunks = [];
  for (let offset = 8; offset < data.length;) {
    const length = data.readUInt32BE(offset);
    const end = offset + length + 12;
    if (end > data.length) throw new Error('Truncated PNG chunk.');
    const type = data.toString('ascii', offset + 4, offset + 8);
    chunks.push({
      type,
      start: offset,
      end,
      data: data.subarray(offset + 8, end - 4),
    });
    offset = end;
  }
  return {
    chunks,
    hasColorMetadata: chunks.some(({ type }) => colorChunks.has(type)),
    animated: chunks.some(({ type }) => type === 'acTL'),
  };
}

export function recompressPng(data, chunks) {
  const imageChunks = chunks.filter(({ type }) => type === 'IDAT');
  if (!imageChunks.length) throw new Error('PNG has no image data.');
  for (let index = 1; index < imageChunks.length; index++) {
    if (imageChunks[index - 1].end !== imageChunks[index].start) {
      throw new Error('PNG image data chunks must be contiguous.');
    }
  }
  const compressed = deflateSync(
    inflateSync(Buffer.concat(imageChunks.map((chunk) => chunk.data))),
    { level: 9 },
  );
  const chunk = Buffer.alloc(compressed.length + 12);
  chunk.writeUInt32BE(compressed.length);
  chunk.write('IDAT', 4, 'ascii');
  compressed.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, -4)), chunk.length - 4);
  return Buffer.concat([
    data.subarray(0, imageChunks[0].start),
    chunk,
    data.subarray(imageChunks.at(-1).end),
  ]);
}
