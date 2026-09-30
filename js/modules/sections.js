/* Identidad visual por sección (Capacidades · Trabajo · Perfil) y menú de las páginas internas. */
import { $, $$, REDUCED } from './utils.js';
import { t, pageTitle } from './i18n.js';
import { SECTIONS, SEC_ICON } from './data/site.js';
import { updateRailFade } from './home.js';
import { morphTo } from './morph3d.js';

export const secOf = v => !v || v.type === 'home' ? null : v.type === 'case' ? 'work'
  : (v.key === 'process' || v.key === 'skills') ? 'caps' : (v.key === 'cases' || v.key === 'visual') ? 'work' : 'profile';

/* ---------- Menú de las páginas, agrupado por sección ----------
   Se construye una vez por idioma; al cambiar de página solo se actualiza cuál está activa. */
export function renderSubnav(cur){
  requestAnimationFrame(updateRailFade);
  $('#subnav').innerHTML = Object.entries(SECTIONS).map(([sec, s]) =>
    `<div class="sn-group" data-sec="${sec}" style="--sec:${s.ac}"><a class="sn-sec" href="#/${s.pages[0]}" aria-label="${t(s.key)}" title="${t(s.key)}">${SEC_ICON[sec]}</a>${s.pages.map(p => `<a href="#/${p}">${p === 'cases' ? t('subCases') : pageTitle(p)}</a>`).join('')}</div>`
  ).join('<span class="sn-sep" aria-hidden="true"></span>');
  markSubnav(cur);
}
/* Menú compacto: si los grupos no entran en una línea (mobile), solo el grupo de la sección
   activa muestra sus páginas y los otros quedan como su ícono de sección. Se mide con los
   textos reales, así funciona igual en ES y EN. */
export function fitSubnav(){
  const n = $('#subnav'); if (!n || !n.clientWidth) return;
  n.classList.remove('is-compact');
  if (n.scrollWidth > n.clientWidth + 1) n.classList.add('is-compact');
}
export function markSubnav(cur){
  const active = !cur ? '' : (cur.type === 'case' || (cur.type === 'page' && cur.key === 'visual')) ? '#/cases' : cur.type === 'page' ? '#/' + cur.key : '';
  $$('#subnav a:not(.sn-sec)').forEach(a => { if (a.getAttribute('href') === active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const sec = secOf(cur);
  $$('#subnav .sn-group').forEach(g => g.classList.toggle('is-active', g.dataset.sec === sec));
  fitSubnav();
  const on = $('#subnav a[aria-current]');
  if (on) { const n = $('#subnav'); if (on.offsetLeft < n.scrollLeft || on.offsetLeft + on.offsetWidth > n.scrollLeft + n.clientWidth) n.scrollTo({ left: on.offsetLeft - 12, behavior: REDUCED ? 'auto' : 'smooth' }); }
}

/* ---------- Sección activa: color, etiqueta, menú y elemento 3D ---------- */
function applySection(v){
  const sec = secOf(v), view = $('#view');
  if (!sec) { delete view.dataset.section; return; }
  view.dataset.section = sec;
  view.style.setProperty('--sec', SECTIONS[sec].ac);
  $('#secTag').innerHTML = `${SEC_ICON[sec]}<span>${t(SECTIONS[sec].key)}</span>`;
  $$('#subnav .sn-group').forEach(g => g.classList.toggle('is-active', g.dataset.sec === sec));
}
export function setSection(v){
  const view = $('#view'), prev = view.dataset.section, visible = !view.hidden;
  applySection(v);
  const next = view.dataset.section;
  if (!next) return;
  morphTo(next, visible && !!prev && prev !== next && !view.classList.contains('sec-entering'));
}
