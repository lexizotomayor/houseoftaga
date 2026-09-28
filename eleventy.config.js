export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // The CMS (Decap) is a static app: copy it as is.
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.ignores.add("src/admin/**");
  eleventyConfig.addWatchTarget("src/assets/");

  const tz = "Pacific/Saipan";
  eleventyConfig.addFilter("longDate", (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: tz }));
  eleventyConfig.addFilter("isoDate", (iso) => new Date(iso).toISOString());
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("youtubeEmbed", (u) => {
    const m = String(u).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : u;
  });

  // "3 years ago" at build time; assets/site.js refreshes it in the browser.
  eleventyConfig.addFilter("ago", (iso) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [n, v] of units) {
      const q = Math.floor(s / v);
      if (q >= 1) return `${q} ${n}${q > 1 ? "s" : ""} ago`;
    }
    return "just now";
  });

  eleventyConfig.addFilter("byPeriod", (stories, period) => stories.filter((s) => s.period === period));
  eleventyConfig.addFilter("except", (stories, slug) => stories.filter((s) => s.slug !== slug));
  eleventyConfig.addFilter("bySlug", (stories, slug) => stories.find((s) => s.slug === slug));

  // Story grid placement. Each entry is [type, desktop span of 6, tablet span of 4, aspect].
  // Phones use one column; "wide" cards keep their ratio there, the rest are 1.2:1.
  const plan = [
    ["wide", 4, 4, "1.618/1"], ["vcat", 2, 2, "1/1.618"], ["vtitle", 2, 2, "1/1.618"],
    ["offset", 2, 2, "1/1"], ["vcat", 2, 2, "1/1.2"], ["wide", 3, 4, "1.618/1"],
    ["vtitle", 3, 2, "1/1.2"], ["vtitle", 2, 2, "1/1.618"], ["offset", 4, 4, "1.618/1"], ["vcat", 4, 2, "1.618/1"],
  ];
  eleventyConfig.addFilter("gridPlan", (list) => list.map((story, i) => {
    const [type, d, t, aspect] = plan[i % plan.length];
    return { story, d, t, aspect, mAspect: type === "wide" ? aspect : "1.2/1" };
  }));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
  };
}
