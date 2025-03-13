document.addEventListener('DOMContentLoaded', () => {
    // Función de mapeo genérico para categorías y equipos
    const mapValue = (value, mapping) => mapping[value] || value;

    // Mapeo de valores para categorías y equipos
    const categoriaMapping = {
        'Prebenjamín': 'PREBEN',
        'Benjamín': 'BEN',
        'Alevín': 'ALE',
        'Infantil': 'INF',
        'Cadete': 'CAD',
        'Juvenil': 'JUV'
    };

    const equipoMapping = {
        'Masculino': 'M',
        'Femenino': 'F'
    };

    // Recibir los datos del jugador desde el proceso principal
    window.api.receiveJugadorData((jugador) => {
        // Obtener el token desde sessionStorage (una vez que ya esté disponible)
        const token = sessionStorage.getItem("access_token");
        console.log("Token en la ventana de edición:", token); // Asegúrate de que se ve el token en la consola

        // Asignar los valores a los campos del formulario
        document.getElementById('jugador-id').value = jugador.id;
        document.getElementById('nombre').value = jugador.nombre;
        document.getElementById('p_apellido').value = jugador.p_apellido;
        document.getElementById('s_apellido').value = jugador.s_apellido;

        // Asignar categoría y subcategoría (sin mapeo ya que son códigos, no nombres)
        document.getElementById('categoria').value = jugador.categoria;
        document.getElementById('subcategoria').value = jugador.subcategoria;

        // Asignar equipo (radio button)
        const equipoValue = mapValue(jugador.equipo, equipoMapping);
        const equipoElement = document.querySelector(`input[name="equipo"][value="${equipoValue}"]`);
        if (equipoElement) equipoElement.checked = true;

        // Asignar los demás campos
        document.getElementById('posicion').value = jugador.posicion;
        document.getElementById('edad').value = jugador.edad;
        //MANDAR LOS DATOS
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
});
