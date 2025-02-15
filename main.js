const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let formWindow;  // Ventana del formulario

// Crear la ventana principal (index.html)
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,  // Habilitar nodeIntegration para usar Node.js en el proceso de renderizado
            contextIsolation: true,  // No usar aislamiento de contexto
            preload: path.join(__dirname, 'preload.js')  // Ruta al archivo preload.js
        }
    });

    // Cargar el archivo HTML de la ventana principal
    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

    // Cuando la ventana principal se cierre, terminar la aplicación
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Crear la ventana del formulario (form.html)
function createFormWindow() {
    formWindow = new BrowserWindow({
        width: 400,
        height: 300,
        modal: true,
        parent: mainWindow,  // La ventana principal será la ventana padre
        webPreferences: {
            nodeIntegration: true,  // Habilitar nodeIntegration
            contextIsolation: false,  // No usar aislamiento de contexto
            preload: path.join(__dirname, 'preload.js')  // Ruta al archivo preload.js
        }
    });

    // Cargar el formulario HTML
    formWindow.loadFile(path.join(__dirname, 'src', 'form.html'));
}

// Cuando la aplicación esté lista, creamos la ventana principal
app.whenReady().then(() => {
    createMainWindow();  // Cargar la ventana principal

    // Abre la ventana del formulario cuando el botón es clickeado
    ipcMain.on('open-form-window', () => {
        createFormWindow();
    });

    app.on('activate', () => {
        // Si no hay ventanas abiertas, abre la ventana principal
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Cerrar las ventanas cuando la aplicación se cierre
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
