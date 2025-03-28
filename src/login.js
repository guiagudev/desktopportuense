// Función para manejar el login y guardar el token en sessionStorage
async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginUrl = "http://65.20.102.238:8000/api/token/";

  try {
      const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
          const data = await response.json();

          // Guardamos los tokens en sessionStorage
          sessionStorage.setItem("access_token", data.access);
          sessionStorage.setItem("refresh_token", data.refresh);

          // Limpiar los campos
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";

          // Ocultar el mensaje de error en caso de éxito
          document.getElementById("errorMessage").textContent = "";

          // Redirigir a la página de jugadores
          window.location.href = "jugadores.html";
      } else {
          const error = await response.json();
          document.getElementById("errorMessage").textContent = error.detail || "Credenciales incorrectas";
      }
  } catch (error) {
      console.error("Error al hacer login:", error);
      document.getElementById("errorMessage").textContent = "Error de conexión";
  }
}

// Añadir el evento al formulario de login
document.getElementById("loginForm").addEventListener("submit", handleLogin);

// Ocultar el mensaje de error si el usuario comienza a escribir
document.getElementById("username").addEventListener("input", () => {
  document.getElementById("errorMessage").textContent = "";
});

document.getElementById("password").addEventListener("input", () => {
  document.getElementById("errorMessage").textContent = "";
});
