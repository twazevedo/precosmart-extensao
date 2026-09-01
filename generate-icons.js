import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createProPNG(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrChunk = createChunk('IHDR', ihdrData);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const cornerRadius = width * 0.28;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData.writeUInt8(0, rowOffset);

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Squircle / rounded box
      const dx = Math.max(Math.abs(x - cx) - (width / 2 - cornerRadius), 0);
      const dy = Math.max(Math.abs(y - cy) - (height / 2 - cornerRadius), 0);
      const dist = Math.hypot(dx, dy);

      if (dist <= cornerRadius) {
        // Linear gradient: Emerald (#10B981) to Cyan (#06B6D4)
        const t = (x + y) / (width + height);
        const r = Math.round(16 * (1 - t) + 6 * t);
        const g = Math.round(185 * (1 - t) + 182 * t);
        const b = Math.round(129 * (1 - t) + 212 * t);

        // Center emblem cut: Lightning Bolt / Tag symbol
        const relX = (x - cx) / (width / 2);
        const relY = (y - cy) / (height / 2);

        // Inner white/neon emblem
        const isEmblem = (
          (relX >= -0.35 && relX <= -0.15 && relY >= -0.55 && relY <= 0.55) || // Vertical bar of P
          (relX >= -0.2 && relX <= 0.35 && relY >= -0.55 && relY <= -0.35) || // Top bar
          (relX >= -0.2 && relX <= 0.35 && relY >= -0.15 && relY <= 0.05) ||  // Middle bar
          (relX >= 0.2 && relX <= 0.4 && relY >= -0.55 && relY <= 0.0) ||     // Right curve
          (relX >= -0.05 && relX <= 0.35 && relY >= 0.15 && relY <= 0.55 && Math.abs(relX - relY + 0.2) < 0.18) // Diagonal tag spark
        );

        if (isEmblem) {
          // Bright white / glowing neon
          rawData.writeUInt8(255, pxOffset);
          rawData.writeUInt8(255, pxOffset + 1);
          rawData.writeUInt8(255, pxOffset + 2);
          rawData.writeUInt8(255, pxOffset + 3);
        } else {
          // Background gradient
          rawData.writeUInt8(r, pxOffset);
          rawData.writeUInt8(g, pxOffset + 1);
          rawData.writeUInt8(b, pxOffset + 2);
          rawData.writeUInt8(255, pxOffset + 3);
        }
      } else {
        // Transparent
        rawData.writeUInt8(0, pxOffset);
        rawData.writeUInt8(0, pxOffset + 1);
        rawData.writeUInt8(0, pxOffset + 2);
        rawData.writeUInt8(0, pxOffset + 3);
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = calculateCRC(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function calculateCRC(buf) {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const iconsDir = path.resolve('icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-16.png'), createProPNG(16, 16));
fs.writeFileSync(path.join(iconsDir, 'icon-48.png'), createProPNG(48, 48));
fs.writeFileSync(path.join(iconsDir, 'icon-128.png'), createProPNG(128, 128));

console.log('Ícones v2.0 Pro (16x16, 48x48, 128x128) gerados com sucesso!');
