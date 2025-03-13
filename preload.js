const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openEditWindow: (id,token) => ipcRenderer.send('open-edit-window', id,token),
    openDetailWindow: (id,token) => ipcRenderer.send('open-detail-window', id, token),
    openCreateWindow: () => ipcRenderer.send('open-create-window'),
    receiveJugadorData: (callback) => ipcRenderer.on('load-jugador-data', (event, data) => callback(data)),
    receiveJugadorActualizado: (callback) => ipcRenderer.on('jugador-actualizado', callback),
    updateJugador: (jugador,token) => ipcRenderer.send('update-jugador', jugador),
    addJugador: (jugador) => ipcRenderer.send('add-jugador', jugador),
    getToken: () => {return sessionStorage.getItem("access_token");},
    requestToken: () => ipcRenderer.invoke("get-token")
});
