/* Transiciones entre vistas (sin recarga):
   inicio → sección: la tarjeta (o el botón "Ver todo") se expande hasta ocupar la pantalla;
   sección → inicio: el recorrido inverso; entre páginas: el contenido sale y entra de costado. */
import { $, html, wait, px } from './utils.js';
import { applyView, focusHome, cardFor, labelFor } from './router.js';
import { setSection } from './sections.js';

export const fxEl = $('#fx');
const fxLabel = $('#fxLabel');
const EASE = 'cubic-bezier(.65,0,.35,1)';

function frames(el){
  const r = el.getBoundingClientRect(), rad = getComputedStyle(el).borderTopLeftRadius;
  return {
    card: { left: px(r.left), top: px(r.top), width: px(r.width), height: px(r.height), borderRadius: rad },
    band: { left: '0px', top: px(r.top), width: px(r.right), height: px(r.height), borderRadius: rad },
    full: { left: '0px', top: '0px', width: px(innerWidth), height: px(innerHeight), borderRadius: '0px' }
  };
}
function fxShow(bg, label){
  html.classList.add('cursor-hidden');
  fxEl.style.setProperty('--fxbg', bg || '#1a1240');
  fxEl.classList.toggle('light', bg === '#e3dcff');
  fxLabel.textContent = label || '';
  fxEl.style.display = 'flex';
}
export function fxHide(){
  html.classList.remove('cursor-hidden');
  fxEl.getAnimations().forEach(a => a.cancel()); fxLabel.getAnimations().forEach(a => a.cancel());
  fxEl.style.display = 'none';
}
const slideIn = () => $('#viewContent').animate([{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }).finished;
const slideOut = (dx) => $('#viewContent').animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${dx}px)` }], { duration: 260, easing: 'ease-in', fill: 'forwards' }).finished;

export async function openFromCard(src, v){
  if (!src) { await crossfade(v); return; }
  const f = frames(src);
  src.classList.add('is-src');
  $('#home').classList.add('leaving');
  fxShow(src.dataset.fx, labelFor(v));
  fxLabel.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 320, easing: 'ease-out', fill: 'forwards' });
  await fxEl.animate([{ ...f.card, opacity: 1 }, { ...f.full, opacity: 1 }], { duration: 720, easing: EASE, fill: 'forwards' }).finished;
  src.classList.remove('is-src');
  applyView(v);
  await wait(140);
  const a = fxEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: 'ease', fill: 'forwards' }).finished;
  await Promise.all([a, slideIn()]);
  fxHide();
}
export async function closeToCard(from, v){
  const bg = cardFor(from) ? cardFor(from).dataset.fx : '#1a1240';
  await slideOut(40);
  fxShow(bg, '');
  await fxEl.animate([{ left: '0px', top: '0px', width: px(innerWidth), height: px(innerHeight), borderRadius: '0px', opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease', fill: 'forwards' }).finished;
  $('#viewContent').getAnimations().forEach(a => a.cancel());
  applyView(v);
  const target = focusHome(v, from);
  if (target) {
    target.classList.add('is-src');
    const f = frames(target);
    await fxEl.animate([{ ...f.full, opacity: 1 }, { ...f.card, opacity: 1 }], { duration: 680, easing: EASE, fill: 'forwards' }).finished;
    target.classList.remove('is-src');
  }
  await fxEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease', fill: 'forwards' }).finished;
  fxHide();
}
/* Entre páginas de distinta sección, la identidad empieza a cambiar junto con la salida del contenido. */
export async function crossfade(v){
  if (!$('#view').hidden && v.type !== 'home') setSection(v);
  if (!$('#view').hidden) await slideOut(-40);
  $('#viewContent').getAnimations().forEach(a => a.cancel());
  applyView(v);
  await slideIn();
}
