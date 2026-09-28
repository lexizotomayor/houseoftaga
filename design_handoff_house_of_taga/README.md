# Handoff: House of Taga — Eleventy site on Netlify

## Overview
A redesign of **houseoftaga.com**, a history site about the Northern Mariana Islands (Saipan, Tinian, Rota) by Alexie Zotomayor. It covers the homepage, story pages, four period (category) listings, About, Contact and Privacy. The look is Bauhaus/constructivist: warm off‑white paper, chocolate‑brown text and rules, red bars and blocks, vertical type, and a strict grid.

The target is a **static Eleventy (11ty v3) site hosted on Netlify**. Use Netlify Forms for Contact and Comments.

## About the design files
The files in `design/` are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code. They depend on a design‑preview runtime (`support.js`), so **do not ship them**. Rebuild them as Eleventy Nunjucks templates with plain HTML and CSS. Use a real stylesheet with classes; the prototypes use inline styles only because of how they were authored.

To preview a reference, serve `design/` over HTTP (e.g. `npx serve design`) and open `Home.dc.html`, `Story.dc.html?s=omang` or `Pages.dc.html#contact`. The stories load from `design/stories/*.json`.

`site/` is a **starter scaffold**, not a finished build. It contains the Eleventy config, data loaders, pagination stubs, Netlify form partials and `netlify.toml`. It does **not** yet contain the layouts or CSS. You still need to write `_includes/base.njk`, `home.njk`, `story.njk` and `page.njk`.

## Fidelity
**High‑fidelity.** Final colours, type, spacing and behaviour. Match them exactly. Every size below is intentional and sits on the scale in *Design tokens*.

---

## Design tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| paper | `#F2EEE6` | page background; text on red/brown |
| ink | `#5E3023` | all text, rules, borders (dark chocolate) |
| ink‑deep | `#3D1F16` | story body paragraphs and comment text only |
| red | `#C8372A` | bars, category boxes, numbers, active nav, primary buttons |
| paper‑hover | `#E8E1D5` | hover fill on the "older" story link; failed‑image fallback box |

Link defaults: `a{color:#5E3023;text-decoration:none}` and `a:hover{color:#C8372A}`. There are no gradients, shadows or border‑radius anywhere: **radius is 0 and shadow is none**.

### Typography
- **Plus Jakarta Sans only**, from Google Fonts. Load weights 300, 400, 500, 600, 700 and 800, plus italic 400 for the story's editor's note. Force it on every element: `*,*::before,*::after{font-family:'Plus Jakarta Sans',sans-serif}` so form fields inherit it.
- Base body: 18px, line‑height 1.618, `-webkit-font-smoothing:antialiased`.
- **Type scale (golden ratio):** 18 · 29 · 47 · 76 · 123 · 199 · 233 · 280 · 377 px. Nothing is below 18px, with two exceptions:
  - The phone nav uses `min(18px, 4.2vw)` so "contemporary period" fits on one line.
  - Story body text is 21px (19px on phones) for long reading.
- Labels, nav and buttons: 800 weight, uppercase, letter‑spacing 0.06–0.14em.
- Big numbers (story numbers, arrows): weight 300, red.
- Headlines: 800 weight, letter‑spacing −0.02 to −0.04em, `text-wrap:balance`. Paragraphs use `text-wrap:pretty`.

### Spacing (Fibonacci)
4 · 8 · 13 · 21 · 34 · 55 · 89 · 144 px. Page side padding:
- phone: 21px
- tablet: 34px
- desktop: `clamp(34px, 4.5vw, 89px)`

### Rules and bars
- Borders: **3px** ink between items; **4px** ink for section dividers.
- Red horizontal bars: **13px** tall, used in pairs with an **8px** gap, running edge to edge.
- Red vertical bar: **21px** wide.
- Vertical text: `writing-mode:vertical-rl; transform:rotate(180deg)` so it reads bottom to top. The one exception is the desktop footer links, which read top to bottom with no rotate.

### Breakpoints
- phone: < 640px
- tablet: 640–1023px
- desktop: ≥ 1024px

### Recurring component: category box
Solid red box, paper‑coloured text, 18px/800, uppercase, letter‑spacing 0.14em, line‑height 1, padding `13px 8px`, vertical (bottom to top), `flex:none`. It is used on every story card, the featured story, the story header and related stories, and it always sits to the **left** of the number and title.

---

## Screens

### 1. Homepage (`design/Home.dc.html`)

