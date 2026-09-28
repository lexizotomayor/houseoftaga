// Every story except the featured one, newest first; paged on the home page.
import { readFileSync } from "node:fs";
import stories from "./stories.js";

const settings = JSON.parse(readFileSync(new URL("./settings.json", import.meta.url), "utf8"));

export default async function () {
  return (await stories()).filter((s) => s.slug !== settings.featured);
}
