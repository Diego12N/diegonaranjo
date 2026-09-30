/* Configuración del sitio y de la navegación entre páginas y secciones. */

export const CONFIG = {
  "email": "diego.emma.n@outlook.com",
  "linkedin": "https://www.linkedin.com/in/diego-emmanuel-naranjo-7ba10513a/",
  "cv": {
    "es": "CV_Diego_Naranjo_UI-UX_ES.pdf",
    "en": "CV_Diego_Naranjo_UI-UX_EN.pdf"
  }
};   // el CV se sirve desde la raíz del sitio

/* Orden de las páginas internas (menú y "siguiente sección"). */
export const PAGES = ["process", "skills", "cases", "about", "contact"];
/* Clave de texto del título de cada página. */
export const PAGE_KEY = {
  "cases": "railCases",
  "about": "aboutEyebrow",
  "process": "processEyebrow",
  "skills": "skillsEyebrow",
  "visual": "visualEyebrow",
  "contact": "contactEyebrow"
};
/* Color de la capa de transición al abrir cada página desde el inicio. */
export const PAGE_FX = {
  "cases": "#2a1216",
  "about": "#1f1640",
  "process": "#2a1d10",
  "skills": "#2a1d10",
  "visual": "#2a1216",
  "contact": "#1f1640"
};
/* Color de acento por grupo del inicio y por página. */
export const AC = {
  "cases": "#ff6a55",
  "profile": "#a78bff",
  "caps": "#ffb347",
  "contact": "#ff8fb0"
};
export const VIEW_AC = {
  "cases": "#ff6a55",
  "about": "#a78bff",
  "process": "#ffb347",
  "skills": "#ffb347",
  "visual": "#ff6a55",
  "contact": "#a78bff"
};

/* Identidad visual por sección: Capacidades (ámbar) · Trabajo (coral) · Perfil (violeta). */
export const SECTIONS = {
  "caps": {
    "ac": "#ffb347",
    "key": "railCaps",
    "pages": [
      "process",
      "skills"
    ]
  },
  "work": {
    "ac": "#ff6a55",
    "key": "railCases",
    "pages": [
      "cases"
    ]
  },
  "profile": {
    "ac": "#a78bff",
    "key": "railProfile",
    "pages": [
      "about",
      "contact"
    ]
  }
};
export const SEC_ICON = {
  "caps": "<svg class=\"sec-ico\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3 20 7.5 12 12 4 7.5Z M4 7.5V16.5L12 21V12 M20 7.5V16.5L12 21\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></svg>",
  "work": "<svg class=\"sec-ico\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"6.5\" y=\"3.5\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" opacity=\".55\"/><rect x=\"3.5\" y=\"8.5\" width=\"14\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><path d=\"M3.5 11.5h14\" stroke=\"currentColor\" stroke-width=\"1.6\"/></svg>",
  "profile": "<svg class=\"sec-ico\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><circle cx=\"12\" cy=\"10\" r=\"3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><path d=\"M6.8 18.2c1.2-2.3 3-3.4 5.2-3.4s4 1.1 5.2 3.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/></svg>"
};
/* Grupo del inicio → sección. */
export const RAIL_SEC = {
  "caps": "caps",
  "cases": "work",
  "profile": "profile"
};
