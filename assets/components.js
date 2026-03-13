// components.js — Inyecta header, nav y footer en todas las páginas
// Centraliza los componentes compartidos para editarlos en un solo lugar
(function () {
    var pathname = window.location.pathname;

    // --- Detectar si es la página 404 (marcada con data-page="404" en el body) ---
    var es404 = document.body.getAttribute("data-page") === "404";

    // --- Calcular profundidad para rutas relativas ---
    // Usa la estructura conocida del sitio en vez de contar segmentos,
    // así funciona tanto en servidor como abriendo archivos localmente
    var profundidad = 0;
    if (pathname.indexOf("/blog/posts/") !== -1) {
        profundidad = 2;
    } else if (pathname.indexOf("/pages/") !== -1 || pathname.indexOf("/blog/") !== -1) {
        profundidad = 1;
    }

    var prefijo = "";
    for (var i = 0; i < profundidad; i++) {
        prefijo += "../";
    }

    // En 404 usamos rutas absolutas porque no sabemos desde qué URL se carga
    var prefijoNav = es404 ? "/" : prefijo;

    // --- Detectar página activa para marcar el link correcto en la nav ---
    var activa = "";
    if (es404) {
        activa = "ninguna";
    } else if (pathname.indexOf("/pages/blog.html") !== -1) {
        activa = "blog";
    } else if (pathname.indexOf("/pages/portafolio.html") !== -1) {
        activa = "portafolio";
    } else if (pathname.indexOf("/pages/CV.html") !== -1) {
        activa = "curriculum";
    } else if (pathname.indexOf("/blog/") !== -1) {
        // Posts y plantilla marcan Blog como activo
        activa = "blog";
    } else {
        activa = "inicio";
    }

    // --- Helper: agrega class="active" si corresponde ---
    function claseActiva(pagina) {
        return activa === pagina ? ' class="active"' : "";
    }

    // --- Inyectar Header ---
    var header = document.getElementById("site-header");
    if (header) {
        header.innerHTML =
            "<header>" +
                '<div class="header-top">' +
                    '<div class="logo">mx<span>/</span>gsr</div>' +
                    '<div class="header-right">' +
                        '<div class="status">' +
                            '<span class="status-dot"></span>' +
                            "Chile" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</header>";
    }

    // --- Inyectar Nav ---
    var nav = document.getElementById("site-nav");
    if (nav) {
        nav.innerHTML =
            "<nav>" +
                '<a href="' + prefijoNav + 'index.html"' + claseActiva("inicio") + ">Inicio</a>" +
                '<a href="' + prefijoNav + 'pages/blog.html"' + claseActiva("blog") + ">Blog</a>" +
                '<a href="' + prefijoNav + 'pages/portafolio.html"' + claseActiva("portafolio") + ">Portafolio</a>" +
                '<a href="' + prefijoNav + 'pages/CV.html"' + claseActiva("curriculum") + ">Curriculum</a>" +
            "</nav>";
    }

    // --- Inyectar Footer ---
    var footer = document.getElementById("site-footer");
    if (footer) {
        footer.innerHTML =
            "<footer>" +
                '<div class="footer-content">' +
                    '<span class="made-with">&copy; 2026 Maximiliano Soto \u2014 hecho con curiosidad y caf\u00e9</span>' +
                    '<pre class="footer-ascii">/\\_/\\\n ( o.o )\n  > ^ <</pre>' +
                "</div>" +
            "</footer>";
    }
})();
