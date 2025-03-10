const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openEditWindow: (id) => ipcRenderer.send('open-edit-window', id),
    openDetailWindow: (id) => ipcRenderer.send('open-detail-window', id),
    receiveJugadorData: (callback) => ipcRenderer.on('load-jugador-data', (event, data) => callback(data)),
    updateJugador: (jugador) => ipcRenderer.send('update-jugador', jugador),
    receiveJugadorActualizado: (callback) => ipcRenderer.on('jugador-actualizado', callback),
    openCreateWindow: () => ipcRenderer.send('open-create-window'),
    addJugador: (jugador) => ipcRenderer.send('add-jugador', jugador)
});
