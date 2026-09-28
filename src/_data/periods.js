// The four periods drive nav, category pages and story labels.
// `period` matches the `period` field in each story JSON; `wp` is the old WordPress category slug.
export default [
  { num: "01", key: "pre-contact",  period: "Pre-Contact",  label: "pre-contact period",  wp: "pre-contact-period",
    name: "Pre-contact period",  note: "Ancient Chamorro settlement, latte stones, and the first voyages into the Marianas." },
  { num: "02", key: "colonial",     period: "Colonial",     label: "colonial period",     wp: "colonial",
    name: "Colonial period",     note: "Spanish, German and Japanese rule, from the galleons to the sugar fields." },
  { num: "03", key: "wwii",         period: "WWII",         label: "wwii",                wp: "wwii",
    name: "WWII",                note: "The battles of Saipan and Tinian, and what the war left behind." },
  { num: "04", key: "contemporary", period: "Contemporary", label: "contemporary period", wp: "contemporary",
    name: "Contemporary period", note: "The Commonwealth years: politics, economy, heritage and people." },
];