**Header / masthead.** The header is a golden‑ratio grid.
- **Wordmark (top‑left):** "house of taga" in lowercase. "house of" is set vertically at 0.17× the "taga" size and 700 weight, beside a horizontal "taga" at 800 weight, letter‑spacing −0.06em, line‑height 0.78. Next to it is the Chamorro emblem `assets/taga-glyph.png` at 35% opacity and 1.15× the taga height.
  - "taga" size, desktop: `clamp(160px,15vw,300px)` at ≥1280px, or `clamp(110px,11vw,220px)` below that.
  - "taga" size, phone and tablet: calculated to fit the width, up to 199px.
- **Homage line:** "an homage to / chamorro / culture" sits directly under the wordmark, one phrase per line, in uppercase 800 weight with letter‑spacing 0.16em.
- **Desktop nav:** inside the top‑left box, rotated. There are six equal columns (four periods, then about, then contact). Each column is `flex:1`, with 3px ink rules on its left and a closing 3px rule on the right, and 34px margin on both sides. Each period shows a red "01"–"04" before its name, e.g. "01 PRE-CONTACT PERIOD".
- **Tablet nav:** a horizontal row of vertical links.
- **Phone nav:** horizontal, one link per line in the box under the wordmark, each at least 44px tall with a 3px bottom rule. All six lines are the same length, and about and contact each get their own line.
- **Red bars:** a 21px vertical red bar runs the full height at `right: 60px` (44px on phones). Paired 13px horizontal red bars cross the page edge to edge.
- **"MARIANAS · Saipan · Tinian · Rota":** vertical, in the strip to the right of the red vertical bar, with equal margin on all sides:
  - phone: 13px
  - tablet: 21px
  - desktop: 34px

**Featured story.**
- A large image, then the red category box, then a heading row: "FEATURED STORY" (47px, or 29px on phones, 800 weight, letter‑spacing 0.14em) followed by a 13px red bar filling the rest of the row.
- Below that: the title (47px/800), the excerpt, and a "read" link.
- The featured story is set by `site.featuredSlug` and is currently the Battle of Saipan.
- It shows no date.

**Story grid** ("LATEST STORIES", or the period name on a period page).
- Heading row: the same style as "FEATURED STORY", followed by the red bar.
- On period pages it also shows an "ALL STORIES" link with a 3px red underline, and a count such as "22 stories".
- Grid: `repeat(cols×2, 1fr)`, where cols is 3 on desktop, 2 on tablet and 1 on phone. Items are placed with `grid-auto-flow: row dense`. Cells are separated by 3px ink gaps, drawn as the grid background with a 3px outer border.
- Card spans vary so rows fill completely (wide = 4 of 6 columns on desktop).
- **Card (every card uses the same layout):**
  1. **Image:** full‑bleed to the card's inner edges, with a 3px ink bottom rule. The image grows (`flex:1 0 auto`) to absorb leftover row height so cards in a row line up. Aspect ratio varies by span. Crop with `object-fit:cover`. The image links to the story.
  2. **Body:** padding 34px (21px on phones), laid out as a row.
     - Left: the **category box**.
     - Right, stacked: the **number** ("01", "02"…, 47px/300, red), then the **title** (47px on cards spanning ≥4 columns, otherwise 29px; 800 weight; line‑height 1.15), then a meta row.
     - The meta row has a 3px top rule and contains "by {author}", the red time‑ago text, and a **share** button (icon plus "SHARE"; it uses Web Share and falls back to copying the link, then shows "COPIED" for 1.6s).

**Footer.** Two columns on desktop and tablet, stacked on phones.
- **Left box:** `assets/taga-engraving.png` fills the box behind the content at 22% opacity (`object-fit:cover`, `object-position:center 40%`). On top of it:
  - "house of taga" in red, vertical, 47px/800 (29px on phones), at the bottom‑left. On phones it is replaced by the lowercase header‑style wordmark in red, placed below the engraving box ("house of" vertical at 21px, "taga" at 123px).
  - A 21×89px red bar.
  - The line "An homage to Chamorro culture…" at 47px/700 (29px on phones).
- **Right box:** about, contact and privacy links, then the copyright line "© 2018 House of Taga / Alexie Zotomayor". There is no "advertise" link.
  - Desktop and tablet: each is a vertical column reading top to bottom, 18px, with 3px ink rules between them and a minimum height of 340px.
  - Phone: horizontal, one per line with 3px bottom rules, and the emblem below them.
  - The red circle/triangle/square emblem sits bottom‑right (89×89px, stroke only).
