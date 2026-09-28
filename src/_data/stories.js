// Loads every story JSON in stories_raw (exported from WordPress, or written by the CMS)
// and prepares it for the templates: local images, lead paragraph, the "from the
// archive" run, older/newer links and related stories.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import Image from "@11ty/eleventy-img";
import periods from "./periods.js";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "..");
const dir = join(here, "stories_raw");
const images = JSON.parse(readFileSync(join(here, "images.json"), "utf8"));

// The local image for a story image value, or null when there is none:
// - WordPress URLs map through images.json (see scripts/import-images.mjs);
// - site paths such as /assets/uploads/cms/photo.jpg (CMS uploads) are resized to WebP at build time.
const resized = new Map();
async function img(url) {
  if (!url) return null;
  if (url in images) return images[url];
  if (!url.startsWith("/assets/")) return null;
  if (!resized.has(url)) {
    const file = join(src, url);
    resized.set(url, existsSync(file)
      ? Image(file, { widths: [1600], formats: ["webp"], outputDir: "_site/img/", urlPath: "/img/" })
          .then((m) => { const w = m.webp[0]; return { src: w.url, width: w.width, height: w.height }; })
      : Promise.resolve(null));
  }
  return resized.get(url);
}

const titleCase = (s) => (s || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const wordsIn = (blocks) => (blocks || [])
  .map((b) => [b.text, b.cite, ...(b.items || [])].filter(Boolean).join(" "))
  .join(" ").split(/\s+/).filter(Boolean).length;
const minutes = (blocks) => Math.max(1, Math.round(wordsIn(blocks) / 220));

function excerptOf(blocks) {
  const p = (blocks || []).find((b) => b.type === "p");
  if (!p) return "";
  const words = p.text.split(/\s+/);
  return words.length > 32 ? words.slice(0, 32).join(" ") + "…" : p.text;
}

// Marks the first paragraph as the lead and attaches local images.
// Images with no local copy stay in the list with `img: null`; the macro shows their alt text.
async function prepare(blocks) {
  let leadDone = false;
  return Promise.all(blocks
    .filter((b) => b.type !== "gallery")
    .map(async (b) => {
      if (b.type === "p" && !leadDone) { leadDone = true; return { ...b, lead: true }; }
      if (b.type === "img") return { ...b, img: await img(b.src) };
      return b;
    }));
}

// Full version: the trailing run of images and any gallery blocks become the archive.
async function splitArchive(blocks) {
  let tail = blocks.length;
  while (tail > 0 && blocks[tail - 1].type === "img") tail--;
  const archive = (await Promise.all(blocks.slice(tail)
    .concat(...blocks.filter((b) => b.type === "gallery").map((b) => b.images || []))
    .map(async (g) => ({ ...g, img: await img(g.src) }))))
    .filter((g) => g.img);
  return { body: await prepare(blocks.slice(0, tail)), archive };
}

export default async function () {
  const raw = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ slug: basename(f, ".json"), ...JSON.parse(readFileSync(join(dir, f), "utf8")) }))
    .filter((s) => !s.draft)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const stories = await Promise.all(raw.map(async (s) => {
    const p = periods.find((x) => x.period === s.period) || periods[0];
    const blocks = s.blocks || [];
    const hasShort = s.short && s.short.length;
    const { body, archive } = await splitArchive(blocks);
    return {
      ...s,
      date: new Date(s.date).toISOString(),
      url: `/stories/${s.slug}/`,
      period: p.period,
      periodKey: p.key,
      periodNum: p.num,
      author: titleCase(s.author || "House of Taga Desk"),
      excerpt: s.excerpt || excerptOf(blocks),
      readMin: s.readMin || minutes(blocks),
      shortMin: hasShort ? (s.shortMin || minutes(s.short)) : null,
      tags: s.tags || [],
      timeline: s.timeline && s.timeline.length ? s.timeline : null,
      comments: [...(s.comments || [])].sort((a, b) => String(b.date).localeCompare(String(a.date))),
      lead: await img(s.image),
      body,
      archive,
      shortBody: hasShort ? await prepare(s.short) : null,
    };
  }));

  // Newest first, so "older" is the next index and "newer" the previous one.
  const link = (s) => (s ? { title: s.title, url: s.url } : { title: "All stories", url: "/" });
  stories.forEach((s, i) => {
    s.older = link(stories[i + 1]);
    s.newer = link(stories[i - 1]);
    s.related = stories.filter((x) => x.period === s.period && x !== s).slice(0, 6)
      .map(({ slug, title, url, period, periodKey, date, lead }) => ({ slug, title, url, period, periodKey, date, lead }));
  });
  return stories;
}
