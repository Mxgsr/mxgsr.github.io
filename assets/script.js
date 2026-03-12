// El tema oscuro se aplica via script inline en cada HTML (antes de pintar).
// Este archivo solo maneja el boton toggle.

// Cuando el DOM este listo, conecta el boton
document.addEventListener("DOMContentLoaded", function () {
    var boton = document.getElementById("theme-toggle");

    // Actualiza el icono del boton segun el tema actual
    // Luna = estas en light, click para ir a dark
    // Sol = estas en dark, click para ir a light
    function actualizarTexto() {
        if (document.documentElement.classList.contains("dark")) {
            boton.textContent = "\u2600\uFE0E";
        } else {
            boton.textContent = "\u25CF";
        }
    }

    actualizarTexto();

    boton.addEventListener("click", function () {
        // classList.toggle agrega la clase si no esta, o la quita si ya esta
        document.documentElement.classList.toggle("dark");

        // Guarda la preferencia para que persista entre paginas y sesiones
        if (document.documentElement.classList.contains("dark")) {
            localStorage.setItem("tema", "dark");
        } else {
            localStorage.setItem("tema", "light");
        }

        actualizarTexto();
    });
});
