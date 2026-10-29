import { gamesFrom, normalizeGame, TEMPLATE } from "./games.js";
import { Space, readJSON, writeJSON } from "./store.js";
import * as sync from "./sync.js";
import { INK, UI, cup, corners } from "./icons.js";
import { dieSVG, setDie } from "./die.js";
import { sfx, setSound } from "./sound.js";
import { makeCard, shareBlob } from "./share.js";
import { initMotes, burst } from "./motes.js";

const VERSION = "2.0.0";
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = n => Number(n).toLocaleString("fr-FR");
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const pct = r => String(r).replace(".", ",") + " %";
const META = { p: "Platine", g: "Or", s: "Argent", b: "Bronze" };
const ST = { todo: "À faire", doing: "En cours", done: "Obtenu" };
const day = ts => new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const isoDay = ts => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

/* ---------- État ---------- */
const PREF = "grimoire:prefs";
const prefs = { game: "bg3", sound: true, ...readJSON(PREF) };
const savePrefs = () => writeJSON(PREF, prefs);
setSound(prefs.sound);

const lib = new Space("_library");
let G, sp;
const ui = { view: "home", tab: "todo", q: "", types: new Set(), cats: new Set(), flags: new Set(), sheet: null, stamp: null };
let installEvt = null;

function seedFor(g) {
  const o = {};
  if (g.seed?.done) g.seed.done.forEach(id => { o["t:" + id] = { status: "done", progress: g.trophies.find(x => x.id === id)?.goal || 0, note: "", doneAt: null, updatedAt: g.seed.at || 1 }; });
  return o;
}
function useGame(id) {
  const list = gamesFrom(lib);
  G = list.find(g => g.id === id) || list[0];
  prefs.game = G.id; savePrefs();
  G.base = G.trophies.filter(x => !x.bonus);
  G.plat = G.trophies.find(x => x.t === "p");
  G.totalPts = G.base.reduce((a, x) => a + (G.points[x.t] || 0), 0);
  sp = new Space(G.id, seedFor(G));
  sync.setSpaces([sp, lib]);
  const r = document.documentElement.style;
  ["gold", "arcane", "bronze"].forEach(k => G.theme[k] ? r.setProperty("--" + k, G.theme[k]) : r.removeProperty("--" + k));
}

const ts = id => sp.get("t:" + id) || { status: "todo", progress: 0, note: "" };
const byId = id => G.trophies.find(x => x.id === id);
const hasRun = () => !!sp.get("run");
const run = () => ({ name: "", fields: {}, act: G.acts[0]?.id || "any", startedAt: Date.now(), archive: [], ...(sp.get("run") || {}) });
function statusOf(x) {
  if (x.t === "p") return G.base.every(y => y.t === "p" || ts(y.id).status === "done") ? "done" : "todo";
  return ts(x.id).status || "todo";
}
const once = x => x.once ?? /une (seule )?partie/i.test(x.d);
const actIdx = a => G.acts.findIndex(z => z.id === a);
const actLabel = a => a && a !== "any" ? (G.acts.find(z => z.id === a)?.l || a) : G.anyLabel;
function reqOk(x, r = run()) {
  if (!x.req) return true;
  return Object.entries(x.req).every(([k, list]) => !r.fields[k] || list.includes(r.fields[k]));
}
function doable(x, r = run()) {
  if (x.t === "p" || statusOf(x) === "done" || !reqOk(x, r)) return false;
  const a = x.a || "any";
  return a === "any" || a === r.act;
}
function missed(x, r = run()) {
  if (!hasRun() || x.t === "p" || statusOf(x) === "done" || !x.a || x.a === "any") return false;
  const i = actIdx(x.a), c = actIdx(r.act);
  return i >= 0 && c >= 0 && i < c;
}
function atRisk(x, r = run()) {
  return hasRun() && x.t !== "p" && x.a && x.a !== "any" && x.a === r.act && statusOf(x) !== "done" && reqOk(x, r) && actIdx(r.act) < G.acts.length - 1;
}
function stats() {
  const done = G.base.filter(x => statusOf(x) === "done");
  const pts = done.reduce((a, x) => a + (G.points[x.t] || 0), 0);
  const p = statusOf(G.plat) === "done" ? 1 : Math.min(.999, G.totalPts ? pts / G.totalPts : done.length / G.base.length);
  return { done: done.length, total: G.base.length, left: G.base.length - done.length, p, roll: p >= 1 ? 20 : Math.max(1, Math.min(19, Math.ceil(p * 20 - 1e-9))) };
}
const metals = () => ["p", "g", "s", "b"].map(t => { const all = G.base.filter(x => x.t === t); return { t, l: META[t], all: all.length, d: all.filter(x => statusOf(x) === "done").length }; });
const dcOf = x => x.r == null ? 15 : Math.max(5, Math.min(25, Math.round(5 + (100 - x.r) / 100 * 20)));

/* ---------- Mutations ---------- */
function save(x, s) { sp.put("t:" + x.id, s); sync.schedule(); }
function setStatus(x, v) {
  if (x.t === "p") return;
  const was = statusOf(x), platWas = statusOf(G.plat);
  const s = { ...ts(x.id), status: v };
  if (v === "done" && was !== "done") s.doneAt = Date.now();
  if (v !== "done") s.doneAt = null;
  save(x, s);
  if (v === "done" && was !== "done") { ui.stamp = x.id; sfx.stamp(); celebrate(x); }
  else sfx.tick();
  if (statusOf(G.plat) === "done" && platWas !== "done") setTimeout(() => celebrate(G.plat), 3200);
  refresh();
}
function setProgress(x, val) {
  val = Math.max(0, Math.min(x.goal, Math.round(Number(val) || 0)));
  const s = { ...ts(x.id) }, prev = s.status || "todo";
  s.progress = val;
  if (val >= x.goal) s.status = "done";
  else if (val > 0) s.status = "doing";
  else if (prev === "doing") s.status = "todo";
  if (s.status === "done" && prev !== "done") s.doneAt = Date.now();
  if (s.status !== "done") s.doneAt = null;
  save(x, s);
  if (s.status === "done" && prev !== "done") { ui.stamp = x.id; sfx.stamp(); celebrate(x); }
  refresh();
}
function toggleStep(x, i) {
  const s = { ...ts(x.id), steps: { ...(ts(x.id).steps || {}) } };
  s.steps[i] = !s.steps[i];
  sfx.tick();
  if (x.stepsDrive && x.goal) { save(x, s); return setProgress(x, Object.values(s.steps).filter(Boolean).length); }
  if (s.steps[i] && s.status === "todo") s.status = "doing";
  save(x, s); refresh();
}
function customStep(x, op, arg) {
  const s = { ...ts(x.id) };
  const list = [...(s.custom || [])];
  if (op === "add") { if (!arg.trim()) return; list.push({ l: arg.trim(), d: false }); }
  if (op === "toggle") list[arg] = { ...list[arg], d: !list[arg].d };
  if (op === "del") list.splice(arg, 1);
  s.custom = list;
  save(x, s); sfx.tick(); refresh();
}
function setRun(patch) { sp.put("run", { ...run(), ...patch }); sync.schedule(); refresh(); }