- Paired red bars run along the very bottom.

### 2. Period pages (`/pre-contact/`, `/colonial/`, `/wwii/`, `/contemporary/`)
These use the homepage layout with the grid filtered to one period and **all** of that period's stories shown.
- The active nav item gets a red fill with paper text, and its number turns paper.
- The heading shows the period label, e.g. "wwii", plus a count and an "ALL STORIES" link back to `/`.
- Story counts from the current export: Pre‑Contact 7 · Colonial 17 · WWII 22 · Contemporary 8.
- In the prototype this is `?cat=wwii`; in Eleventy use real paths (`period.njk` is already stubbed).

### 3. Story page (`design/Story.dc.html`, route `/stories/{slug}/`)
From top to bottom:
1. **Reading progress bar:** sticky at the top, 8px tall, red fill on paper with a 1px ink bottom border. Its width tracks scroll position, from 0 to 100%.
2. **Header:** a smaller wordmark ("taga" at 123px on desktop, 99px on tablet, 76px on phones) plus horizontal tabs: home, then the four periods. The current story's period tab is filled red. Below them are the paired red bars.
3. **Title block:** a golden‑ratio grid (1fr : 1.618fr on desktop, stacked otherwise).
   - Left: the category box, which links to its period page, then the date as "June 10, 2019" (29px/800) with red time‑ago text under it. On desktop this block is right‑aligned.
   - Right: the h1 (`clamp(76px,7vw,123px)` on desktop, 76px on tablet, 47px on phones; 800 weight; line‑height 0.95), then the optional dek (29px/500), then a meta row with a 3px top rule: "by **Author**", the red "N min read", and share.
4. **Lead image:** **uncropped** at its natural aspect ratio, centred on an ink band, and capped at 85vh (70vh below desktop). If the image fails to load, hide the whole figure.
5. **Body:** the same 1 : 1.618 grid.
   - **Left rail** (sticky on desktop, `top:55px`):
     - A **"READ IT" short/full toggle**, shown only when the story has a short version. It is two equal buttons in a 3px ink frame, each showing its label and its minutes. The selected button is filled ink with paper text. Short is the default.
     - An optional **timeline**: a titled list of date/event rows, dates in red 800 weight, with 3px rules.
   - **Article column:** `max-width: 651px` (a measured 65 characters per line at 21px), `margin-left:auto; margin-right:auto` so both margins stay equal. Text colour is **ink‑deep `#3D1F16`**, 21px (19px on phones), line‑height 1.7, 29px between paragraphs, `hyphens:auto`. Block types:
     - `note`: an ink box with paper italic 18px text and a 21px red strip on the left.
     - The **first `p` is the lead**: 29px/700 (21px on phones), in ink.
     - `h`: 29px/800 with a 21×21px red square before it.
     - `quote`: an 8px red left border, 34px left padding, 29px/600.
     - `pull`: a 13px red top border, the quote at 76px/800 in lowercase (47px on phones), and an uppercase citation at 18px/800 below.
     - `list`: each item marked with a 13×3px red dash.
     - `img`: **uncropped** at its natural ratio inside a 3px ink border, with an optional caption beside a 3px red strip. If the image fails to load, show a paper‑hover box at 1.414:1 containing the alt text.
     - `embed`: YouTube in a 16:9 frame with a 3px ink border.
     - In short mode, a red button at the end reads "READ THE FULL STORY · N MIN".
   - **Tags:** outlined 3px ink chips, at least 44px tall, turning ink‑filled on hover. They sit in the same 651px centred column.
6. **"FROM THE ARCHIVE":** the trailing run of images at the end of a story's `blocks`, plus any `gallery` blocks, pulled out of the body. Shown in **full mode only**.
   - The heading row has the red bar and a count, e.g. "13 photographs".
   - A CSS‑columns masonry layout: 3 columns on desktop, 2 on tablet, 1 on phone, with 21px gaps.
   - Each figure is uncropped, in a 3px ink frame, with a caption row: a red number (300 weight) and the caption.
   - Photos that fail to load are left out; hide the section if none load.
