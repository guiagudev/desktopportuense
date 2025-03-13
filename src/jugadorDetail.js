document.addEventListener("DOMContentLoaded", () => {
    window.api.receiveJugadorData((jugador) => {
        if (!jugador) {
            console.error("Error: No se recibió información del jugador.");
            return;
        }

        console.log("Jugador recibido:", jugador);
        const token = sessionStorage.getItem("access_token"); // O si lo usas de otra forma
        console.log("Token utilizado para la solicitud del jugador:", token);

        // Actualizar los detalles en el HTML
        document.getElementById("jugadorNombre").textContent = `${jugador.nombre} ${jugador.p_apellido} ${jugador.s_apellido || ''}`;
        document.getElementById("jugadorEquipo").textContent = `${jugador.equipo}`
        document.getElementById("jugadorCategoria").textContent = `${jugador.categoria}`
        document.getElementById("jugadorSubcategoria").textContent = `${jugador.subcategoria}`
        document.getElementById("jugadorPosicion").textContent = `${jugador.posicion}`;
        const imgElement = document.getElementById("jugadorImagen");
        if (jugador.imagen) {
            imgElement.src = jugador.imagen;
            imgElement.style.display = "block"; // Mostrar la imagen
        } else {
            imgElement.style.display = "none"; // Ocultar si no hay imagen
        }
        
    });
});
