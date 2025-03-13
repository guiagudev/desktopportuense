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

  const token = sessionStorage.getItem("access_token"); // Obtener el token

  console.log("Token enviado", token);

  $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json",
      headers: {
          "Authorization": `Token ${token}`  // 🔹 Agregar el token aquí
      },
      data: JSON.stringify(nuevoJugador),
      success: function () {
          cargarJugadores(); // Recarga la lista de jugadores
          $("#addJugadorForm")[0].reset();
      },
      error: function (xhr, status, error) {
          console.error("Error al agregar jugador:", xhr.responseText);
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