7. **Comments** (section id `comments`): the same 1 : 1.618 grid.
   - Left: "COMMENTS" (47px/800, letter‑spacing 0.14em) with the count below it (47px/300, red, zero‑padded).
   - Right, in the 651px column:
     - The prompt "A memory, a correction, a question? Håfa un hasso — tell us." (29px/700).
     - A comment textarea with a 3px ink frame.
     - Name and email fields in a 2‑column grid (1 column on phones). The inputs have only a 3px ink bottom border, which turns red on focus. Placeholders: "Shown with your comment" and "Optional, never shown".
     - The note "Comments are read before they appear. See privacy." and a red "POST →" button (hover turns it ink).
     - After posting: a red square with "Si Yu'os ma'åse' — your comment is posted."
     - The comment list, newest first: a 55×55px ink square with the lowercase initial in paper, the name (800 weight), red time‑ago text, and the comment text (18px, ink‑deep, `white-space:pre-line`), with 3px rules between comments.
8. **Older / newer:** two halves (stacked on phones).
   - Left: "← OLDER" with the title (29px/800); paper‑hover fill on hover.
   - Right: "NEWER →", filled red with paper text, turning ink on hover.
   - The order comes from the date‑sorted stories. At either end, link to "All stories" (`/`).
9. **"MORE {PERIOD}":** up to 6 other stories from the same period, in 2 columns on desktop.
   - Each row: a square thumbnail (144px, 89px on phones), the category box, the title (29px/800), and the date plus red time‑ago text.
10. **Footer:** "BACK TO TOP", then about/contact/privacy, then the copyright, then the paired red bars.

### 4. About / Contact / Privacy (`design/Pages.dc.html#about|#contact|#privacy`)
Build these as three separate routes: `/about/`, `/contact/`, `/privacy/`.
- **Shared layout:**
  - Header: the wordmark plus tabs (home, about, contact, privacy); the active tab is filled red.
  - Body: a 1 : 1.618 grid. The left side has the page name huge and vertical on desktop (`clamp(199px,17vw,280px)`), or horizontal on tablet (123px) and phone (76px). Beside it: a red number (01, 02, 03) and a 21×89px red bar.
- **About:**
  - The lead line (47px/700).
  - A portrait slot (1:1.2) next to the "THE WRITER" category box and two paragraphs.
  - A "FOUR PERIODS" list: a red number, the period name at 29px/800, and a one‑line note.
  - ⚠ The copy is a draft; the site owner must confirm it.
- **Contact:**
  - The lead line "A story tip, a correction, a family photograph — hafa adai, write in."
  - Topic chips, one choice only, in a 3px ink frame; the selected chip is ink‑filled. The options are: story tip, correction, photos & archives, say hafa adai.
  - Name, email and message fields.
  - The note "We only use your details to reply. See privacy." and a red "SEND →" button.
  - A side column with three entries: email hafadai@houseoftaga.com, "from: Saipan · Tinian · Rota", and a corrections note.
  - Success state: an 89×89px red square, "Si Yu'os ma'åse', {first name}.", a reply note, and "send another".
- **Privacy:**
  - An "UPDATED" category box with the date, and the lead line.
  - Six numbered sections, each with a red number, a 29px/800 heading and the body text.
  - ⚠ The draft copy is not legal advice.

---

## Interactions and behaviour
- **Time‑ago text:** "N years/months/weeks/days/hours/minutes ago", or "just now". Render it at build time, then refresh it on the client every 60s with a small script that reads `<time datetime>`.
- **Dates:** always display dates in the `Pacific/Saipan` time zone (the `longDate` filter is already set up).
- **Share:** use `navigator.share({title,url})` where available; otherwise copy the link to the clipboard and show "COPIED" for 1.6s.
- **Short/full toggle:** a client‑side toggle. Render both versions in the HTML, show short by default, and switch with a button and `aria-pressed`. The archive section is visible in full mode only. The "min read" figure in the meta row follows the selected mode.
- **Progress bar:** update it on scroll with a passive listener: `scrollY / (scrollHeight − innerHeight)`.
- **Sticky rail:** desktop only.
- **Hover states:**
  - Links: text turns red.
  - Primary buttons: red background turns ink.
  - Tags: fill with ink, text turns paper.
  - "Older" link: paper‑hover fill.
- **Focus:** input bottom borders and the textarea frame turn red.
- **Tap targets:** at least 44px everywhere.
- **Images:** use `loading="lazy"` except on the lead image. Always set width and height, or `aspect-ratio`, so pages don't jump as images load. Uncropped images need their real dimensions: read them at build time (e.g. with `@11ty/eleventy-img`) and write `width` and `height` into the HTML.

