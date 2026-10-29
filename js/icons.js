/* Icônes : style « encre sur parchemin » pour le codex (tracés ronds, hachures),
   pictos d'interface plus fins, coupes de trophée et ornements de cadre. */
const ink = body => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const ui = (body, sw = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const INK = {
  book: ink(`<path d="M24 13c-5-3.4-11-3.6-16-1.6v26c5-2 11-1.8 16 1.6 5-3.4 11-3.6 16-1.6v-26c-5-2-11-1.8-16 1.6z"/><path d="M24 13v26"/><path d="M12 18.5c3-1 6-1 8.5 0M12 23.5c3-1 6-1 8.5 0M12 28.5c3-1 6-1 8.5 0M27.5 18.5c3-1 6-1 8.5 0M27.5 23.5c3-1 6-1 8.5 0" stroke-width="1.4"/><path d="M30 9.5l2-4 2 4v6l-2-1.6-2 1.6z" stroke-width="1.6"/>`),
  crown: ink(`<path d="M9 34 7 15l9 8.5L24 10l8 13.5 9-8.5-2 19z"/><path d="M9 39h30M9 34h30"/><circle cx="24" cy="27.5" r="2.6"/><circle cx="7" cy="13.5" r="1.6"/><circle cx="41" cy="13.5" r="1.6"/><circle cx="24" cy="8" r="1.6"/><path d="M14 30.5h4M30 30.5h4" stroke-width="1.4"/>`),
  skull: ink(`<path d="M24 7.5C15 7.5 9 13.5 9 21.5c0 5 2.2 8.4 5 10.4V38h20v-6.1c2.8-2 5-5.4 5-10.4 0-8-6-14-15-14z"/><path d="M14 22.5c0-2.6 2-4 4.2-4s4 1.6 4 4-1.8 4-4 4-4.2-1.4-4.2-4zM25.8 22.5c0-2.4 1.8-4 4-4s4.2 1.4 4.2 4-2 4-4.2 4-4-1.6-4-4z" fill="currentColor" fill-opacity=".85"/><path d="m24 28.5-2.2 4h4.4z"/><path d="M19 38v-4.5M24 38v-4.5M29 38v-4.5" stroke-width="1.6"/><path d="M15 12.5c2-1.6 4-2.4 6-2.6" stroke-width="1.3"/>`),
  helm: ink(`<path d="M13 27c0-8.4 4.8-14.5 11-14.5S35 18.6 35 27v8H13z"/><path d="M13 24.5C7.6 23.5 4.6 18.4 5.6 12c2.6 4 5.6 5.4 8.8 5.4M35 24.5c5.4-1 8.4-6.1 7.4-12.5-2.6 4-5.6 5.4-8.8 5.4"/><path d="M24 12.5V35M16.5 28h5M26.5 28h5"/><path d="M11.5 35h25v4h-25z"/><path d="M17 17.5c1.4-1.6 3-2.6 5-3" stroke-width="1.3"/>`),
  heart: ink(`<path d="M24 39.5S9 30.6 9 19.5C9 14.6 12.8 10.5 17.5 10.5c3 0 5 1.5 6.5 4 1.5-2.5 3.5-4 6.5-4 4.7 0 8.5 4.1 8.5 9 0 11.1-15 20-15 20z"/><path d="M14.5 18.5c0-2.2 1.6-4 3.6-4" stroke-width="1.5"/><path d="M5 40 18 27M40.5 7.5 31 17" stroke-width="1.8"/><path d="M38 7l3-.5-.5 3M5 40l1.5-4M5 40l4-1.4" stroke-width="1.6"/>`),
  chest: ink(`<path d="M8 22h32v16H8z"/><path d="M8 22c0-7 5-11.5 16-11.5S40 15 40 22"/><path d="M8 27.5h32"/><path d="M21 25.5h6v6.5h-6z"/><path d="M14.5 13.5V22M33.5 13.5V22M14.5 27.5V38M33.5 27.5V38" stroke-width="1.6"/><path d="M24 28v1.6" stroke-width="1.8"/><path d="M10.5 31.5l2 2M10.5 35l2 2M35.5 31.5l2 2" stroke-width="1.2"/>`),
  vial: ink(`<path d="M19.5 6.5h9M21 7v9L11 33a5 5 0 0 0 4.4 7.5h17.2A5 5 0 0 0 37 33L27 16V7"/><path d="M14.6 28.5h18.8" /><path d="M16 33c2 .8 4 .8 6 0s4-.8 6 0 3 .6 4 .2" stroke-width="1.4"/><circle cx="21" cy="35.5" r="1.3"/><circle cx="27.5" cy="33" r="1"/><path d="M28.5 20.5l2 3.2" stroke-width="1.4"/>`),
  sword: ink(`<path d="M35 7h6v6L23.5 30.5l-6-6z"/><path d="M13.5 23.5l11 11M11.5 30.5l6 6"/><path d="M16 33l-6.5 6.5"/><circle cx="8.6" cy="40.4" r="2.2"/><path d="M36.5 10.5 21.5 25.5" stroke-width="1.3"/>`),
  d20: ink(`<path d="M24 5.5 39.5 14.5v19L24 42.5 8.5 33.5v-19z"/><path d="M24 14.5l9 15H15z"/><path d="M24 5.5v9M8.5 14.5 15 29.5M39.5 14.5 33 29.5M15 29.5l-6.5 4M33 29.5l6.5 4M15 29.5 24 42.5l9-13" stroke-width="1.6"/><path d="M22 23.5h4M24 21.5v5" stroke-width="1.6"/>`),
  map: ink(`<path d="M12 10.5h22a4 4 0 0 1 4 4v23.5H16a4 4 0 0 1-4-4z"/><path d="M12 34a4 4 0 0 0 4 4M12 10.5a4 4 0 0 0-4 4v2.5h4"/><path d="M18 18.5h14M18 23.5h14M18 28.5h9" stroke-width="1.5"/><path d="M29 28l3 3m0-3-3 3" stroke-width="1.6"/>`),
  star: ink(`<path d="m24 6 5 11.5 12.4 1.2-9.4 8.2 2.8 12.2L24 32.8l-10.8 6.3L16 26.9l-9.4-8.2L19 17.5z"/><path d="M24 14v12" stroke-width="1.3"/>`),
  gem: ink(`<path d="M14 9h20l7 10-17 21L7 19z"/><path d="M7 19h34M19 9l-3 10 8 21 8-21-3-10" stroke-width="1.6"/>`),
  hourglass: ink(`<path d="M13 7h22M13 41h22"/><path d="M15.5 7c0 8.5 8.5 10.5 8.5 17s-8.5 8.5-8.5 17M32.5 7c0 8.5-8.5 10.5-8.5 17s8.5 8.5 8.5 17"/><path d="M19 37l5-4 5 4z" fill="currentColor"/><path d="M24 25.5v5" stroke-width="1.4" stroke-dasharray="1 2"/>`),
  hero: ink(`<path d="M15 21c0-7 4-12.5 9-12.5S33 14 33 21"/><path d="M12.5 41c0-9 5-15.5 11.5-15.5S35.5 32 35.5 41"/><path d="M15 21c2.4 2.6 5.4 4 9 4s6.6-1.4 9-4"/><path d="M19 19.5l2 1.2M29 19.5l-2 1.2" stroke-width="1.6"/><path d="M24 30v11" stroke-width="1.4"/>`),
  axe: ink(`<path d="M24 7v35"/><path d="M24 12c6-4.6 13.5-3.6 16.5 2-3 6.4-9.6 8.4-16.5 6.2"/><path d="M24 12c-6-4.6-13.5-3.6-16.5 2 3 6.4 9.6 8.4 16.5 6.2"/><path d="M20.5 42h7M20 30h8M20 35h8" stroke-width="1.5"/>`),
  lute: ink(`<path d="M30.5 30a11.5 11.5 0 1 1-13-11.4c3-.4 5.5.6 7.5 2.6s3 4.6 2.6 7.5"/><circle cx="19.5" cy="30.5" r="3.2"/><path d="M25 25 39 11"/><path d="M36.5 8.5l5 5"/><path d="M13.5 36.5l7-7" stroke-width="1.3"/>`),
  sun: ink(`<circle cx="24" cy="24" r="7.5"/><path d="M24 5.5v6M24 36.5v6M5.5 24h6M36.5 24h6M11 11l4.2 4.2M32.8 32.8 37 37M37 11l-4.2 4.2M11 37l4.2-4.2"/><circle cx="24" cy="24" r="2.5" fill="currentColor"/>`),
  leaf: ink(`<path d="M9 39C9 21 21 9.5 40 8.5 39 27 27.5 39 9 39z"/><path d="M9 39 31 17" /><path d="M17 31h7.5M21 27v-7M25 23h6M27.5 20.5v-4" stroke-width="1.4"/>`),
  shield: ink(`<path d="M24 5.5 38.5 11v11c0 9.5-6.2 16.6-14.5 20.5C15.7 38.6 9.5 31.5 9.5 22V11z"/><path d="M24 11v26.5M14.5 21h19" stroke-width="1.6"/><path d="M14 13.5 24 10l10 3.5" stroke-width="1.2"/>`),
  bow: ink(`<path d="M11 7.5c17 2.5 28 13.5 29.5 31"/><path d="M11 7.5l29.5 31" stroke-width="1.2"/><path d="M7.5 40.5 31 17"/><path d="M31 17l-1.5 5.5M31 17l-5.5 1.5"/><path d="M7.5 40.5l3.5-.8M7.5 40.5l.8-3.5" stroke-width="1.6"/>`),
  dagger: ink(`<path d="M37 7.5h3.5V11L27 24.5l-3.5-3.5z"/><path d="M18 21.5 26.5 30"/><path d="M22.2 25.8 12 36"/><circle cx="10.3" cy="37.7" r="2.4"/><path d="M38 10l-12 12" stroke-width="1.2"/>`),
  flame: ink(`<path d="M24 42.5c-8 0-13-6-13-13 0-8.4 7.4-11 8.2-19.5 4 3 6 7 6 11 2-2 3-4.4 3-7.5 5.4 4.2 8.8 10.4 8.8 16 0 7-5 13-13 13z"/><path d="M24 42.5c-3 0-5.2-2.2-5.2-5.2 0-4 5.2-6 5.2-10.4 3 3 5.2 6.4 5.2 10.4 0 3-2.2 5.2-5.2 5.2z" stroke-width="1.5"/>`),
  eye: ink(`<path d="M4.5 24C9.5 16 16.5 12 24 12s14.5 4 19.5 12C38.5 32 31.5 36 24 36S9.5 32 4.5 24z"/><circle cx="24" cy="24" r="6.2"/><circle cx="24" cy="24" r="2.2" fill="currentColor"/><path d="M24 5v3.5M24 39.5V43M11.5 8.5l2 3M36.5 8.5l-2 3" stroke-width="1.4"/>`),
  balance: ink(`<circle cx="24" cy="24" r="16.5"/><path d="M24 7.5a8.25 8.25 0 0 1 0 16.5 8.25 8.25 0 0 0 0 16.5"/><circle cx="24" cy="15.8" r="2.2" fill="currentColor"/><circle cx="24" cy="32.2" r="2.2"/>`),
  hat: ink(`<path d="M7.5 38.5h33"/><path d="M12 38.5c2-4.2 6.2-6.4 12-6.4s10 2.2 12 6.4"/><path d="M17.5 33 26.5 6l6 27.2"/><path d="M26.5 6c3.4 1 5.6 3.4 6.4 6.6" stroke-width="1.4"/><path d="m21.5 23 2 1M25.5 16.5l1 2M26 27.5l1.6 1" stroke-width="1.5"/>`),
  camp: ink(`<path d="M6 39 24 9l18 30z"/><path d="M24 9v30M17 39l7-12 7 12"/><path d="M4 39h40"/><path d="M33 6l3 3M36 4.5v3M38.5 6l-2 2" stroke-width="1.4"/>`)
};

export const UI = {
  check: ui(`<path d="m5 12.5 4.5 4.5L19 7.5"/>`, 3),
  ext: ui(`<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>`, 2.2),
  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>`,
  search: ui(`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`, 2.2),
  filter: ui(`<path d="M4 6h16M7 12h10M10 18h4"/>`, 2.2),
  share: ui(`<path d="M12 15V4M8 8l4-4 4 4"/><path d="M6 12H5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-1"/>`),
  close: ui(`<path d="M6 6l12 12M18 6 6 18"/>`, 2.2),
  plus: ui(`<path d="M12 5v14M5 12h14"/>`, 2.4),
  minus: ui(`<path d="M5 12h14"/>`, 2.4),
  warn: ui(`<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.3"/>`),
  sound: ui(`<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>`),
  mute: ui(`<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>`),
  download: ui(`<path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 19h14"/>`),
  upload: ui(`<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 19h14"/>`),
  cloud: ui(`<path d="M7 18h10.5a4 4 0 0 0 .5-8 6 6 0 0 0-11.6 1.6A3.3 3.3 0 0 0 7 18z"/>`),
  trash: ui(`<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>`),
  arrow: ui(`<path d="M9 6l6 6-6 6"/>`, 2.2),
  camera: ui(`<path d="M4 8.5h3.2L9 6h6l1.8 2.5H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.3" r="3.6"/>`),
  phone: ui(`<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>`),
  dot: `<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1 11 6 6 11 1 6z" fill="currentColor"/></svg>`
};

/* Coupes de trophée, teintées par métal */
const METAL = { p: ["#E6F6FF", "#86CDF3", "#3E7FA6"], g: ["#FFF0BE", "#E3B54F", "#8C6A2F"], s: ["#FFFFFF", "#C4CBD6", "#6C7480"], b: ["#FFD7B5", "#CD8A5F", "#7A4527"] };
let cupN = 0;
export function cup(t) {
  const [hi, mid, lo] = METAL[t] || METAL.b, g = "cg" + (++cupN);
  const grad = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".45" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient></defs>`;
  if (t === "p") return `<svg viewBox="0 0 32 32" aria-hidden="true">${grad}<path d="M16 2.5 26 9v14l-10 6.5L6 23V9z" fill="url(#${g})" stroke="${lo}" stroke-width=".8"/><path d="M16 7.5 21.5 11v9L16 23.5 10.5 20v-9z" fill="none" stroke="${hi}" stroke-width="1" opacity=".8"/><path d="M16 2.5v5M6 9l4.5 2M26 9l-4.5 2M6 23l4.5-3M26 23l-4.5-3M16 29.5v-6" stroke="${hi}" stroke-width=".8" opacity=".6"/><circle cx="12.5" cy="10" r="1.4" fill="#fff" opacity=".8"/></svg>`;
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${grad}<path d="M9 4h14v6c0 5-3 9-7 9s-7-4-7-9V4Z" fill="url(#${g})"/><path d="M9 7H5c0 4 2 6 5 6.5M23 7h4c0 4-2 6-5 6.5" fill="none" stroke="${mid}" stroke-width="2"/><path d="M16 19v5M10 28h12l-1.5-4h-9Z" fill="url(#${g})" stroke="${lo}" stroke-width="1" stroke-linejoin="round"/><path d="M12.5 6.5v4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".55"/></svg>`;
}

/* Volute de coin (dessinée pour le coin haut-gauche, retournée en CSS pour les autres) */
export const CORNER_PATHS = [
  "M5 70V26C5 14 14 5 26 5h44",
  "M11 70V28c0-9.5 7.5-17 17-17h42",
  "M5 40c9 0 14-6 11.5-11.5-1.8-4-7.4-3.8-8 0-.4 2.6 2.2 3.8 4 2.2",
  "M40 5c0 9-6 14-11.5 11.5-4-1.8-3.8-7.4 0-8 2.6-.4 3.8 2.2 2.2 4",
  "M1.5 1.5 12 12"
];
export function corners() {
  const p = CORNER_PATHS;
  const svg = `<svg viewBox="0 0 72 72" fill="none" stroke-linecap="round"><path d="${p[0]}" stroke="url(#bronzeG)" stroke-width="2.4"/><path d="${p[1]}" stroke="url(#bronzeG)" stroke-width="1" opacity=".65"/><path d="${p[2]}" stroke="url(#bronzeG)" stroke-width="1.8"/><path d="${p[3]}" stroke="url(#bronzeG)" stroke-width="1.8"/><path d="${p[4]}" stroke="url(#bronzeG)" stroke-width="1.6"/><path d="M0 0l6 1.5L1.5 6z" fill="#E2B27A"/></svg>`;
  return ["tl", "tr", "bl", "br"].map(c => `<span class="cn ${c}" aria-hidden="true">${svg}</span>`).join("");
}
