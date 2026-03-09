// Aplica el tema guardado ANTES de que la pagina se pinte,
// para evitar un flash blanco al cargar en dark mode
var temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "dark") {
    document.body.classList.add("dark");
}

// Cuando el DOM este listo, conecta el boton
document.addEventListener("DOMContentLoaded", function () {
    var boton = document.getElementById("theme-toggle");

    // Actualiza el icono del boton segun el tema actual
    // Luna = estas en light, click para ir a dark
    // Sol = estas en dark, click para ir a light
    function actualizarTexto() {
        if (document.body.classList.contains("dark")) {
            boton.textContent = "\u2600\uFE0E";
        } else {
            boton.textContent = "\u25CF";
        }
    }

    actualizarTexto();

    boton.addEventListener("click", function () {
        // classList.toggle agrega la clase si no esta, o la quita si ya esta
        document.body.classList.toggle("dark");

        // Guarda la preferencia para que persista entre paginas y sesiones
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("tema", "dark");
        } else {
            localStorage.setItem("tema", "light");
        }

        actualizarTexto();
    });
});
