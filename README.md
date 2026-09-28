# House of Taga — an homage to Chamorro culture

The history of the Northern Mariana Islands (Saipan, Tinian and Rota), told one story at a time. By Alexie Zotomayor.

Built with [Eleventy](https://www.11ty.dev/) 3 (Nunjucks) and hosted on Netlify, with Netlify Forms for Contact and Comments.

## Run it

```bash
npm install
npm start          # dev server with live reload
npm run build      # production build into _site/
```

Node 20 or later is required (`.nvmrc` pins 22).

## Where things live

| Path | What |
|---|---|
| `src/_data/site.js` | Name, URL, contact email, copyright, the featured story (`featuredSlug`), optional About portrait |
| `src/_data/periods.js` | The four periods: nav, period pages, labels and old WordPress category slugs |
| `src/_data/stories_raw/*.json` | One file per story, exported from WordPress (schema in `design_handoff_house_of_taga/README.md` → Story data) |
| `src/_data/stories.js` | Prepares stories for the templates: local images, lead paragraph, archive photos, older/newer, related |
| `src/_data/images.json` | Story image URL → local WebP with its width and height. Written by `npm run images` |
| `src/_data/comments/<slug>.json` | Approved comments (see below) |
| `src/_includes/` | `base.njk`, `home.njk` (home and period pages), `story.njk`, `page.njk` (About, Contact, Privacy), and partials |
| `src/assets/css/site.css` | The stylesheet and design tokens |
| `src/assets/js/site.js` | Share, time-ago, reading progress, short/full toggle, form submit |
| `src/assets/uploads/` | Story images, resized from the WordPress uploads |
| `src/redirects.njk` | Builds `_redirects`, which keeps old WordPress URLs working |
| `scripts/import-images.mjs` | One-time image import from the WordPress uploads folder |
| `design_handoff_house_of_taga/` | The original design handoff (reference only, not built) |

## Pages

- `/` is the featured story (`featuredSlug` in `site.js`) plus the ten latest. Older stories page on at `/page/2/`, `/page/3/` and so on.
- `/pre-contact/`, `/colonial/`, `/wwii/`, `/contemporary/` list every story in that period.
- `/stories/<slug>/` is one story.
- `/about/`, `/contact/`, `/privacy/`, `/thanks/` (where forms land without JavaScript) and `/404.html`.

## Adding a story

Add `src/_data/stories_raw/<slug>.json` in the same shape as the others (`slug`, `title`, `date`, `author`, `period`, `image`, `blocks`…). Stories are sorted by `date`, so the newest goes first automatically. For a short version, add `short`, `shortMin` and the toggle appears.

For images, put the file in `src/assets/uploads/` and add its entry to `src/_data/images.json`, or put the original in the uploads folder and run `npm run images`.

## Approving comments

Comments are moderated. Submissions arrive in Netlify → Forms → **comments**, with the story slug in the `story` field. To publish one, add it to `src/_data/comments/<slug>.json`:

```json
[
  { "name": "Rosa", "text": "My grandmother told this story too.", "date": "2026-10-02T08:30:00Z" }
]
```

Commit and push. Netlify rebuilds and the comment appears, newest first.

## Contact form

Submissions arrive in Netlify → Forms → **contact**. Turn on email notifications there (Forms → Form notifications) so they reach hafadai@houseoftaga.com.

## Images

Story images came from the WordPress `wp-content/uploads` folder (kept on the owner's machine, not in this repo). `npm run images` matches each image URL in the stories to the full-size original, resizes it to 1600px wide as WebP, and records its size so pages don't jump while loading. Images with no local file are left out: in-story photos with alt text show that text in a box, and missing archive photos are skipped.

These 30 images were not in the uploads folder and are gone from the old sites. Replacing them means finding the originals, adding them to the uploads folder and running `npm run images`:

| Story | Missing |
|---|---|
| the-battle-of-saipan-tinian | 13 archive photos from zotomayor.com: Destroyed H8K base at Tanapag, GIs at the sugar mill wreckage, Japanese POW, KO'd Japanese tank, Marines following a Sherman, cave clearing, Marines leading women and children, civilians rounded up, Tapotchau, Marines at the airstrip, `020930-F-9999G-005`, `1356_001`, `10407149_…_n` |
| remembering-wwii-bombardier-hap-halloran | `hapdon`, `1024x1024`, `10511648_…_o`, `COVER-HAP`, `hap-on-tinian-pit`, `hap2` |
| usmc-maj-rick-spooner-sacrifices-made-worthwhile | `IMG_6157-min`, `IMG_6163-min` |
| wwii-marine-veteran-fred-leroy-desrosier-lived-a-life-of-service | `Dad-in-Saipan-1944`, `saipan-landing` |
| 2-groups-of-yap-chamorros-return-home | `Yap-Chamorros-leave` |
| chief-nurse-marion-olds-recounts-japanese-attack-on-guam | `Headline2` |
| from-naval-to-civilian-rule-nanyo-cho-in-the-marianas | `Local-primary-school-students` |
| in-memoriam-princess-taiping | `taipingatsea` |
| remarkable-structures-from-the-japanese-period | `puntan-a` |
| supertyphoon-yutu-banishes-japanese-era-dwellings-into-oblivion | `IMG_8469` |
| unearthing-3500-years-of-chamorro-history | `latte_village_01` |

Every story still has its lead image.

Run `npm run images` to print the current list.

## Redirects

Old WordPress permalinks (`/<slug>/`) redirect to `/stories/<slug>/`, and old category pages (`/category/wwii/` and so on) redirect to the period pages. `src/redirects.njk` generates these from the story list, so new stories need nothing extra.

## Still open

- Three years in the Battle of Saipan text read 1945 where 1944 is likely: the June 15 landing morning, "Saipan secured July 9" and "Tinian secured August 1".
- "Still Finding Amelia" describes an August 2025 expedition as if it is still to come.
- Short versions exist for the 10 newest stories. The other 44 have none yet.
- The About and Privacy copy are drafts to approve. The About page needs a portrait: add it to `src/assets/` and set `portrait` in `site.js`.
