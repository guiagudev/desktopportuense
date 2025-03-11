// Definir la URL base de la API
const apiUrl = "http://127.0.0.1:8000/api/jugadores/";


// Variable global para almacenar el equipo actual
let equipoActual = "M"; 

// Cargar los jugadores desde la API con el equipo seleccionado
async function cargarJugadores(equipo = equipoActual) {
  equipoActual = equipo; // Actualizar la variable global
  let url = apiUrl;
  if (equipo) {
    url += `?equipo=${equipo}`; // Agregar parámetro de equipo si se especifica
  }
 //Manually introducing my Token
 
  try {
    // Obtener el token de acceso desde el sessionStorage
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNjk1Nzc3LCJpYXQiOjE3NDE2OTU0NzcsImp0aSI6IjU0ZWRlZjQ0ODQ3NTQ0Y2Y4ZGQ0OWQ5OWIxZTk1Nzk5IiwidXNlcl9pZCI6M30.jZ6h7UhU5RzjEIGBeho1mh6j87uRxBmBRfSBRHTT10k';
    
    // Si no hay token, mostrar error o redirigir a login
    if (!accessToken) {
      console.error("No hay token de acceso. Por favor, inicia sesión.");
      // Podrías redirigir a la página de login aquí si lo prefieres
      return;
    }

    // Hacer la solicitud GET con el token en el header
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Incluir el token de acceso
      }
    });

    if (!response.ok) {
      throw new Error('Error al cargar los jugadores');
    }

    const data = await response.json();
    
    // Verificar si se recibieron jugadores
    if (data.length === 0) {
      $("#jugadoresList").html("<li class='list-group-item'>No hay jugadores disponibles.</li>");
    } else {
      $("#jugadoresList").empty();
      data.forEach((jugador) => {
        const segundoApellido = jugador.s_apellido ? jugador.s_apellido : "";
        $("#jugadoresList").append(`
          <li class="list-group-item">
            <a href="#" onclick="detalleJugador(${jugador.id})">
              ${jugador.nombre} ${jugador.p_apellido} ${segundoApellido}
            </a> - ${jugador.posicion} - ${jugador.edad} años -  ${jugador.categoria}

            <button class="btn btn-danger btn-sm float-right ml-2" onclick="eliminarJugador(${jugador.id})">Eliminar</button>
            <button class="btn btn-primary btn-sm float-right" onclick="editarJugador(${jugador.id})">Editar</button>
          </li>
        `);
      });
    }
  } catch (error) {
    console.error("Error al cargar los jugadores:", error);
    $("#jugadoresList").html("<li class='list-group-item'>Error al cargar jugadores. Intenta nuevamente.</li>");
  }
}


// Agregar un nuevo jugador
$("#addJugadorForm").submit(function (event) {
  event.preventDefault();

  const nuevoJugador = {
    nombre: $("#nombre").val(),
    primer_apellido: $("#p_apellido").val(),
    segundo_apellido: $("#s_apellido").val(),
    equipo: $("#equipo").val(),
    posicion: $("#posicion").val(),
    edad: $("#edad").val(),
  };

  $.post(apiUrl, nuevoJugador, function () {
    cargarJugadores(); // Se recarga con el equipo actual
    $("#addJugadorForm")[0].reset();
  });
});

// Eliminar un jugador
function eliminarJugador(id) {
  $.ajax({
    url: `${apiUrl}${id}/`,
    type: "DELETE",
    success: function () {
      cargarJugadores(); // Se recarga con el equipo actual
    },
  });
}

function detalleJugador(id) {
  console.log("Página de jugador con ID: ", id);
  window.api.openDetailWindow(id);
}

// Editar un jugador
function editarJugador(id) {
  console.log("Editando jugador con ID:", id);
  window.api.openEditWindow(id);
}

// Lógica para manejar el cambio de pestaña (Masculino/Femenino)
$(document).ready(function () {
  cargarJugadores(equipoActual); // Cargar jugadores del equipo actual

  $("#masculino-tab").click(function () {
    cargarJugadores("M");
  });

  $("#femenino-tab").click(function () {
    cargarJugadores("F");
  });

  $("#btnAbrirCrearJugador").click(function () {
    window.api.openCreateWindow();
  });
});
