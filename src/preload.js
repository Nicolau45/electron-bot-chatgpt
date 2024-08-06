const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC methods to the renderer process
contextBridge.exposeInMainWorld('myAPI', {
  sendMessage: (message) => ipcRenderer.send('request-response', message),
  onResponse: (callback) => ipcRenderer.on('response-openai', (event, response) => callback(response)),
  startSTT: () => ipcRenderer.send('start-stt'),
  onSTTResponse: (callback) => ipcRenderer.on('stt-response', (event, response) => callback(response))
});
