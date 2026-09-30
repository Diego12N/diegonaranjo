/* Arranque (script clásico, se ejecuta antes de pintar la página):
   - marca si hay que mostrar el loader (una vez por sesión, nunca con "reducir movimiento");
   - si el resto del sitio no arranca en 4 s, retira el loader y muestra el contenido;
   - captura los clicks en enlaces internos (#...) para navegar sin recargar (ver js/modules/router.js). */
(function(){
  var d=document.documentElement; d.classList.add('js');
  var r=false, seen=false;
  try{ r=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  try{ seen=sessionStorage.getItem('dn-seen')==='1'; }catch(e){}
  if(r||seen) d.classList.add('no-loader'); else d.classList.add('loading');
  // Seguridad: si la inicialización falla, se retira el loader y se muestra el contenido.
  setTimeout(function(){ if(!window.__booted){ d.classList.remove('js','loading'); d.classList.add('no-loader'); } }, 4000);
})();
window.addEventListener('click', function(e){
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if (window.__nav) window.__nav(a.getAttribute('href'), a);
}, true);
