/* Inicio: presentación (izquierda), objeto 3D junto al nombre y columna de tarjetas (derecha). */
import { $, $$ } from './utils.js';
import { t, lang } from './i18n.js';
import { CONFIG, PAGE_FX, AC, SEC_ICON, RAIL_SEC } from './data/site.js';
import { PROJECTS } from './data/projects.js';
import { BANNERS, CAMPAIGNS, PIECES, bSrc, showVisual } from './data/banners.js';

/* ---------- Presentación ---------- */
export function renderIntro(){
  $('#introCol').innerHTML = `
    <p class="h-tag hi" style="--d:0"><span class="dot" aria-hidden="true"></span>${t('open')}</p>
    <h1 class="hero-name" id="heroName"><span class="sr-only">Diego Naranjo</span><span class="split" aria-hidden="true" id="heroSplit">Diego Naranjo</span></h1>
    <p class="hero-role hi" style="--d:1">${t('heroRole')}</p>
    <p class="hero-statement hi" style="--d:2">${t('heroStatement')}</p>
    <ul class="evidence hi" style="--d:3" aria-label="${t('evidenceLabel')}">${t('evidence').map(e => `<li>${e}</li>`).join('')}</ul>
    <div class="hero-ctas hi" style="--d:4">
      <a class="btn btn-primary" href="${CONFIG.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn btn-ghost" data-cv="full" href="${CONFIG.cv.es}"></a>
    </div>`;
  splitName();
  const cell = $('#gooCell'); if (cell && cell.parentElement !== $('#introCol')) $('#introCol').appendChild(cell);
  placeGoo();
}
function splitName(){
  const el = $('#heroSplit'); let c = 0;
  el.innerHTML = el.textContent.trim().split(' ').map(w =>
    `<span class="w">${[...w].map(ch => `<span class="ch" style="--c:${c++}">${ch}</span>`).join('')}</span>`).join(' ');
}
/* Ubica el objeto detrás de la última letra del nombre, en su esquina superior derecha.
   Se mide la palabra (no la letra animada) para que la posición no dependa de la animación de entrada. */
function placeGoo(){
  const col = $('#introCol'), cell = $('#gooCell'), words = $$('#heroSplit .w');
  if (!col || !cell || !words.length) return;
  const o = words[words.length - 1].getBoundingClientRect(), c = col.getBoundingClientRect();
  if (!o.width) return;
  const size = o.height * 1.25;
  cell.style.width = size + 'px'; cell.style.height = size + 'px';
  cell.style.left = (o.right - c.left - size * 0.34) + 'px';
  cell.style.top = (o.top - c.top - size * 0.28) + 'px';
}

/* ---------- Tarjetas: 01 Capacidades · 02 Trabajo seleccionado · 03 Perfil y contacto ---------- */
function card(o){
  return `<li><a class="card${o.cls ? ' ' + o.cls : ''}" id="${o.id}" href="${o.href}" data-fx="${o.fx}" data-cursor="cursorOpen" style="--k:${o.k}">
    <span class="c-vis ${o.vcls || ''}" aria-hidden="true">${o.vis || ''}</span>
    <span class="c-txt"><span class="c-t">${o.t}</span><span class="c-s">${o.s}</span>${o.d ? `<span class="c-d">${o.d}</span>` : ''}</span>
    <span class="c-go" aria-hidden="true">→</span></a></li>`;
}
function renderRailGroups(){
  const live = PROJECTS.filter(p => !p.draft);
  let k = 0;
  const G = t('skillsGroups') || t('skillGroups');
  const skillsSub = [G[0].items[0], G[0].items[1], G[1].items[0]].map(s => s.replace(/\s*\(.*?\)/, '')).join(', ') + '…';
  const group = (n, key, label, items, all) => `<section class="rail-group" id="rg-${key}" data-fx="${key === 'cases' ? PAGE_FX.cases : '#1a1240'}" style="--ac:${AC[key]}" aria-labelledby="rl-${key}">
      <div class="rail-head"><h2 class="rail-label" id="rl-${key}"><span class="n">${n}</span>${label}</h2>${all ? `<a class="rail-all" id="railAllCases" href="#/cases" data-fx="${PAGE_FX.cases}">${t('seeAll')} <span aria-hidden="true">→</span></a>` : ''}</div><ul>${items}</ul></section>`;
  const caps =
    card({ id: 'card-page-process', href: '#/process', fx: PAGE_FX.process, k: k++, vcls: 'mv-steps', vis: '<i></i><i></i><i></i><i></i><i></i>', t: t('processEyebrow'), s: t('steps').map(x => x.t).join(' · '), d: t('cProcD') }) +
    card({ id: 'card-page-skills', href: '#/skills', fx: PAGE_FX.skills, k: k++, vcls: 'mv-chips', vis: '<i></i><i></i><i></i>', t: t('skillsEyebrow'), s: skillsSub, d: G.map(g => g.t).join(' · ') });
  const work = live.map(p => {
    const d = p[lang], img = p.thumb || (p.cover && p.cover.src);
    return card({ id: 'card-case-' + p.slug, href: '#/case/' + p.slug, fx: '#120d18', k: k++, vis: img ? `<img src="${img}" alt="">` : '',
      t: d.title, s: d.category, d: d.summary });
  }).join('') + (showVisual() ? card({ id: 'card-page-visual', href: '#/visual', fx: PAGE_FX.visual, k: k++, vcls: 'mv-real', vis: `<img src="${bSrc(BANNERS[0], 'm')}" alt="">`,
      t: t('visualEyebrow'), s: `${CAMPAIGNS.length} ${t('campWord2')} · ${PIECES.length} ${t('piecesWord')}`, d: t('cVisS') }) : '');
  const prof =
    card({ id: 'card-page-about', href: '#/about', fx: PAGE_FX.about, k: k++, vis: '<span class="mv-num">4</span>', t: t('aboutEyebrow'), s: `4 ${t('aboutYears')}`, d: t('aboutWhere') }) +
    card({ id: 'card-page-contact', href: '#/contact', fx: PAGE_FX.contact, k: k++, cls: 'card-contact', vcls: 'mv-mail', vis: '<span>@</span>', t: t('contactEyebrow'), s: t('location'), d: t('cContactS') });
  $('#rail').innerHTML = group('01', 'caps', t('railCaps'), caps) + group('02', 'cases', t('railCases'), work, true) + group('03', 'profile', t('railProfile'), prof);
}
export function renderRail(){
  renderRailGroups();
  /* íconos de sección en los títulos de grupo */
  $$('#rail .rail-group').forEach(g => {
    const sec = RAIL_SEC[g.id.replace('rg-', '')]; if (!sec) return;
    g.dataset.sec = sec;
    const n = g.querySelector('.rail-label .n'); if (n && !g.querySelector('.rail-label .sec-ico')) n.insertAdjacentHTML('afterend', SEC_ICON[sec]);
  });
}

