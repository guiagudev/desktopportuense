const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

let mainWindow;
let editWindow;

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

function createJugadorWindow(jugador) {
    editWindow = new BrowserWindow({
        width: 400,
        height: 300,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    editWindow.loadFile(path.join(__dirname, 'src', 'createForm.html'));

    editWindow.webContents.once('did-finish-load', () => {
        editWindow.webContents.send('load-jugador-data', jugador);
    });
}
function createEditWindow(jugador) {
    editWindow = new BrowserWindow({
        width: 400,
        height: 300,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    editWindow.loadFile(path.join(__dirname, 'src', 'editForm.html'));

    editWindow.webContents.once('did-finish-load', () => {
        editWindow.webContents.send('load-jugador-data', jugador);
    });
}
ipcMain.on('open-create-window', () => {
    createJugadorWindow();
});
ipcMain.on('add-jugador', async (event, jugador) => {
    console.log("Jugador recibido en main.js:", jugador);

    
    try {
        const response = await fetch(`http://localhost:8000/api/jugadores/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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


ipcMain.on('open-edit-window', async (event, jugadorId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/jugadores/${jugadorId}/`);
        const jugador = await response.json();
        createEditWindow(jugador);
    } catch (error) {
        console.error("Error al cargar jugador:", error);
    }
});

ipcMain.on('update-jugador', async (event, jugador) => {
    try {
        const response = await fetch(`http://localhost:8000/api/jugadores/${jugador.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jugador)
        });

        if (response.ok) {
            mainWindow.webContents.send('jugador-actualizado');
            editWindow.close();
        }
    } catch (error) {
        console.error("Error al actualizar jugador:", error);
    }
});

app.whenReady().then(createMainWindow);
