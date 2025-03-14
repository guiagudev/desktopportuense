// Definir la URL base de la API
const apiUrl = "http://127.0.0.1:8000/api/jugadores/";

// Variable global para almacenar el equipo actual
let equipoActual = "M"; 

async function getToken() {
  return await window.api.getToken(); // Obtiene el token desde el proceso principal
}

async function cargarJugadores(equipo = equipoActual) {
  equipoActual = equipo;
  let url = apiUrl;
  if (equipo) {
    url += `?equipo=${equipo}`;
  }

  try {
    const token = await getToken(); // Obtiene el token antes de hacer la solicitud

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar los jugadores");
    }

    const data = await response.json();

    // Mostrar los jugadores en la lista
    $("#jugadoresList").empty();
    if (data.length === 0) {
      $("#jugadoresList").html("<li class='list-group-item'>No hay jugadores disponibles.</li>");
    } else {
      data.forEach((jugador) => {
        const segundoApellido = jugador.s_apellido ? jugador.s_apellido : "";
        $("#jugadoresList").append(`
          <li class="list-group-item">
            <a href="#" onclick="detalleJugador(${jugador.id})">
              ${jugador.nombre} ${jugador.p_apellido} ${segundoApellido}
            </a> - ${jugador.posicion} - ${jugador.edad} años -  ${jugador.categoria}

            
            <button class="btn btn-primary btn-sm float-right" onclick="editarJugador(${jugador.id})">Editar</button>
            <button class="btn btn-danger btn-sm float-right ml-2" onclick="eliminarJugador(${jugador.id})">Eliminar</button>
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

// renderer.js
const modal = document.getElementById('createJugadorModal');
const btn = document.getElementById('openModalBtn'); // Botón para abrir el modal
const span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$("#createJugadorForm").submit(function (event) {
    event.preventDefault();

    const nuevoJugador = {
        nombre: $("#nombre").val(),
        primer_apellido: $("#p_apellido").val(),
        segundo_apellido: $("#s_apellido").val(),
        categoria: $("#categoria").val(),
        subcategoria: $("#subcategoria").val(),
        equipo: $("#equipo").val(),
        posicion: $("#posicion").val(),
        edad: $("#edad").val(),
    };
    console.log("Primer apellido:", nuevoJugador.p_apellido);
    const token = sessionStorage.getItem("access_token");

    $.ajax({
        url: apiUrl, // Asegúrate de que apiUrl esté definida correctamente
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify(nuevoJugador),
        success: function (data) {
            console.log("Jugador agregado con éxito:", data);
            cargarJugadores(); // Recarga la lista de jugadores
            modal.style.display = "none"; // Cerrar el modal
            $("#createJugadorForm")[0].reset(); // Limpiar el formulario
        },
        error: function (xhr, status, error) {
            console.error("Error al agregar jugador:", xhr.responseText);
            alert("Error al agregar jugador: " + xhr.responseText);
        }
    });
});

// Eliminar un jugador
async function eliminarJugador(id) {
  const token =  await getToken();
  $.ajax({
    url: `${apiUrl}${id}/`,
    type: "DELETE",
    headers: {
      "Authorization": token ? `Bearer ${token}` : ""  // Incluye el token en los headers
    },
    success: function () {
      cargarJugadores(); // Se recarga con el equipo actual
    },
  });
}

async function detalleJugador(id) {
  console.log("Página de jugador con ID: ", id);
  const token = await getToken();
  window.api.openDetailWindow(id,token);
}

// Editar un jugador
async function editarJugador(id) {
  console.log("Editando jugador con ID:", id);
  const token = await getToken();
  window.api.openEditWindow(id,token);
  
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
