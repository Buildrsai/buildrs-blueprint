/**
 * Linear.app Clone — Asset Download Script
 * Downloads all required assets: font, grain texture, favicons, and section images
 */

import { createWriteStream, existsSync, mkdirSync } from "fs";
import { pipeline } from "stream/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

async function download(url, dest) {
  if (existsSync(dest)) {
    console.log(`  SKIP (exists): ${path.relative(PUBLIC, dest)}`);
    return;
  }
  const dir = path.dirname(dest);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  console.log(`  Downloading: ${path.relative(PUBLIC, dest)}`);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Referer: "https://linear.app/",
    },
  });
  if (!res.ok) {
    console.error(`  ERROR ${res.status}: ${url}`);
    return;
  }
  await pipeline(res.body, createWriteStream(dest));
}

async function downloadBatch(items, concurrency = 4) {
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map(({ url, dest }) => download(url, dest)));
  }
}

const assets = [
  // ── Font ──────────────────────────────────────────────────
  {
    url: "https://static.linear.app/fonts/InterVariable.woff2?v=4.1",
    dest: path.join(PUBLIC, "fonts/InterVariable.woff2"),
  },

  // ── Textures ──────────────────────────────────────────────
  {
    url: "https://static.linear.app/static/grain-default.png",
    dest: path.join(PUBLIC, "images/grain-default.png"),
  },

  // ── Favicons ──────────────────────────────────────────────
  {
    url: "https://linear.app/favicon.ico",
    dest: path.join(PUBLIC, "seo/favicon.ico"),
  },
  {
    url: "https://linear.app/static/favicon.svg",
    dest: path.join(PUBLIC, "seo/favicon.svg"),
  },
  {
    url: "https://linear.app/static/apple-touch-icon.png?v=2",
    dest: path.join(PUBLIC, "seo/apple-touch-icon.png"),
  },

  // ── Hero mockup ───────────────────────────────────────────
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/c7b144b7-4ef0-4991-9bcb-617c6a37d200/public",
    dest: path.join(PUBLIC, "images/hero-mockup.png"),
  },

  // ── Section 1: Intake ─────────────────────────────────────
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/c7fa8f5f-d439-4329-6a65-de549b51e300/public",
    dest: path.join(PUBLIC, "images/section1-intake-mockup.png"),
  },

  // ── Section UI elements ───────────────────────────────────
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/f28b59f4-538c-4517-cfd7-510913015200/public",
    dest: path.join(PUBLIC, "images/avatar-codex.png"),
  },
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/13a0909f-186f-4d83-3fd3-d04883ec2d00/public",
    dest: path.join(PUBLIC, "images/avatar-codex-2.png"),
  },

  // ── Customer avatars ──────────────────────────────────────
  {
    url: "https://webassets.linear.app/images/ornj730p/production/f79251b06e9edeeacbf2875384defe629e000b3c-352x352.png",
    dest: path.join(PUBLIC, "images/avatar-karri.png"),
  },
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/c8aeedda-7726-4a4f-226a-f573f85d8d00/public",
    dest: path.join(PUBLIC, "images/avatar-didier.png"),
  },
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/e408d7c9-e3a3-4802-e4d4-51ed197c3a00/public",
    dest: path.join(PUBLIC, "images/avatar-steven.png"),
  },
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/a482eab9-69d1-412f-f2ce-8f72444fcb00/public",
    dest: path.join(PUBLIC, "images/avatar-ema.png"),
  },
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/229693cb-2eda-40d1-ba64-ce6762435200/public",
    dest: path.join(PUBLIC, "images/avatar-meg.png"),
  },

  // ── AI tool logos ─────────────────────────────────────────
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/f9ed2721-1966-4abc-129b-93aaac1a6200/public",
    dest: path.join(PUBLIC, "images/logo-github-copilot.png"),
  },
  {
    url: "https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/5a228df7-2423-4807-6105-cd32ddddde00/public",
    dest: path.join(PUBLIC, "images/logo-cursor.png"),
  },
];

console.log(`\nDownloading ${assets.length} assets to public/...\n`);
await downloadBatch(assets, 4);
console.log("\nDone!\n");
