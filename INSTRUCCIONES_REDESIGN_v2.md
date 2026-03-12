# Instrucciones: Rediseño maxsoto.cl (Fase 9)

## Contexto previo

El sitio ya tiene 8 fases completadas. Respetar lo que ya existe y **refactorizar**, no reescribir desde cero. Revisar el HISTORIAL_CAMBIOS.md para el detalle completo.

**Lo que ya existe y hay que preservar:**
- `styles.css` ya separado y vinculado a todas las páginas
- Dark mode funcional con variables CSS en `:root` y `body.dark`, toggle en `script.js`, persistencia en localStorage
- Navegación y footer unificados en todas las páginas
- Blog con carpeta `Posts/` (un HTML por post), `blog.html` como índice con extractos, sidebar con navegador de posts, layout flexbox dos columnas
- `Post-md/` para borradores (excluida de git)
- Responsive design con media queries (<600px)
- `script.js` con toggle de dark mode

**Lo que cambia con el rediseño:**
- Sistema de diseño completo: nueva paleta, tipografía, spacing, componentes
- Estética retro/terminal elevada — más intencional y con personalidad
- Nuevos componentes visuales (tarjetas, timeline, tags, estados vacíos)

## Decisión sobre tipografía

El sitio actualmente usa Courier New. El rediseño propone JetBrains Mono (cuerpo) y Space Mono (títulos) vía Google Fonts. Ambas son monoespaciadas, así que **se mantiene el espíritu retro** pero con mejor legibilidad y personalidad.

**Implementar así:** Agregar los `<link>` de Google Fonts en el `<head>` de todas las páginas. Definir las familias en las variables CSS con Courier New como fallback:

```css
--mono: 'JetBrains Mono', 'Courier New', monospace;
--display: 'Space Mono', 'Courier New', monospace;
```

Si por rendimiento o preferencia se quiere evitar Google Fonts, se puede descartar este paso y mantener Courier New. El resto del diseño funciona igual.

## Paso 1: Refactorizar `styles.css`

**No borrar todo.** Reemplazar progresivamente. El archivo resultante debe tener esta estructura:

```
1. Variables (:root y body.dark)
2. Reset y base
3. Tipografía
4. Layout (.container)
5. Header
6. Navegación
7. Secciones genéricas
8. Componentes (tags, tarjetas, timeline, estados vacíos)
9. Página: Blog (índice + posts + sidebar)
10. Página: Portafolio
11. Página: CV
12. Footer
13. Efectos (scanlines, noise, animaciones)
14. Responsive
```

### 1.1 Variables — tema claro y oscuro

Reemplazar las variables existentes con el nuevo sistema de colores. **Respetar el patrón actual de `:root` para light y `body.dark` para dark:**

```css
:root {
    /* Light theme */
    --bg: #f5f3f0;
    --bg-surface: #eae7e3;
    --bg-elevated: #dedbd6;
    --border: #ccc8c1;
    --border-accent: #3d5afe;
    --text-primary: #1a1a1c;
    --text-secondary: #4a4a52;
    --text-muted: #8a8a92;
    --accent: #3d5afe;
    --accent-glow: rgba(61, 90, 254, 0.1);
    --accent-warm: #e05a2b;
    --green: #2e9d8a;
    --mono: 'JetBrains Mono', 'Courier New', monospace;
    --display: 'Space Mono', 'Courier New', monospace;
}

body.dark {
    --bg: #0a0a0c;
    --bg-surface: #111115;
    --bg-elevated: #1a1a20;
    --border: #2a2a35;
    --border-accent: #3d5afe;
    --text-primary: #e8e6e3;
    --text-secondary: #8a8a95;
    --text-muted: #55555f;
    --accent: #3d5afe;
    --accent-glow: rgba(61, 90, 254, 0.15);
    --accent-warm: #ff6b35;
    --green: #4ec9b0;
}
```

**Nota:** El azul acento (`--accent`) y el naranjo cálido (`--accent-warm`) se mantienen iguales en ambos temas para consistencia de marca. Lo que cambia es fondo, superficies, bordes y textos.

### 1.2 Reset y base

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

