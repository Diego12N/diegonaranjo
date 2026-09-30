/* Movimiento: pausa de animaciones, cursor personalizado, apariciones al hacer scroll y loader. */
import { $, $$, html, REDUCED, FINE, wait } from './utils.js';
import { t } from './i18n.js';

/* ---------- Pausa de movimiento (se recuerda entre visitas) ---------- */
export let paused = false;
export function setMotion(off){
  paused = off;
  html.classList.toggle('motion-off', off);
  $$('.motion-toggle').forEach(b => { b.setAttribute('aria-pressed', String(off)); b.textContent = off ? '▶' : '❚❚'; });
  try { localStorage.setItem('dn-motion', off ? 'off' : 'on'); } catch(e){}
}
export function initMotion(){
  if (REDUCED) html.classList.add('reduced');
  try { paused = localStorage.getItem('dn-motion') === 'off'; } catch(e){}
  $$('.motion-toggle').forEach(b => b.addEventListener('click', () => setMotion(!paused)));
}

/* ---------- Cursor (solo puntero fino y sin reducir movimiento) ---------- */
export function initPointer(){
  if (!FINE || REDUCED) return;
  const ring = $('#cursorRing'), dot = $('#cursorDot'), label = $('#cursorLabel'), stage = $('#home');
  let mx = -100, my = -100, rx = -100, ry = -100, started = false, raf = 0;
  function loop(){
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    raf = (Math.abs(mx - rx) + Math.abs(my - ry) > .3) ? requestAnimationFrame(loop) : 0;
  }
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    if (!started) { started = true; rx = mx; ry = my; html.classList.add('has-cursor'); }
    if (!raf) raf = requestAnimationFrame(loop);
    if (!stage.hidden) {
      stage.style.setProperty('--mx', mx + 'px'); stage.style.setProperty('--my', (my + scrollY) + 'px');
      stage.style.setProperty('--px', ((mx / innerWidth - .5) * -8).toFixed(1) + 'px');
      stage.style.setProperty('--py', ((my / innerHeight - .5) * -6).toFixed(1) + 'px');
    }
  }, { passive: true });
  document.addEventListener('mouseleave', () => html.classList.remove('has-cursor'));
  document.addEventListener('mouseenter', () => { if (started) html.classList.add('has-cursor'); });
  document.addEventListener('mouseover', e => {
    const lab = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button, input, [role="button"]');
    ring.classList.toggle('is-label', !!lab);
    ring.classList.toggle('is-link', !lab && !!link);
    label.textContent = lab ? t(lab.dataset.cursor) : '';
  });
}

/* ---------- Apariciones (.reveal / .stagger) ---------- */
const io = ('IntersectionObserver' in window && !REDUCED)
  ? new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .12 })
  : null;
export function observeReveals(){
  $$('.stagger').forEach(el => [...el.children].forEach((c, i) => c.style.setProperty('--i', i)));
  $$('.reveal:not(.in), .stagger:not(.in)').forEach(el => { io ? io.observe(el) : el.classList.add('in'); });
}

/* ---------- Loader (una vez por sesión; se omite con reducir movimiento) ---------- */
export async function runLoader(){
  const html = document.documentElement, loader = $('#loader');
  if (html.classList.contains('no-loader')) {
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('intro')));
    return;
  }
  const bar = $('#loaderBar'), pct = $('#loaderPct');
  const start = performance.now(), MIN = 500;
  let done = false;
  const fonts = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, wait(900)]) : wait(0);
  (function tick(now){
    const p = Math.min(1, (now - start) / MIN);
    const eased = done ? 1 : 1 - Math.pow(1 - p, 3);
    bar.style.setProperty('--p', eased.toFixed(3));
    pct.textContent = Math.round(eased * 100);
    if (!done) requestAnimationFrame(tick);
  })(start);
  await Promise.all([fonts, wait(MIN)]);
  done = true; bar.style.setProperty('--p', 1); pct.textContent = '100';
  await wait(120);
  loader.classList.add('done');
  html.classList.remove('loading');
  html.classList.add('intro');
  try { sessionStorage.setItem('dn-seen', '1'); } catch(e){}
  setTimeout(() => loader.remove(), 700);
}
