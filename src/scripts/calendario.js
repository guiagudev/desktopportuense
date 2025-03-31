const apiUrlEventos = "http://127.0.0.1:8000/api/eventos/";

$(document).ready(function () {
  // Mostrar el calendario
  $("#calendar").fullCalendar({
    locale: "es", // Configuración del idioma en español
    header: {
      left: "prev,next today",
      center: "title",
      right: "month,agendaWeek,agendaDay",
    },
    events: async function (start, end, timezone, callback) {
      try {
        const token = await window.api.getToken();
        const response = await fetch(apiUrlEventos, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los eventos");
        }

        const data = await response.json();
        
        const eventos = data.map((evento) => ({
          title: `${evento.equipo1} vs ${evento.equipo2}`,
          start: evento.fecha,
          description: evento.descripcion,
          id: evento.id,
          color: evento.equipo1 === "R.C. Portuense" ||evento.equipo1 === "Racing Portuense" ||evento.equipo1 === "Portuense" ||evento.equipo2 === "R.C. Portuense" ||evento.equipo2 === "Racing Portuense" ||evento.equipo2 === "Portuense" ? "#FF5733" : "#007bff",
        }));

        callback(eventos);
      } catch (error) {
        console.error("Error al cargar los eventos:", error);
      }
    },
    eventClick: function (event) {
      // Abrir el modal de edición de evento
      openEditEventModal(event);
    },
    editable: true,
    droppable: true,
   
  });

  // Mostrar modal para crear nuevo evento
  $("#createNewEventBtn").click(function () {
    openCreateEventModal();
  });
  // Manejar la eliminación del evento
$("#deleteEventBtn").click(async function () {
const eventId = $("#editEventForm").data("eventId");

if (!eventId) {
alert("No se encontró el evento para eliminar.");
return;
}

const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este evento?");
if (!confirmDelete) return;

try {
const token = sessionStorage.getItem("access_token");

const response = await fetch(`${apiUrlEventos}${eventId}/`, {
method: "DELETE",
headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json",
},
});

if (!response.ok) {
throw new Error("Error al eliminar el evento.");
}

$("#editEventModal").modal("hide");
$("#calendar").fullCalendar("refetchEvents"); // Refrescar calendario después de borrar
} catch (error) {
alert("Error al eliminar el evento: " + error.message);
}
});

  // Manejar el formulario de creación de eventos
  $("#createEventForm").submit(async function (event) {
    event.preventDefault(); // Evitar recarga de la página

    const evento = {
      equipo1: $("#equipo1").val(),
      equipo2: $("#equipo2").val(),
      descripcion: $("#eventDescription").val(),
      fecha: new Date($("#eventDate").val()).toISOString(),
    };

    try {
      const token = sessionStorage.getItem("access_token");

      const response = await fetch(apiUrlEventos, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(evento),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      $("#createEventModal").modal("hide");
      $("#calendar").fullCalendar("refetchEvents"); // Recargar el calendario
    } catch (error) {
      alert("Error al crear el evento: " + error.message);
    }
  });

  // Manejar el formulario de edición de eventos
  $("#editEventForm").submit(async function (event) {
    event.preventDefault(); // Evitar recarga de la página

    const eventId = $("#editEventForm").data("eventId");
    const evento = {
      equipo1: $("#editEquipo1").val(),
      equipo2: $("#editEquipo2").val(),
      descripcion: $("#editEventDescription").val(),
      fecha: new Date($("#editEventDate").val()).toISOString(),
    };

    try {
      const token = sessionStorage.getItem("access_token");

      const response = await fetch(`${apiUrlEventos}${eventId}/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(evento),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      $("#editEventModal").modal("hide");
      $("#calendar").fullCalendar("refetchEvents"); // Recargar el calendario
    } catch (error) {
      alert("Error al editar el evento: " + error.message);
    }
  });
});

function openCreateEventModal(date = null) {
  $("#createEventModal").modal("show");
  if (date) {
    $("#eventDate").val(date.format("YYYY-MM-DDTHH:mm"));
  }
}

function openEditEventModal(event) {
  $("#editEventModal").modal("show");
  $("#editEquipo1").val(event.title.split(" vs ")[0]);
  $("#editEquipo2").val(event.title.split(" vs ")[1]);
  $("#editEventDescription").val(event.description);
  $("#editEventDate").val(moment(event.start).format("YYYY-MM-DDTHH:mm"));
  $("#editEventForm").data("eventId", event.id);
}
