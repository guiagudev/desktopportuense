const apiUrl = 'http://127.0.0.1:8000/api/jugadores/';

// Cargar los jugadores desde la API
function cargarJugadores() {
    $.get(apiUrl, function(data) {
        $('#jugadoresList').empty();
        data.forEach(jugador => {
            $('#jugadoresList').append(`
                <li class="list-group-item">
                    ${jugador.nombre} - ${jugador.equipo} - ${jugador.posicion} - ${jugador.edad} años
                    <button class="btn btn-danger btn-sm float-right ml-2" onclick="eliminarJugador(${jugador.id})">Eliminar</button>
                    <button class="btn btn-warning btn-sm float-right" onclick="editarJugador(${jugador.id})">Editar</button>
                </li>
            `);
        });
    });
}

// Agregar un nuevo jugador
$('#addJugadorForm').submit(function(event) {
    event.preventDefault();
    
    const nuevoJugador = {
        nombre: $('#nombre').val(),
        equipo: $('#equipo').val(),
        posicion: $('#posicion').val(),
        edad: $('#edad').val()
    };
    
    $.post(apiUrl, nuevoJugador, function() {
        cargarJugadores();
        $('#addJugadorForm')[0].reset();
    });
});

// Eliminar un jugador
function eliminarJugador(id) {
    $.ajax({
        url: `${apiUrl}${id}/`,
        type: 'DELETE',
        success: function() {
            cargarJugadores();
        }
    });
}

// Editar un jugador (aquí puedes agregar una interfaz de edición si lo necesitas)
function editarJugador(id) {
    // Implementar la lógica para editar un jugador
}

$(document).ready(function() {
    cargarJugadores();
});
