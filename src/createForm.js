document.getElementById('create-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const equipo = document.getElementById('equipo').value;
    const posicion = document.getElementById('posicion').value;
    const edad = document.getElementById('edad').value;
    
    const nuevoJugador = { nombre, equipo, posicion, edad };
    
    console.log("Enviando nuevo jugador", nuevoJugador);
    
    // Enviar jugador al proceso principal
    window.api.addJugador(nuevoJugador);

    // Cerrar ventana después de enviar los datos
    window.close();
});
