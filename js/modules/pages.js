/* Páginas internas: Trabajo seleccionado, Cómo trabajo, Skills, Sobre mí y el cierre "siguiente sección". */
import { $, pad } from './utils.js';
import { t, lang, pageTitle } from './i18n.js';
import { PAGES } from './data/site.js';
import { PROJECTS } from './data/projects.js';
import { BANNERS, CAMPAIGNS, PIECES, bSrc, showVisual } from './data/banners.js';
import { TOOL_GROUPS, LOGOS } from './data/logos.js';

/* ---------- Sobre mí ---------- */
export function renderAbout(){
  $('#bio').innerHTML = t('bio').map((p,i) => `<p${i === 0 ? ' class="lead"' : ''}>${p}</p>`).join('');
  $('#xpList').innerHTML = t('xp').map(x => `
    <div class="xp"><div class="xp-head"><h4>${x.role}</h4><span class="when">${x.when}</span></div>
      <p class="org">${x.org}</p><ul>${x.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      ${x.note ? `<p class="note">${x.note}</p>` : ''}</div>`).join('');
  $('#eduList').innerHTML = t('edu').map(e => `<li><span>${e.t}<span class="o">${e.o}</span></span><span class="y">${e.y}</span></li>`).join('');
}

/* ---------- Cómo trabajo ---------- */
export function renderProcess(){
  $('#steps').innerHTML = t('steps').map((s,i) => `<li><span class="n">${pad(i+1)}</span><h3>${s.t}</h3><p>${s.d}</p></li>`).join('');
  $('#devList').innerHTML = t('dev').map(d => `<li><h4>${d.t}</h4><p>${d.d}</p></li>`).join('');
}

/* ---------- Skills + logos de herramientas ---------- */
export function renderSkills(){
  $('#skillCols').innerHTML = t('skillGroups').map(g => `<div class="${g.core ? 'core' : ''}"><h3>${g.t}</h3><ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('');
  $('#learningList').innerHTML = t('learning').map(i => `<li>${i}</li>`).join('');
  renderLogos();
}
function renderLogos(){
  const box = $('#toolLogos'); if (!box) return;
  box.innerHTML = `<p class="sr-only">${lang === 'es' ? 'Herramientas y tecnologías' : 'Tools and technologies'}</p>` + TOOL_GROUPS.map(g => `<div class="tl-group">
      <p class="tl-k">${g.k[lang]}</p>
      <ul class="tl-list">${g.items.map(([slug, name]) => {
        const l = LOGOS[slug];
        // Tiendanube no está en bibliotecas de logos de uso libre: monograma provisorio hasta cargar el oficial.
        const art = l ? `<svg viewBox="${l.vb}" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${l.body}</svg>` : `<span class="tl-mono" aria-hidden="true">TN</span>`;
        return `<li class="tl-item" title="${name}">${art}<span class="sr-only">${name}</span></li>`;
      }).join('')}</ul></div>`).join('');
}

/* ---------- Trabajo seleccionado: casos + diseño visual ---------- */
export function renderCasesPage(){
  const live = PROJECTS.filter(p => !p.draft);
  const grid = $('#caseGrid');
  const metaItem = (label, v) => v ? `<span>${label}: <b>${v}</b></span>` : '';
  grid.innerHTML = live.map((p, i) => {
    const d = p[lang], img = (p.cover && p.cover.src) || p.thumb;
    return `<li style="--i:${i}"><a class="case-card" href="#/case/${p.slug}" data-cursor="cursorView">
      <span class="cc-media" aria-hidden="true">${img ? `<img src="${img}" alt="" loading="lazy">` : ''}</span>
      <span class="cc-body">
        <span class="cc-top"><span class="cc-n">${pad(i + 1)}</span><span class="cc-cat">${d.category}</span></span>
        <h3 class="cc-title">${d.title}</h3>
        <span class="cc-sum">${d.summary}</span>
        <span class="cc-meta">${metaItem(t('rowRole'), d.meta.role)}${metaItem(t('rowTools'), d.meta.tools)}</span>
        <span class="cc-go">${t('viewCase')} <i aria-hidden="true">→</i></span>
      </span></a></li>`;
  }).join('');
  let head = $('#workCasesH');
  if (!head) { grid.insertAdjacentHTML('beforebegin', '<h2 class="work-h" id="workCasesH"></h2>'); head = $('#workCasesH'); }
  head.innerHTML = `<span class="n">01</span>${t('workCasesH')}`;
  let vis = $('#workVisual');
  if (!vis) { grid.insertAdjacentHTML('afterend', '<div id="workVisual"></div>'); vis = $('#workVisual'); }
  const pick = [BANNERS[0], BANNERS[2], BANNERS[1]];
  vis.innerHTML = showVisual() ? `<h2 class="work-h"><span class="n">02</span>${t('workVisualH')}</h2>
    <a class="visual-card" href="#/visual" data-cursor="cursorOpen">
      <span class="vc-body">
        <span class="vc-k">${CAMPAIGNS.length} ${t('campWord2')} · ${PIECES.length} ${t('piecesWord')}</span>
        <span class="vc-t">${t('visualTitle')}</span>
        <span class="vc-d">${t('visualLead')}</span>
        <span class="cc-go">${t('seePieces')} <i aria-hidden="true">→</i></span>
      </span>
      <span class="vc-mosaic" aria-hidden="true">
        <img class="m1" src="${bSrc(pick[0], 'd')}" alt="" loading="lazy">
        <img class="m2" src="${bSrc(pick[1], 'd')}" alt="" loading="lazy">
        <img class="m3" src="${bSrc(pick[2], 'm')}" alt="" loading="lazy">
      </span>
    </a>` : '';
}

/* ---------- Cierre de cada página: siguiente sección (Diseño visual continúa como Trabajo) ---------- */
export function renderNextSec(key){
  if (key === 'visual') key = 'cases';
  const list = PAGES.filter(p => p !== 'visual' || showVisual());
  const next = list[(list.indexOf(key) + 1) % list.length];
  const a = $('#nextSec');
  a.href = '#/' + next;
  a.innerHTML = `<span><small>${t('nextSection')}</small><strong>${pageTitle(next)}</strong></span><span class="arr" aria-hidden="true">→</span>`;
}