::selection {
    background: var(--accent);
    color: var(--bg);
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
}

body {
    font-family: var(--mono);
    background: var(--bg);
    color: var(--text-primary);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    transition: background 0.3s ease, color 0.3s ease;
}
```

**Importante:** Agregar `transition` en body para que el cambio light/dark sea suave — ya existía el toggle, esto lo mejora visualmente.

### 1.3 Componentes nuevos

Agregar estos componentes al CSS. Son reutilizables en múltiples páginas:

**Section labels (// 01, // 02):**
```css
.section-label {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
}

.section-title {
    font-family: var(--display);
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
}

.section-title .num {
    color: var(--accent);
    margin-right: 0.5rem;
}
```

**Tags:**
```css
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    padding: 0.35rem 0.8rem;
    border: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--text-secondary);
    letter-spacing: 0.03em;
    transition: all 0.2s ease;
}

.tag:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-glow);
}
```

**Tarjetas genéricas (para posts, proyectos, contacto):**
```css
.card {
    padding: 1.2rem 1.5rem;
    border: 1px solid var(--border);
    background: var(--bg-surface);
    text-decoration: none;
    color: inherit;
    transition: all 0.25s ease;
    display: block;
}

.card:hover {
    border-color: var(--accent);
    background: var(--bg-elevated);
    transform: translateX(4px);
}

.card--accent-left {
    border: none;
    border-left: 3px solid var(--accent);
}

.card--accent-left:hover {
    border-left-color: var(--accent-warm);
}
```

**Estado vacío (para secciones sin contenido aún):**
```css
.empty-state {
    padding: 3rem 0;
    font-size: 0.9rem;
    color: var(--text-muted);
}
```

## Paso 2: Header y navegación

### Header

Reemplazar el header actual en todas las páginas por:

```html
<header>
    <div class="header-top">
        <div class="logo">mx<span>/</span>gsr</div>
        <div class="header-right">
            <div class="status">
                <span class="status-dot"></span>
                Santiago, Chile
            </div>
            <!-- Mantener el botón de dark mode existente aquí -->
        </div>
    </div>
</header>
```

CSS del header:

```css
.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem 0 1.5rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2rem;
}

.logo {
    font-family: var(--display);
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-secondary);
}

.logo span {
    color: var(--accent);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1.2rem;
}

.status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.status-dot {
    width: 6px;
    height: 6px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
```

**Nota sobre dark mode toggle:** El botón existente (fijo abajo a la derecha) puede quedarse donde está o moverse al header junto al status. Decisión estética — ambas son válidas. Si se mueve al header, quitar el `position: fixed` y estilizarlo como un botón pequeño inline. Si se mantiene fijo, solo actualizar su estilo visual para que use las nuevas variables.

### Navegación

Reemplazar la nav actual por:

```html
<nav>
    <a href="/index.html" class="active">Inicio</a>
    <a href="/pages/blog.html">Blog</a>
    <a href="/pages/portafolio.html">Portafolio</a>
    <a href="/pages/CV.html">Curriculum</a>
</nav>
```

```css
nav {
    display: flex;
    gap: 0;
    margin-bottom: 2.5rem;
    border: 1px solid var(--border);
}

nav a {
    flex: 1;
    padding: 0.9rem 1.2rem;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    border-right: 1px solid var(--border);
    transition: all 0.2s ease;
    position: relative;
}

nav a:last-child { border-right: none; }

nav a:hover {
    color: var(--text-primary);
    background: var(--accent-glow);
}

nav a.active {
    color: var(--accent);
    background: var(--accent-glow);
}

nav a.active::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
}
```

**Importante sobre rutas:** Verificar que los links funcionen tanto en GitHub Pages como con dominio custom. Si GitHub Pages usa subdirectorio, ajustar las rutas. Probar con rutas relativas si las absolutas dan problemas.

## Paso 3: Páginas específicas

### index.html

Reestructurar el contenido actual con los nuevos componentes. Referencia completa en el archivo `index.html` del prototipo que ya existe en el proyecto (descargado previamente).

Elementos clave:
- Hero con nombre grande (`font-family: var(--display)`, tamaño `clamp(2.2rem, 5vw, 3.2rem)`) y cursor parpadeante
- Sección "Sobre mí" con `section-label` `// 01`, contenido en párrafos, tags de intereses
- Tarjeta de Fido con `card--accent-left` usando `--accent-warm`
- Sección "Contacto" con `section-label` `// 02`, links como tarjetas con iconos de texto (GH, LI, EM)

