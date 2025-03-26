const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

let mainWindow;
let editWindow;
let accessToken = null; // Variable en el proceso principal para almacenar el token

ipcMain.handle("get-token", () => {
  return accessToken;
});

// (Opcional) Cuando el usuario inicie sesión, guarda el token en esta variable
function setAccessToken(token) {
  accessToken = token;
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}
ipcMain.on('add-jugador', async (event, jugador) => {
    console.log("Jugador recibido en main.js:", jugador);

    
    try {
        const response = await fetch(`http://localhost:8000/api/jugadores/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jugador),
        });

        if (response.ok) {
            console.log("jugador creado con éxito");
            mainWindow.webContents.send('jugador-actualizado');
            if (editWindow && !editWindow.isDestroyed()) {
                editWindow.close();  // Cerramos la ventana solo si no ha sido destruida
            }
        }
    } catch (error) {
        console.error("Error al actualizar jugador:", error);
    }

    // Notificar a la ventana principal que se ha añadido un nuevo jugador
    

    
});




app.whenReady().then(createMainWindow);
