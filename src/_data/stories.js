// Loads every story JSON exported from WordPress (see README → Story data) and
// prepares it for the templates: local images, lead paragraph, the "from the
// archive" run, older/newer links and related stories.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import periods from "./periods.js";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "stories_raw");
const images = JSON.parse(readFileSync(join(here, "images.json"), "utf8"));

// The local copy of an image URL, or null when there is none (see scripts/import-images.mjs).
const img = (url) => (url && images[url]) || null;

const titleCase = (s) => (s || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// Marks the first paragraph as the lead and attaches local images.
// Images with no local copy stay in the list with `img: null`; the macro shows their alt text.
function prepare(blocks) {
  let leadDone = false;
  return blocks
    .filter((b) => b.type !== "gallery")
    .map((b) => {
      if (b.type === "p" && !leadDone) { leadDone = true; return { ...b, lead: true }; }
      if (b.type === "img") return { ...b, img: img(b.src) };
      return b;
    });
}

// Full version: the trailing run of images and any gallery blocks become the archive.
function splitArchive(blocks) {
  let tail = blocks.length;
  while (tail > 0 && blocks[tail - 1].type === "img") tail--;
  const archive = blocks.slice(tail)
    .concat(...blocks.filter((b) => b.type === "gallery").map((b) => b.images))
    .map((g) => ({ ...g, img: img(g.src) }))
    .filter((g) => g.img);
  return { body: prepare(blocks.slice(0, tail)), archive };
}

export default function () {
  const stories = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((s) => {
      const p = periods.find((x) => x.period === s.period);
      const { body, archive } = splitArchive(s.blocks || []);
      return {
        ...s,
        url: `/stories/${s.slug}/`,
        periodKey: p.key,
        periodNum: p.num,
        author: titleCase(s.author),
        lead: img(s.image),
        body,
        archive,
        shortBody: s.short && s.short.length ? prepare(s.short) : null,
      };
    });

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
