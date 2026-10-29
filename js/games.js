/* Registre des jeux : jeux intégrés + jeux importés (stockés dans l'espace « _library »). */
import bg3 from "../games/bg3.js";

export const BUILTIN = [bg3];
const TYPES = ["p", "g", "s", "b"];
const ICONS = ["book","crown","skull","helm","heart","chest","vial","sword","d20","map","star","gem"];

export function gamesFrom(lib) {
  const custom = lib.keys()
    .filter(k => k.startsWith("game:") && !lib.get(k).deleted && lib.get(k).def)
    .map(k => normalizeGame(lib.get(k).def));
  return [...BUILTIN.map(normalizeGame), ...custom.filter(g => !BUILTIN.some(b => b.id === g.id))];
}

/* Valide et complète une définition de jeu ; lève une erreur lisible si elle est inutilisable. */
export function normalizeGame(def) {
  if (!def || typeof def !== "object") throw new Error("Le fichier ne contient pas de jeu.");
  const id = String(def.id || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!id || id.startsWith("_")) throw new Error("Le jeu doit avoir un identifiant « id ».");
  if (!def.name) throw new Error("Le jeu doit avoir un nom « name ».");
  if (!Array.isArray(def.trophies) || !def.trophies.length) throw new Error("La liste « trophies » est vide.");
  const cats = {};
  Object.entries(def.cats || { general: { l: "Général" } }).forEach(([k, v]) => {
    cats[k] = { l: v.l || k, i: ICONS.includes(v.i) ? v.i : "star", skill: v.skill || v.l || k, check: v.check || "Test de caractéristique" };
  });
  const firstCat = Object.keys(cats)[0];
  const seen = new Set();
  const trophies = def.trophies.map((x, i) => {
    const tid = String(x.id || "t" + i);
    if (seen.has(tid)) throw new Error(`Identifiant de trophée en double : ${tid}`);
    seen.add(tid);
    return { ...x, id: tid, n: x.n || tid, d: x.d || "", t: TYPES.includes(x.t) ? x.t : "b", c: cats[x.c] ? x.c : firstCat };
  });
  if (!trophies.some(x => x.t === "p")) trophies.unshift({ id: "platine", n: def.platTitle || "Platine", d: "Obtenir tous les trophées.", t: "p", c: firstCat });
  return {
    ...def, id, cats, trophies,
    platform: def.platform || "",
    platTitle: def.platTitle || trophies.find(x => x.t === "p").n,
    points: { p: 0, g: 90, s: 30, b: 15, ...(def.points || {}) },
    acts: Array.isArray(def.acts) ? def.acts : [],
    anyLabel: def.anyLabel || "Toute la partie",
    run: def.run && Array.isArray(def.run.fields) ? def.run : { fields: [] },
    guides: Array.isArray(def.guides) ? def.guides : [],
    theme: def.theme || {},
    seed: def.seed || null
  };
}

export const TEMPLATE = {
  id: "mon-jeu",
  name: "Mon jeu",
  platform: "PS5",
  player: "",
  platTitle: "Nom du trophée platine",
  theme: { gold: "#D8B166", arcane: "#A57BFF" },
  cats: {
    histoire: { l: "Histoire", i: "book", skill: "Histoire", check: "Test d'Intelligence" },
    combat: { l: "Combat", i: "sword", skill: "Athlétisme", check: "Test de Force" },
    explo: { l: "Exploration", i: "chest", skill: "Perception", check: "Test de Sagesse" }
  },
  acts: [
    { id: "c1", l: "Chapitre 1", close: "Ce qui se passe quand on quitte ce chapitre." },
    { id: "c2", l: "Chapitre 2" }
  ],
  run: { fields: [{ id: "diff", l: "Difficulté", o: [["normal", "Normal"], ["difficile", "Difficile"]] }] },
  guides: [{ n: "Guide PSTHC", lang: "FR", d: "Feuille de route", u: "https://www.psthc.fr/" }],
  trophies: [
    { id: "platine", n: "Nom du platine", d: "Obtenir tous les trophées.", t: "p", c: "histoire" },
    { id: "exemple-or", n: "Un trophée or", d: "Description du trophée.", t: "g", c: "histoire", a: "c2", r: 12.5 },
    { id: "exemple-compteur", n: "Un trophée à compteur", d: "Ramasser 50 plumes.", t: "b", c: "explo", a: "any", goal: 50, u: "plumes", tip: "Une astuce." },
    { id: "exemple-etapes", n: "Un trophée à étapes", d: "Vaincre les trois gardiens.", t: "s", c: "combat", a: "c1", goal: 3, u: "gardiens", steps: ["Gardien du feu", "Gardien de l'eau", "Gardien du vent"], stepsDrive: 1 }
  ]
};
