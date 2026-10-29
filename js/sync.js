/* Synchronisation Supabase : compte email + mot de passe, table « entries ».
   À chaque passage : on lit tout l'espace, on fusionne, puis on renvoie ce qui est plus récent en local. */
import cfg from "../config.js";

/* supabase-js 2.45.4 embarqué (vendor/) : pas de dépendance à un CDN, fonctionne hors ligne */
/* table dédiée : peut cohabiter avec les tables d'un autre projet Supabase */
const TABLE = "grimoire_entries";
const LIB = new URL("../vendor/supabase.js", import.meta.url).href;
let sb = null, user = null, spaces = [], timer = 0, running = false, again = false;
let onStatus = () => {}, onRemote = () => {}, onAuth = () => {}, blocked = false;
export let status = "off";

export const enabled = () => !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
export const ready = () => !!sb;
export const currentUser = () => user;
function set(s) { status = s; onStatus(s); }

function loadLib() {
  if (window.supabase?.createClient) return Promise.resolve(window.supabase);
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = LIB;
    s.onload = () => window.supabase?.createClient ? res(window.supabase) : rej(new Error("supabase-js introuvable"));
    s.onerror = rej;
    document.head.append(s);
  });
}

export async function init(hooks) {
  onStatus = hooks.status || onStatus;
  onRemote = hooks.remote || onRemote;
  onAuth = hooks.auth || onAuth;
  if (!enabled()) return set("off");
  addEventListener("online", () => sb ? schedule(0) : boot());
  document.addEventListener("visibilitychange", () => { if (!document.hidden) sb ? schedule(0) : boot(); });
  await boot();
}

async function boot() {
  if (sb) return;
  set("connecting");
  try {
    const { createClient } = await loadLib();
    sb = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "grimoire:auth" } });
    const { data } = await sb.auth.getSession();
    user = data.session?.user || null;
    // l'app peut bloquer la synchro (changement de compte sur un appareil partagé : on recharge d'abord)
    if (onAuth("INITIAL", user) === "stop") { blocked = true; return; }
    sb.auth.onAuthStateChange((e, s) => {
      const was = user?.id;
      user = s?.user || null;
      if (onAuth(e, user) === "stop") { blocked = true; return; }
      if (user && user.id !== was) schedule(0);
      if (!user) set("signedout");
    });
    user ? schedule(0) : set("signedout");
  } catch (e) {
    console.warn("Supabase indisponible", e);
    sb = null;
    set("offline");
  }
}
export const retry = () => boot();

export function setSpaces(list) { spaces = list; if (user) schedule(0); }
export function schedule(ms = 1200) { clearTimeout(timer); timer = setTimeout(run, ms); }

async function run() {
  if (!sb || !user || blocked) return;
  if (running) { again = true; return; }
  running = true;
  set("syncing");
  try {
    let changed = false;
    for (const s of spaces) {
      const { data, error } = await sb.from(TABLE).select("key,value,updated_at").eq("game", s.ns);
      if (error) throw error;
      const remote = {};
      data.forEach(r => { remote[r.key] = Number(r.updated_at); });
      if (s.merge(data)) changed = true;
      const up = s.keys()
        .filter(k => !(k in remote) || (s.get(k).updatedAt || 0) > remote[k])
        .map(k => ({ user_id: user.id, game: s.ns, key: k, value: s.get(k), updated_at: s.get(k).updatedAt || 0 }));
      if (up.length) {
        const { error: e2 } = await sb.from(TABLE).upsert(up, { onConflict: "user_id,game,key" });
        if (e2) throw e2;
      }
    }
    set("ok");
    if (changed) onRemote();
  } catch (e) {
    console.warn("Synchro", e);
    set(navigator.onLine ? "error" : "offline");
  }
  running = false;
  if (again) { again = false; run(); }
}

export async function signIn(email, password) {
  if (!sb) throw new Error("Serveur injoignable pour l'instant. Vérifie ta connexion.");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
export async function signUp(email, password) {
  if (!sb) throw new Error("Serveur injoignable pour l'instant. Vérifie ta connexion.");
  const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.href.split("#")[0] } });
  if (error) throw error;
  return !!data.session;
}
export async function signOut() { blocked = true; clearTimeout(timer); if (sb) await sb.auth.signOut(); user = null; set("signedout"); }
export async function resetPassword(email) {
  if (!sb) throw new Error("Serveur injoignable pour l'instant. Vérifie ta connexion.");
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split("#")[0] });
  if (error) throw error;
}
export async function updatePassword(password) {
  const { error } = await sb.auth.updateUser({ password });
  if (error) throw error;
}
export const syncNow = () => schedule(0);
/* envoie tout de suite ce qui reste (avant une déconnexion) */
export async function flush() { clearTimeout(timer); if (!sb || !user || blocked) return; await run(); }
