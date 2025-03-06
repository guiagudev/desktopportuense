document.addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1:8000/api/jugadores/opciones/")
        .then(response => response.json())
        .then(data => {
            const selectCategoria = document.getElementById("categoria");
            const selectSubcategoria = document.getElementById("subcategoria");
            const equipoRadioContainer = document.getElementById("equipo-radio-buttons");

            // Llenar el dropdown de categorías
            data.categorias.forEach(categoria => {
                let option = document.createElement("option");
                option.value = categoria[0];  
                option.textContent = categoria[1];  
                selectCategoria.appendChild(option);
            });

            // Llenar el dropdown de subcategorías
            data.subcategorias.forEach(subcategoria => {
                let option = document.createElement("option");
                option.value = subcategoria[0];  
                option.textContent = subcategoria[1];  
                selectSubcategoria.appendChild(option);
            });

            // Llenar los radio buttons de equipos
            data.equipos.forEach(equipo => {
                let label = document.createElement("label");
                let radioButton = document.createElement("input");
                
                radioButton.type = "radio";  // Usamos radio button para solo permitir una selección
                radioButton.name = "equipo";  // Todos tienen el mismo nombre, lo que asegura que solo uno sea seleccionable
                radioButton.value = equipo[0];  // El valor de cada equipo ('M' o 'F')
                
                label.appendChild(radioButton);
                label.appendChild(document.createTextNode(" " + equipo[1]));  // El nombre del equipo
                equipoRadioContainer.appendChild(label);
                equipoRadioContainer.appendChild(document.createElement("br"));
            });
        })
        .catch(error => console.error("Error cargando opciones:", error));
});

window.api.receiveJugadorData((jugador) => {
    document.getElementById('jugador-id').value = jugador.id;
    document.getElementById('nombre').value = jugador.nombre;
    document.getElementById('p_apellido').value = jugador.p_apellido;
    document.getElementById('s_apellido').value = jugador.s_apellido;
    document.getElementById('categoria').value = jugador.categoria;
    document.getElementById('subcategoria').value = jugador.subcategoria;

    // Seleccionar el equipo del jugador
    const equipoRadios = document.querySelectorAll('input[name="equipo"]');
    equipoRadios.forEach(radio => {
        if (radio.value === jugador.equipo) {
            radio.checked = true;  // Marcar el radio button correspondiente
        }
    });

    document.getElementById('posicion').value = jugador.posicion;
    document.getElementById('edad').value = jugador.edad;
});

document.getElementById('edit-form').addEventListener('submit',(e) => {
    e.preventDefault();
    const id = document.getElementById('jugador-id').value;
    const nombre = document.getElementById('nombre').value;
    const p_apellido = document.getElementById('p_apellido').value;
    const s_apellido = document.getElementById('s_apellido').value;
    const categoria = document.getElementById('categoria').value;
    const subcategoria = document.getElementById('subcategoria').value;

    // Obtener el valor del equipo seleccionado (radio button)
    const equipo = document.querySelector('input[name="equipo"]:checked')?.value;

    const posicion = document.getElementById('posicion').value;
    const edad = document.getElementById('edad').value;
    
    const jugadorActualizado = { id, nombre, p_apellido, s_apellido, categoria, subcategoria, equipo, posicion, edad };
    console.log("Enviando jugador actualizado", jugadorActualizado);
    window.api.updateJugador(jugadorActualizado);
});
