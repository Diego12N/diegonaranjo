/* Visor "Propuesta de rediseño" del caso: vistas desktop / mobile / diseño anterior,
   flechas, miniaturas y deslizamiento. El índice activo es la fuente de verdad: los clicks
   lo cambian al instante y el scroll solo lo actualiza cuando lo mueve el usuario. */
import { $, $$, REDUCED, pad } from './utils.js';
import { t, L } from './i18n.js';
import { PROJECTS } from './data/projects.js';
import { currentCase } from './router.js';

let scState = { slug: null, view: 'desktop' };

/* Al abrir otro caso, el visor vuelve a la vista desktop. */
export function scPrepare(slug){
  if (scState.slug !== slug) scState = { slug, view: 'desktop' };
}

export function showcaseHTML(p){
  const V = p.showcase, views = ['desktop', 'mobile', 'before'].filter(v => V[v]);
  return `<section class="showcase" aria-labelledby="scTitle">
    <div class="sc-top">
      <h2 class="sc-title" id="scTitle">${t('scLabel')}</h2>
      <div class="seg sc-tabs" role="group" aria-label="${t('scViews')}">${views.map(v => `<button type="button" data-view="${v}" aria-pressed="${v === scState.view}">${t('sc_' + v)}</button>`).join('')}</div>
    </div>
    <div class="sc-stage">
      <div class="sc-track" id="scTrack" tabindex="0" role="group" aria-label="${t('scScreens')}"></div>
      <button type="button" class="icon-btn sc-arrow sc-prev" aria-label="${t('scPrev')}">←</button>
      <button type="button" class="icon-btn sc-arrow sc-next" aria-label="${t('scNext')}">→</button>
    </div>
    <div class="sc-foot">
      <p class="sc-cap" id="scCap" aria-live="polite"></p>
      <div class="sc-thumbs" id="scThumbs" role="group" aria-label="${t('scThumbs')}"></div>
      <a class="full-link" id="scFull" href="#" target="_blank" rel="noopener"></a>
    </div>
  </section>`;
}
function scRender(p, animate){
  const v = p.showcase[scState.view], mob = scState.view === 'mobile', track = $('#scTrack');
  track.classList.toggle('is-mobile', mob);
  $('#scThumbs').classList.toggle('is-mobile', mob);
  track.innerHTML = v.shots.map((s, i) => `<figure class="sc-frame" data-i="${i}">
      <div class="${mob ? 'sc-phone' : 'sc-browser'}">${mob ? '' : '<div class="bar"><span></span><span></span><span></span></div>'}
        <img src="${s.src}" alt="${L(s.l)}" width="${s.w}" height="${s.h}" ${i < 2 ? '' : 'loading="lazy"'} decoding="async"></div></figure>`).join('');
  $('#scThumbs').innerHTML = v.shots.map((s, i) => `<button type="button" class="sc-thumb" data-i="${i}" aria-label="${pad(i + 1)} · ${L(s.l)}"><img src="${s.src}" alt="" loading="lazy"></button>`).join('');
  const full = $('#scFull'); full.href = v.figma || v.full.src; full.textContent = `${t('scFull')} ↗`;
  $$('.sc-tabs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === scState.view)));
  track.scrollLeft = 0; scState.lock = false; track.style.scrollSnapType = '';
  scReserve(p);
  scUpdate(p);
  if (animate && !REDUCED) track.animate([{ opacity: 0, transform: 'translateX(24px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
}
function scIndex(){
  const track = $('#scTrack'); if (!track) return 0;
  const n = track.children.length, max = track.scrollWidth - track.clientWidth;
  if (track.scrollLeft <= 4) return 0;
  if (track.scrollLeft >= max - 4) return n - 1;
  const c = track.scrollLeft + track.clientWidth / 2; let best = 0, dist = Infinity;
  [...track.children].forEach((f, i) => { const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - c); if (d < dist) { dist = d; best = i; } });
  return best;
}
/* El pie del visor reserva la altura del texto más largo de la vista,
   así cambiar de captura nunca desplaza miniaturas ni contenido. */
function scReserve(p){
  const cap = $('#scCap'), track = $('#scTrack'); if (!cap || !track) return;
  const v = p.showcase[scState.view], n = v.shots.length, keep = cap.textContent;
  cap.style.minHeight = '';
  let h = 0;
  v.shots.forEach((s, i) => { cap.textContent = `${pad(i + 1)} / ${pad(n)} · ${L(s.l)}`; h = Math.max(h, cap.getBoundingClientRect().height); });
  cap.textContent = keep; cap.style.minHeight = Math.ceil(h) + 'px';
  track.style.minHeight = '';
  track.style.minHeight = Math.ceil(track.getBoundingClientRect().height) + 'px';
}
function scUpdate(p){
  const track = $('#scTrack'); if (!track) return;
  const v = p.showcase[scState.view], n = v.shots.length;
  const i = scState.i = Math.max(0, Math.min(n - 1, scState.i || 0));
  $('#scCap').textContent = `${pad(i + 1)} / ${pad(n)} · ${L(v.shots[i].l)}`;
  $$('#scThumbs .sc-thumb').forEach((b, j) => { if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  $('.sc-prev').disabled = i === 0;
  $('.sc-next').disabled = i === n - 1;
  const th = $$('#scThumbs .sc-thumb')[i], box = $('#scThumbs');
  if (th && box.scrollWidth > box.clientWidth + 2) box.scrollTo({ left: th.offsetLeft - (box.clientWidth - th.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
}
function scScrollTo(i, smooth){
  const track = $('#scTrack'), f = track && track.children[i]; if (!f) return;
  const max = track.scrollWidth - track.clientWidth;
  const left = Math.max(0, Math.min(max, f.offsetLeft - (track.clientWidth - f.offsetWidth) / 2));
  scState.lock = true; clearTimeout(scState.lockT);
  // sin snap mientras dura el desplazamiento programado: evita que el navegador lo corte o lo devuelva
  track.style.scrollSnapType = 'none';
  track.scrollTo({ left, behavior: smooth && !REDUCED ? 'smooth' : 'auto' });
  const release = () => { scState.lock = false; track.style.scrollSnapType = ''; };
  if (!smooth || REDUCED || Math.abs(track.scrollLeft - left) < 2) { scState.lockT = setTimeout(release, 60); return; }
  let last = -1, still = 0;
  const watch = () => {                                     // termina cuando el scroll se detiene (compatible sin scrollend)
    if (!scState.lock) return;
    if (Math.abs(track.scrollLeft - last) < .5) { if (++still > 5) return release(); } else still = 0;
    last = track.scrollLeft; requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
  scState.lockT = setTimeout(release, 1400);
}
function scGo(i, p){
  const n = $('#scTrack').children.length; i = Math.max(0, Math.min(n - 1, i));
  scState.i = i;
  scUpdate(p || PROJECTS.find(x => x.slug === currentCase));
  scScrollTo(i, true);
}
export function scSetup(p){
  if (!p.showcase || !$('#scTrack')) return;
  scState.i = 0;
  scRender(p, false);
  const track = $('#scTrack');
  let raf = 0;
  // interacción directa del usuario sobre la tira: cancela el bloqueo del desplazamiento programado
  ['wheel', 'touchstart'].forEach(ev => track.addEventListener(ev, () => { if (scState.lock) { scState.lock = false; track.style.scrollSnapType = ''; } }, { passive: true }));
  track.addEventListener('scroll', () => {
    if (scState.lock || raf) return;
    raf = requestAnimationFrame(() => { raf = 0; if (scState.lock) return; const i = scIndex(); if (i !== scState.i) { scState.i = i; scUpdate(p); } });
  }, { passive: true });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scGo(scState.i + 1, p); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); scGo(scState.i - 1, p); }
  });
  $('.sc-prev').addEventListener('click', () => scGo(scState.i - 1, p));
  $('.sc-next').addEventListener('click', () => scGo(scState.i + 1, p));
  $('#scThumbs').addEventListener('click', e => { const b = e.target.closest('.sc-thumb'); if (b) scGo(+b.dataset.i, p); });
  $$('.sc-tabs button').forEach(b => b.addEventListener('click', () => { if (b.dataset.view !== scState.view) { scState.view = b.dataset.view; scState.i = 0; scRender(p, true); } }));
}
export function initShowcase(){
  window.addEventListener('resize', () => { const p = PROJECTS.find(x => x.slug === currentCase); if (p && p.showcase && !$('#caseView').hidden && $('#scTrack')) { scReserve(p); scUpdate(p); scScrollTo(scState.i, false); } }, { passive: true });
}
