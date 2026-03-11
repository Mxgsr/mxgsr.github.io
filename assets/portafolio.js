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
                contenedor.innerHTML = '<p>No hay proyectos públicos por ahora.</p>';
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
                '<p>No se pudieron cargar los proyectos. ' +
                '<a href="https://github.com/' + GITHUB_USER + '">Ver directamente en GitHub</a></p>';
        });
});

// Crea el elemento HTML de una tarjeta de proyecto
function crearTarjeta(repo) {
    var articulo = document.createElement("article");

    // Nombre del repo como link
    var titulo = document.createElement("h2");
    var link = document.createElement("a");
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repo.name;
    titulo.appendChild(link);

    // Descripcion (o texto por defecto)
    var descripcion = document.createElement("p");
    descripcion.textContent = repo.description || "Sin descripción";

    // Metadata: lenguaje + fecha
    var meta = document.createElement("div");
    meta.className = "repo-meta";

    if (repo.language) {
        var lenguaje = document.createElement("span");
        lenguaje.className = "repo-lenguaje";
        lenguaje.textContent = repo.language;
        meta.appendChild(lenguaje);
    }

    var fecha = document.createElement("time");
    fecha.dateTime = repo.updated_at;
    fecha.textContent = "Actualizado: " + formatearFecha(repo.updated_at);
    meta.appendChild(fecha);

    articulo.appendChild(titulo);
    articulo.appendChild(descripcion);
    articulo.appendChild(meta);

    return articulo;
}

// Formatea fecha ISO a formato legible (ej: "10 mar 2026")
function formatearFecha(fechaISO) {
    var fecha = new Date(fechaISO);
    var meses = ["ene", "feb", "mar", "abr", "may", "jun",
                 "jul", "ago", "sep", "oct", "nov", "dic"];
    return fecha.getDate() + " " + meses[fecha.getMonth()] + " " + fecha.getFullYear();
}
