// The four periods drive nav, category pages and story labels.
// `period` matches the `period` field in each story JSON; `label`/`name` are what readers see; `wp` is the old WordPress category slug.
export default [
  { num: "01", key: "pre-contact",  period: "Pre-Contact",  label: "ancient ground",      wp: "pre-contact-period",
    name: "Ancient Ground",      note: "Ancient Chamorro settlement, latte stones, and the first voyages into the Marianas." },
  { num: "02", key: "colonial",     period: "Colonial",     label: "colonial layers",     wp: "colonial",
    name: "Colonial Layers",     note: "Spanish, German and Japanese rule, from the galleons to the sugar fields." },
  { num: "03", key: "wwii",         period: "WWII",         label: "footprints of war",   wp: "wwii",
    name: "Footprints of War",   note: "The battles of Saipan and Tinian, and what the war left behind." },
  { num: "04", key: "contemporary", period: "Contemporary", label: "island dispatches",   wp: "contemporary",
    name: "Island Dispatches",   note: "The Commonwealth years: politics, economy, heritage and people." },
];
