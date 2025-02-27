window.api.receiveJugadorData((jugador) => {
    document.getElementById('jugador-id').value = jugador.id;
    document.getElementById('nombre').value = jugador.nombre;
    document.getElementById('equipo').value = jugador.equipo;
    document.getElementById('posicion').value = jugador.posicion;
    document.getElementById('edad').value = jugador.edad;
   
});

document.getElementById('edit-form').addEventListener('submit',(e) => {
    e.preventDefault();
    const id = document.getElementById('jugador-id').value;
    const nombre = document.getElementById('nombre').value;
    const equipo = document.getElementById('equipo').value;
    const posicion = document.getElementById('posicion').value;
    const edad = document.getElementById('edad').value;
    
    const jugadorActualizado = { id, nombre, equipo, posicion, edad };
    console.log("Enviando jugador actualizado", jugadorActualizado);
    window.api.updateJugador(jugadorActualizado);
});