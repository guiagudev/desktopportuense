document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const jugadorId = parseInt(params.get("id"), 10);
    const carpetasUrl = 'http://127.0.0.1:8000/api/carpetas/';
    const jugadoresUrl = 'http://127.0.0.1:8000/api/jugadores/';
    const pdfsUrl = 'http://127.0.0.1:8000/api/pdfs/'; // Endpoint para PDFs
    let carpetaSeleccionada = null;

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

        // Mostrar los datos del jugador en la interfaz
        document.getElementById("jugadorTitle").textContent = `Detalles de ${jugador.nombre}`;
        document.getElementById("jugadorNombre").textContent = jugador.nombre;
        document.getElementById("jugadorEquipo").textContent = jugador.equipo;
        document.getElementById("jugadorCategoria").textContent = jugador.categoria;
        document.getElementById("jugadorSubcategoria").textContent = jugador.subcategoria;
        document.getElementById("jugadorPosicion").textContent = jugador.posicion;
        document.getElementById("jugadorImagen").src = jugador.imagen;
        async function abrirModalPDFs(carpetaId) {
            carpetaSeleccionada = carpetaId;
            document.getElementById("pdfList").innerHTML = "<li class='list-group-item'>Cargando...</li>";
            document.getElementById("previewContainer").style.display = "none"; // Ocultar vista previa
        
            try {
                const response = await fetch(`${pdfsUrl}?carpeta_id=${carpetaId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
        
                if (!response.ok) throw new Error("Error obteniendo PDFs");
        
                const pdfs = await response.json();
                console.log("Respuesta de PDFs:", pdfs);  // Verifica la respuesta
        
                const pdfList = document.getElementById("pdfList");
                pdfList.innerHTML = ""; // Limpiar la lista
        
                pdfs.forEach(pdf => {
                    console.log(pdf);  // Verifica cada objeto de PDF
                    const li = document.createElement("li");
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        
                    const link = document.createElement("a");
                    link.href = "#";
                    link.textContent = pdf.nombre;  // El nombre del PDF
                    link.onclick = (e) => {
                        e.preventDefault();
                        descargarPDF(pdf.archivo, pdf.nombre);  // Llamar a la función para descargar
                    };

                    link.setAttribute("download", pdf.nombre);
        
                    const btnEliminar = document.createElement("button");
                    btnEliminar.classList.add("btn", "btn-sm", "btn-danger");
                    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
                    btnEliminar.onclick = () => eliminarPDF(pdf.id);
        
                    li.appendChild(link);
                    li.appendChild(btnEliminar);
                    pdfList.appendChild(li);
                });
        
                const modal = new bootstrap.Modal(document.getElementById("pdfsModal"));
                modal.show();
            } catch (error) {
                console.error("Error al cargar PDFs:", error);
            }
        }
       
       
        async function descargarPDF(pdfUrl, nombre) {
            try {
                // Hacemos la solicitud al servidor para obtener el archivo
                const response = await fetch(pdfUrl, {
                    headers: {
                        "Authorization": `Bearer ${token}`  // Asegúrate de que el token esté presente si es necesario
                    }
                });
        
                if (!response.ok) throw new Error("Error al obtener el archivo");
        
                // Convertimos el archivo a Blob
                const blob = await response.blob();
        
                // Creamos un enlace para descargar el archivo
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);  // Creamos un URL del Blob
                link.download = nombre; 
                 // Usamos el nombre del archivo para la descarga
        
                // Hacemos que el enlace haga clic automáticamente para iniciar la descarga
                link.click();
                alert(`El archivo "${nombre}" se ha descargado exitosamente.`);
            } catch (error) {
                console.error("Error al descargar el PDF:", error);
            }
        }
        

        // Función para cargar las carpetas del jugador
        async function cargarCarpetas() {
            try {
                const response = await fetch(`${carpetasUrl}?jugador_id=${jugadorId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Error obteniendo carpetas");

                const carpetas = await response.json();
                const listaCarpetas = document.getElementById("listaCarpetas");
                listaCarpetas.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

                carpetas.forEach(carpeta => {
                    const li = document.createElement("li");
                    li.id = `carpeta-${carpeta.id}`;
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                
                    // Nombre de la carpeta
                    const span = document.createElement("span");
                    span.textContent = carpeta.nombre;
                    span.id = `span-${carpeta.id}`;
                    span.classList.add("editable-span");
                    span.onclick = () => habilitarEdicion(carpeta.id, carpeta.nombre);
                
                    const btnGroup = document.createElement("div");
                
                    // Botón para ver PDFs de la carpeta
                    const btnVerPDFs = document.createElement("button");
                    btnVerPDFs.classList.add("btn", "btn-sm", "btn-primary", "me-2");
                    btnVerPDFs.innerHTML = '<i class="bi bi-file-earmark-pdf"></i>';
                    btnVerPDFs.onclick = () => abrirModalPDFs(carpeta.id);
                
                    // Botón para eliminar carpeta
                    const btnEliminar = document.createElement("button");
                    btnEliminar.classList.add("btn", "btn-sm", "btn-danger");
                    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
                    btnEliminar.onclick = () => eliminarCarpeta(carpeta.id);
                
                    btnGroup.appendChild(btnVerPDFs);
                    btnGroup.appendChild(btnEliminar);
                
                    li.appendChild(span);
                    li.appendChild(btnGroup);
                
                    listaCarpetas.appendChild(li);
                });
                
            } catch (error) {
                console.error("Error al cargar carpetas:", error);
            }
        }

        // Función para crear una nueva carpeta
       // Función para crear una nueva carpeta
window.crearCarpeta = async function () {
    const nombre = document.getElementById("nuevaCarpetaNombre").value.trim();
    if (!nombre) {
        alert("El nombre de la carpeta no puede estar vacío");
        return;
    }

    // Deshabilitar el botón y la entrada mientras se crea la carpeta
    const btnCrear = document.querySelector("button[onclick='crearCarpeta()']");
    const inputNombre = document.getElementById("nuevaCarpetaNombre");

    console.log("Deshabilitando el formulario de creación de carpeta...");
    console.log("Estado del botón 'Crear': Deshabilitado");
    console.log("Estado del campo de entrada 'Nombre de carpeta': Deshabilitado");

    btnCrear.disabled = true;
    inputNombre.disabled = true;

    try {
        const response = await fetch(carpetasUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ jugador: jugadorId, nombre })
        });

        if (!response.ok) throw new Error("Error creando carpeta");

        console.log("Carpeta creada correctamente");

        // Limpiar el campo de entrada y volver a habilitar el botón
        document.getElementById("nuevaCarpetaNombre").value = "";
        
        console.log("Rehabilitando el formulario de creación de carpeta...");
        console.log("Estado del botón 'Crear': Habilitado");
        console.log("Estado del campo de entrada 'Nombre de carpeta': Habilitado");
        
        cargarCarpetas();  // Actualizar lista de carpetas sin necesidad de recargar toda la página
    } catch (error) {
        console.error("Error al crear carpeta:", error);
    } finally {
        // Volver a habilitar el botón y la entrada
        btnCrear.disabled = false;
        inputNombre.disabled = false;
        
        console.log("Formulario de creación de carpeta restaurado.");
    }
};
document.getElementById("subirPDFBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file || !carpetaSeleccionada) {
        alert("Selecciona un archivo y una carpeta válida.");
        return;
    }

    const formData = new FormData();
    formData.append("carpeta", carpetaSeleccionada);
    formData.append("archivo", file);

    try {
        const response = await fetch(pdfsUrl, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) throw new Error("Error subiendo el PDF");

        alert("PDF subido correctamente");
        fileInput.value = "";  // Limpiar el input
        abrirModalPDFs(carpetaSeleccionada); // Recargar la lista de PDFs
    } catch (error) {
        console.error("Error al subir PDF:", error);
    }
});
async function eliminarPDF(id) {
    if (!confirm("¿Seguro que deseas eliminar este PDF?")) return;

    try {
        const response = await fetch(`${pdfsUrl}${id}/`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Error eliminando PDF");

        alert("PDF eliminado correctamente");
        abrirModalPDFs(carpetaSeleccionada); // Recargar la lista de PDFs
    } catch (error) {
        console.error("Error al eliminar PDF:", error);
    }
}

// Función para eliminar una carpeta
window.eliminarCarpeta = async function (id) {
    console.log(`Intentando eliminar la carpeta con ID: ${id}`);

    if (!confirm("¿Estás seguro de que deseas eliminar esta carpeta?")) {
        console.log(`Eliminación de carpeta cancelada para ID: ${id}`);
        return;
    }

    try {
        console.log(`Enviando solicitud de eliminación para la carpeta con ID: ${id}`);

        const response = await fetch(`${carpetasUrl}${id}/`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Error eliminando carpeta");

        console.log(`Carpeta con ID: ${id} eliminada correctamente`);

        // Recargar la lista después de eliminar
        console.log("Recargando la lista de carpetas...");
        cargarCarpetas();  // Actualizar lista automáticamente
    } catch (error) {
        console.error(`Error al eliminar la carpeta con ID: ${id}`, error);
    } finally {
        console.log("Proceso de eliminación finalizado.");
    }

    // Después de la eliminación, re-habilitar el formulario de crear carpeta si es necesario
    const btnCrear = document.querySelector("button[onclick='crearCarpeta()']");
    const inputNombre = document.getElementById("nuevaCarpetaNombre");

    // Si el formulario fue deshabilitado durante la eliminación, lo volvemos a habilitar
    if (btnCrear.disabled || inputNombre.disabled) {
        console.log("Restaurando formulario de creación de carpeta después de la eliminación...");
        btnCrear.disabled = false;
        inputNombre.disabled = false;

        console.log("Formulario de creación de carpeta restaurado.");
        console.log("Estado del botón 'Crear': Habilitado");
        console.log("Estado del campo de entrada 'Nombre de carpeta': Habilitado");
    }
};


        // Función para habilitar la edición del nombre de la carpeta
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

        // Función para guardar la edición del nombre de la carpeta
        async function guardarEdicion(id, nuevoNombre, span) {
            if (!nuevoNombre || nuevoNombre.trim() === "") {
                alert("El nombre de la carpeta no puede estar vacío.");
                return;
            }

            try {
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
            } catch (error) {
                console.error("Error al guardar edición:", error);
            }
        }

        // Función para eliminar una carpeta
       // Función para eliminar una carpeta
window.eliminarCarpeta = async function (id) {
    console.log(`Intentando eliminar la carpeta con ID: ${id}`);

    if (!confirm("¿Estás seguro de que deseas eliminar esta carpeta?")) {
        console.log(`Eliminación de carpeta cancelada para ID: ${id}`);
        return;
    }

    try {
        console.log(`Enviando solicitud de eliminación para la carpeta con ID: ${id}`);

        const response = await fetch(`${carpetasUrl}${id}/`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Error eliminando carpeta");

        console.log(`Carpeta con ID: ${id} eliminada correctamente`);

        // Recargar la lista después de eliminar
        console.log("Recargando la lista de carpetas...");
        cargarCarpetas();  // Actualizar lista automáticamente
    } catch (error) {
        console.error(`Error al eliminar la carpeta con ID: ${id}`, error);
    } finally {
        console.log("Proceso de eliminación finalizado.");
    }
};


        // Cargar carpetas cuando se abra el modal o página
        cargarCarpetas();

    } catch (error) {
        console.error("Error general:", error);
    }
});
