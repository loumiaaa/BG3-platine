/* Petits sons synthétisés (aucun fichier audio) : sceau, dé, réussite, parchemin. */
let ctx = null, on = true;
export function setSound(v) { on = !!v; }

function ac() {
  if (!on) return null;
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function noise(c, dur) {
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = b;
  return s;
}
function env(c, t0, vol, dur, attack = .005) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  g.connect(c.destination);
  return g;
}
function tone(c, f, t0, dur, { type = "sine", vol = .15, to = null } = {}) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  o.connect(env(c, t0, vol, dur));
  o.start(t0);
  o.stop(t0 + dur + .05);
}
function burst(c, t0, dur, { f = 1200, q = 1, vol = .2, type = "bandpass", to = null } = {}) {
  const s = noise(c, dur), fl = c.createBiquadFilter();
  fl.type = type;
  fl.frequency.setValueAtTime(f, t0);
  if (to) fl.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  fl.Q.value = q;
  s.connect(fl).connect(env(c, t0, vol, dur));
  s.start(t0);
}

export const sfx = {
  stamp() { const c = ac(); if (!c) return; const t = c.currentTime; tone(c, 140, t, .25, { vol: .35, to: 45 }); burst(c, t, .08, { f: 700, type: "lowpass", vol: .25 }); },
  roll() {
    const c = ac(); if (!c) return;
    let t = c.currentTime, gap = .045;
    for (let i = 0; i < 11; i++) { burst(c, t, .035, { f: 2200 + Math.random() * 1600, q: 4, vol: .22 }); t += gap; gap *= 1.17; }
    tone(c, 220, t, .12, { vol: .08, type: "triangle" });
  },
  success() { const c = ac(); if (!c) return; const t = c.currentTime; [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(c, f, t + i * .09, 1.2, { type: "triangle", vol: .09 })); tone(c, 2093, t + .36, 1.4, { vol: .025 }); },
  fail() { const c = ac(); if (!c) return; const t = c.currentTime; tone(c, 196, t, .5, { type: "sawtooth", vol: .05, to: 98 }); tone(c, 147, t + .12, .6, { type: "triangle", vol: .08, to: 73 }); },
  page() { const c = ac(); if (!c) return; burst(c, c.currentTime, .28, { f: 2400, to: 500, q: .7, vol: .09 }); },
  tick() { const c = ac(); if (!c) return; burst(c, c.currentTime, .02, { f: 3000, q: 6, vol: .08 }); }
};
