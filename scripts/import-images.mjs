// One-time import of story images from the WordPress uploads folder.
//
// Every image URL in src/_data/stories_raw/*.json is matched to a file in the
// local uploads copy (../IMG/2019 by default, or UPLOADS_DIR), preferring the
// full-size original over WordPress's resized copies. Each match is resized to
// at most 1600px wide, saved as WebP under src/assets/uploads/, and recorded in
// src/_data/images.json as { url: { src, width, height } }. URLs with no local
// file are recorded as null, and the templates leave those images out.
//
// Run with `npm run images`. Existing outputs are reused, so reruns are quick.
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const storiesDir = join(root, "src/_data/stories_raw");
const uploads = process.env.UPLOADS_DIR || join(root, "IMG/2019");
const outDir = join(root, "src/assets/uploads");
const MAX_W = 1600;

// Files WordPress re-uploaded with a "-1" suffix.
const ALIASES = { "2024/02/hap1-714x1024.jpg": "2019/06/hap1-1-714x1024.jpg" };

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}
const byName = new Map();
for (const f of walk(uploads)) if (!byName.has(basename(f))) byName.set(basename(f), f);

function urlsOf(story) {
  const out = [story.image];
  for (const list of [story.blocks || [], story.short || []])
    for (const b of list) {
      if (b.type === "img") out.push(b.src);
      if (b.type === "gallery") out.push(...b.images.map((i) => i.src));
    }
  return out.filter(Boolean);
}

// The local file for a URL: the unsized original if present, else the exact file.
function localFor(url) {
  const m = url.match(/\/wp-content\/uploads\/(.+)$/);
  if (!m) return null;
  let rel = decodeURIComponent(m[1]);
  if (!url.includes("houseoftaga.com")) {
    return byName.get(basename(rel)) || null;
  }
  rel = ALIASES[rel] || rel;
  const original = rel.replace(/-\d+x\d+(\.\w+)$/, "$1");
  for (const r of [original, rel]) if (existsSync(join(uploads, r))) return join(uploads, r);
  return null;
}

const urls = new Set();
for (const f of readdirSync(storiesDir).filter((f) => f.endsWith(".json")))
  urlsOf(JSON.parse(readFileSync(join(storiesDir, f), "utf8"))).forEach((u) => urls.add(u));

const map = {};
const missing = [];
for (const url of [...urls].sort()) {
  const file = localFor(url);
  if (!file) { map[url] = null; missing.push(url); continue; }
  const rel = file.slice(uploads.length + 1);
  const outRel = rel.slice(0, -extname(rel).length) + ".webp";
  const outPath = join(outDir, outRel);
  if (!existsSync(outPath)) {
    mkdirSync(dirname(outPath), { recursive: true });
    await sharp(file).rotate().resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: 78 }).toFile(outPath);
  }
  const { width, height } = await sharp(outPath).metadata();
  map[url] = { src: "/assets/uploads/" + outRel, width, height };
}

writeFileSync(join(root, "src/_data/images.json"), JSON.stringify(map, null, 1) + "\n");
console.log(`${urls.size - missing.length} imported, ${missing.length} missing`);
for (const u of missing) console.log("  missing:", u);
