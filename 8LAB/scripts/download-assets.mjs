import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../app/public');

const assets = [
  // Logos
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/6780c821cb23ba8e3e38f846_Group%202%20(17).webp', dest: 'images/logo-8lab.webp' },
  // Hero images
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/6751f6ac528163c0966c4f7b_Frame%20239.webp', dest: 'images/hero-cling-vert.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/6751f6d3d2a048754721d339_SVG%20(6).webp', dest: 'images/hero-arrow.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/67b4acfa1985ed703f616870_kDyKhQFN_400x400.webp', dest: 'images/avatar-1.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/67b4ac9049d9318cc51b9ffb_2kM0jb-2_400x400.webp', dest: 'images/avatar-2.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/67b4ac90770d3709219ab3a4_CleanShot%202025-02-18%20at%2016.47.59%402x.webp', dest: 'images/avatar-3.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/67b4ac90a825530cf3a5c74f_qF_dTJUn_400x400.webp', dest: 'images/avatar-4.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/67b4ac90e785581feb22bf06_1YyfBnvV_400x400.webp', dest: 'images/avatar-5.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/67521f50cfb79160298c2af6_Star%201.webp', dest: 'images/star.webp' },
  // Hero blur overlays
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/6752e1429621e89be405eac0_Group%2022%20(6).png', dest: 'images/blur-left.png' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/6752e1ab87b2b36d9e239b40_Group%2047676.png', dest: 'images/blur-right.png' },
  // Hero stats icons
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/6752f9e8804724bed2cc87fa_Frame%2047677%20(2).webp', dest: 'images/icon-formation.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/675494e0fe1c579ce8462481_Container.webp', dest: 'images/icon-container.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/675494ecf93b975b38339ec9_users-03.webp', dest: 'images/icon-users.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/675494fab70806b6b651789c_package.webp', dest: 'images/icon-package.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/67554c066a09d65d0bd3882b_presentation-chart-02.webp', dest: 'images/icon-chart.webp' },
  { url: 'https://cdn.prod.website-files.com/665f1c02fd605624c6b2d5a1/675494cd4dea0778f72c386f_star-06%20(1).webp', dest: 'images/icon-star.webp' },
];

async function downloadAsset(url, destRelative) {
  const destPath = join(PUBLIC_DIR, destRelative);
  mkdirSync(dirname(destPath), { recursive: true });

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed: ${url} (${response.status})`);
    return;
  }

  const buffer = await response.arrayBuffer();
  const { writeFileSync } = await import('fs');
  writeFileSync(destPath, Buffer.from(buffer));
  console.log(`✓ ${destRelative}`);
}

// Batch download — 4 at a time
async function downloadAll() {
  console.log(`Downloading ${assets.length} assets to ${PUBLIC_DIR}...`);
  const chunks = [];
  for (let i = 0; i < assets.length; i += 4) {
    chunks.push(assets.slice(i, i + 4));
  }
  for (const chunk of chunks) {
    await Promise.all(chunk.map(a => downloadAsset(a.url, a.dest)));
  }
  console.log('Done!');
}

downloadAll().catch(console.error);