/* ---------- Columna de tarjetas: desplazamiento y fundidos de los bordes ---------- */
/* En escritorio solo se desplaza la columna de tarjetas (sin barra visible).
   La rueda del mouse funciona sobre cualquier parte del inicio. */
const railScrolls = () => getComputedStyle($('#rail')).overflowY === 'auto';
export function updateRailFade(){
  const r = $('#rail'); if (!r) return;
  r.classList.toggle('at-top', r.scrollTop < 4);
  r.classList.toggle('at-end', r.scrollTop + r.clientHeight > r.scrollHeight - 4);
}

/* El objeto 3D acompaña la navegación: se inclina hacia la tarjeta
   que está bajo el cursor (o con foco) y toma su color. */
export function leanTo(el){
  const cell = $('#gooCell'); if (!cell) return;
  if (!el) { cell.style.setProperty('--lx', '0px'); cell.style.setProperty('--ly', '0px'); cell.style.setProperty('--ls', '1'); cell.style.removeProperty('--tint'); cell.classList.remove('leaning'); return; }
  const g = cell.getBoundingClientRect(), r = el.getBoundingClientRect();
  if (!g.width) return;
  const dy = Math.max(-14, Math.min(14, ((r.top + r.height / 2) - (g.top + g.height / 2)) * .05));
  cell.style.setProperty('--lx', '8px'); cell.style.setProperty('--ly', dy + 'px'); cell.style.setProperty('--ls', '1.12');
  cell.style.setProperty('--tint', getComputedStyle(el.closest('.rail-group')).getPropertyValue('--ac'));
  cell.classList.add('leaning');
}

/* Ubicación del objeto 3D: se recalcula al cambiar el tamaño y cuando cargan las fuentes. */
export function initGoo(){
  if ('ResizeObserver' in window) new ResizeObserver(() => placeGoo()).observe(document.getElementById('introCol'));
  window.addEventListener('resize', () => placeGoo(), { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => placeGoo());
}
export function initRail(){
  $('#home').addEventListener('wheel', e => {
    if (!railScrolls() || e.ctrlKey) return;
    const rail = $('#rail');
    if (rail.contains(e.target)) return;
    rail.scrollBy({ top: e.deltaY, behavior: 'auto' });
    e.preventDefault();
  }, { passive: false });
  $('#rail').addEventListener('scroll', updateRailFade, { passive: true });
  window.addEventListener('resize', updateRailFade, { passive: true });
  $('#rail').addEventListener('mouseover', e => { const c = e.target.closest('a.card'); if (c) leanTo(c); });
  $('#rail').addEventListener('mouseleave', () => leanTo(null));
  $('#rail').addEventListener('focusin', e => { const c = e.target.closest('a.card'); if (c) leanTo(c); });
  $('#rail').addEventListener('focusout', () => leanTo(null));
}