### blog.html (índice)

**Mantener la estructura existente** de índice + sidebar + links a Posts/.

Adaptar el layout de dos columnas existente (ya usa flexbox) al nuevo estilo:

```css
/* === BLOG INDEX === */
.blog-layout {
    display: flex;
    gap: 2rem;
}

.blog-main {
    flex: 1;
    min-width: 0;
}

.blog-sidebar {
    width: 220px;
    flex-shrink: 0;
}

.blog-sidebar-title {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
}

.blog-sidebar a {
    display: block;
    padding: 0.4rem 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
}

.blog-sidebar a:hover {
    color: var(--accent);
}

/* Post cards en el índice */
.post-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.post-card {
    padding: 1.2rem 1.5rem;
    border-left: 3px solid var(--accent);
    background: var(--bg-surface);
    text-decoration: none;
    color: inherit;
    transition: all 0.25s ease;
    display: block;
}

.post-card:hover {
    border-left-color: var(--accent-warm);
    background: var(--bg-elevated);
    transform: translateX(4px);
}

.post-date {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
}

.post-title {
    font-family: var(--display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.4rem;
}

.post-excerpt {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.7;
}
```

**Responsive (ya existente, adaptar):** En <600px, `.blog-layout` pasa a `flex-direction: column` y la sidebar va debajo. Esto ya debería existir — solo verificar que sigue funcionando con las nuevas clases.

### Posts individuales (Posts/*.html)

Los archivos en `Posts/` también deben usar el CSS compartido y la plantilla base (header, nav con "Blog" como `.active`, footer). El contenido del post va en un `<article>` con estilos de prosa:

```css
/* === POST CONTENT === */
article.post-content {
    max-width: 680px;
}

article.post-content h1 {
    font-family: var(--display);
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

article.post-content .post-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}

article.post-content p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.85;
    margin-bottom: 1.2rem;
}

article.post-content strong {
    color: var(--text-primary);
    font-weight: 500;
}

article.post-content a {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 3px;
}

article.post-content a:hover {
    color: var(--accent-warm);
}

article.post-content blockquote {
    border-left: 3px solid var(--accent);
    padding: 0.8rem 1.2rem;
    margin: 1.5rem 0;
    background: var(--bg-surface);
    color: var(--text-secondary);
    font-style: italic;
}
```

**Importante:** Los posts en `Posts/` están un nivel más profundo. Verificar que la ruta al CSS sea correcta (`../../css/styles.css` o similar). Lo mismo para los links de navegación.

### portafolio.html

Grid de proyectos:

```css
/* === PORTAFOLIO === */
.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.project-card {
    padding: 1.5rem;
    border: 1px solid var(--border);
    background: var(--bg-surface);
    transition: all 0.25s ease;
    text-decoration: none;
    color: inherit;
}

.project-card:hover {
    border-color: var(--accent);
    background: var(--accent-glow);
}

.project-category {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.8rem;
}

.project-name {
    font-family: var(--display);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.project-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 1rem;
}

.project-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.project-stack .tag {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
}
```

El proyecto CASEN que ya está listado debería migrar a este formato de tarjeta.

### CV.html

Timeline vertical:

```css
/* === CV / TIMELINE === */
.timeline {
    position: relative;
    padding-left: 2rem;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
}

.timeline-entry {
    position: relative;
    padding-bottom: 2rem;
}

.timeline-entry::before {
    content: '';
    position: absolute;
    left: -2rem;
    top: 0.5rem;
    width: 7px;
    height: 7px;
    background: var(--accent);
    border-radius: 50%;
    transform: translateX(-3px);
}

.timeline-date {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
}

.timeline-role {
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.15rem;
}

.timeline-company {
    font-size: 0.85rem;
    color: var(--accent);
    margin-bottom: 0.5rem;
}

.timeline-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.7;
}
```

