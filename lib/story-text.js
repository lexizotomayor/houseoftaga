// Turns the CMS "Story" box (Markdown, pasted in one go) into the same blocks
// the WordPress-imported stories use, so the templates treat both alike.
//
//   blank line            new paragraph
//   ## Heading            heading
//   > text                quote
//   - item / 1. item      list
//   ![description](/assets/uploads/cms/photo.jpg "caption")   photo
//   {{< youtube https://youtu.be/… >}}  (or a YouTube link on its own line)   video
//   {{< pull cite="Name" >}}text{{< /pull >}}                  pull quote
//   {{< note >}}text{{< /note >}}                              editor's note
//   **bold**, _italic_, [link](https://…) inside any text.
//
// Each text block keeps `text` (plain, for word counts and excerpts) and `html` (formatted).

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Inline Markdown → { text, html }.
function inline(src) {
  const kept = [];
  const keep = (c) => `\u0000${kept.push(c) - 1}\u0000`;
  let s = src.replace(/\\([\\`*_{}\[\]()#+\-.!>~|"'])/g, (_, c) => keep(c)); // \* \_ \# … written by the editor
  const breaks = (x) => x.replace(/(?: {2,}|\\)\n/g, "\u0001").replace(/\n/g, " ");
  s = breaks(s);

  const links = [];
  s = s.replace(/\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g, (_, t, url) => `\u0002${links.push({ t, url }) - 1}\u0002`)
       .replace(/<(https?:\/\/[^>\s]+)>/g, (_, url) => `\u0002${links.push({ t: url, url }) - 1}\u0002`);

  const fmt = (x, html) => {
    const wrap = (tag) => (_, a) => (html ? `<${tag}>${a}</${tag}>` : a);
    let out = html ? esc(x) : x;
    out = out.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, wrap("strong"))
             .replace(/__(?=\S)([\s\S]*?\S)__/g, wrap("strong"))
             .replace(/\*(?=\S)([\s\S]*?\S)\*/g, wrap("em"))
             .replace(/(^|[^\w])_(?=\S)([\s\S]*?\S)_(?!\w)/g, (_, pre, a) => pre + (html ? `<em>${a}</em>` : a))
             .replace(/~~(?=\S)([\s\S]*?\S)~~/g, wrap("s"));
    out = out.replace(/\u0002(\d+)\u0002/g, (_, i) => {
      const { t, url } = links[i];
      const label = fmt(t, html);
      if (!html) return label;
      const safe = /^(https?:|mailto:|\/|#)/i.test(url) ? url : "#";
      const ext = /^https?:/i.test(url) ? ' rel="noopener"' : "";
      return `<a href="${esc(safe)}"${ext}>${label}</a>`;
    });
    out = out.replace(/\u0001/g, html ? "<br>" : " ");
    return out.replace(/\u0000(\d+)\u0000/g, (_, i) => (html ? esc(kept[i]) : kept[i]));
  };
  return { text: fmt(s, false).replace(/\s+/g, " ").trim(), html: fmt(s, true).trim() };
}

const attr = (s, name) => {
  const m = s.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : "";
};
const unq = (s) => s.replace(/\\"/g, '"');

const IMG = /^!\[((?:\\.|[^\]])*)\]\(\s*<?([^)\s>]+)>?(?:\s+"((?:\\.|[^"])*)")?\s*\)$/;
const YT = /^(?:<|\[[^\]]*\]\()?(https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/\S+?)(?:>|\))?$/;
const LIST = /^\s*([-*+]|\d+[.)])\s+(.*)$/;
const SHORT_OPEN = /^\{\{<\s*(youtube|pull|note)\b/;

export function storyBlocks(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  const textBlock = (type, src, extra = {}) => blocks.push({ type, ...inline(src), ...extra });

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t || /^([-*_])(\s*\1){2,}$/.test(t)) { i++; continue; }

    // Shortcodes from the editor's Video / Pull quote / Editor's note buttons.
    if (SHORT_OPEN.test(t)) {
      let chunk = t;
      const kind = t.match(SHORT_OPEN)[1];
      if (kind !== "youtube") while (!chunk.includes(`{{< /${kind} >}}`) && i + 1 < lines.length) chunk += "\n" + lines[++i];
      i++;
      if (kind === "youtube") {
        const src = (chunk.match(/youtube\s+"?([^\s">]+)"?/) || [])[1];
        if (src) blocks.push({ type: "embed", src });
        continue;
      }
      const m = chunk.match(new RegExp(`^\\{\\{<\\s*${kind}([^>]*)>\\}\\}([\\s\\S]*?)\\{\\{<\\s*/${kind}\\s*>\\}\\}`));
      if (!m) { textBlock("p", chunk); continue; }
      if (kind === "pull") textBlock("pull", m[2].trim(), attr(m[1], "cite") ? { cite: attr(m[1], "cite") } : {});
      else textBlock("note", m[2].trim());
      continue;
    }

    const h = t.match(/^#{1,6}\s+(.*?)\s*#*$/);
    if (h) { textBlock("h", h[1]); i++; continue; }

    if (t.startsWith(">")) {
      const q = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) q.push(lines[i++].trim().replace(/^>\s?/, ""));
      textBlock("quote", q.join("\n").trim());
      continue;
    }

    if (LIST.test(line)) {
      const ordered = /^\d/.test(line.match(LIST)[1]);
      const items = [];
      while (i < lines.length && lines[i].trim()) {
        const m = lines[i].match(LIST);
        if (m) items.push(m[2]);
        else items[items.length - 1] += "\n" + lines[i].trim();
        i++;
      }
      const parts = items.map(inline);
      blocks.push({ type: "list", ordered, items: parts.map((p) => p.text), itemsHtml: parts.map((p) => p.html) });
      continue;
    }

    const img = t.match(IMG);
    if (img) {
      blocks.push({ type: "img", src: img[2], alt: inline(unq(img[1])).text, caption: img[3] ? inline(unq(img[3])).text : "" });
      i++;
      continue;
    }

    // Paragraph: runs until a blank line or the start of another kind of block.
    const para = [line];
    i++;
    while (i < lines.length) {
      const n = lines[i].trim();
      if (!n || /^#{1,6}\s/.test(n) || n.startsWith(">") || IMG.test(n) || SHORT_OPEN.test(n) || LIST.test(lines[i])) break;
      para.push(lines[i++]);
    }
    const whole = para.join("\n").trim();
    const yt = whole.match(YT);
    if (yt) { blocks.push({ type: "embed", src: yt[1] }); continue; }
    textBlock("p", whole);
  }
  return blocks;
}
