// Definir la URL base de la API
const apiUrl = "http://127.0.0.1:8000/api/jugadores/";
const apiUrlEventos = "http://127.0.0.1:8000/api/eventos/";

// Variable global para almacenar el equipo actual
let equipoActual = "M"; 
let categoriaActual = ""
let subcategoriaActual ="";
async function getToken() {
  return await window.api.getToken(); // Obtiene el token desde el proceso principal
}

async function cargarJugadores(equipo = equipoActual, categoria = categoriaActual, subcategoria=subcategoriaActual, nombre="", edadMin="", edadMax="") {
  equipoActual = equipo;
  categoriaActual = categoria; // Guardar la categoría actual

  let url = apiUrl;
  let params = [];

  if (equipo) {
    params.push(`equipo=${equipo}`);
  }
  if (categoria) {
    params.push(`categoria=${categoria}`);
  }
  if (subcategoria) {
    params.push(`subcategoria=${subcategoria}`);
  }
  if(nombre) {
    params.push(`nombre=${nombre}`);
  }
  if(edadMin) {
    params.push(`edad_min=${edadMin}`);
  }
  if(edadMax) {
    params.push(`edad_max=${edadMax}`)
  }

  if (params.length > 0) {
    url += `?${params.join("&")}`;
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
        $("#jugadoresList").append(`
          <li class="list-group-item">
            <a href="#" onclick="detalleJugador(${jugador.id})">
              ${jugador.nombre} ${jugador.p_apellido} 
            </a> - ${jugador.posicion} - ${jugador.edad} años -  ${jugador.categoria} ${jugador.subcategoria}
            
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

  // Creamos un objeto FormData
  const formData = new FormData();

  // Añadimos los campos del formulario a FormData
  formData.append("nombre", $("#nombre").val());
  formData.append("primer_apellido", $("#p_apellido").val());
  formData.append("segundo_apellido", $("#s_apellido").val());
  formData.append("categoria", $("#categoria").val());
  formData.append("subcategoria", $("#subcategoria").val());
  formData.append("equipo", $("#equipo").val());
  formData.append("posicion", $("#posicion").val());
  formData.append("edad", $("#edad").val());

  // Si el campo de imagen tiene un archivo, lo añadimos al FormData
  const imagenFile = $("#imagen")[0].files[0];
  if (imagenFile) {
      formData.append("imagen", imagenFile);
  }

  // Obtener el token desde el almacenamiento de sesión
  const token = sessionStorage.getItem("access_token");

  // Hacemos la solicitud con FormData
  $.ajax({
      url: apiUrl, // Asegúrate de que apiUrl esté definida correctamente
      type: "POST",
      headers: {
          "Authorization": `Bearer ${token}`,
      },
      data: formData,
      contentType: false, // Importante para no establecer contentType automáticamente
      processData: false, // Importante para evitar que jQuery procese los datos
      success: function (data) {
          console.log("Jugador agregado con éxito:", data);
          cargarJugadores(); // Recargar la lista de jugadores
          modal.style.display = "none"; // Cerrar el modal
          $("#createJugadorForm")[0].reset(); // Limpiar el formulario
      },
      error: function (xhr, status, error) {
          console.error("Error al agregar jugador:", xhr.responseText);
          alert("Error al agregar jugador: " + xhr.responseText);
      }
  });
});

// Modal para editar un jugador
async function editarJugador(id) {
  const token = await getToken(); // Obtener el token antes de la solicitud

  $.ajax({
      url: `${apiUrl}${id}/`, // Asegurar que la URL tenga el formato correcto
      type: "GET",
      contentType: "application/json",
      headers: {
          "Authorization": token ? `Bearer ${token}` : "" // Incluir el token
      },
      success: function (jugador) {
          // Llenar los campos del formulario con los datos del jugador
          $("#editJugadorId").val(jugador.id);
          $("#editNombre").val(jugador.nombre);
          $("#editPApellido").val(jugador.p_apellido);
          $("#editSApellido").val(jugador.s_apellido);
          $("#editCategoria").val(jugador.categoria);
          $("#editSubcategoria").val(jugador.subcategoria);
          $("#editEquipo").val(jugador.equipo);
          $("#editPosicion").val(jugador.posicion);
          $("#editEdad").val(jugador.edad);

          // Mostrar el modal
          $("#editJugadorModal").show();
      },
      error: function (xhr, status, error) {
          console.error("Error al obtener los datos del jugador:", xhr.responseText);
          alert("Error al cargar los datos del jugador.");
      }
  });
}

$("#editJugadorForm").submit(function (event) {
  event.preventDefault();

  const id = $("#editJugadorId").val();
  const jugadorActualizado = {
      nombre: $("#editNombre").val(),
      p_apellido: $("#editPApellido").val(),
      s_apellido: $("#editSApellido").val(),
      categoria: $("#editCategoria").val(),
      subcategoria: $("#editSubcategoria").val(),
      equipo: $("#editEquipo").val(),
      posicion: $("#editPosicion").val(),
      edad: $("#editEdad").val(),
  };

  const token = sessionStorage.getItem("access_token");

  $.ajax({
      url: `${apiUrl}${id}/`,
      type: "PUT",
      contentType: "application/json",
      headers: {
          "Authorization": `Bearer ${token}`
      },
      data: JSON.stringify(jugadorActualizado),
      success: function (data) {
          console.log("Jugador actualizado con éxito:", data);
          cargarJugadores();
          $("#editJugadorModal").css("display", "none"); // Ocultar modal
      },
      error: function (xhr, status, error) {
          console.error("Error al actualizar jugador:", xhr.responseText);
          alert("Error al actualizar jugador: " + xhr.responseText);
      }
  });
});
$("#closeEditModal").click(function () {
  $("#editJugadorModal").hide();
});

window.onclick = function (event) {
  if (event.target == document.getElementById('editJugadorModal')) {
      document.getElementById('editJugadorModal').style.display = "none";
  }
  if (event.target == document.getElementById('createJugadorModal')) {
      document.getElementById('createJugadorModal').style.display = "none";
  }
};
// Eliminar un jugador
async function eliminarJugador(id) {
  const confirmacion = confirm(" Eliminar un jugador también borrará sus carpetas y PDFs asociados. ¿Estás seguro?");

  if (!confirmacion) {
    return; // Si el usuario cancela, no se realiza la eliminación
  }
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
  window.location.href = `detailJugador.html?id=${id}`;
}







// Lógica para manejar el cambio de pestaña (Masculino/Femenino)
$(document).ready(function () {
  let nombreActual="";
  let edadMinActual="";
  let edadMaxActual="";
  cargarJugadores(equipoActual,categoriaActual,subcategoriaActual,nombreActual,edadMinActual,edadMaxActual); // Cargar jugadores del equipo actual

  $("#nombreBuscar").on("input",function () {
    nombreActual = $(this).val();
    cargarJugadores(equipoActual,categoriaActual,subcategoriaActual,nombreActual,edadMinActual,edadMaxActual)
  });
  $("#edadMinBuscar").on("input", function () {
    edadMinActual = $(this).val();
    cargarJugadores(equipoActual,categoriaActual,nombreActual,edadMinActual,edadMaxActual);
  });
  $("#edadMaxBuscar").on("input", function () {
    edadMaxActual = $(this).val();
    cargarJugadores(equipoActual,categoriaActual,nombreActual,edadMinActual,edadMaxActual);
  })
  $("#masculino-tab").click(function () {
    cargarJugadores("M",categoriaActual,nombreActual,edadMinActual,edadMaxActual);
  });

  $("#femenino-tab").click(function () {
    cargarJugadores("F",categoriaActual,nombreActual,edadMinActual,edadMaxActual);
  });
  $("#categoriaSelect").change(function () {
    categoriaActual = $(this).val(); // Obtener la categoría seleccionada
    cargarJugadores(equipoActual,categoriaActual,nombreActual,edadMinActual,edadMaxActual); // Recargar la lista con el nuevo filtro
  });
  $("#subcategoriaSelect").change(function () {
    subcategoriaActual = $(this).val();
    cargarJugadores(equipoActual,categoriaActual,nombreActual,edadMinActual,edadMaxActual);
  })

  $("#btnAbrirCrearJugador").click(function () {
    window.api.openCreateWindow();
  });
});
