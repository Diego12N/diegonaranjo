/* Diseño visual para web: visor de campañas en una tienda simulada, galería de piezas y lightbox. */
import { $, $$, REDUCED, pad } from './utils.js';
import { t, lang } from './i18n.js';
import { RUBRO, BANNERS, CAMPAIGNS, PIECES, bSrc, STORE_ICO, STORE_INFO } from './data/banners.js';

let bvIndex = 0, bvDevice = window.innerWidth < 720 ? 'mobile' : 'desktop';

/* Faja de información de la tienda (contenido ficticio) debajo del banner */
function storeInfo(dev){
  const items = dev === 'd' ? STORE_INFO : STORE_INFO.slice(0, 2);
  return `<ul class="store-info" aria-hidden="true">${items.map(s => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${STORE_ICO[s.i]}</svg><span class="si-k">${s.k[lang]}</span><span class="si-a">${s.a[lang]} ›</span></li>`).join('')}</ul>`;
}

/* ---------- Visor: la campaña elegida dentro de una tienda simulada (desktop o mobile) ---------- */
export function renderViewer(animate){
  const c = CAMPAIGNS[bvIndex];
  if (bvDevice === 'mobile' && !c.m) bvDevice = 'desktop';
  $('#bvIndustry').textContent = c.t[lang];
  $('#bvRubro').textContent = RUBRO[c.r][lang];
  $('#bvCount').textContent = `${pad(bvIndex + 1)} / ${pad(CAMPAIGNS.length)}`;
  const dev = bvDevice === 'desktop' ? 'd' : 'm', size = c[dev];
  const img = `<img class="bv-img" src="${bSrc(c, dev)}" alt="${c.t[lang]} — ${t(dev === 'd' ? 'devD' : 'devM')}" width="${size[0]}" height="${size[1]}">`;
  const head = dev === 'd'
    ? `<div class="store-head"><span class="logo"></span><span class="links"><i></i><i></i><i></i><i></i></span><span class="icons"><i></i><i></i></span></div>`
    : `<div class="store-head"><span class="icons"><i></i></span><span class="logo"></span><span class="icons"><i></i></span></div>`;
  const store = `${head}${img}${storeInfo(dev)}`;
  const stage = $('#bvStage');
  stage.innerHTML = dev === 'd'
    ? `<div class="bv-device"><div class="dev-desktop"><div class="bar"><span></span><span></span><span></span></div>${store}</div></div>`
    : `<div class="bv-device"><div class="dev-mobile"><div class="screen"><div class="notch"></div>${store}</div></div></div>`;
  $('#bvCaption').textContent = c.m ? `${t(dev === 'd' ? 'devD' : 'devM')} · ${size[0]} × ${size[1]} px` : `${t('devD')} · ${size[0]} × ${size[1]} px · ${t('noMobile')}`;
  $$('.seg button').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.device === bvDevice));
    const off = b.dataset.device === 'mobile' && !c.m;
    b.disabled = off; b.title = off ? t('noMobile') : '';
  });
  if (animate && !REDUCED && stage.firstElementChild.animate) {
    stage.firstElementChild.animate([{ opacity: 0, transform: 'translateY(14px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.3,1)' });
  }
  syncTabs();
}

/* ---------- Selector de campañas sincronizado con el visor ---------- */
export function renderTabs(){
  $('#bvTabs').innerHTML = CAMPAIGNS.map((c, i) =>
    `<button type="button" data-camp="${i}" aria-pressed="${i === bvIndex}"><img src="${bSrc(c, 'd')}" alt="" loading="lazy">${c.t[lang]}</button>`).join('');
}
export function syncTabs(){
  $$('#bvTabs button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.camp === bvIndex)));
  $$('#bGallery .bcamp').forEach(b => b.classList.toggle('is-camp', +b.dataset.camp === bvIndex));
}

/* ---------- Galería: una fila por campaña, desktop y mobile a la misma altura ---------- */
export function renderGallery(){
  $('#bGallery').innerHTML = BANNERS.map((c, ci) => {
    const items = PIECES.map((p, i) => [p, i]).filter(([p]) => p.camp === ci);
    return `<article class="bcamp" data-camp="${ci}">
      <header class="bcamp-head"><h3>${c.t[lang]}</h3><span class="bcamp-r">${RUBRO[c.r][lang]}</span><span class="bcamp-dev">${c.m ? t('bothDev') : t('onlyDesktop')}</span></header>
      <div class="bcamp-row">${items.map(([p, i]) => `<button type="button" class="bpiece" style="--r:${p.ratio.toFixed(4)}" data-piece="${i}" data-cursor="cursorZoom" aria-label="${c.t[lang]} — ${t(p.dev === 'd' ? 'devD' : 'devM')}">
        <img src="${p.src}" alt="" width="${p.w}" height="${p.h}" loading="lazy" decoding="async"><span class="bpiece-tag" aria-hidden="true">${t(p.dev === 'd' ? 'devD' : 'devM')}</span></button>`).join('')}</div>
    </article>`;
  }).join('');
}

/* ---------- Lightbox con la imagen real ---------- */
export const lb = $('#lightbox');
let lbIndex = 0, lbReturn = null;
function sizeLightbox(){
  const p = PIECES[lbIndex], im = $('#lbStage img'); if (!p || !im) return;
  const W = Math.min(1400, window.innerWidth - 48), H = window.innerHeight - 190;
  const w = (W / p.ratio <= H) ? W : H * p.ratio;
  im.style.width = Math.max(120, w) + 'px';
}
export function renderLightbox(animate){
  const p = PIECES[lbIndex], c = CAMPAIGNS[p.camp];
  $('#lbStage').innerHTML = `<img src="${p.src}" alt="" width="${p.w}" height="${p.h}">`;
  $('#lbTitle').textContent = `${c.t[lang]} — ${t(p.dev === 'd' ? 'devD' : 'devM')}`;
  $('#lbSub').textContent = `${p.w} × ${p.h} px · ${RUBRO[c.r][lang]}`;
  $('#lbCount').textContent = `${lbIndex + 1} / ${PIECES.length}`;
  sizeLightbox();
  if (animate && !REDUCED) $('#lbStage').animate([{ opacity: 0, transform: 'scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.3,1)' });
}
function openLightbox(i){
  lbIndex = i; lbReturn = document.activeElement;
  renderLightbox(false);
  if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
  document.documentElement.classList.add('cursor-hidden');
}

/* ---------- Eventos ---------- */
export function initVisual(){
  $$('.seg button').forEach(b => b.addEventListener('click', () => { if (bvDevice !== b.dataset.device) { bvDevice = b.dataset.device; renderViewer(true); } }));
  $('#bvPrev').addEventListener('click', () => { bvIndex = (bvIndex - 1 + CAMPAIGNS.length) % CAMPAIGNS.length; renderViewer(true); });
  $('#bvNext').addEventListener('click', () => { bvIndex = (bvIndex + 1) % CAMPAIGNS.length; renderViewer(true); });
  $('#bGallery').addEventListener('click', e => { const b = e.target.closest('[data-piece]'); if (b) openLightbox(+b.dataset.piece); });
  lb.addEventListener('close', () => { document.documentElement.classList.remove('cursor-hidden'); if (lbReturn) lbReturn.focus(); });
  $('#lbClose').addEventListener('click', () => lb.close());
  $('#lbPrev').addEventListener('click', () => { lbIndex = (lbIndex - 1 + PIECES.length) % PIECES.length; renderLightbox(true); });
  $('#lbNext').addEventListener('click', () => { lbIndex = (lbIndex + 1) % PIECES.length; renderLightbox(true); });
  $('#lbInner').addEventListener('click', e => { if (e.target.id === 'lbInner') lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); $('#lbNext').click(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); $('#lbPrev').click(); }
  });
  window.addEventListener('resize', () => { if (lb.open) sizeLightbox(); }, { passive: true });
}
export function initCampaignTabs(){
  $('#bvTabs').addEventListener('click', e => {
    const b = e.target.closest('[data-camp]'); if (!b) return;
    const i = +b.dataset.camp; if (i === bvIndex) return;
    bvIndex = i; renderViewer(true);
  });
}
