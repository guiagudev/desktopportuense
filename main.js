const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fetch = require("node-fetch");

let mainWindow;
let editWindow;
let accessToken = null; // Variable global para almacenar el token

// Permitir que el frontend obtenga el token
ipcMain.handle("get-token", () => accessToken);

// Función para actualizar el token cuando el usuario inicie sesión
function setAccessToken(token) {
  accessToken = token;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false, // Evita el redimensionado
    maximizable: false, // Desactiva la maximización
    fullscreenable: false, // Evita pantalla completa
    frame: true, // Mantiene los botones de minimizar y cerrar
    transparent: true,
    autoHideMenuBar: true, // Oculta la barra de menú (opcional)
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "src", "templates", "index.html"));
}

// Evento para añadir un jugador
ipcMain.on("add-jugador", async (event, jugador) => {
  console.log("Jugador recibido en main.js:", jugador);

  if (!accessToken) {
    console.error("No hay token de acceso disponible");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/jugadores/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Se usa accessToken correctamente
      },
      body: JSON.stringify(jugador),
    });

    if (response.ok) {
      console.log("Jugador creado con éxito");
      mainWindow.webContents.send("jugador-actualizado");

      // Cerrar la ventana de edición si existe
      if (editWindow && !editWindow.isDestroyed()) {
        editWindow.close();
        editWindow = null;
      }
    } else {
      console.error("Error al crear jugador:", await response.text());
    }
  } catch (error) {
    console.error("Error al actualizar jugador:", error);
  }
});

app.whenReady().then(createMainWindow);
