/* Un « espace » = un ensemble clé → valeur horodaté, gardé dans localStorage
   et fusionné avec Supabase (la valeur la plus récente gagne, clé par clé). */
export class Space {
  constructor(ns, seed = {}) {
    this.ns = ns;
    this.k = "grimoire:" + ns;
    let d = null;
    try { d = JSON.parse(localStorage.getItem(this.k)); } catch (e) {}
    this.d = { ...seed, ...(d && typeof d === "object" ? d : {}) };
  }
  get(k) { return this.d[k]; }
  keys() { return Object.keys(this.d); }
  put(k, v) {
    this.d[k] = { ...v, updatedAt: Math.max(Date.now(), (this.d[k]?.updatedAt || 0) + 1) };
    this.save();
  }
  save() { try { localStorage.setItem(this.k, JSON.stringify(this.d)); } catch (e) {} }
  /* rows : [{key, value, updated_at}] venant du serveur. Renvoie true si quelque chose a changé. */
  merge(rows) {
    let ch = false;
    for (const r of rows) {
      const cur = this.d[r.key];
      if (!cur || Number(r.updated_at) > (cur.updatedAt || 0)) {
        this.d[r.key] = { ...r.value, updatedAt: Number(r.updated_at) };
        ch = true;
      }
    }
    if (ch) this.save();
    return ch;
  }
  dump() { return JSON.parse(JSON.stringify(this.d)); }
}

export function readJSON(key, fallback = {}) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v && typeof v === "object" ? v : fallback; } catch (e) { return fallback; }
}
export function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
