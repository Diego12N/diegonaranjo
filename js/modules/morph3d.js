/* Elemento 3D que viaja y se transforma entre secciones.
   Un único objeto isométrico persistente: cubo (Capacidades) · pantalla (Trabajo) ·
   ficha/avatar cilíndrico (Perfil). Cada forma se describe con las mismas 4 caras y la
   misma cantidad de puntos 3D, así la transición interpola la geometría real (no un
   fundido entre dos dibujos) mientras el objeto se desplaza a su lugar en la nueva sección. */
import { $, REDUCED } from './utils.js';

const C = Math.cos(Math.PI / 6), SEG = 12;             // 4 lados × 12 = 48 puntos por cara
const P = ([x, y, z]) => [(x - y) * C, (x + y) * .5 - z];
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const edge = (a, b) => Array.from({ length: SEG }, (_, k) => lerp3(a, b, k / SEG));
const quad = (a, b, c, d) => [...edge(a, b), ...edge(b, c), ...edge(c, d), ...edge(d, a)];
// cara elíptica / arco: 4 tramos de 90° alineados con las esquinas de un cuadrado
const arc = (cx, cy, r, z, a0, a1, n = SEG) => Array.from({ length: n }, (_, k) => {
  const a = (a0 + (a1 - a0) * k / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z];
});
const circle = (cx, cy, r, z) => [...arc(cx, cy, r, z, 225, 315), ...arc(cx, cy, r, z, 315, 405), ...arc(cx, cy, r, z, 45, 135), ...arc(cx, cy, r, z, 135, 225)];
// caja: cara izquierda (y = d), derecha (x = w), superior; mismo orden de vértices en todas las formas
const boxFaces = (w, d, h) => ({
  left:  quad([0, d, 0], [w, d, 0], [w, d, h], [0, d, h]),
  right: quad([w, 0, 0], [w, d, 0], [w, d, h], [w, 0, h]),
  top:   quad([0, 0, h], [w, 0, h], [w, d, h], [0, d, h])
});
const S = 40;
const cube = Object.assign(boxFaces(S, S, S), { detail: quad([10, 10, S], [30, 10, S], [30, 30, S], [10, 30, S]) });
// Trabajo: pantalla / tablet de pie (misma familia que las pantallas del motivo)
const W = 58, D = 8, H = 42;
const screen = Object.assign(boxFaces(W, D, H), { detail: quad([6, D, 6], [W - 6, D, 6], [W - 6, D, H - 6], [6, D, H - 6]) });
screen.left = screen.left.map(([x, y, z]) => [x - 9, y + 16, z]);
screen.right = screen.right.map(([x, y, z]) => [x - 9, y + 16, z]);
screen.top = screen.top.map(([x, y, z]) => [x - 9, y + 16, z]);
screen.detail = screen.detail.map(([x, y, z]) => [x - 9, y + 16, z]);
// Perfil: ficha cilíndrica (avatar) con disco interior
const R = 22, cx = 20, cy = 20, Hc = 16;
const halfSide = (a0, a1) => {                            // borde inferior → vertical → borde superior → vertical
  const bot = arc(cx, cy, R, 0, a0, a1), top = arc(cx, cy, R, Hc, a1, a0);
  const e1 = [cx + R * Math.cos(a1 * Math.PI / 180), cy + R * Math.sin(a1 * Math.PI / 180)];
  const e0 = [cx + R * Math.cos(a0 * Math.PI / 180), cy + R * Math.sin(a0 * Math.PI / 180)];
  return [...bot, ...edge([e1[0], e1[1], 0], [e1[0], e1[1], Hc]), ...top, ...edge([e0[0], e0[1], Hc], [e0[0], e0[1], 0])];
};
const token = {
  left: halfSide(135, 45), right: halfSide(-45, 45), top: circle(cx, cy, R, Hc), detail: circle(cx, cy, R * .5, Hc)
};
const SHAPES = { caps: cube, work: screen, profile: token };
// posición (en el viewBox 560 × 480 del motivo) de cada sección
const POS = { caps: [110, 330], work: [92, 176], profile: [134, 250] };
const FACES = [['left', .07, .55], ['right', .12, .55], ['top', .2, .75], ['detail', .28, .6]];

let svg, polys, cur = null, raf = 0, sec = null;
const clone = s => ({ left: s.left.map(p => p.slice()), right: s.right.map(p => p.slice()), top: s.top.map(p => p.slice()), detail: s.detail.map(p => p.slice()) });

function mount(){
  const bg = $('#view .sec-bg'); if (!bg || $('#secMorph')) return;
  bg.insertAdjacentHTML('beforeend', `<svg class="sec-morph" id="secMorph" viewBox="0 0 560 480" aria-hidden="true" focusable="false"><g class="mo-float"><g class="mo-pos">${
    FACES.map(([k, fo, so]) => `<polygon data-f="${k}" fill="currentColor" fill-opacity="${fo}" stroke="currentColor" stroke-opacity="${so}" stroke-width="${k === 'detail' ? 1.2 : 1.5}" stroke-linejoin="round"/>`).join('')
  }</g></g></svg>`);
  svg = $('#secMorph'); polys = [...svg.querySelectorAll('polygon')];
}
function draw(st){
  polys.forEach((pl, i) => { pl.setAttribute('points', st.shape[FACES[i][0]].map(p => P(p).map(n => n.toFixed(1)).join(',')).join(' ')); });
  svg.querySelector('.mo-pos').setAttribute('transform', `translate(${st.pos[0].toFixed(1)} ${st.pos[1].toFixed(1)}) rotate(${(st.rot || 0).toFixed(2)})`);
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // easeInOutCubic

/* Lleva el objeto a la forma y posición de la sección `next` (con animación o directo). */
export function morphTo(next, animate){
  mount(); if (!svg || !SHAPES[next]) return;
  if (cur && next === sec) return;
  cancelAnimationFrame(raf); raf = 0;
  const goal = { shape: clone(SHAPES[next]), pos: POS[next].slice(), rot: 0 };
  if (!cur || !animate || REDUCED || document.documentElement.classList.contains('motion-off')) {
    cur = goal; sec = next; draw(cur); raf = 0; return;
  }
  sec = next;
  const from = { shape: clone(cur.shape), pos: cur.pos.slice(), rot: cur.rot || 0 };
  const dist = Math.hypot(goal.pos[0] - from.pos[0], goal.pos[1] - from.pos[1]);
  const dur = 1250, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = ease(k);
    // la forma cambia algo después de que empieza el viaje y termina un poco antes de llegar
    const m = ease(Math.min(1, Math.max(0, (k - .08) / .8)));
    const shape = {};
    for (const f of ['left', 'right', 'top', 'detail']) shape[f] = from.shape[f].map((p, i) => lerp3(p, goal.shape[f][i], m));
    const lift = Math.sin(Math.PI * e) * Math.min(46, 18 + dist * .18);   // leve arco en el recorrido
    cur = {
      shape,
      pos: [from.pos[0] + (goal.pos[0] - from.pos[0]) * e, from.pos[1] + (goal.pos[1] - from.pos[1]) * e - lift],
      rot: Math.sin(Math.PI * e) * (goal.pos[1] < from.pos[1] ? -4 : 4)
    };
    draw(cur);
    if (k < 1) raf = requestAnimationFrame(step); else { raf = 0; cur = goal; draw(cur); }
  };
  raf = requestAnimationFrame(step);
}
