// Every story except the featured one, newest first; paged on the home page.
import stories from "./stories.js";
import site from "./site.js";

export default function () {
  return stories().filter((s) => s.slug !== site.featuredSlug);
}
