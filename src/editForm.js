document.addEventListener('DOMContentLoaded', () => {
    // Recibir los datos del jugador desde el proceso principal
    window.api.receiveJugadorData((jugador) => {
        document.getElementById('jugador-id').value = jugador.id;
        document.getElementById('nombre').value = jugador.nombre;
        document.getElementById('p_apellido').value = jugador.p_apellido;
        document.getElementById('s_apellido').value = jugador.s_apellido;
        document.getElementById('categoria').value = jugador.categoria;
        document.getElementById('subcategoria').value = jugador.subcategoria;
        document.getElementById('posicion').value = jugador.posicion;
        document.getElementById('edad').value = jugador.edad;
        document.getElementById('equipo').value = jugador.equipo;
    });

    // Enviar los cambios cuando el formulario se envíe
    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const jugador = {
            id: document.getElementById('jugador-id').value,
            nombre: document.getElementById('nombre').value,
            p_apellido: document.getElementById('p_apellido').value,
            s_apellido: document.getElementById('s_apellido').value,
            categoria: document.getElementById('categoria').value,
            subcategoria: document.getElementById('subcategoria').value,
            posicion: document.getElementById('posicion').value,
            equipo : document.querySelector('input[name="equipo"]:checked').value,
            edad: document.getElementById('edad').value,
        };

        // Enviar los datos al proceso principal para actualizar el jugador
        window.api.updateJugador(jugador);
    });
});
