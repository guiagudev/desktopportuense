// Definir la URL base de la API
const apiUrl = 'http://127.0.0.1:8000/api/jugadores/';

// Cargar los jugadores desde la API con el equipo seleccionado
function cargarJugadores(equipo = '') {
    let url = apiUrl;
    if (equipo) {
        url += `?equipo=${equipo}`; // Agregar parámetro de equipo si se especifica
    }

    $.get(url, function(data) {
        $('#jugadoresList').empty();
        data.forEach(jugador => {
            const segundoApellido = jugador.s_apellido ? jugador.s_apellido : "";
            $('#jugadoresList').append(`
                <li class="list-group-item">
                    ${jugador.nombre} ${jugador.p_apellido} ${segundoApellido} - ${jugador.posicion} - ${jugador.edad} años
                    <button class="btn btn-danger btn-sm float-right ml-2" onclick="eliminarJugador(${jugador.id})">Eliminar</button>
                    <button class="btn btn-primary btn-sm float-right" onclick="editarJugador(${jugador.id})">Editar</button>
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
        primer_apellido: $('#p_apellido').val(),
        segundo_apellido: $('#s_apellido').val(),
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

// Editar un jugador (puedes añadir una interfaz de edición si lo necesitas)
function editarJugador(id) {
    console.log("Editando jugador con ID:", id);
    window.api.openEditWindow(id);
}

// Lógica para manejar el cambio de pestaña (Masculino/Femenino)
$(document).ready(function() {
    // Cargar los jugadores por defecto (Masculino, es el activo)
    cargarJugadores('M');

    // Cambiar de equipo al hacer clic en una pestaña
    $('#masculino-tab').click(function() {
        cargarJugadores('M');
    });

    $('#femenino-tab').click(function() {
        cargarJugadores('F');
    });

    // Botón para abrir la ventana de creación de jugador
    $('#btnAbrirCrearJugador').click(function() {
        window.api.openCreateWindow();
    });
});
