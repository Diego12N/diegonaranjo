# Portfolio — Diego Naranjo

Portfolio profesional de Diego Naranjo, UI / UX Designer. Es un sitio bilingüe (ES / EN) orientado a recruiters de empresas IT.

Es una web estática en HTML, CSS y JavaScript sin framework, sin librerías, sin dependencias npm y sin paso de build. El JavaScript usa módulos ES nativos del navegador (`import` / `export`).

---

## Cómo verlo localmente

> **Importante:** los módulos ES no funcionan abriendo `index.html` con doble clic. El navegador los bloquea cuando la página se abre como `file://` y el sitio queda vacío. Hay que abrirlo desde un servidor local, que es lo mismo que pasa una vez publicado.

Tenés tres opciones; ninguna instala nada en el proyecto:

1. **Node** (es la opción que se usa en este proyecto):
   ```bash
   cd carpeta-del-portfolio
   npx serve .
   ```
   Después abrí `http://localhost:3000` en el navegador (si el puerto está ocupado, `serve` muestra cuál usó).
2. **VS Code + extensión Live Server:** clic derecho sobre `index.html` → *Open with Live Server*.
3. **Python**, si está instalado: `python3 -m http.server 8000` y abrí `http://localhost:8000`. En Windows el comando puede ser `python` o `py`.

Para ver el sitio en inglés directamente: `http://localhost:3000/?lang=en`.

## Publicar en GitHub Pages (gratis)

1. Creá un repositorio **público** en GitHub.
   - Si se llama `tu-usuario.github.io`, el sitio queda en `https://tu-usuario.github.io`.
   - Con cualquier otro nombre (por ejemplo `portfolio`), queda en `https://tu-usuario.github.io/portfolio/`.
2. Subí el contenido de esta carpeta a la raíz del repositorio, incluido el archivo oculto `.nojekyll`.
3. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Elegí la rama `main` y la carpeta `/ (root)`, y guardá.
4. En uno o dos minutos el sitio queda publicado en la dirección de arriba.

Antes de publicar:

- Subí el CV como `CV_Diego_Naranjo_ES.pdf` en la raíz, junto a `index.html`.
- En `index.html`, reemplazá `og:image` por la URL absoluta (por ejemplo `https://tu-usuario.github.io/assets/images/og-image.png`) y agregá `<meta property="og:url" content="https://tu-usuario.github.io/">`. Sin eso, LinkedIn y otras redes no muestran la vista previa.
- GitHub Pages **distingue mayúsculas y minúsculas** en los nombres de archivo, aunque Windows y macOS no. Todas las rutas del proyecto están en minúsculas y son relativas (sin `/` inicial), así que funcionan en las dos direcciones posibles.

Más adelante se puede conectar un dominio propio en **Settings → Pages → Custom domain** sin tocar el código.

---

## Estructura

```text
/
├── index.html                 estructura y contenido semántico; carga CSS, js/boot.js y js/main.js
├── .nojekyll                  indica a GitHub Pages que publique los archivos tal cual
├── CLAUDE.md                  reglas permanentes para Claude Code
├── docs/                      documentación persistente del proyecto (ver "Trabajar con Claude Code")
├── prompts/                   prompts para iniciar sesiones de Claude Code
├── css/
│   ├── base.css               variables (:root), reset, tipografía, accesibilidad, reducir movimiento / pausa
│   ├── layout.css             navegación superior, contenedores, vista interna y cabecera fija, cierre de página, footer
│   ├── components.css         botones, selectores, loader, capa de transición, cursor, apariciones
│   └── sections/
│       ├── home.css           inicio: destellos, texto de fondo, objeto 3D junto al nombre, columna de tarjetas
│       ├── identity.css       identidad por sección: fondos, patrones, motivos isométricos, elemento 3D que se transforma
│       ├── work.css           página "Trabajo seleccionado"
│       ├── case-study.css     caso de estudio: resumen, visor "Propuesta de rediseño", secciones, bloques, índice, progreso
│       ├── visual.css         "Diseño visual para web": visor de campañas, tienda simulada, galería, lightbox
│       └── pages.css          Cómo trabajo, Skills (con logos), Sobre mí, Contacto
├── js/
│   ├── boot.js                script clásico del <head> (ver "Consideraciones")
│   ├── main.js                punto de entrada: registra eventos y arranca el sitio
│   └── modules/
│       ├── utils.js           $, $$, html, REDUCED, FINE, pad, wait, px
│       ├── i18n.js            idioma actual, t(), L(), pageTitle(), textos estáticos (data-i18n), CV
│       ├── router.js          rutas con #, historial, vista activa (applyView), foco al volver
│       ├── transitions.js     expandir desde tarjeta / "Ver todo", contraer al volver, fundido entre páginas
│       ├── sections.js        identidad por sección, menú de páginas agrupado
│       ├── morph3d.js         elemento 3D que viaja y cambia de forma entre secciones
│       ├── home.js            presentación, objeto 3D junto al nombre, tarjetas, desplazamiento de la columna
│       ├── case-study.js      render del caso, bloques (tabla, lista, nota, par, comparador, imagen, contraste, datos), índice, progreso
│       ├── showcase.js        visor "Propuesta de rediseño" (flechas, miniaturas, deslizamiento)
│       ├── visual.js          visor de campañas, tienda simulada, galería, lightbox
│       ├── pages.js           páginas Trabajo, Cómo trabajo, Skills, Sobre mí y "siguiente sección"
│       ├── motion.js          pausa de movimiento, cursor, apariciones al hacer scroll, loader
│       └── data/
│           ├── site.js        CONFIG (email, LinkedIn, CV), páginas, colores y secciones
│           ├── texts.js       textos de interfaz ES / EN
│           ├── projects.js    casos de estudio (ES / EN) y capturas del visor con links de Figma
│           ├── banners.js     campañas, piezas y faja de la tienda simulada
│           └── logos.js       logos de herramientas de la página Skills
└── assets/
    └── images/
        ├── arca/              caso El Arca de Noé (+ screens/ del visor)
        ├── clicksport/        caso ClickSport (+ screens/ del visor)
        ├── banners/           24 piezas de campañas (WebP)
        └── og-image.png       imagen para compartir en redes
```

