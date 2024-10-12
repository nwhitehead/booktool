import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    generatePDF: (contents) => ipcRenderer.invoke('generatePDF', contents),
    render: (payload) => ipcRenderer.invoke('render', payload),
});