/* ---------- Gabarits ---------- */
function medal(t, cls = "") { return `<span class="medal m-${t} ${cls}">${cup(t)}</span>`; }
function pills(x) {
  const st = statusOf(x), out = [];
  if (st === "doing") out.push(`<span class="pill doing">En cours</span>`);
  if (atRisk(x)) out.push(`<span class="pill risk">${UI.warn}Manquable</span>`);
  else if (missed(x)) out.push(`<span class="pill missed">Manqué cette partie</span>`);
  if (once(x)) out.push(`<span class="pill once">1 partie</span>`);
  if (x.durge) out.push(`<span class="pill durge">Sombres Pulsions</span>`);
  if (x.r < 10) out.push(`<span class="pill rare">${pct(x.r)}</span>`);
  return out.join("");
}
function bar(x) {
  if (!x.goal) return "";
  const st = statusOf(x), v = st === "done" ? x.goal : (ts(x.id).progress || 0);
  return `<span class="bar"><i style="width:${Math.min(1, v / x.goal) * 100}%"></i></span><span class="barlbl">${fmt(v)} sur ${fmt(x.goal)} ${esc(x.u || "")}</span>`;
}
function card(x) {
  const st = statusOf(x), c = G.cats[x.c];
  return `<article class="card" data-st="${st}" data-t="${x.t}">
    <button type="button" class="card-main" data-open="${x.id}">
      ${medal(x.t)}
      <span class="card-txt">
        <span class="name">${esc(x.n)}</span>
        <span class="desc">${esc(x.d)}</span>
        <span class="meta"><span class="cat-ico">${INK[c.i]}</span>${esc(c.l)}${x.a && x.a !== "any" ? " · " + esc(actLabel(x.a)) : ""}</span>
        ${pills(x) ? `<span class="pills">${pills(x)}</span>` : ""}
        ${bar(x)}
      </span>
    </button>
    <button type="button" class="seal${ui.stamp === x.id ? " stamp" : ""}" data-seal="${x.id}" aria-label="${st === "done" ? "Retirer le sceau" : "Apposer le sceau"} : ${esc(x.n)}" ${x.t === "p" ? "disabled" : ""}>${UI.check}</button>
  </article>`;
}
function mini(x) {
  return `<button type="button" class="mini" data-open="${x.id}">${medal(x.t, "sm")}<span><b>${esc(x.n)}</b><small>${esc(G.cats[x.c].l)}${x.goal ? ` · ${fmt(ts(x.id).progress || 0)}/${fmt(x.goal)}` : ""}</small></span></button>`;
}
const section = (title, body, extra = "") => `<section class="panel ${extra}">${corners()}<h2 class="ph">${title}</h2>${body}</section>`;

/* ---------- En-tête & navigation ---------- */
const SYNC_TXT = { off: "Local", connecting: "Connexion…", signedout: "Non connecté·e", syncing: "Synchro…", ok: "Synchronisé", offline: "Hors ligne", error: "Erreur synchro" };
function renderBar() {
  $("#bar").innerHTML = `
    <button type="button" class="brand" data-go="home" aria-label="Accueil">
      <span class="brand-ico">${INK.d20}</span>
      <span><b>Grimoire de platine</b><small>${esc(G.name)}${G.platform ? " · " + esc(G.platform) : ""}</small></span>
    </button>
    <button type="button" class="sync" data-go="more" data-s="${sync.status}" aria-label="État de la synchronisation : ${SYNC_TXT[sync.status]}"><i></i><span>${SYNC_TXT[sync.status]}</span></button>`;
}
const NAV = [["home", "Grimoire", "book"], ["list", "Registre", "map"], ["run", "Partie", "hero"], ["chron", "Chronique", "hourglass"], ["more", "Plus", "star"]];
function renderNav() {
  $("#nav").innerHTML = NAV.map(([k, l, i]) => `<button type="button" data-go="${k}" ${ui.view === k ? 'aria-current="page"' : ""}><span class="nav-ico">${INK[i]}</span><span>${l}</span>${k === "run" && hasRun() && G.base.some(x => atRisk(x)) ? `<em aria-label="Manquables"></em>` : ""}</button>`).join("");
}

/* ---------- Vue : Grimoire ---------- */
function vHome() {
  const s = stats(), r = run();
  const ms = metals().filter(m => m.all).map(m => `<div class="metal"><span class="coin m-${m.t}">${cup(m.t)}</span><b>${m.d}<small>/${m.all}</small></b><span>${m.l}</span></div>`).join("");
  const risk = G.base.filter(x => atRisk(x, r)), cur = G.acts[actIdx(r.act)];
  const now = G.base.filter(x => doable(x, r));
  let alert = "";
  if (!hasRun()) alert = `<button type="button" class="callout" data-go="run"><span class="callout-ico">${INK.hero}</span><span><b>Ouvre ta fiche de partie</b><small>Origine, difficulté, acte en cours : le grimoire te dira ce qui est faisable maintenant et ce que tu risques de manquer.</small></span>${UI.arrow}</button>`;
  else if (risk.length) alert = `<section class="alert">${UI.warn}<div><h2>Avant de quitter ${esc(cur?.l || "")}</h2><p>${esc(cur?.close || "Ces hauts faits ne seront plus accessibles ensuite.")}</p><div class="chips-open">${risk.map(x => `<button type="button" data-open="${x.id}"><i class="dot m-${x.t}"></i>${esc(x.n)}</button>`).join("")}</div></div></section>`;

  return `
  <div class="hero-top">
    <p class="eyebrow">Registre des hauts faits${G.player ? " · " + esc(G.player) : ""}</p>
    <h1 class="title">${esc(G.platTitle)}</h1>
  </div>
  <section class="check" aria-label="Progression vers le platine">
    ${corners()}
    <div class="check-in">
      <div class="runes" aria-hidden="true"></div>
      <p class="check-title">Jet de platine</p>
      <p class="check-sub">Test de persévérance</p>
      <div class="dc"><span>Classe de<br>difficulté</span><b>20</b></div>
      <div class="braid" aria-hidden="true"><i></i></div>
      <div class="die-box">${dieSVG("hd", { label: `Dé à vingt faces : ${s.roll} sur 20` })}</div>
      <div class="verdict${s.p >= 1 ? " win" : ""}">${s.p >= 1 ? "Réussite" : Math.floor(s.p * 100) + " %"}</div>
      <p class="check-foot">${s.p >= 1 ? "Le 20 naturel est tombé : platine obtenu." : `<b>${s.done}</b> hauts faits sur ${s.total} · <b>${s.left}</b> restants`}</p>
    </div>
  </section>
  <div class="metals">${ms}</div>
  <div class="actions">
    <button type="button" class="btn primary" data-act="roll"><span class="btn-ico">${INK.d20}</span>Lancer le dé du destin</button>
    <button type="button" class="btn icon" data-act="share" aria-label="Partager ma progression">${UI.share}</button>
  </div>
  ${alert}
  ${hasRun() ? section(`Faisable maintenant <span class="ph-n">${esc(actLabel(r.act))} · ${now.length}</span>`, now.length ? `<div class="minis">${now.map(mini).join("")}</div>` : `<p class="muted">Rien d'autre à faire dans cet acte pour ta partie actuelle. Avance d'un acte dans ta fiche de partie.</p>`) : ""}
  ${vRoute(r)}
  ${section("Bibliothèque des guides", `<div class="guides">${G.guides.map(g => `<a href="${esc(g.u)}" target="_blank" rel="noopener"><b>${esc(g.n)}<span>${esc(g.lang || "")}</span></b><small>${esc(g.d || "")}</small></a>`).join("")}</div>`, "collapsible")}
  `;
}
function vRoute(r) {
  const left = G.base.filter(x => x.t !== "p" && statusOf(x) !== "done");
  const keys = [...G.acts.map(a => a.id), "any"];
  const nodes = keys.map(k => {
    const xs = left.filter(x => (x.a || "any") === k);
    const here = hasRun() && r.act === k, past = hasRun() && k !== "any" && actIdx(k) < actIdx(r.act);
    return `<li class="node${here ? " here" : ""}${past ? " past" : ""}${xs.length ? "" : " clear"}">
      <span class="node-gem" aria-hidden="true"></span>
      <div class="node-h"><b>${esc(actLabel(k))}</b>${here ? `<span class="here-tag">Tu es ici</span>` : ""}<small>${xs.length ? `${xs.length} ${xs.length > 1 ? "quêtes" : "quête"}` : "Achevé"}</small></div>
      ${xs.length ? `<div class="chips-open">${xs.map(x => `<button type="button" data-open="${x.id}" class="${missed(x, r) ? "is-missed" : ""}"><i class="dot m-${x.t}"></i>${esc(x.n)}</button>`).join("")}</div>` : ""}
    </li>`;
  }).join("");
  const hint = [];
  if (left.some(x => x.id === "coup-critique")) hint.push("Une ultime partie en <b>Tacticien</b> couvre « Coup critique » et, avec l'origine <b>Sombres Pulsions</b>, « Les péchés du père ».");
  if (left.some(x => once(x) && x.id !== "coup-critique")) hint.push("Enchaîne-y les hauts faits « 1 partie » : ils se cumulent du début à la fin.");
  return section("Journal de quête", `${hint.length ? `<p class="hint">${hint.join(" ")}</p>` : ""}<ol class="route">${nodes}</ol>`);
}