**Punto de entrada:** `index.html` carga `js/boot.js` (clásico, en el `<head>`) y `js/main.js` (`type="module"`). `main.js` importa el resto de los módulos.

**Dependencias externas:** solo Google Fonts (Bricolage Grotesque e Inter), cargadas desde `fonts.googleapis.com`. Sin conexión se usan las fuentes del sistema. Los íconos y logos son SVG dentro del código.

---

## Consideraciones para futuros desarrollos

- **`js/boot.js` tiene que seguir siendo un script clásico en el `<head>`.** Se ejecuta antes de pintar la página: decide si se muestra el loader y captura los clicks en enlaces internos (`#…`) para navegar sin recargar (llama a `window.__nav`, que define `router.js`). Si se convierte en módulo, se ejecutaría tarde y aparecerían recargas y parpadeos.
- **Orden del CSS:** los archivos se cargan en este orden: base → layout → components → sections/home → identity → work → case-study → visual → pages. En la migración se respetó la cascada original. Si dos reglas compiten (mismo elemento, misma propiedad, misma especificidad), gana la que se carga después. Al agregar estilos, conviene hacerlo en el archivo de la sección correspondiente, al final.
- **Bilingüe:** todo texto visible va en `data/texts.js` (ES y EN) o en los datos (`{ es, en }`). En el HTML se usa `data-i18n`, `data-i18n-html` o `data-i18n-aria`. No hay que dejar textos fijos en un solo idioma.
- **Agregar un caso:**
  1. Sumar el objeto a `PROJECTS` en `data/projects.js`, con `slug`, `thumb`, `cover`, `blocks` y `es` / `en` (`title`, `category`, `summary`, `lede`, `meta`, `strip`, `sections`).
  2. Sumar sus capturas a `SHOWCASE` y enlazarlas al final del archivo (`PROJECTS.find(...).showcase = SHOWCASE.<clave>`).
  3. Poner las imágenes en `assets/images/<caso>/`.
  
  La tarjeta del inicio y la página Trabajo se generan solas.
- **Agregar un banner:** agregar la imagen en `assets/images/banners/` con el nombre `<id>-desktop.webp` / `<id>-mobile.webp` y una línea en `BANNERS` (`data/banners.js`).
- **Colores de sección:** están en `SECTIONS`, `VIEW_AC` y `AC` (`data/site.js`), y como `rgba` en los patrones de `sections/identity.css`. Si cambian, hay que actualizar ambos lugares.
- **Módulos ES:** una variable exportada no se puede reasignar desde otro módulo. Por eso el estado vive en el módulo dueño (por ejemplo `lang` en `i18n.js`, `curView` en `router.js`) y se lee desde los demás.
- **Datos guardados en el navegador:** `dn-lang` (idioma), `dn-motion` (pausa) y `dn-seen` (loader ya mostrado en la sesión).

---

## Qué se hizo en la reorganización

Fue un cambio estructural, sin cambios visuales ni de comportamiento.

