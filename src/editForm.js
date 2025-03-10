document.addEventListener("DOMContentLoaded", () => {
    // Obtener las opciones de categorías, subcategorías y equipos del backend
    fetch("http://127.0.0.1:8000/api/jugadores/opciones/")
        .then(response => response.json())
        .then(data => {
            const selectCategoria = document.getElementById("categoria");
            const selectSubcategoria = document.getElementById("subcategoria");
            const equipoRadios = document.getElementById("equipo-radio-buttons");

            // Llenar el dropdown de categorías
            data.categorias.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria[0];
                option.textContent = categoria[1];
                selectCategoria.appendChild(option);
            });

            // Llenar el dropdown de subcategorías
            data.subcategorias.forEach(subcategoria => {
                const option = document.createElement("option");
                option.value = subcategoria[0];
                option.textContent = subcategoria[1];
                selectSubcategoria.appendChild(option);
            });

            // Llenar los radio buttons de equipos
            data.equipos.forEach(equipo => {
                const label = document.createElement("label");
                const radioButton = document.createElement("input");

                radioButton.type = "radio"; // Usamos radio button para solo permitir una selección
                radioButton.name = "equipo"; // Todos tienen el mismo nombre, lo que asegura que solo uno sea seleccionable
                radioButton.value = equipo[0]; // El valor de cada equipo ('M' o 'F')

                label.appendChild(radioButton);
                label.appendChild(document.createTextNode(" " + equipo[1])); // El nombre del equipo
                equipoRadios.appendChild(label);
                equipoRadios.appendChild(document.createElement("br"));
            });
        })
        .catch(error => console.error("Error cargando opciones:", error));
});

window.api.receiveJugadorData((jugador) => {
    console.log("Datos del jugador recibido:", jugador);
    console.log("Categoría recibida:", jugador.categoria);
    console.log("Subcategoría recibida:", jugador.subcategoria);

    document.getElementById('jugador-id').value = jugador.id;
    document.getElementById('nombre').value = jugador.nombre;
    document.getElementById('p_apellido').value = jugador.p_apellido;
    document.getElementById('s_apellido').value = jugador.s_apellido;

    const categoriaSelect = document.getElementById('categoria');
    if (categoriaSelect) {
        console.log("Intentando asignar categoría:", jugador.categoria);
        [...categoriaSelect.options].forEach(option => {
            if (option.value === jugador.categoria) {
                option.selected = true;
            }
        });
    } else {
        console.error("Elemento #categoria no encontrado en el DOM.");
    }

    const subcategoriaSelect = document.getElementById('subcategoria');
    if (subcategoriaSelect) {
        console.log("Intentando asignar subcategoría:", jugador.subcategoria);
        [...subcategoriaSelect.options].forEach(option => {
            if (option.value === jugador.subcategoria) {
                option.selected = true;
            }
        });
    } else {
        console.error("Elemento #subcategoria no encontrado en el DOM.");
    }

    // Establecer el radio button del equipo correctamente
    const equipoRadios = document.querySelectorAll('input[name="equipo"]');
    equipoRadios.forEach(radio => {
        if (radio.value === jugador.equipo) {
            radio.checked = true;
        }
    });

    document.getElementById('posicion').value = jugador.posicion;
    document.getElementById('edad').value = jugador.edad;
});

