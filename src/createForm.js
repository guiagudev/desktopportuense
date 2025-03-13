
// Función para obtener el token desde localStorage
function getToken() {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
}

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

    // Obtener el token
    const token = getToken();
    
    if (!token) {
        alert("No se ha encontrado un token válido. Por favor, inicia sesión.");
        return;
    }

    // Hacer la solicitud POST para crear el jugador, incluyendo el token en los headers
    fetch("http://127.0.0.1:8000/api/jugadores/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(nuevoJugador)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Jugador creado:", data);
        window.api.addJugador(nuevoJugador);  // Llama al proceso principal para agregar el jugador

        // Cerrar ventana después de enviar los datos
        window.close();
    })
    .catch(error => {
        console.error("Error al agregar el jugador:", error);
        alert("Hubo un error al agregar el jugador.");
    });
});
