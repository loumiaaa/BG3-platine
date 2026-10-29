/* Carte de progression partageable (PNG 1080×1350, format portrait réseaux sociaux) */
import { HP, TI, FACES, shade } from "./die.js";
import { CORNER_PATHS } from "./icons.js";

const W = 1080, H = 1350;

function wrap(ctx, text, maxW) {
  const words = text.split(" "), lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}
function spaced(ctx, px) { if ("letterSpacing" in ctx) ctx.letterSpacing = px + "px"; }

export async function makeCard({ game, s, metals, player }) {
  try {
    await Promise.all(['700 64px "Cinzel Decorative"', '700 40px "Cinzel"', '600 30px "Cinzel"', 'italic 400 36px "EB Garamond"'].map(f => document.fonts.load(f)));
  } catch (e) {}
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");

  // fond
  x.fillStyle = "#0B0810"; x.fillRect(0, 0, W, H);
  let g = x.createRadialGradient(W / 2, 520, 40, W / 2, 520, 620);
  g.addColorStop(0, "rgba(124,77,219,.38)"); g.addColorStop(1, "rgba(124,77,219,0)");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  g = x.createRadialGradient(W / 2, H + 80, 40, W / 2, H + 80, 700);
  g.addColorStop(0, "rgba(240,140,60,.28)"); g.addColorStop(1, "rgba(240,140,60,0)");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // cercles runiques
  x.strokeStyle = "rgba(226,178,122,.10)"; x.lineWidth = 1.5;
  [190, 260, 330].forEach(r => { x.beginPath(); x.arc(W / 2, 640, r, 0, 6.283); x.stroke(); });
  for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283; x.beginPath(); x.moveTo(W / 2 + Math.cos(a) * 260, 640 + Math.sin(a) * 260); x.lineTo(W / 2 + Math.cos(a) * 330, 640 + Math.sin(a) * 330); x.stroke(); }

  // cadre
  const bronze = x.createLinearGradient(0, 0, W, H);
  bronze.addColorStop(0, "#F1C894"); bronze.addColorStop(.5, "#B07A45"); bronze.addColorStop(1, "#6B4526");
  x.strokeStyle = bronze; x.lineWidth = 3;
  x.beginPath(); x.roundRect(54, 54, W - 108, H - 108, 30); x.stroke();
  x.lineWidth = 1; x.globalAlpha = .5; x.beginPath(); x.roundRect(68, 68, W - 136, H - 136, 22); x.stroke(); x.globalAlpha = 1;
  [[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]].forEach(([tx, ty, sx, sy]) => {
    x.save(); x.translate(tx + sx * 30, ty + sy * 30); x.scale(sx * 2, sy * 2);
    x.lineCap = "round"; x.strokeStyle = bronze;
    CORNER_PATHS.forEach((d, i) => { x.lineWidth = [2.4, 1, 1.8, 1.8, 1.6][i]; x.stroke(new Path2D(d)); });
    x.restore();
  });

  // en-tête
  x.textAlign = "center"; x.textBaseline = "alphabetic";
  x.fillStyle = "#A99BB0"; x.font = '600 26px "Cinzel"'; spaced(x, 7);
  x.fillText(`${game.name} · ${game.platform}`.toUpperCase(), W / 2, 170);
  spaced(x, 0);
  x.font = '700 62px "Cinzel Decorative"';
  const tg = x.createLinearGradient(0, 190, 0, 330);
  tg.addColorStop(0, "#FBE7B8"); tg.addColorStop(.6, "#D8B166"); tg.addColorStop(1, "#8C6A2F");
  x.fillStyle = tg;
  const full = x.measureText(game.platTitle).width;
  const lines = wrap(x, game.platTitle, full > 860 ? Math.min(860, full / 2 + 80) : 860);
  lines.forEach((l, i) => x.fillText(l, W / 2, 250 + i * 72));
  x.fillStyle = "#A99BB0"; x.font = 'italic 400 34px "EB Garamond"';
  x.fillText("Jet de platine", W / 2, 250 + lines.length * 72 + 4);

  // d20
  const cy = 668, k = 2.25;
  x.save(); x.translate(W / 2 - 100 * k, cy - 100 * k); x.scale(k, k);
  const poly = a => { x.beginPath(); a.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); };
  FACES.forEach(([f, v]) => { poly(f); x.fillStyle = shade(v); x.fill(); });
  poly(TI); x.fillStyle = shade(.85); x.fill();
  x.font = '600 15px "EB Garamond"'; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "rgba(240,235,252,.7)";
  FACES.forEach(([f, , n, r]) => {
    const cx = (f[0][0] + f[1][0] + f[2][0]) / 3, cy2 = (f[0][1] + f[1][1] + f[2][1]) / 3;
    x.save(); x.translate(cx, cy2); x.rotate(r * Math.PI / 180); x.fillText(n, 0, 0); x.restore();
  });
  x.save(); poly(HP); x.clip();
  const lvl = (1 - s.p) * 172 + 8;
  const lg = x.createLinearGradient(0, lvl, 0, 200);
  lg.addColorStop(0, "rgba(255,194,122,.32)"); lg.addColorStop(1, "rgba(199,101,42,.1)");
  x.fillStyle = lg; x.fillRect(0, lvl, 200, 200);
  x.strokeStyle = "rgba(255,224,168,.9)"; x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, lvl); x.lineTo(200, lvl); x.stroke();
  x.restore();
  x.strokeStyle = "rgba(235,225,255,.55)"; x.lineWidth = 1.1;
  [[HP[0], TI[0]], [HP[1], TI[0]], [HP[5], TI[0]], [HP[5], TI[1]], [HP[4], TI[1]], [HP[3], TI[1]], [HP[1], TI[2]], [HP[2], TI[2]], [HP[3], TI[2]]]
    .forEach(([a, b]) => { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); });
  poly(TI); x.stroke();
  poly(HP); x.lineWidth = 3; x.strokeStyle = "rgba(20,14,28,.9)"; x.stroke();
  x.font = '700 42px "Cinzel"'; x.textAlign = "center"; x.textBaseline = "middle";
  x.lineWidth = 3; x.strokeStyle = "rgba(20,12,30,.9)"; x.strokeText(String(s.roll), 100, 106);
  x.fillStyle = "#FFF4DE"; x.fillText(String(s.roll), 100, 106);
  x.restore();

  // verdict
  x.textBaseline = "alphabetic";
  x.font = '700 104px "Cinzel"'; x.fillStyle = "#FFF1D6";
  x.shadowColor = "rgba(255,150,60,.9)"; x.shadowBlur = 40;
  const verdict = s.p >= 1 ? "RÉUSSITE" : Math.floor(s.p * 100) + " %";
  x.fillText(verdict, W / 2, 1000); x.shadowBlur = 0;
  x.font = 'italic 400 36px "EB Garamond"'; x.fillStyle = "#EDE3D1";
  x.fillText(`${s.done} hauts faits sur ${s.total} · ${s.left} restants`, W / 2, 1060);

  // métaux
  const cols = { p: "#86CDF3", g: "#E3B54F", s: "#C4CBD6", b: "#CD8A5F" };
  const m = metals.filter(z => z.all), step = 200, x0 = W / 2 - (m.length - 1) * step / 2;
  m.forEach((z, i) => {
    const mx = x0 + i * step;
    x.fillStyle = cols[z.t]; x.beginPath(); x.moveTo(mx, 1110); x.lineTo(mx + 14, 1124); x.lineTo(mx, 1138); x.lineTo(mx - 14, 1124); x.closePath(); x.fill();
    x.font = '700 34px "Cinzel"'; x.fillStyle = "#EDE3D1"; x.fillText(`${z.d}/${z.all}`, mx, 1186);
    x.font = '600 20px "Cinzel"'; x.fillStyle = "#A99BB0"; spaced(x, 4); x.fillText(z.l.toUpperCase(), mx, 1216); spaced(x, 0);
  });
  x.font = 'italic 400 28px "EB Garamond"'; x.fillStyle = "#6E6278";
  x.fillText(`${player ? player + " · " : ""}${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`, W / 2, 1262);

  return await new Promise(r => c.toBlob(r, "image/png"));
}

export async function shareBlob(blob, name, text) {
  const file = new File([blob], name, { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], text }); return "shared"; } catch (e) { if (e.name === "AbortError") return "cancel"; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return "downloaded";
}
