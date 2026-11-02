const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('starlitDesktop', {
  platform: process.platform,
  pairingInfo: () => ipcRenderer.invoke('pairing-info'),
  windowControl: action => ipcRenderer.invoke('window-control', action),
  windowState: () => ipcRenderer.invoke('window-state'),
  ...(process.platform === 'win32' ? {
    updateDownload: release => ipcRenderer.invoke('update-download', release),
    updateInstall: () => ipcRenderer.invoke('update-install'),
    onUpdateState: callback => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('update-state', listener);
    return () => ipcRenderer.removeListener('update-state', listener);
  },
  onWindowState: callback => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('window-state', listener);
    return () => ipcRenderer.removeListener('window-state', listener);
    },
  } : {}),
});
