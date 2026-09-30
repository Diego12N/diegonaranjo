/* Utilidades compartidas: selectores, preferencias del usuario y helpers de formato. */

export const $ = s => document.querySelector(s);
export const $$ = s => document.querySelectorAll(s);
export const html = document.documentElement;

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE = window.matchMedia('(pointer: fine)').matches;

export const pad = n => String(n).padStart(2, '0');
export const wait = ms => new Promise(r => setTimeout(r, ms));
export const px = n => Math.round(n) + 'px';