- El `index.html` único (≈350 KB con CSS y JS embebidos) se separó en HTML + 9 archivos CSS + 19 archivos JS.
- **Equivalencia verificada:** se compararon el sitio anterior y el nuevo en 19 estados de la interfaz (desktop, 1024 px y 390 px; ES y EN; todas las páginas, los dos casos con sus vistas, el visor de campañas, el lightbox, el loader):
  - DOM generado idéntico.
  - Estilos calculados idénticos en todos los elementos, incluidos `::before` y `::after` y los estados hover.
  - 57 capturas de pantalla idénticas píxel a píxel.
  - 27 recorridos interactivos con resultado idéntico, con y sin "reducir movimiento": transiciones, "Ver todo", volver, idioma, pausa, visor, lightbox y enlaces directos.
- **Eliminado por no usarse:**
  - Código de versiones anteriores reemplazado antes de ejecutarse: banners de ejemplo, proyectos borrador y conceptual, placeholders, portada y etiqueta del caso, bloques de caso sin uso.
  - 434 selectores CSS de versiones anteriores (bento, clásica), 263 declaraciones pisadas y 14 animaciones sin uso.
  - 30 textos sin uso.
  - 6 imágenes que no se mostraban.
  - `version-bento.html` y `version-clasica.html`.
- Las funciones que se redefinían varias veces (`applyView`, `renderRail`, `renderCase`, `setSection`, `crossfade`, etc.) quedaron unificadas en una sola función cada una, en el mismo orden de ejecución.

---

## Problemas detectados

Los problemas conocidos (deuda técnica y detalles pendientes) están en **`docs/estado-actual.md`**, que es la única lista vigente. Las tareas para resolverlos están en `docs/tareas-pendientes.md`.

---

## Trabajar con Claude Code

El proyecto se documenta a sí mismo para que cada sesión de Claude Code empiece liviana, sin cargar conversaciones anteriores:

| Archivo | Qué contiene |
|---|---|
| `CLAUDE.md` | Reglas permanentes (se carga solo al abrir el proyecto) |
| `docs/estado-actual.md` | Qué está hecho, en revisión, pendiente, problemas y qué no tocar |
| `docs/tareas-pendientes.md` | Tareas con estado, alcance, qué no modificar y dependencias |
| `docs/decisiones-diseno.md` | Decisiones visuales vigentes y lista de lo descartado |
| `docs/contexto.md` | Explicación completa del proyecto para una sesión sin contexto |
| `docs/perfil-profesional.md` | Fuente de verdad sobre la experiencia de Diego (para cualquier texto) |
| `prompts/` | Prompts para copiar y pegar: auditoría inicial e inicio de sesión (Claude no los lee por su cuenta) |

### Mantenimiento de la documentación

- **`CLAUDE.md`:** solo cuando cambia una regla permanente de trabajo (por ejemplo, una herramienta nueva, una convención de código o una restricción general). Casi nunca.
- **`docs/estado-actual.md`:** al final de **cada** sesión con cambios.
  - Mover ítems entre Implementado, En revisión y Pendiente.
  - Agregar o quitar problemas conocidos.
  - Actualizar la fecha y agregar una línea al registro breve.
- **`docs/tareas-pendientes.md`:** cuando aparece, avanza o se completa una tarea. Las completadas se borran en la siguiente limpieza; su resultado queda en `estado-actual.md`.
- **`docs/decisiones-diseno.md`:** cuando se aprueba una decisión visual o de comportamiento que va a durar (un color, un hover, una animación, un criterio responsive). La regla vigente se edita **en su lugar**. Si la anterior podría volver a proponerse, se agrega una fila en "Descartado / reemplazado" con fecha y motivo.
- **`docs/contexto.md`:** solo cuando cambia la arquitectura o el contenido estructural (una página nueva, un caso nuevo, una sección que cambia de propósito).
- **`docs/perfil-profesional.md`:** solo con datos que confirmes vos (experiencia, formación terminada, métricas reales).

**Qué no guardar:** conversaciones, prompts viejos, pasos intermedios, intentos fallidos (salvo en "Descartado", en una línea), código copiado (el código es su propia fuente) ni información repetida entre archivos.

**Para que no crezcan:** cada dato vive en un solo archivo (los demás lo referencian). El registro breve se mantiene en unas 10 líneas y lo más viejo se borra. Las tareas completadas salen de la lista. Si `estado-actual.md` supera unas 150 líneas, hay que resumirlo.

**Para evitar contradicciones:** cuando cambia una decisión, se reemplaza el texto vigente en el mismo commit que el código y se busca (`Ctrl+Shift+F`) el término en `docs/` para actualizar cualquier mención. La jerarquía de `CLAUDE.md` resuelve los conflictos que queden.

**Git:** conviene hacer commit al final de cada sesión. `CLAUDE.md`, `docs/` y `prompts/` están en `.gitignore`: son documentación de trabajo, quedan solo en la copia local y no se publican en el repositorio.
