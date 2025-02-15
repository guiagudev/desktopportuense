const { contextBridge, ipcRenderer } = require('electron');

// Exponer la API para abrir la ventana del formulario
contextBridge.exposeInMainWorld('api', {
    openFormWindow: () => ipcRenderer.send('open-form-window')
});
