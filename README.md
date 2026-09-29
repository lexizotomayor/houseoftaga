# House of Taga — field notes on history, memory, and life in the Marianas

The history of the Northern Mariana Islands (Saipan, Tinian and Rota), told one story at a time. By Alexie Zotomayor.

Built with [Eleventy](https://www.11ty.dev/) 3 (Nunjucks) and hosted on Netlify, with Netlify Forms for Contact and Comments and a content editor (Decap CMS) at `/admin/`.

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
| `src/_data/site.js` | Name, URL, contact email, copyright |
| `src/_data/settings.json`, `about.json`, `privacy.json` | Featured story, About and Privacy text (edited in the CMS under Pages) |
| `src/_data/periods.js` | The four periods: nav, period pages, labels and old WordPress category slugs |
| `src/_data/stories_raw/*.json` | One file per story; the file name is the story's address. Exported from WordPress, and edited in the CMS |
| `src/_data/stories.js` | Prepares stories for the templates: local images, lead paragraph, archive photos, older/newer, related |
| `src/_data/images.json` | Story image URL → local WebP with its width and height. Written by `npm run images` |
| `src/admin/` | The CMS: `config.yml` lists what can be edited |
| `src/_includes/` | `base.njk`, `home.njk` (home and period pages), `story.njk`, `page.njk` (About, Contact, Privacy), and partials |
| `src/assets/css/site.css` | The stylesheet and design tokens |
| `src/assets/js/site.js` | Share, time-ago, reading progress, short/full toggle, form submit |
| `src/assets/uploads/` | Story images, resized from the WordPress uploads. Photos added in the CMS go in `uploads/cms/` and are resized when the site builds |
| `src/redirects.njk` | Builds `_redirects`, which keeps old WordPress URLs working |
| `scripts/import-images.mjs` | One-time image import from the WordPress uploads folder |
| `design_handoff_house_of_taga/` | The original design handoff (reference only, not built) |

## Pages

- `/` is the featured story (chosen in the CMS under Pages → Home page) plus the ten latest. Older stories page on at `/page/2/`, `/page/3/` and so on.
- `/pre-contact/`, `/colonial/`, `/wwii/`, `/contemporary/` list every story in that period.
- `/stories/<slug>/` is one story.
- `/about/`, `/contact/`, `/privacy/`, `/thanks/` (where forms land without JavaScript) and `/404.html`.

## Content editor (Decap CMS)

Edit the site at **https://houseoftaga.com/admin/**. Every save is a commit to GitHub, and Netlify rebuilds the site in a minute or two.

What you can edit:

- **Stories:** write, edit, date, and choose the period. The story body is built from the same pieces as the design: paragraphs, headings, photos with captions, quotes, big pull quotes, editor's notes, lists, photo galleries and YouTube videos. Photos at the very end of the body, and any gallery, appear under "From the archive". Optional extras are a short version (readers get a Short / Full toggle), a timeline, and tags. Reading time and the excerpt fill in automatically when left empty. Switch on **Hide from the site (draft)** to save a story without publishing it.
- **Comments:** each story has a **Comments** list at the bottom (see below).
- **Pages:** the featured story on the home page, the About page (lead line, portrait, the writer) and the Privacy page.
- **Media:** photos upload to `src/assets/uploads/cms/`. Upload them at full size; the site makes web-sized copies.

The page layouts, the four periods and the contact page text live in the templates in `src/`.

### Logins (Netlify Identity)

Editors sign in with an email and password; no GitHub account is needed.

One-time setup in Netlify (**Site configuration → Identity**):

1. **Enable Identity**, and set **Registration** to **Invite only**.
2. Under **Services → Git Gateway**, choose **Enable Git Gateway**. This lets the editor save changes to GitHub.

To add an editor: **Identity → Invite users**, and enter their email. They click the link in the email, which opens houseoftaga.com with a **Complete your signup** box, choose a password, and are taken to `/admin/`. Password resets work the same way.

After that, editors log in at **https://houseoftaga.com/admin/**.

### Trying the editor locally

```bash
npx decap-server             # in one terminal (port 8081)
npm start -- --port=8082     # in another
```

Then open http://localhost:8082/admin/ and choose **Login**. (Identity itself only works on the live site.) Changes are written to your local files, not GitHub.

## Approving comments

Comments are moderated. Submissions arrive in Netlify → Forms → **comments**, with the story's address in the `story` field. To publish one, open that story in the editor, choose **Add comments** at the bottom, and copy in the name, comment and date. Publish, and it appears on the story, newest first.

## Contact form

Submissions arrive in Netlify → Forms → **contact**. Turn on email notifications there (Forms → Form notifications) so they reach hafadai@houseoftaga.com.

## Images

Story images came from the WordPress `wp-content/uploads` folder (kept on the owner's machine, not in this repo). `npm run images` matches each image URL in the stories to the full-size original, resizes it to 1600px wide as WebP, and records its size so pages don't jump while loading. Images with no local file are left out: in-story photos with alt text show that text in a box, and missing archive photos are skipped.

These 30 images were not in the uploads folder and are gone from the old sites. If you find the originals, the simplest fix is to open the story in the editor and upload the photo into its block again:

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
- The About and Privacy copy are drafts to approve, and the About page needs a portrait. Both can be done in the editor under Pages.
