/* Braises et poussière arcanique en fond */
const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
let cv, cx, W = 0, H = 0, P = [], raf = 0;

function size() {
  const r = Math.min(2, window.devicePixelRatio || 1);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * r; cv.height = H * r;
  cx.setTransform(r, 0, 0, r, 0, 0);
}
function mote(at) {
  const arc = Math.random() < .35;
  return {
    x: at ? at.x : Math.random() * W, y: at ? at.y : H + Math.random() * H * .6, r: Math.random() * 1.6 + .5,
    vy: at ? -(Math.random() * 2.4 + 1) : -(Math.random() * .35 + .12), vx: at ? (Math.random() - .5) * 3 : (Math.random() - .5) * .15,
    life: at ? 70 + Math.random() * 50 : 1e9,
    c: arc ? "165,123,255" : (Math.random() < .5 ? "240,165,90" : "246,223,166"), a: Math.random() * .5 + .25, ph: Math.random() * 6.28
  };
}
function frame(t) {
  cx.clearRect(0, 0, W, H);
  for (let i = P.length - 1; i >= 0; i--) {
    const m = P[i];
    m.x += m.vx + Math.sin(t / 1400 + m.ph) * .15; m.y += m.vy; m.life--;
    if (m.life <= 0) { P.splice(i, 1); continue; }
    if (m.y < -10) Object.assign(m, mote(), { y: H + 10 });
    const al = m.a * (.6 + .4 * Math.sin(t / 300 + m.ph)) * (m.life < 60 ? m.life / 60 : 1);
    cx.beginPath(); cx.arc(m.x, m.y, m.r * 3, 0, 6.28); cx.fillStyle = `rgba(${m.c},${al * .15})`; cx.fill();
    cx.beginPath(); cx.arc(m.x, m.y, m.r, 0, 6.28); cx.fillStyle = `rgba(${m.c},${al})`; cx.fill();
  }
  raf = requestAnimationFrame(frame);
}
export function initMotes(canvas) {
  if (reduce) return;
  cv = canvas; cx = cv.getContext("2d");
  size();
  P = Array.from({ length: Math.round(Math.min(50, W / 14)) }, () => { const m = mote(); m.y = Math.random() * H; return m; });
  raf = requestAnimationFrame(frame);
  addEventListener("resize", size);
  document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); });
}
export function burst(x, y) {
  if (reduce || !W) return;
  const at = { x: x ?? W / 2, y: y ?? H * .35 };
  for (let i = 0; i < 40; i++) P.push(mote(at));
}