## Paso 4: Efectos visuales

### Scanlines (sutil, solo en dark mode)

Agregar `<div class="scanlines"></div>` como primer hijo de `<body>` en todas las páginas:

```css
.scanlines {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9998;
    background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.015) 2px,
        rgba(0,0,0,0.015) 4px
    );
    opacity: 0;
    transition: opacity 0.3s ease;
}

body.dark .scanlines {
    opacity: 1;
}
```

### Noise overlay

```css
body::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
}
```

### Animaciones fade-in

```css
.fade-in {
    opacity: 0;
    transform: translateY(12px);
    animation: fadeIn 0.6s ease forwards;
}

.fade-in:nth-child(1) { animation-delay: 0.1s; }
.fade-in:nth-child(2) { animation-delay: 0.2s; }
.fade-in:nth-child(3) { animation-delay: 0.3s; }
.fade-in:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeIn {
    to { opacity: 1; transform: translateY(0); }
}
```

Aplicar clase `fade-in` a las secciones principales de cada página.

## Paso 5: Footer

Reemplazar el footer actual en todas las páginas:

```html
<footer>
    <div class="footer-content">
        <span class="made-with">&copy; 2025 maxsoto.cl — hecho con curiosidad y café</span>
        <pre class="footer-ascii">  /\_/\
 ( o.o )
  > ^ <</pre>
    </div>
</footer>
```

```css
footer {
    padding: 3rem 0;
    border-top: 1px solid var(--border);
    margin-top: 2rem;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.footer-ascii {
    font-size: 0.65rem;
    color: var(--text-muted);
    opacity: 0.5;
    text-align: right;
    line-height: 1.2;
    font-family: var(--mono);
}
```

## Paso 6: Responsive

Actualizar las media queries existentes. El breakpoint de 600px se mantiene:

```css
@media (max-width: 600px) {
    .container { padding: 0 1.2rem; }
    nav { flex-direction: column; }
    nav a {
        border-right: none;
        border-bottom: 1px solid var(--border);
        text-align: left;
        padding-left: 1.5rem;
    }
    nav a:last-child { border-bottom: none; }
    .header-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.8rem;
    }
    .footer-content {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    .blog-layout { flex-direction: column; }
    .blog-sidebar { width: 100%; }
    .project-grid { grid-template-columns: 1fr; }
    .contact-links { grid-template-columns: 1fr; }
}
```

## Paso 7: Checklist final

- [ ] `styles.css` refactorizado con la estructura definida en Paso 1
- [ ] Variables light y dark funcionando con el toggle existente
- [ ] Google Fonts cargando en TODAS las páginas (incluidos Posts/*.html)
- [ ] Header nuevo en todas las páginas
- [ ] Nav con `.active` correcto en cada página
- [ ] Footer nuevo en todas las páginas
- [ ] `<div class="scanlines"></div>` en todas las páginas
- [ ] index.html con nuevo diseño (hero, about, contacto)
- [ ] blog.html adaptado (post cards, sidebar con nuevo estilo)
- [ ] Posts/*.html con estilos de artículo y rutas correctas al CSS
- [ ] portafolio.html con grid de proyectos
- [ ] CV.html con timeline
- [ ] Responsive funcional en todas las páginas
- [ ] Dark mode funcional en todas las páginas
- [ ] Links de navegación funcionan desde cualquier nivel de profundidad
- [ ] Commit con mensaje: "feat: redesign fase 9 - nuevo sistema de diseño retro/terminal"

## Reglas generales

1. **CSS vanilla** — no frameworks
2. **Monoespaciada siempre** — JetBrains Mono cuerpo, Space Mono títulos, Courier New fallback
3. **Paleta cerrada** — solo los colores en `:root` y `body.dark`, no agregar nuevos
4. **Hover consistente** — `translateX(4px)` para listas, `border-color: var(--accent)` para tarjetas
5. **No romper dark mode** — todo nuevo estilo debe usar variables, nunca colores hardcodeados
6. **No romper la estructura de Posts/** — los posts individuales son archivos separados, no tocar esa arquitectura
7. **`script.js`** — solo actualizar si es necesario para el dark mode toggle, no reescribir
