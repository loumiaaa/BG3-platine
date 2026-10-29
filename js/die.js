/* Le d20 façon jet de compétence de BG3 : facettes gravées, numéro central,
   et une lueur de potion qui monte avec la progression. */
export const HP = [[100, 10], [180, 56], [180, 144], [100, 190], [20, 144], [20, 56]];
export const TI = [[100, 52], [55, 130], [145, 130]];
const pts = a => a.map(p => p.join(",")).join(" ");
const cen = a => [a.reduce((s, p) => s + p[0], 0) / a.length, a.reduce((s, p) => s + p[1], 0) / a.length];

/* facettes : sommets, teinte (0 sombre → 1 claire), numéro gravé, rotation du numéro */
export const FACES = [
  [[TI[0], HP[5], TI[1]], .55, "9", -62],
  [[TI[0], TI[2], HP[1]], .7, "4", 62],
  [[TI[1], TI[2], HP[3]], .35, "13", 0],
  [[HP[0], HP[1], TI[0]], .82, "14", 180],
  [[HP[0], HP[5], TI[0]], .62, "6", 180],
  [[HP[5], HP[4], TI[1]], .4, "19", -90],
  [[HP[4], HP[3], TI[1]], .25, "7", -30],
  [[HP[1], HP[2], TI[2]], .5, "18", 90],
  [[HP[2], HP[3], TI[2]], .3, "5", 30]
];
export const shade = v => {
  const a = [34, 27, 46], b = [118, 104, 150];
  return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * v)).join(",")})`;
};

export function dieSVG(id, { fill = true, label = "" } = {}) {
  let wave = "M0 10";
  for (let x = 0; x <= 400; x += 25) wave += ` Q${x + 12.5} ${x % 50 ? 16 : 4} ${x + 25} 10`;
  const faces = FACES.map(([f, v, n, r]) => {
    const [cx, cy] = cen(f);
    return `<polygon points="${pts(f)}" fill="${shade(v)}"/><text x="${cx}" y="${cy}" transform="rotate(${r} ${cx} ${cy})" class="die-n">${n}</text>`;
  }).join("");
  const edges = [[HP[0], TI[0]], [HP[1], TI[0]], [HP[5], TI[0]], [HP[5], TI[1]], [HP[4], TI[1]], [HP[3], TI[1]], [HP[1], TI[2]], [HP[2], TI[2]], [HP[3], TI[2]]]
    .map(([a, b]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`).join("");
  return `<svg class="die" id="${id}" viewBox="0 0 200 200" role="img" aria-label="${label || "Dé à vingt faces"}">
  <defs>
    <clipPath id="${id}-clip"><polygon points="${pts(HP)}"/></clipPath>
    <radialGradient id="${id}-glow"><stop offset="0" stop-color="#B98BFF" stop-opacity=".45"/><stop offset=".6" stop-color="#7C4DDB" stop-opacity=".12"/><stop offset="1" stop-color="#7C4DDB" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC27A" stop-opacity=".32"/><stop offset="1" stop-color="#C7652A" stop-opacity=".1"/></linearGradient>
    <linearGradient id="${id}-center" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(.95)}"/><stop offset="1" stop-color="${shade(.6)}"/></linearGradient>
  </defs>
  <circle class="die-halo" cx="100" cy="100" r="100" fill="url(#${id}-glow)"/>
  <g class="die-body">
    ${faces}
    <polygon points="${pts(TI)}" fill="url(#${id}-center)"/>
    ${fill ? `<g clip-path="url(#${id}-clip)" class="die-liq"><g class="die-fill" style="transform:translateY(200px)"><path class="die-wave" d="${wave} V220 H0Z" fill="url(#${id}-liq)"/><path class="die-wave" d="${wave}" fill="none" stroke="#FFE0A8" stroke-width="1.6" opacity=".9"/></g></g>` : ""}
    <g stroke="rgba(235,225,255,.55)" stroke-width="1.1" stroke-linejoin="round" fill="none">${edges}<polygon points="${pts(TI)}"/></g>
    <polygon points="${pts(HP)}" fill="none" stroke="rgba(20,14,28,.9)" stroke-width="3"/>
    <polygon points="${pts(HP)}" fill="none" stroke="rgba(220,205,255,.35)" stroke-width="1"/>
    <text class="die-main" x="100" y="106">–</text>
  </g>
</svg>`;
}

const last = {};
export function setDie(id, p, n) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelector(".die-main").textContent = n;
  const f = el.querySelector(".die-fill");
  if (!f) return;
  const y = v => `translateY(${(1 - v) * 172 + 8}px)`;
  f.style.transition = "none";
  f.style.transform = y(last[id] ?? 0);
  f.getBoundingClientRect();
  f.style.transition = "";
  requestAnimationFrame(() => { f.style.transform = y(p); });
  last[id] = p;
}
