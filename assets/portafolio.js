// Carga los repos publicos de GitHub y los renderiza como tarjetas
// Usa la API publica (sin token) — limite de 60 requests/hora, suficiente para uso personal

var GITHUB_USER = "mxgsr";
var API_URL = "https://api.github.com/users/" + GITHUB_USER + "/repos?sort=updated&per_page=100";

document.addEventListener("DOMContentLoaded", function () {
    var contenedor = document.getElementById("proyectos");

    // Estado inicial: mensaje de carga
    contenedor.innerHTML = '<p class="estado-carga">Cargando proyectos...</p>';

    fetch(API_URL)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("Error de la API: " + respuesta.status);
            }
            return respuesta.json();
        })
        .then(function (repos) {
            // Filtrar forks — solo repos propios
            var propios = repos.filter(function (repo) {
                return !repo.fork;
            });

            if (propios.length === 0) {
                contenedor.innerHTML = '<div class="empty-state">No hay proyectos públicos por ahora.</div>';
                return;
            }

            // Limpiar el mensaje de carga antes de renderizar
            contenedor.innerHTML = "";

            propios.forEach(function (repo) {
                contenedor.appendChild(crearTarjeta(repo));
            });
        })
        .catch(function () {
            // Si la API falla, mostrar fallback con link directo al perfil
            contenedor.innerHTML =
                '<div class="empty-state">No se pudieron cargar los proyectos. ' +
                '<a href="https://github.com/' + GITHUB_USER + '" style="color: var(--accent);">Ver directamente en GitHub</a></div>';
        });
});

// Crea el elemento HTML de una tarjeta de proyecto
function crearTarjeta(repo) {
    var card = document.createElement("a");
    card.className = "project-card";
    card.href = repo.html_url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    // Categoria (lenguaje o "Proyecto")
    var categoria = document.createElement("p");
    categoria.className = "project-category";
    categoria.textContent = repo.language || "Proyecto";
    card.appendChild(categoria);

    // Nombre del repo
    var nombre = document.createElement("p");
    nombre.className = "project-name";
    nombre.textContent = repo.name;
    card.appendChild(nombre);

    // Descripcion
    var descripcion = document.createElement("p");
    descripcion.className = "project-desc";
    descripcion.textContent = repo.description || "Sin descripción";
    card.appendChild(descripcion);

    // Stack / topics como tags
    if (repo.topics && repo.topics.length > 0) {
        var stack = document.createElement("div");
        stack.className = "project-stack";
        repo.topics.forEach(function (topic) {
            var tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = topic;
            stack.appendChild(tag);
        });
        card.appendChild(stack);
    }

    return card;
}

// Formatea fecha ISO a formato legible (ej: "10 mar 2026")
function formatearFecha(fechaISO) {
    var fecha = new Date(fechaISO);
    var meses = ["ene", "feb", "mar", "abr", "may", "jun",
                 "jul", "ago", "sep", "oct", "nov", "dic"];
    return fecha.getDate() + " " + meses[fecha.getMonth()] + " " + fecha.getFullYear();
}
