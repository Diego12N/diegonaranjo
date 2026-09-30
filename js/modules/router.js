/* Router sin recarga: rutas con # (#/case/slug, #/cases, #/about…), historial y vista activa.
   Los clicks en enlaces internos los captura js/boot.js y llegan acá a través de window.__nav. */
import { $, $$, REDUCED } from './utils.js';
import { t, lang, pageTitle } from './i18n.js';
import { AC, VIEW_AC } from './data/site.js';
import { PROJECTS } from './data/projects.js';
import { showVisual } from './data/banners.js';
import { leanTo } from './home.js';
import { renderSubnav, markSubnav, setSection } from './sections.js';
import { renderCase } from './case-study.js';
import { renderNextSec, renderCasesPage } from './pages.js';
import { renderViewer } from './visual.js';
import { observeReveals } from './motion.js';
import { fxEl, fxHide, openFromCard, closeToCard, crossfade } from './transitions.js';

let curHash = location.hash;
export let curView = null;
export let currentCase = null;

function setUrl(hash, replace){
  try { const u = new URL(location.href); u.hash = hash; history[replace ? 'replaceState' : 'pushState'](null, '', u); } catch(e){}
}
function parse(h){
  let m = h.match(/^#\/case\/([\w-]+)$/); if (m) return { type: 'case', key: m[1] };
  m = h.match(/^#\/(cases|about|process|skills|visual|contact)$/); if (m) return { type: 'page', key: m[1] };
  return { type: 'home', anchor: h };
}
const keyOf = v => v.type === 'home' ? 'home' : v.type + ':' + v.key;
/* Elemento del inicio desde el que se abre (y al que vuelve) cada vista. "Trabajo" usa el botón "Ver todo". */
export const cardFor = v => !v || v.type === 'home' ? null : (v.type === 'page' && v.key === 'cases' ? (document.getElementById('railAllCases') || document.getElementById('rg-cases')) : document.getElementById(v.type === 'case' ? 'card-case-' + v.key : 'card-page-' + v.key));
export const labelFor = v => v.type === 'case' ? PROJECTS.find(x => x.slug === v.key)[lang].title : v.type === 'page' ? pageTitle(v.key) : '';

/* ---------- Mostrar una vista ---------- */
function showView(v){
  const home = v.type === 'home';
  $('#home').hidden = !home;
  $('#view').hidden = home;
  document.body.classList.toggle('on-home', home);
  $('#nav').classList.toggle('solid', !home);
  $('#progress').hidden = v.type !== 'case';
  $('#caseView').hidden = v.type !== 'case';
  $$('[data-page]').forEach(s => { s.hidden = !(v.type === 'page' && s.dataset.page === v.key); });
  $('#pageEnd').hidden = !(v.type === 'page' && v.key !== 'contact');
  if (!$('#subnav').children.length) renderSubnav(v); else markSubnav(v);
  $('#view').style.setProperty('--ac', v.type === 'page' ? VIEW_AC[v.key] : AC.cases);
  if (v.type === 'case') {
    currentCase = v.key;
    renderCase(PROJECTS.find(x => x.slug === v.key));
    $$('#caseBody a[href="#projects"]').forEach(a => a.setAttribute('href', '#/cases'));
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('#caseTitle').focus({ preventScroll: true });
  } else if (v.type === 'page') {
    renderNextSec(v.key);
    document.title = `${pageTitle(v.key)} — Diego Naranjo`;
    if (v.key === 'visual') renderViewer(false);
    if (v.key === 'cases') renderCasesPage();
    window.scrollTo({ top: 0, behavior: 'instant' });
    const h = $(`[data-page="${v.key}"] h1`); if (h) h.focus({ preventScroll: true });
  } else {
    document.title = t('docTitle');
    $('#home').classList.remove('leaving');
    leanTo(null);
  }
  observeReveals();
}
/* Vista + identidad de sección. Al entrar desde el inicio, el fondo de la sección aparece sin golpe. */
export function applyView(v){
  const view = $('#view'), wasHidden = view.hidden;
  if (wasHidden && v.type !== 'home') view.classList.add('sec-entering');
  showView(v);
  setSection(v);
  view.classList.remove('sec-entering');
  if (wasHidden && v.type !== 'home' && !REDUCED) {
    view.classList.remove('sec-enter'); void view.offsetWidth; view.classList.add('sec-enter');
    setTimeout(() => view.classList.remove('sec-enter'), 1100);
  }
}
export function focusHome(v, from){
  let el = cardFor(from);
  if (v.anchor === '#projects' && !el) {
    el = $('#rail .rail-group .card:not(.draft)');
    const g = $('#rail .rail-group'); g.classList.remove('flash'); void g.offsetWidth; g.classList.add('flash');
  }
  if (!el) { window.scrollTo({ top: 0, behavior: 'instant' }); return null; }
  const r = el.getBoundingClientRect();
  if (r.top < 60 || r.bottom > innerHeight) el.scrollIntoView({ block: 'center', behavior: 'instant' });
  const focusable = el.matches('a, button') ? el : (el.querySelector('.rail-all') || el);
  focusable.focus({ preventScroll: true });
  return el;
}

/* ---------- Navegación ---------- */
export async function go(initial, srcEl){
  let v = parse(curHash);
  if ((v.type === 'case' && !PROJECTS.find(x => !x.draft && x.slug === v.key)) || (v.type === 'page' && v.key === 'visual' && !showVisual())) {
    curHash = '#top'; setUrl('#top', true); v = parse(curHash);
  }
  const k = keyOf(v);
  if (curView && k === keyOf(curView)) {
    if (v.type === 'home' && !initial) focusHome(v, null);
    return;
  }
  const from = curView; curView = v;
  if (initial || REDUCED || !fxEl.animate) {
    applyView(v);
    if (v.type === 'home' && !initial) focusHome(v, from);
    return;
  }
  if (v.type !== 'home' && (!from || from.type === 'home')) {
    const src = (srcEl && srcEl.closest && srcEl.closest('.card')) || cardFor(v);
    await openFromCard(src && !$('#home').hidden ? src : null, v);
  } else if (v.type === 'home') {
    await closeToCard(from, v);
  } else {
    await crossfade(v);
  }
}
let routeChain = Promise.resolve();
function navigate(hash, el){
  if (!hash || hash === '#') return;
  if (hash === '#main') { const m = $('#main'); m.focus({ preventScroll: true }); return; }
  if (hash === '#contact') hash = '#/contact';
  if (hash === '#projects' && curView && curView.type !== 'home') hash = '#/cases';
  curHash = hash; setUrl(hash, false);
  routeChain = routeChain.then(() => go(false, el)).catch(() => { fxHide(); applyView(parse(curHash)); });
}
function syncFromLocation(){
  if (location.hash === curHash) return;
  curHash = location.hash;
  routeChain = routeChain.then(() => go(false, null)).catch(() => { fxHide(); applyView(parse(curHash)); });
}
export function initRouter(){
  try { history.scrollRestoration = 'manual'; } catch(e){}
  window.__nav = navigate;
  window.addEventListener('popstate', syncFromLocation);
  window.addEventListener('hashchange', syncFromLocation);
}
