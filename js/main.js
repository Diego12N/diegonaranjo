/* Punto de entrada: conecta los módulos, registra los eventos y arranca el sitio.
   El orden de arranque es el mismo que tenía el script original. */
import { $, $$, html } from './modules/utils.js';
import { lang, setLangCode, t, pageTitle, initialLang, applyStatic } from './modules/i18n.js';
import { CONFIG } from './modules/data/site.js';
import { PROJECTS } from './modules/data/projects.js';
import { initMotion, setMotion, paused, initPointer, observeReveals, runLoader } from './modules/motion.js';
import { renderIntro, renderRail, initGoo, initRail } from './modules/home.js';
import { renderAbout, renderProcess, renderSkills, renderCasesPage, renderNextSec } from './modules/pages.js';
import { renderViewer, renderTabs, renderGallery, syncTabs, lb, renderLightbox, initVisual, initCampaignTabs } from './modules/visual.js';
import { renderCase, updateProgress } from './modules/case-study.js';
import { initShowcase } from './modules/showcase.js';
import { renderSubnav } from './modules/sections.js';
import { curView, go, initRouter } from './modules/router.js';

/* ---------- Idioma: vuelve a dibujar todo el contenido ---------- */
function renderAll(){
  renderIntro(); renderRail(); renderCasesPage(); renderAbout(); renderProcess(); renderSkills(); renderTabs(); renderGallery();
  if (curView && curView.type === 'page') { renderNextSec(curView.key); if (curView.key === 'visual') renderViewer(false); }
  renderSubnav(curView);
  if (curView && curView.type === 'case') $$('#caseBody a[href="#projects"]').forEach(a => a.setAttribute('href', '#/cases'));
  if (lb.open) renderLightbox(false);
  if (curView && curView.type === 'case') renderCase(PROJECTS.find(x => x.slug === curView.key));
  if (curView && curView.type === 'page') document.title = `${pageTitle(curView.key)} — Diego Naranjo`;
  else if (!curView || curView.type === 'home') document.title = t('docTitle');
  syncTabs();
}
function setLang(l){
  setLangCode(l); html.lang = l;
  try { localStorage.setItem('dn-lang', l); } catch(e){}
  try { const u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(history.state, '', u); } catch(e){}
  renderAll();
  applyStatic();
  $$('[data-mail]').forEach(a => { a.href = 'mailto:' + CONFIG.email; a.textContent = CONFIG.email; });
  $$('[data-linkedin]').forEach(a => { a.href = CONFIG.linkedin; });
  observeReveals();
}

/* ---------- Eventos ---------- */
initVisual();
initGoo();
initCampaignTabs();
initMotion();
initRail();
initRouter();
$$('.lang button').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }));
const navEl = $('#nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 20);
  if (!$('#caseView').hidden) updateProgress();
}, { passive: true });
initShowcase();

/* ---------- Arranque ---------- */
setLang(initialLang());
setMotion(paused);
go(true, null);
initPointer();
runLoader();
setTimeout(() => html.classList.add('intro-done'), 2200);
window.__booted = true;
