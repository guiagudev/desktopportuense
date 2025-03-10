const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openEditWindow: (id) => ipcRenderer.send('open-edit-window', id),
    openDetailWindow: (id) => ipcRenderer.send('open-detail-window', id),
    openCreateWindow: () => ipcRenderer.send('open-create-window'),
    receiveJugadorData: (callback) => ipcRenderer.on('load-jugador-data', (event, data) => callback(data)),
    receiveJugadorActualizado: (callback) => ipcRenderer.on('jugador-actualizado', callback),
    updateJugador: (jugador) => ipcRenderer.send('update-jugador', jugador),
    addJugador: (jugador) => ipcRenderer.send('add-jugador', jugador)
});
