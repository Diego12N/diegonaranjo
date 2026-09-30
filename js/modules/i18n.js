/* Idioma: textos ES / EN, idioma actual y textos estáticos del HTML (data-i18n). */
import { $, $$ } from './utils.js';
import { I18N } from './data/texts.js';
import { CONFIG, PAGE_KEY } from './data/site.js';

export let lang = 'es';
export function setLangCode(l){ lang = l; }

export const t = k => (I18N[lang][k] !== undefined ? I18N[lang][k] : I18N.es[k]);
/* Valor bilingüe { es, en } → texto en el idioma actual. */
export const L = x => (x && typeof x === 'object' && !Array.isArray(x) && ('es' in x || 'en' in x)) ? (x[lang] !== undefined ? x[lang] : x.es) : x;
export const pageTitle = k => (k === 'cases' ? t('railCases') : k === 'skills' ? t('skillsEyebrow') : k === 'visual' ? t('visualEyebrow') : t(PAGE_KEY[k]));

export function initialLang(){
  try { const p = new URLSearchParams(location.search).get('lang'); if (p === 'es' || p === 'en') return p; } catch(e){}
  try { const s = localStorage.getItem('dn-lang'); if (s === 'es' || s === 'en') return s; } catch(e){}
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function applyCv(root){
  const fallback = !CONFIG.cv[lang];
  root.querySelectorAll('[data-cv]').forEach(a => {
    a.href = CONFIG.cv[lang] || CONFIG.cv.es; a.target = '_blank'; a.rel = 'noopener';
    const short = a.dataset.cv === 'short';
    a.textContent = short ? t(fallback ? 'cvShortFallback' : 'cvShort') : t(fallback ? 'cvFullFallback' : 'cvFull');
    if (fallback) a.setAttribute('hreflang', 'es'); else a.removeAttribute('hreflang');
  });
}
function updateMeta(){
  const set = (sel, v) => { const m = document.querySelector(sel); if (m) m.setAttribute('content', v); };
  set('meta[name="description"]', t('metaDesc'));
  set('meta[property="og:description"]', t('ogDesc'));
  set('meta[property="og:locale"]', t('ogLocale'));
  set('meta[property="og:locale:alternate"]', lang === 'es' ? 'en_US' : 'es_AR');
}
export function applyStatic(){
  $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
  $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  applyCv(document);
  updateMeta();
  const mail = $('#emailLink'); mail.href = 'mailto:' + CONFIG.email; mail.textContent = CONFIG.email;
  $('#linkedinLink').href = CONFIG.linkedin;
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}
