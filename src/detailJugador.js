document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const jugadorId = parseInt(params.get("id"), 10);
    const carpetasUrl = 'http://127.0.0.1:8000/api/carpetas/';
    const jugadoresUrl = 'http://127.0.0.1:8000/api/jugadores/';

    if (!jugadorId) {
        console.error("ID del jugador no encontrado en la URL");
        return;
    }

    try {
        const token = await window.api.getToken();  

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
        document.getElementById("jugadorImagen").src = jugador.imagen_url;

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
                    li.id = `carpeta-${carpeta.id}`;
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

                    // Crear el nombre de la carpeta como un span inicialmente
                    const span = document.createElement("span");
                    span.textContent = carpeta.nombre;
                    span.id = `span-${carpeta.id}`;
                    span.classList.add("editable-span");
                    span.onclick = () => habilitarEdicion(carpeta.id, carpeta.nombre);

                    const btnGroup = document.createElement("div");

                    // Botón Eliminar
                    const btnEliminar = document.createElement("button");
                    btnEliminar.classList.add("btn", "btn-sm", "btn-danger");
                    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
                    btnEliminar.onclick = () => eliminarCarpeta(carpeta.id);

                    btnGroup.appendChild(btnEliminar);
                    li.appendChild(span);
                    li.appendChild(btnGroup);

                    listaCarpetas.appendChild(li);
                });
            } catch (error) {
                console.error("Error:", error);
            }
        }
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

        // Función para habilitar la edición
        async function habilitarEdicion(id, nombreActual) {
            const span = document.getElementById(`span-${id}`);
            const currentText = span.textContent;
            
            // Reemplazar el span por un input
            const input = document.createElement("input");
            input.type = "text";
            input.value = currentText;
            input.classList.add("form-control");
            input.onblur = () => guardarEdicion(id, input.value, span);  // Cuando se pierde el foco, guardar la edición
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    guardarEdicion(id, input.value, span);
                }
            };

            span.replaceWith(input);
            input.focus();
        }

        // Función para guardar la edición
        async function guardarEdicion(id, nuevoNombre, span) {
            if (!nuevoNombre || nuevoNombre.trim() === "") {
                alert("El nombre de la carpeta no puede estar vacío.");
                return;
            }

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

                // Reemplazar el input por el nuevo nombre
                const updatedSpan = document.createElement("span");
                updatedSpan.textContent = nuevoNombre;
                updatedSpan.classList.add("editable-span");
                updatedSpan.id = `span-${id}`;
                updatedSpan.onclick = () => habilitarEdicion(id, nuevoNombre); // Rehabilitar edición si se hace clic de nuevo

                span.replaceWith(updatedSpan);

                // Recargar carpetas
                await cargarCarpetas();

            } catch (error) {
                console.error("Error:", error);
            }
        }

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

                await cargarCarpetas();  // Recargar la lista automáticamente
            } catch (error) {
                console.error("Error:", error);
            }
        };

        // Cargar carpetas cuando se abra el modal o página
        cargarCarpetas();

    } catch (error) {
        console.error("Error:", error);
    }
});