/* ---------- Vue : Registre ---------- */
function filterCount() { return ui.types.size + ui.cats.size + ui.flags.size; }
function matches(x) {
  const st = statusOf(x), r = run();
  if (ui.tab !== "all" && st !== ui.tab) return false;
  if (ui.types.size && !ui.types.has(x.t)) return false;
  if (ui.cats.size && !ui.cats.has(x.c)) return false;
  for (const f of ui.flags) {
    if (f === "once" && !once(x)) return false;
    if (f === "durge" && !x.durge) return false;
    if (f === "rare" && !(x.r < 10)) return false;
    if (f === "now" && !doable(x, r)) return false;
    if (f === "risk" && !atRisk(x, r)) return false;
  }
  if (ui.q) {
    const s = ts(x.id);
    const h = norm([x.n, x.d, x.tip || "", s.note || "", G.cats[x.c].l, actLabel(x.a)].join(" "));
    if (!h.includes(ui.q)) return false;
  }
  return true;
}
const FLAGS = [["now", "Faisable maintenant"], ["risk", "Manquable"], ["once", "1 partie"], ["durge", "Sombres Pulsions"], ["rare", "Rares (< 10 %)"]];
function vList() {
  const c = { todo: 0, doing: 0, done: 0 };
  G.base.forEach(x => c[statusOf(x)]++);
  const tabs = [["todo", "À faire"], ["doing", "En cours"], ["done", "Obtenus"], ["all", "Tous"]];
  const active = [
    ...[...ui.types].map(t => [`type:${t}`, META[t]]),
    ...[...ui.cats].map(k => [`cat:${k}`, G.cats[k].l]),
    ...[...ui.flags].map(f => [`flag:${f}`, FLAGS.find(z => z[0] === f)[1]])
  ];
  return `
  <div class="lhead">
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${ui.tab === k}">${l}<span>${k === "all" ? G.base.length : c[k]}</span></button>`).join("")}</div>
    <div class="row">
      <label class="search">${UI.search}<input id="q" type="search" placeholder="Trophée, compagnon, boss…" aria-label="Rechercher" value="${esc(ui.qRaw || "")}"></label>
      <button type="button" class="fbtn" data-act="filters" aria-label="Filtres">${UI.filter}<span>Filtres</span>${filterCount() ? `<em>${filterCount()}</em>` : ""}</button>
    </div>
    ${active.length ? `<div class="active">${active.map(([k, l]) => `<button type="button" data-unf="${k}">${esc(l)}${UI.close}</button>`).join("")}<button type="button" class="clear" data-act="clearf">Tout effacer</button></div>` : ""}
  </div>
  <div class="list" id="list">${listHTML()}</div>`;
}
function listHTML() {
  const items = G.base.filter(matches), bonus = G.trophies.filter(x => x.bonus && matches(x));
  if (ui.tab === "done") items.sort((a, b) => (ts(b.id).doneAt || 0) - (ts(a.id).doneAt || 0));
  let h = items.map(card).join("");
  if (bonus.length) h += `<div class="sect"><span>Bonus · hors platine</span></div>` + bonus.map(card).join("");
  if (!h) {
    const msg = { todo: ["Aucune quête ici", "Aucun trophée ne correspond. Change de filtre ou d'onglet."], doing: ["Aucune quête en cours", "Ouvre un trophée et passe-le « En cours », ou saisis une progression."], done: ["Aucun sceau apposé", "Scelle un trophée pour le ranger ici."], all: ["Aucun résultat", "Essaie un autre mot-clé."] }[ui.tab];
    h = `<div class="empty"><span class="empty-ico">${INK.map}</span><b>${msg[0]}</b>${msg[1]}</div>`;
  }
  ui.stamp = null;
  return h;
}

/* ---------- Vue : Partie ---------- */
function vRun() {
  const r = run(), started = hasRun();
  const fields = G.run.fields.map(f => `<div class="field"><span class="ink-lbl">${esc(f.l)}</span><div class="opts">${f.o.map(([v, l]) => `<button type="button" data-field="${f.id}" data-val="${v}" aria-pressed="${r.fields[f.id] === v}">${esc(l)}</button>`).join("")}</div></div>`).join("");
  const track = G.acts.map((a, i) => `<button type="button" class="stop${a.id === r.act ? " on" : ""}${i < actIdx(r.act) ? " past" : ""}" data-actset="${a.id}"><i></i><span>${esc(a.l)}</span></button>`).join("");
  const now = G.base.filter(x => doable(x, r)), lost = G.base.filter(x => missed(x, r)), risk = G.base.filter(x => atRisk(x, r));
  const onceLeft = G.base.filter(x => once(x) && statusOf(x) !== "done");
  return `
  <section class="parch char">
    <div class="parch-in">
      <p class="ink-eyebrow">${esc(G.name)}</p>
      <h1 class="ink-title">Fiche de partie</h1>
      ${started ? `<p class="ink-sub">Commencée le ${day(r.startedAt)}</p>` : `<p class="ink-sub">Remplis la fiche : le grimoire calcule ce qui est faisable maintenant.</p>`}
      <label class="ink-field"><span class="ink-lbl">Nom de la partie</span><input id="runName" value="${esc(r.name)}" placeholder="Ex. Durge tacticienne" autocomplete="off"></label>
      ${fields}
      ${G.acts.length ? `<div class="field"><span class="ink-lbl">Où en es-tu ?</span><div class="track">${track}</div></div>` : ""}
      ${!started ? `<button type="button" class="ink-btn" data-act="startrun">Ouvrir la fiche</button>` : ""}
    </div>
  </section>
  ${started && risk.length ? `<section class="alert">${UI.warn}<div><h2>À faire avant de quitter ${esc(actLabel(r.act))}</h2><p>${esc(G.acts[actIdx(r.act)]?.close || "")}</p><div class="chips-open">${risk.map(x => `<button type="button" data-open="${x.id}"><i class="dot m-${x.t}"></i>${esc(x.n)}</button>`).join("")}</div></div></section>` : ""}
  ${section(`Faisable maintenant <span class="ph-n">${now.length}</span>`, now.length ? `<div class="stack">${now.map(card).join("")}</div>` : `<p class="muted">Rien pour l'instant avec cette fiche.</p>`)}
  ${lost.length ? section(`Manqués dans cette partie <span class="ph-n">${lost.length}</span>`, `<p class="muted">Ces actes sont derrière toi : ce sera pour une prochaine partie.</p><div class="chips-open">${lost.map(x => `<button type="button" data-open="${x.id}" class="is-missed"><i class="dot m-${x.t}"></i>${esc(x.n)}</button>`).join("")}</div>`) : ""}
  ${started ? section("Nouvelle partie", `<p class="muted">Archive cette fiche et repars de zéro. Les compteurs « 1 partie » non obtenus (${onceLeft.length}) seront remis à zéro ; tes trophées obtenus restent scellés.</p><button type="button" class="btn" data-act="newrun">${UI.plus}Commencer une nouvelle partie</button>
    ${r.archive?.length ? `<h3 class="sub-h">Parties précédentes</h3><ul class="archive">${r.archive.slice().reverse().map(a => `<li><b>${esc(a.name || "Partie sans nom")}</b><small>${G.run.fields.map(f => f.o.find(o => o[0] === a.fields?.[f.id])?.[1]).filter(Boolean).map(esc).join(" · ")}${a.fields && Object.keys(a.fields).length ? " · " : ""}${day(a.startedAt)} → ${day(a.endedAt)} · arrêtée en ${esc(actLabel(a.act))}</small></li>`).join("")}</ul>` : ""}`) : ""}`;
}
async function moveAct(to) {
  const r = run(), from = actIdx(r.act), ti = actIdx(to);
  if (ti > from) {
    const passing = G.acts.slice(from, ti).map(a => a.id);
    const risk = G.base.filter(x => x.t !== "p" && passing.includes(x.a) && statusOf(x) !== "done" && reqOk(x, r));
    if (risk.length) {
      const closes = G.acts.slice(from, ti).filter(a => a.close).map(a => `<p>${esc(a.close)}</p>`).join("");
      const ok = await confirmBox({
        title: "Point de non-retour",
        body: `${closes}<p>Il te reste <b>${risk.length}</b> haut${risk.length > 1 ? "s" : ""} fait${risk.length > 1 ? "s" : ""} qui ne ser${risk.length > 1 ? "ont" : "a"} plus accessible${risk.length > 1 ? "s" : ""} dans cette partie :</p><ul class="risk-list">${risk.map(x => `<li><i class="dot m-${x.t}"></i>${esc(x.n)}</li>`).join("")}</ul>`,
        yes: "Avancer quand même", no: "Rester ici", danger: true
      });
      if (!ok) return;
    }
  }
  sfx.page();
  setRun({ act: to });
}
async function newRun() {
  const ok = await confirmBox({ title: "Nouvelle partie", body: "<p>La fiche actuelle sera archivée et les compteurs « 1 partie » non obtenus remis à zéro.</p>", yes: "Commencer", no: "Annuler" });
  if (!ok) return;
  const r = run();
  G.base.filter(x => once(x) && statusOf(x) !== "done").forEach(x => {
    const s = ts(x.id);
    if (s.progress || s.steps || s.status === "doing") save(x, { ...s, progress: 0, steps: {}, status: "todo" });
  });
  sp.put("run", { name: "", fields: {}, act: G.acts[0]?.id || "any", startedAt: Date.now(), archive: [...(r.archive || []), { name: r.name, fields: r.fields, act: r.act, startedAt: r.startedAt, endedAt: Date.now() }] });
  sync.schedule(); sfx.page(); refresh();
}

/* ---------- Vue : Chronique ---------- */
function vChron() {
  const done = G.base.filter(x => statusOf(x) === "done" && x.t !== "p");
  const dated = done.filter(x => ts(x.id).doneAt).sort((a, b) => ts(a.id).doneAt - ts(b.id).doneAt);
  const undated = done.filter(x => !ts(x.id).doneAt);
  const groups = {};
  dated.slice().reverse().forEach(x => {
    const k = new Date(ts(x.id).doneAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    (groups[k] = groups[k] || []).push(x);
  });
  const entry = x => `<li><button type="button" data-open="${x.id}">${medal(x.t, "sm")}<span><b>${esc(x.n)}</b><small>${ts(x.id).doneAt ? day(ts(x.id).doneAt) : esc(G.cats[x.c].l)}</small></span></button></li>`;
  const plat = statusOf(G.plat) === "done";
  return `
  <div class="hero-top"><p class="eyebrow">Chronique</p><h1 class="title sm">Le chemin du platine</h1></div>
  ${section("Progression dans le temps", chart(dated, undated.length))}
  ${plat ? `<div class="plat-banner">${medal("p", "lg")}<div><b>Platine obtenu</b><small>${esc(G.platTitle)}</small></div></div>` : ""}
  ${section("Sceaux apposés", `${Object.keys(groups).length ? Object.entries(groups).map(([m, xs]) => `<h3 class="month">${m}</h3><ol class="chron-tl">${xs.map(entry).join("")}</ol>`).join("") : `<p class="muted">Les prochains sceaux seront datés ici automatiquement.</p>`}
    ${undated.length ? `<h3 class="month">Avant l'ouverture du grimoire <span>${undated.length}</span></h3><p class="muted">Date inconnue : touche un trophée pour la renseigner.</p><ol class="chron-tl compact">${undated.map(entry).join("")}</ol>` : ""}`)}`;
}
function chart(dated, base) {
  const W = 340, H = 150, P = 26, total = G.base.length - 1;
  if (!dated.length) return `<div class="chart-empty"><b>${base}</b> hauts faits déjà scellés avant le grimoire. La courbe démarrera avec ton prochain sceau.</div>`;
  const t0 = ts(dated[0].id).doneAt, t1 = Math.max(Date.now(), t0 + 864e5);
  const X = t => P + (t - t0) / (t1 - t0) * (W - P * 1.5), Y = n => H - P - n / total * (H - P * 1.6);
  let n = base, d = `M${P} ${Y(base)}`;
  dated.forEach(x => { const t = ts(x.id).doneAt; d += ` H${X(t).toFixed(1)} V${Y(++n).toFixed(1)}`; });
  d += ` H${X(t1).toFixed(1)}`;
  const area = d + ` V${H - P} H${P} Z`;
  const dots = dated.map((x, i) => `<circle cx="${X(ts(x.id).doneAt).toFixed(1)}" cy="${Y(base + i + 1).toFixed(1)}" r="3" class="cdot m-${x.t}"/>`).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution : de ${base} à ${n} hauts faits">
    <defs><linearGradient id="chA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0A55A" stop-opacity=".35"/><stop offset="1" stop-color="#F0A55A" stop-opacity="0"/></linearGradient></defs>
    <line x1="${P}" x2="${W - P / 2}" y1="${Y(total)}" y2="${Y(total)}" class="goal"/><text x="${W - P / 2}" y="${Y(total) - 5}" text-anchor="end" class="clbl">Platine · ${total}</text>
    <path d="${area}" fill="url(#chA)"/><path d="${d}" class="line"/>${dots}
    <text x="${P}" y="${H - 8}" class="clbl">${new Date(t0).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</text>
    <text x="${W - P / 2}" y="${H - 8}" text-anchor="end" class="clbl">aujourd'hui</text>
    <text x="${P + 4}" y="${Y(base) - 6}" class="clbl">${base}</text><text x="${X(t1) - 2}" y="${Y(n) - 6}" text-anchor="end" class="clbl hi">${n}</text>
  </svg>`;
}

/* ---------- Vue : Plus ---------- */
function vMore() {
  const u = sync.currentUser(), list = gamesFrom(lib);
  let acc;
  if (!sync.enabled()) acc = `<p class="muted">La synchronisation n'est pas encore configurée : ta progression reste sur cet appareil. Renseigne <code>config.js</code> avec ton projet Supabase (voir le README) pour la retrouver partout.</p>`;
  else if (!sync.ready()) acc = `<p class="muted">${sync.status === "connecting" ? "Connexion au serveur…" : "Serveur injoignable pour l'instant. Ta progression est gardée sur l'appareil et sera synchronisée au retour du réseau."}</p>${sync.status === "connecting" ? "" : `<button type="button" class="btn" data-act="retry">${UI.cloud}Réessayer</button>`}`;
  else if (!u) acc = `<form class="auth" id="auth"><label><span class="lbl">Email</span><input name="email" type="email" autocomplete="email" required></label><label><span class="lbl">Mot de passe</span><input name="pw" type="password" autocomplete="current-password" minlength="6" required></label><div class="row2"><button class="btn primary" name="mode" value="in">Se connecter</button><button class="btn" name="mode" value="up">Créer le compte</button></div><p class="auth-msg" id="authMsg" role="status"></p></form>`;
  else acc = `<div class="acc"><span class="acc-ico">${UI.cloud}</span><div><b>${esc(u.email)}</b><small>${SYNC_TXT[sync.status]}</small></div></div><div class="row2"><button type="button" class="btn" data-act="syncnow">Synchroniser</button><button type="button" class="btn ghost" data-act="signout">Se déconnecter</button></div>`;
  return `
  <div class="hero-top"><p class="eyebrow">Réglages</p><h1 class="title sm">L'antre du mage</h1></div>
  ${section("Compte & synchronisation", acc)}
  ${section("Jeux du grimoire", `<div class="games">${list.map(g => `<button type="button" class="game${g.id === G.id ? " on" : ""}" data-game="${esc(g.id)}"><span class="game-ico">${INK.d20}</span><span><b>${esc(g.name)}</b><small>${esc(g.platform)} · ${g.trophies.length} trophées</small></span>${g.id === G.id ? `<em>Actif</em>` : ""}</button>`).join("")}</div>
    <p class="muted">Pour suivre un autre platine, télécharge le modèle, remplis-le avec la liste des trophées, puis importe-le.</p>
    <div class="row2"><button type="button" class="btn" data-act="tpl">${UI.download}Modèle de jeu</button><label class="btn">${UI.upload}Importer un jeu<input type="file" accept="application/json,.json" id="gameFile" hidden></label></div>`)}
  ${section("Sauvegarde", `<p class="muted">Exporte ta progression (trophées, notes, fiche de partie) dans un fichier, pour la garder ou la restaurer.</p><div class="row2"><button type="button" class="btn" data-act="export">${UI.download}Exporter</button><label class="btn">${UI.upload}Restaurer<input type="file" accept="application/json,.json" id="backupFile" hidden></label></div>`)}
  ${section("Partage", `<p class="muted">Une carte au format portrait avec ton d20, ta progression et tes médailles.</p><button type="button" class="btn" data-act="share">${UI.share}Créer ma carte de progression</button>`)}
  ${section("Ambiance", `<button type="button" class="toggle" data-act="sound" aria-pressed="${prefs.sound}"><span>${prefs.sound ? UI.sound : UI.mute}Sons (sceau, dé, parchemin)</span><i></i></button>`)}
  ${section("Installer sur le téléphone", installEvt ? `<button type="button" class="btn primary" data-act="install">${UI.phone}Installer l'application</button>` : matchMedia("(display-mode: standalone)").matches ? `<p class="muted">L'application est installée. Bonne quête !</p>` : `<ol class="steps-how"><li><b>iPhone (Safari)</b> : bouton Partager, puis « Sur l'écran d'accueil ».</li><li><b>Android (Chrome)</b> : menu ⋮, puis « Installer l'application ».</li></ol>`)}
  <p class="foot">Grimoire de platine v${VERSION} · Liste d'après PSTHC, rareté d'après Exophase. Progression calculée comme sur PlayStation : bronze ${G.points.b}, argent ${G.points.s}, or ${G.points.g} points.</p>`;
}

/* ---------- Fiche détaillée (bottom sheet) ---------- */
function sheetTrophy(x) {
  const st = statusOf(x), s = ts(x.id), c = G.cats[x.c];
  const steps = x.steps ? x.steps.map((l, i) => `<li><button type="button" data-step-i="${i}" aria-pressed="${!!s.steps?.[i]}"><i>${UI.check}</i>${esc(l)}</button></li>`).join("") : "";
  const custom = (s.custom || []).map((z, i) => `<li><button type="button" data-cstep="${i}" aria-pressed="${z.d}"><i>${UI.check}</i>${esc(z.l)}</button><button type="button" class="del" data-cdel="${i}" aria-label="Supprimer l'étape">${UI.close}</button></li>`).join("");
  const links = [
    ...G.guides.filter(g => g.feat || g.cats?.includes(x.c) || (x.durge && g.cats?.includes("durge"))).map(g => [g.n, g.u, UI.ext, g.feat ? "feat" : ""]),
    ["Vidéos YouTube", `https://www.youtube.com/results?search_query=${encodeURIComponent(`${G.name} trophée ${x.n}`)}`, UI.play, ""],
    ["Chercher une soluce", `https://www.google.com/search?q=${encodeURIComponent(`${G.name} trophée "${x.n}"`)}`, UI.search, ""]
  ].map(([l, u, i, k]) => `<a class="lnk ${k}" href="${esc(u)}" target="_blank" rel="noopener">${i}${esc(l)}</a>`).join("");
  return `
  <div class="grab" aria-hidden="true"></div>
  <button type="button" class="sh-close" data-close aria-label="Fermer">${UI.close}</button>
  <div class="sh-head">
    ${medal(x.t, "lg")}
    <div>
      <p class="eyebrow">${META[x.t]}${G.points[x.t] && !x.bonus ? ` · ${G.points[x.t]} pts` : ""}${x.r != null ? ` · ${pct(x.r)} des joueurs` : ""}</p>
      <h2>${esc(x.n)}</h2>
      <p class="sh-desc">${esc(x.d)}</p>
      <p class="sh-meta"><span class="cat-ico">${INK[c.i]}</span>${esc(c.l)} · ${esc(actLabel(x.a))}</p>
      ${pills(x) ? `<div class="pills">${pills(x)}</div>` : ""}
    </div>
  </div>
  <div class="sh-body">
    ${x.t === "p" ? `<p class="muted">Il se débloque tout seul quand les ${G.base.length - 1} autres hauts faits sont scellés.</p>` : `
    <div><span class="lbl">Statut</span><div class="seg">${["todo", "doing", "done"].map(v => `<button type="button" data-set="${v}" data-v="${v}" aria-pressed="${st === v}">${ST[v]}</button>`).join("")}</div></div>
    ${x.goal ? `<div><label class="lbl" for="prog">Progression</label><div class="stepper"><button type="button" data-step="-1" aria-label="Retirer">${UI.minus}</button><input id="prog" type="number" inputmode="numeric" min="0" max="${x.goal}" value="${st === "done" ? x.goal : (s.progress || 0)}" ${x.stepsDrive ? "readonly" : ""}><button type="button" data-step="1" aria-label="Ajouter">${UI.plus}</button><span>sur ${fmt(x.goal)} ${esc(x.u || "")}</span></div>${bar(x)}</div>` : ""}
    <div class="checklist"><span class="lbl">Étapes${x.steps ? ` · ${Object.values(s.steps || {}).filter(Boolean).length + (s.custom || []).filter(z => z.d).length}/${x.steps.length + (s.custom || []).length}` : ""}</span><ul>${steps}${custom}</ul>
      <form class="addstep" id="addStep"><input id="stepTxt" placeholder="Ajouter une étape perso…" autocomplete="off" aria-label="Nouvelle étape"><button class="btn icon" aria-label="Ajouter l'étape">${UI.plus}</button></form></div>
    ${x.tip ? `<div class="tip parch"><div class="parch-in"><span class="ink-lbl">Astuce du grimoire</span><p>${esc(x.tip)}</p></div></div>` : ""}
    ${st === "done" ? `<div><label class="lbl" for="doneAt">Obtenu le</label><input type="date" id="doneAt" value="${s.doneAt ? isoDay(s.doneAt) : ""}" max="${isoDay(Date.now())}" class="date"></div>` : ""}
    `}
    <div><span class="lbl">Soluces & vidéos</span><div class="links">${links}</div></div>
    ${x.t !== "p" ? `<div><label class="lbl" for="note">Mes notes</label><textarea id="note" placeholder="Sauvegarde utilisée, choix faits, où tu en es…">${esc(s.note || "")}</textarea></div>` : ""}
  </div>`;
}
function sheetFilters() {
  const cnt = k => { const xs = G.base.filter(x => x.c === k); return `${xs.filter(x => statusOf(x) === "done").length}/${xs.length}`; };
  return `
  <div class="grab" aria-hidden="true"></div>
  <button type="button" class="sh-close" data-close aria-label="Fermer">${UI.close}</button>
  <div class="parch codex-wrap"><div class="parch-in">
    <h2 class="ink-title sm">Codex des quêtes</h2>
    <div class="codex">${Object.entries(G.cats).map(([k, c]) => `<button type="button" class="tile" data-fcat="${k}" aria-pressed="${ui.cats.has(k)}"><span class="tile-ico">${INK[c.i]}</span><span class="tile-l">${esc(c.l)}</span><small>${cnt(k)}</small></button>`).join("")}</div>
  </div></div>
  <div class="sh-body">
    <div><span class="lbl">Métal</span><div class="chips">${["b", "s", "g", "p"].map(t => `<button type="button" class="chip" data-ftype="${t}" aria-pressed="${ui.types.has(t)}"><i class="dot m-${t}"></i>${META[t]}</button>`).join("")}</div></div>
    <div><span class="lbl">Particularités</span><div class="chips">${FLAGS.map(([k, l]) => `<button type="button" class="chip" data-fflag="${k}" aria-pressed="${ui.flags.has(k)}">${l}</button>`).join("")}</div></div>
    <div class="row2"><button type="button" class="btn ghost" data-act="clearf">Tout effacer</button><button type="button" class="btn primary" data-close>Voir ${G.base.filter(matches).length} trophées</button></div>
  </div>`;
}

/* ---------- Rendu ---------- */
let prevView = null;
function renderView() {
  const v = $("#view"), y = scrollY;
  v.innerHTML = { home: vHome, list: vList, run: vRun, chron: vChron, more: vMore }[ui.view]();
  if (ui.view === "home") setDie("hd", stats().p, stats().roll);
  if (prevView === ui.view) scrollTo(0, y); else { scrollTo(0, 0); prevView = ui.view; }
}
function editingIn(el) { const a = document.activeElement; return el.contains(a) && (a.tagName === "TEXTAREA" || (a.tagName === "INPUT" && a.type !== "date")); }
function renderSheet() {
  const el = $("#sheet");
  if (!ui.sheet) return;
  if (editingIn(el)) return;
  const st = el.scrollTop;
  el.innerHTML = ui.sheet.type === "filters" ? sheetFilters() : sheetTrophy(byId(ui.sheet.id));
  el.scrollTop = st;
}
function refresh() { renderBar(); renderNav(); if (!editingIn($("#view"))) renderView(); else if (ui.view === "list") $("#list").innerHTML = listHTML(); renderSheet(); }
function go(v) { if (ui.view === v) return scrollTo({ top: 0, behavior: "smooth" }); ui.view = v; closeSheet(); renderNav(); renderView(); $("#view").focus({ preventScroll: true }); history.replaceState(null, "", "#" + v); }

/* ---------- Feuilles, modales, toasts ---------- */
let lastFocus = null;
function openSheet(s) {
  lastFocus = document.activeElement;
  ui.sheet = s;
  const el = $("#sheet");
  el.hidden = false; $("#scrim").hidden = false;
  el.scrollTop = 0;
  renderSheet();
  requestAnimationFrame(() => { el.classList.add("show"); $("#scrim").classList.add("show"); });
  document.body.classList.add("locked");
  sfx.page();
  setTimeout(() => $(".sh-close", el)?.focus({ preventScroll: true }), 50);
}
function closeSheet() {
  if (!ui.sheet) return;
  ui.sheet = null;
  const el = $("#sheet");
  el.classList.remove("show"); $("#scrim").classList.remove("show");
  document.body.classList.remove("locked");
  setTimeout(() => { if (!ui.sheet) { el.hidden = true; $("#scrim").hidden = true; } }, 320);
  renderView();
  lastFocus?.focus?.({ preventScroll: true });
}
function openModal(html, cls = "") {
  const m = $("#modal");
  m.className = "modal " + cls;
  m.innerHTML = `<div class="modal-in">${html}</div>`;
  m.hidden = false;
  requestAnimationFrame(() => m.classList.add("show"));
  return m;
}
function closeModal() {
  const m = $("#modal");
  m.classList.remove("show");
  setTimeout(() => { m.hidden = true; m.innerHTML = ""; }, 250);
}
function confirmBox({ title, body, yes, no, danger }) {
  return new Promise(res => {
    const m = openModal(`<section class="dialog">${corners()}<h2 class="ph">${title}</h2><div class="dialog-body">${body}</div><div class="row2"><button type="button" class="btn ghost" data-r="0">${no}</button><button type="button" class="btn ${danger ? "danger" : "primary"}" data-r="1">${yes}</button></div></section>`);
    m.onclick = e => { const b = e.target.closest("[data-r]"); if (!b && e.target !== m) return; m.onclick = null; closeModal(); res(b?.dataset.r === "1"); };
    setTimeout(() => $("[data-r='0']", m)?.focus(), 30);
  });
}
let toastT;
function toast(html, ms = 3000) {
  const t = $("#toast");
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), ms);
}
function celebrate(x) {
  toast(`<div class="unlock">${corners()}<span class="medal m-${x.t}">${cup(x.t)}</span><div><small>${x.t === "p" ? "Réussite critique" : "Haut fait accompli"}</small><b>${esc(x.n)}</b></div></div>`, x.t === "p" ? 5000 : 3200);
  burst();
  setTimeout(() => sfx.success(), 120);
}

