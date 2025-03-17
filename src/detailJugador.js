document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const jugadorId = params.get("id");
    const carpetasUrl = 'http://127.0.0.1:8000/api/carpetas/';
    const jugadoresUrl = 'http://127.0.0.1:8000/api/jugadores/';

    if (!jugadorId) {
        console.error("ID del jugador no encontrado en la URL");
        return;
    }

    try {
        const token = await window.api.getToken();  

        // Obtener detalles del jugador
        const responseJugador = await fetch(`${jugadoresUrl}${jugadorId}/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!responseJugador.ok) throw new Error("Error obteniendo los datos del jugador");

        const jugador = await responseJugador.json();

        document.getElementById("jugadorTitle").textContent = `Detalles de ${jugador.nombre}`;
        document.getElementById("jugadorNombre").textContent = jugador.nombre;
        document.getElementById("jugadorEquipo").textContent = jugador.equipo;
        document.getElementById("jugadorCategoria").textContent = jugador.categoria;
        document.getElementById("jugadorSubcategoria").textContent = jugador.subcategoria;
        document.getElementById("jugadorPosicion").textContent = jugador.posicion;
        document.getElementById("jugadorImagen").src = jugador.imagen_url || "ruta_default.jpg";

        // Función para cargar carpetas
        async function cargarCarpetas() {
            try {
                const response = await fetch(`${carpetasUrl}?jugador_id=${jugadorId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Error obteniendo carpetas");

                const carpetas = await response.json();
                const listaCarpetas = document.getElementById("listaCarpetas");
                listaCarpetas.innerHTML = "";

                carpetas.forEach(carpeta => {
                    const li = document.createElement("li");
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

                    const span = document.createElement("span");
                    span.textContent = carpeta.nombre;

                    const btnGroup = document.createElement("div");

                    // Botón Editar
                    const btnEditar = document.createElement("button");
                    btnEditar.classList.add("btn", "btn-sm", "btn-warning", "me-2");
                    btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
                    btnEditar.onclick = () => editarCarpeta(carpeta.id, carpeta.nombre);

                    // Botón Eliminar
                    const btnEliminar = document.createElement("button");
                    btnEliminar.classList.add("btn", "btn-sm", "btn-danger");
                    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
                    btnEliminar.onclick = () => eliminarCarpeta(carpeta.id);

                    btnGroup.appendChild(btnEditar);
                    btnGroup.appendChild(btnEliminar);

                    li.appendChild(span);
                    li.appendChild(btnGroup);

                    listaCarpetas.appendChild(li);
                });
            } catch (error) {
                console.error("Error:", error);
            }
        }

        // Crear carpeta
        window.crearCarpeta = async function () {
            const nombre = document.getElementById("nuevaCarpetaNombre").value.trim();
            if (!nombre) {
                alert("El nombre de la carpeta no puede estar vacío");
                return;
            }

            try {
                const token = await window.api.getToken();
                const response = await fetch(carpetasUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ jugador: jugadorId, nombre })
                });

                if (!response.ok) throw new Error("Error creando carpeta");

                document.getElementById("nuevaCarpetaNombre").value = "";
                cargarCarpetas();  // Actualizar lista
            } catch (error) {
                console.error("Error:", error);
            }
        };

        // Editar carpeta
        window.editarCarpeta = async function (id, nombreActual) {
            const nuevoNombre = prompt("Nuevo nombre de la carpeta:", nombreActual);
            if (!nuevoNombre || nuevoNombre.trim() === "") return;

            try {
                const token = await window.api.getToken();
                const response = await fetch(`${carpetasUrl}${id}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ nombre: nuevoNombre })
                });

                if (!response.ok) throw new Error("Error editando carpeta");

                cargarCarpetas();  // Actualizar lista
            } catch (error) {
                console.error("Error:", error);
            }
        };

        // Eliminar carpeta
        window.eliminarCarpeta = async function (id) {
            if (!confirm("¿Estás seguro de que deseas eliminar esta carpeta?")) return;

            try {
                const token = await window.api.getToken();
                const response = await fetch(`${carpetasUrl}${id}/`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Error eliminando carpeta");

                cargarCarpetas();  // Actualizar lista
            } catch (error) {
                console.error("Error:", error);
            }
        };

        // Evento para abrir el modal y cargar carpetas
        const btnAbrirCarpetas = document.querySelector("[data-bs-target='#carpetasModal']");
        if (btnAbrirCarpetas) {
            btnAbrirCarpetas.addEventListener("click", cargarCarpetas);
        } else {
            console.error("Botón para abrir carpetas no encontrado.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
});
