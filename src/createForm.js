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
document.getElementById('create-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const p_apellido = document.getElementById('p_apellido').value;
    const s_apellido = document.getElementById('s_apellido').value;
    const categoria = document.getElementById('categoria').value;
    const subcategoria = document.getElementById('subcategoria').value;
    const equipo = document.querySelector('input[name="equipo"]:checked')?.value;

    if (!equipo) {
        alert("Por favor, selecciona un equipo.");
        return;  // Detiene el envío si no se seleccionó ningún equipo
    }
    const posicion = document.getElementById('posicion').value;
    const edad = document.getElementById('edad').value;
    
    const nuevoJugador = { nombre, p_apellido, s_apellido, categoria, subcategoria, equipo, posicion, edad };

    
    console.log("Enviando nuevo jugador", nuevoJugador);
    
    // Enviar jugador al proceso principal
    window.api.addJugador(nuevoJugador);

    // Cerrar ventana después de enviar los datos
    window.close();
});
