/* Página de caso de estudio: resumen, visor, secciones, bloques de contenido, índice y progreso. */
import { $, $$, REDUCED, pad } from './utils.js';
import { t, L, lang, applyCv } from './i18n.js';
import { CONFIG } from './data/site.js';
import { PROJECTS, SECTION_ORDER } from './data/projects.js';
import { scPrepare, showcaseHTML, scSetup } from './showcase.js';

/* ---------- Bloques de contenido ---------- */
const imgTag = (src, alt, w, h) => `<img src="${src}" alt="${alt || ''}"${w ? ` width="${w}" height="${h}"` : ''} loading="lazy" decoding="async">`;
const capHTML = (cap, src) => (cap || src) ? `<figcaption><span>${cap || ''}</span>${src ? `<a class="full-link" href="${src}" target="_blank" rel="noopener">${t('fullSize')} ↗</a>` : ''}</figcaption>` : '';

/* tabla, lista, nota y par de imágenes */
function blockHTML(b, d){
  const x = b[lang] || b.es;
  if (b.type === 'table') {
    return `<div class="cs-data cs-table reveal${b.cls ? ' ' + b.cls : ''}"><h3>${x.t}</h3>${x.lead ? `<p>${x.lead}</p>` : ''}
      <div class="table-wrap"><table><thead><tr>${x.head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
      <tbody>${x.rows.map(r => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((c, i) => `<td data-label="${x.head[i + 1]}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  if (b.type === 'list') {
    return `<div class="cs-data cs-list reveal"><h3>${x.t}</h3><ul>${x.items.map(i => `<li><b>${i[0]}</b>${i[1] ? ' ' + i[1] : ''}</li>`).join('')}</ul></div>`;
  }
  if (b.type === 'note') {
    return `<aside class="cs-note reveal"><h3>${x.t}</h3><p>${x.text}</p></aside>`;
  }
  if (b.type === 'pair') {
    return `<figure class="cs-block cs-pair reveal">${b.items.map(it => `<div><p class="page-label">${L(it.label)}</p>${imgTag(it.src, L(it.alt), it.w, it.h)}</div>`).join('')}${capHTML(L(b.caption))}</figure>`;
  }
  return baseBlockHTML(b, d);
}
/* comparador antes/después, imagen, contraste y tabla de datos */
function baseBlockHTML(b, d){
  if (b.type === 'compare') {
    const labs = L(b.labels);
    return `<figure class="cs-block reveal"><div class="compare has-img" data-cursor="cursorDrag">
      <div class="c-img c-before">${imgTag(b.before, labs[0])}</div><div class="c-img c-after">${imgTag(b.after_, labs[1])}</div>
      <span class="c-lab l">${labs[0]}</span><span class="c-lab r">${labs[1]}</span>
      <div class="c-handle"></div>
      <input type="range" min="0" max="100" value="50" aria-label="${t('compareLabel')}">
    </div>${capHTML(L(b.caption))}</figure>`;
  }
  if (b.type === 'image') {
    return `<figure class="cs-block shot reveal">${imgTag(b.src, L(b.alt), b.w, b.h)}${capHTML(L(b.caption), b.src)}</figure>`;
  }
  if (b.type === 'contrast') {
    const col = (c, cls) => `<div class="${cls}"><h3>${L(c).t}</h3><ul>${L(c).items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
    return `<div class="contrast reveal">${col(b.site, 'c-site')}${col(b.user, 'c-user')}</div>`;
  }
  if (b.type === 'data') {
    const x = b[lang] || b.es;
    return `<div class="cs-data reveal"><h3>${x.t}</h3><p>${x.lead}</p>
      <div class="table-wrap"><table><thead><tr>${x.head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
      <tbody>${x.rows.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td class="ex">${r[2]}</td></tr>`).join('')}</tbody></table></div>
      <p>${x.extra}</p><p class="pattern">${x.pattern}</p>
      <ul class="ba"><li><b>${x.before[0]}:</b> ${x.before[1]}</li><li><b>${x.after[0]}:</b> ${x.after[1]}</li></ul></div>`;
  }
  return '';
}
function sectionBody(v){
  if (Array.isArray(v)) return v.map(x => `<div class="decision"><h3>${x.title}</h3><p>${x.text}</p></div>`).join('');
  return `<p>${v}</p>`;
}
function caseContactHTML(){
  return `<section class="case-contact" aria-labelledby="caseContactTitle">
    <h2 id="caseContactTitle">${t('caseContactTitle')}</h2>
    <p>${t('caseContactLead')}</p>
    <div class="contact-links">
      <a class="btn btn-primary" href="mailto:${CONFIG.email}">${CONFIG.email}</a>
      <a class="btn btn-ghost" href="${CONFIG.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn btn-ghost" data-cv="full" href="${CONFIG.cv[lang] || CONFIG.cv.es}"></a>
    </div>
  </section>`;
}
const thumbHTML = p => p.thumb ? `<img src="${p.thumb}" alt="" width="640" height="400" loading="lazy" decoding="async">` : '';

/* Resumen en 3 pasos debajo de la introducción */
function summaryHTML(p){
  const d = p[lang]; if (!d.strip) return '';
  const k = ['sumProblem', 'sumProposal', 'sumResult'];
  return `<ol class="cs-strip">${d.strip.map((s, i) => `<li><span class="n">${pad(i + 1)}</span><p class="k">${t(k[i])}</p><p>${s}</p></li>`).join('')}</ol>`;
}

/* ---------- Render del caso ---------- */
function renderCaseBody(p){
  const d = p[lang], M = t('meta'), S = t('sec');
  const metaRows = [
    [M.client, d.meta.client], [M.role, d.meta.role], [M.platform, d.meta.platform], [M.tools, d.meta.tools]
  ].filter(r => r[1]);
  const toc = []; let n = 0;
  const content = SECTION_ORDER.map(id => {
    const v = d.sections[id]; let out = '';
    if (v === undefined) return '';
    const empty = v === null || v === undefined;
    if (!empty) {
      n++; toc.push({ id, n, title: S[id] });
      out = `<section class="cs-sec reveal" id="s-${id}"><span class="num">${pad(n)}</span><h2 tabindex="-1">${S[id]}</h2>${sectionBody(v)}`;
      (p.blocks || []).filter(b => b.after === id).forEach(b => { out += blockHTML(b, d); });
      out += `</section>`;
    }
    return out;
  }).join('');
  const list = PROJECTS.filter(x => !x.draft);
  const next = list.length > 1 ? list[(list.indexOf(p) + 1) % list.length] : null;
  $('#caseBody').innerHTML = `
    <div class="wrap">
      <a class="back" href="#projects">${t('caseBack')}</a>
      <header class="case-intro">
        <div class="case-top"><span class="cat">${d.category}</span></div>
        <h1 tabindex="-1" id="caseTitle">${d.title}</h1>
        <p class="case-lede">${d.lede || d.summary}</p>
      </header>
      <dl class="meta-grid">${metaRows.map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl>
    </div>
    <div class="wrap case-layout">
      <nav class="toc" aria-label="${t('tocTitle')}"><p>${t('tocTitle')}</p><ol>
        ${toc.map(s => `<li><button type="button" data-target="s-${s.id}"><span class="n">${pad(s.n)}</span>${s.title}</button></li>`).join('')}
      </ol></nav>
      <div class="case-content">${content}</div>
    </div>
    <div class="wrap case-end">
      ${caseContactHTML()}
      ${next ? `<a class="next-card" href="#/case/${next.slug}" data-cursor="cursorView"><span><small>${t('caseNext')}</small><strong>${next[lang].title}</strong></span><span class="thumb" aria-hidden="true">${thumbHTML(next)}</span></a>` : ''}
      <a class="back" href="#projects">${t('caseBack')}</a>
    </div>`;
  document.title = `${d.title} — Diego Naranjo`;
  applyCv($('#caseBody'));
  setupCase();
}
export function renderCase(p){
  renderCaseBody(p);
  scPrepare(p.slug);
  const body = $('#caseBody');
  const intro = body.querySelector('.case-intro'), wrap = intro.parentElement, meta = wrap.querySelector('.meta-grid');
  intro.insertAdjacentHTML('afterend', summaryHTML(p).replace('class="cs-strip"', 'class="cs-strip is-wide"'));
  if (p.showcase) {
    const metaHTML = meta ? meta.outerHTML : '';
    if (meta) meta.remove();
    wrap.insertAdjacentHTML('afterend', `<div class="wrap sc-wrap">${showcaseHTML(p)}</div><div class="wrap">${metaHTML}</div>`);
    scSetup(p);
  }
}

/* ---------- Interacciones: índice, scrollspy, comparador y progreso ---------- */
let spy = null;
function setupCase(){
  $$('.toc button').forEach(b => b.addEventListener('click', () => {
    const sec = document.getElementById(b.dataset.target); if (!sec) return;
    sec.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    const h = sec.querySelector('h2'); if (h) h.focus({ preventScroll: true });
  }));
  if (spy) spy.disconnect();
  if ('IntersectionObserver' in window) {
    spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          $$('.toc button').forEach(b => b.classList.toggle('active', b.dataset.target === en.target.id));
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    $$('.cs-sec[id]').forEach(s => spy.observe(s));
  }
  $$('.compare input').forEach(inp => {
    const box = inp.closest('.compare');
    inp.addEventListener('input', () => box.style.setProperty('--pos', inp.value + '%'));
  });
  updateProgress();
}
export function updateProgress(){
  const bar = $('#progress');
  if ($('#caseView').hidden) { bar.hidden = true; return; }
  bar.hidden = false;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  // al llegar al final, el índice marca la última sección aunque no alcance el centro de la pantalla
  if (max > 0 && max - window.scrollY < 40) {
    const btns = $$('.toc button');
    btns.forEach((b, i) => b.classList.toggle('active', i === btns.length - 1));
  }
}