/* ---------- Dé du destin ---------- */
async function rollFate() {
  const r = run();
  let pool = G.base.filter(x => doable(x, r));
  if (!pool.length) pool = G.base.filter(x => x.t !== "p" && statusOf(x) !== "done");
  if (!pool.length) return toast(`<div class="unlock plain">Plus aucune quête à tirer : le platine est à toi.</div>`);
  const x = pool[Math.floor(Math.random() * pool.length)], roll = 1 + Math.floor(Math.random() * 20), dc = dcOf(x), c = G.cats[x.c];
  const m = openModal(`<section class="check fate">${corners()}<div class="check-in">
      <div class="runes" aria-hidden="true"></div>
      <p class="check-title">${esc(c.skill)}</p><p class="check-sub">${esc(c.check)}</p>
      <div class="dc"><span>Classe de<br>difficulté</span><b>${dc}</b></div>
      <div class="braid" aria-hidden="true"><i></i></div>
      <div class="die-box rolling">${dieSVG("fd", { fill: false })}</div>
      <div class="verdict" id="fateV" aria-live="polite">&nbsp;</div>
      <div class="fate-res" id="fateR"></div>
    </div></section>`, "fate-modal");
  m.onclick = e => {
    if (e.target === m || e.target.closest("[data-fclose]")) { m.onclick = null; closeModal(); }
    const o = e.target.closest("[data-fopen]");
    if (o) { m.onclick = null; closeModal(); openSheet({ type: "trophy", id: o.dataset.fopen }); }
    if (e.target.closest("[data-freroll]")) { m.onclick = null; closeModal(); setTimeout(rollFate, 260); }
  };
  sfx.roll();
  const box = $(".die-box", m);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let delay = 40;
  for (let i = 0; i < (reduce ? 1 : 14); i++) {
    $(".die-main", m).textContent = 1 + Math.floor(Math.random() * 20);
    await new Promise(z => setTimeout(z, delay));
    delay *= 1.16;
  }
  $(".die-main", m).textContent = roll;
  box.classList.remove("rolling"); box.classList.add("landed");
  const crit = roll === 20, fumble = roll === 1, win = crit || (!fumble && roll >= dc);
  const v = $("#fateV", m);
  v.textContent = crit ? "Réussite critique" : fumble ? "Échec critique" : win ? "Réussite" : "Échec";
  v.className = "verdict " + (win ? "win" : "fail");
  win ? sfx.success() : sfx.fail();
  if (win) burst();
  $("#fateR", m).innerHTML = `
    <p class="fate-msg">${win ? "Le destin te désigne cette quête. Lance-toi !" : "Le destin te désigne cette quête… prévois une sauvegarde avant."}</p>
    <div class="fate-card">${medal(x.t)}<div><b>${esc(x.n)}</b><small>${esc(x.d)}</small></div></div>
    <div class="row2"><button type="button" class="btn ghost" data-freroll>Relancer</button><button type="button" class="btn primary" data-fopen="${x.id}">Voir la quête</button></div>
    <button type="button" class="fate-x" data-fclose aria-label="Fermer">${UI.close}</button>`;
}