## Forms (Netlify)
The partials are in `site/src/_includes/partials/`. Both forms use `data-netlify="true"` with a honeypot field.
- **contact:** fields topic, name, email, message. Turn on email notifications in the Netlify UI.
- **comments:** one form for the whole site, with a hidden `story` field holding the slug. The planned moderation flow:
  1. A submission arrives in Netlify.
  2. The owner approves it.
  3. It is added to `src/_data/comments/{slug}.json` as `[{name, text, date}]`.
  4. The site rebuilds.
  - This keeps "Comments are read before they appear" true. You can automate it later with a Netlify Function and the GitHub API.
- Add a `/thanks/` page. It can read `?from=slug` to link back to the story.
- **The prototype only saves comments in the browser's localStorage. Don't carry that over.**

## Story data
`site/src/_data/stories_raw/*.json` holds the **54 published posts** from the WordPress export dated 2026‑09‑28, one file per slug. `index.json` holds summaries and can be ignored, because `stories.js` rebuilds the list. Schema:
```jsonc
{
  "slug": "omang",
  "title": "…",                  // plain text; <br> already stripped
  "date": "2019-06-10T02:53:05Z", // GMT; display in Pacific/Saipan
  "author": "HOUSE OF TAGA DESK", // prototype title-cases it for display
  "category": "…", "period": "WWII" | "Colonial" | "Pre-Contact" | "Contemporary",
  "categories": [], "tags": [],
  "image": "https://…", "imageAlt": "…",
  "excerpt": "…", "dek": "…"?,     // dek only on some stories
  "words": 1234, "readMin": 5,
  "blocks": [ /* full story */ ],
  "short": [ /* optional short version, same block types */ ], "shortWords": 0, "shortMin": 2,
  "timelineTitle": "…"?, "timeline": [{ "date": "…", "what": "…" }]?
}
```
Block types: `p {text}`, `h {text}`, `quote {text}`, `pull {text, cite}`, `note {text}`, `list {ordered, items[]}`, `img {src, alt, caption}`, `gallery {images[{src,alt}]}`, `embed {src}`. Render them with a Nunjucks macro that switches on `type`.

Short versions exist for the 10 newest stories. They are plain‑style rewrites about 40% of the original length, with direct quotes kept. `the-battle-of-saipan-tinian` has a cleaned full text (a duplicated passage removed and typos fixed), a pull quote, a timeline and captions.

## Redirects
Old WordPress permalinks are `/{slug}/`. Keep them working with `/{slug}/ → /stories/{slug}/ 301`, generated per story. Also redirect the old category URLs to the new period pages.

## Assets
- `assets/taga-glyph.png`: the Chamorro emblem shown beside "taga", supplied by the owner and used at 35% opacity.
- `assets/taga-engraving.png`: the owner's House of Taga engraving, recoloured to ink `#5E3023` on a transparent background and used at 22% opacity in the footer.
- The footer emblem (circle/triangle/square) is an inline SVG with `stroke:#C8372A; stroke-width:4; fill:none`, in a `viewBox="0 0 100 100"`: `<circle cx=50 cy=50 r=46/> <polygon points="14,50 76,14 76,86"/> <rect x=42 y=30 width=34 height=40/>`.
- The share icon is a standard three‑node share glyph, as an inline SVG at 21px with a 2px stroke.
- ⚠ **Story images are hot‑linked** from houseoftaga.com/wp-content/uploads and zotomayor.com. The Battle of Saipan archive photos on zotomayor.com already fail to load. Before the WordPress site goes offline, get the `wp-content/uploads` folder, put it in `src/assets/uploads/`, and rewrite the image URLs in the JSON.

## Open items for the owner
- Three years in the Battle of Saipan text read 1945 where 1944 is likely: the June 15 landing morning, "Saipan secured July 9", and "Tinian secured August 1".
- "Still Finding Amelia" refers to an August 2025 expedition as if it's still upcoming.
- Short versions still need writing for the remaining 44 stories. It is also undecided whether guest essays, such as Don Farrell's, should get short versions.
- The About and Privacy copy need the owner's approval, and the About page needs a portrait.

## Files
- `design/Home.dc.html`: homepage and period filter (`?cat=`)
- `design/Story.dc.html`: story page (`?s={slug}`)
- `design/Pages.dc.html`: About, Contact, Privacy (`#about`, `#contact`, `#privacy`)
- `design/stories/`: the story JSON the prototypes read
- `design/assets/`: the glyph and the engraving
- `design/support.js`, `design/image-slot.js`: the prototype runtime only; **do not use in production**
- `site/`: the Eleventy + Netlify starter (config, data, pagination stubs, form partials, `netlify.toml`)