/* ---------- Partage, import, export ---------- */
async function share() {
  toast(`<div class="unlock plain">Enluminure de ta carte…</div>`, 1500);
  const blob = await makeCard({ game: G, s: stats(), metals: metals(), player: G.player });
  const url = URL.createObjectURL(blob);
  const m = openModal(`<section class="dialog share">${corners()}<h2 class="ph">Ta carte de progression</h2><img src="${url}" alt="Carte de progression ${esc(G.name)}"><div class="row2"><button type="button" class="btn ghost" data-sx>Fermer</button><button type="button" class="btn primary" data-sg>${UI.share}Partager</button></div></section>`);
  m.onclick = async e => {
    if (e.target === m || e.target.closest("[data-sx]")) { m.onclick = null; closeModal(); setTimeout(() => URL.revokeObjectURL(url), 400); }
    if (e.target.closest("[data-sg]")) {
      const s = stats();
      const r = await shareBlob(blob, `platine-${G.id}.png`, `${G.name} : ${s.done}/${s.total} hauts faits (${Math.floor(s.p * 100)} %)`);
      if (r === "downloaded") toast(`<div class="unlock plain">Image enregistrée</div>`);
    }
  };
}
function download(name, obj) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
  a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}
function exportBackup() { download(`grimoire-${G.id}-${isoDay(Date.now())}.json`, { app: "grimoire-platine", v: 1, game: G.id, exportedAt: Date.now(), entries: sp.dump() }); }
async function readFile(input) { const f = input.files?.[0]; input.value = ""; if (!f) return null; return JSON.parse(await f.text()); }
async function importBackup(data) {
  let entries = null;
  if (data?.app === "grimoire-platine" && data.entries) {
    if (data.game !== G.id) throw new Error(`Cette sauvegarde concerne un autre jeu (${data.game}). Active-le d'abord.`);
    entries = data.entries;
  } else if (data && typeof data === "object" && Object.values(data).every(v => v && typeof v === "object" && "status" in v)) {
    entries = {}; Object.entries(data).forEach(([k, v]) => { entries["t:" + k] = { ...v, doneAt: v.doneAt || null }; });
  }
  if (!entries) throw new Error("Ce fichier n'est pas une sauvegarde du grimoire.");
  const n = Object.keys(entries).length;
  const ok = await confirmBox({ title: "Restaurer la sauvegarde", body: `<p>${n} entrées vont remplacer les données actuelles de ${esc(G.name)}.</p>`, yes: "Restaurer", no: "Annuler", danger: true });
  if (!ok) return;
  Object.entries(entries).forEach(([k, v]) => sp.put(k, v));
  sync.schedule(0); refresh();
  toast(`<div class="unlock plain">Sauvegarde restaurée</div>`);
}
async function importGame(def) {
  const g = normalizeGame(def);
  lib.put("game:" + g.id, { def });
  sync.schedule(0);
  useGame(g.id); refresh();
  toast(`<div class="unlock plain">${esc(g.name)} ajouté au grimoire</div>`);
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const goB = t.closest("[data-go]"); if (goB) return go(goB.dataset.go);
  const op = t.closest("[data-open]"); if (op && !t.closest("#modal")) return openSheet({ type: "trophy", id: op.dataset.open });
  const se = t.closest("[data-seal]"); if (se) { const x = byId(se.dataset.seal); return setStatus(x, statusOf(x) === "done" ? "todo" : "done"); }
  if (t.closest("[data-close]") || t.id === "scrim") return closeSheet();
  const a = t.closest("[data-act]")?.dataset.act;
  if (a === "roll") return rollFate();
  if (a === "share") return share();
  if (a === "filters") return openSheet({ type: "filters" });
  if (a === "clearf") { ui.types.clear(); ui.cats.clear(); ui.flags.clear(); return refresh(); }
  if (a === "startrun") { sfx.page(); return setRun({ startedAt: Date.now() }); }
  if (a === "newrun") return newRun();
  if (a === "syncnow") return sync.syncNow();
  if (a === "retry") return sync.retry();
  if (a === "signout") return sync.signOut().then(refresh);
  if (a === "export") return exportBackup();
  if (a === "tpl") return download("modele-jeu.json", TEMPLATE);
  if (a === "sound") { prefs.sound = !prefs.sound; savePrefs(); setSound(prefs.sound); sfx.tick(); return renderView(); }
  if (a === "install" && installEvt) { installEvt.prompt(); installEvt.userChoice.finally(() => { installEvt = null; renderView(); }); return; }
  const tab = t.closest("[data-tab]"); if (tab) { ui.tab = tab.dataset.tab; sfx.tick(); return renderView(); }
  const un = t.closest("[data-unf]"); if (un) { const [k, v] = un.dataset.unf.split(":"); ({ type: ui.types, cat: ui.cats, flag: ui.flags })[k].delete(v); return renderView(); }
  const fc = t.closest("[data-fcat]"); if (fc) { const k = fc.dataset.fcat; ui.cats.has(k) ? ui.cats.delete(k) : ui.cats.add(k); sfx.tick(); return refresh(); }
  const ft = t.closest("[data-ftype]"); if (ft) { const k = ft.dataset.ftype; ui.types.has(k) ? ui.types.delete(k) : ui.types.add(k); return refresh(); }
  const ff = t.closest("[data-fflag]"); if (ff) { const k = ff.dataset.fflag; ui.flags.has(k) ? ui.flags.delete(k) : ui.flags.add(k); return refresh(); }
  const fd = t.closest("[data-field]"); if (fd) { const r = run(); const v = r.fields[fd.dataset.field] === fd.dataset.val ? "" : fd.dataset.val; sfx.tick(); return setRun({ fields: { ...r.fields, [fd.dataset.field]: v } }); }
  const as = t.closest("[data-actset]"); if (as) return moveAct(as.dataset.actset);
  const gm = t.closest("[data-game]"); if (gm && gm.dataset.game !== G.id) { useGame(gm.dataset.game); sfx.page(); return refresh(); }
  // fiche trophée
  if (ui.sheet?.type === "trophy" && t.closest("#sheet")) {
    const x = byId(ui.sheet.id);
    const sb = t.closest("[data-set]"); if (sb) return setStatus(x, sb.dataset.set);
    const stp = t.closest("[data-step]"); if (stp && !x.stepsDrive) { const v = Number($("#prog").value) || 0; return setProgress(x, v + Number(stp.dataset.step) * (x.goal >= 100 ? 5 : 1)); }
    if (stp && x.stepsDrive) return toast(`<div class="unlock plain">Coche les étapes ci-dessous</div>`, 1800);
    const si = t.closest("[data-step-i]"); if (si) return toggleStep(x, Number(si.dataset.stepI));
    const cs = t.closest("[data-cstep]"); if (cs) return customStep(x, "toggle", Number(cs.dataset.cstep));
    const cd = t.closest("[data-cdel]"); if (cd) return customStep(x, "del", Number(cd.dataset.cdel));
  }
});
document.addEventListener("input", e => {
  if (e.target.id === "q") { ui.qRaw = e.target.value; ui.q = norm(e.target.value.trim()); $("#list").innerHTML = listHTML(); }
  if (e.target.id === "note") { const x = byId(ui.sheet.id), v = e.target.value; clearTimeout(noteT); noteT = setTimeout(() => save(x, { ...ts(x.id), note: v }), 600); }
});
let noteT;
document.addEventListener("change", async e => {
  const t = e.target;
  if (t.id === "prog") return setProgress(byId(ui.sheet.id), t.value);
  if (t.id === "runName") return setRun({ name: t.value.trim() });
  if (t.id === "doneAt" && t.value) { const x = byId(ui.sheet.id); const [y, m, d] = t.value.split("-").map(Number); save(x, { ...ts(x.id), doneAt: new Date(y, m - 1, d, 12).getTime() }); return refresh(); }
  try {
    if (t.id === "backupFile") { const d = await readFile(t); if (d) await importBackup(d); }
    if (t.id === "gameFile") { const d = await readFile(t); if (d) await importGame(d); }
  } catch (err) { confirmBox({ title: "Import impossible", body: `<p>${esc(err.message || "Fichier illisible.")}</p>`, yes: "D'accord", no: "Fermer" }); }
});
document.addEventListener("submit", async e => {
  e.preventDefault();
  if (e.target.id === "addStep") { const i = $("#stepTxt"); customStep(byId(ui.sheet.id), "add", i.value); requestAnimationFrame(() => $("#stepTxt")?.focus()); }
  if (e.target.id === "auth") {
    const f = e.target, mode = e.submitter?.value || "in", msg = $("#authMsg");
    msg.textContent = "Ouverture du portail…";
    try {
      if (mode === "up") { const live = await sync.signUp(f.email.value, f.pw.value); msg.textContent = live ? "Compte créé." : "Compte créé : confirme ton email, puis connecte-toi ici."; }
      else { await sync.signIn(f.email.value, f.pw.value); refresh(); }
    } catch (err) { msg.textContent = err.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : (err.message || "Connexion impossible."); }
  }
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("#modal").hidden) { $("#modal").click(); return; }
  closeSheet();
});
// glisser la fiche vers le bas pour la fermer
(() => {
  const el = $("#sheet");
  let y0 = null, dy = 0;
  el.addEventListener("touchstart", e => { if (el.scrollTop > 0 || e.target.closest("textarea,input")) return; y0 = e.touches[0].clientY; dy = 0; }, { passive: true });
  el.addEventListener("touchmove", e => { if (y0 == null) return; dy = Math.max(0, e.touches[0].clientY - y0); el.style.transform = `translateY(${dy}px)`; }, { passive: true });
  el.addEventListener("touchend", () => { if (y0 == null) return; el.style.transform = ""; if (dy > 110) closeSheet(); y0 = null; });
})();
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; if (ui.view === "more") renderView(); });

/* ---------- Démarrage ---------- */
useGame(prefs.game);
const start = location.hash.slice(1);
if (NAV.some(n => n[0] === start)) ui.view = start;
renderBar(); renderNav(); renderView();
initMotes($("#motes"));
sync.init({ status: () => { renderBar(); if (ui.view === "more" && !editingIn($("#view"))) renderView(); }, remote: () => refresh() });
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
