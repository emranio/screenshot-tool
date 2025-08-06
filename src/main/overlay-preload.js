import { contextBridge, ipcRenderer } from 'electron'

const overlayAPI = {
    // Overlay specific events
    onInitializeOverlay: (callback) => {
        ipcRenderer.on('initialize-overlay', callback)
    },

    // Selection complete
    selectionComplete: (selection) => ipcRenderer.invoke('overlay-selection-complete', selection),

    // Cancel overlay
    cancel: () => ipcRenderer.invoke('overlay-cancel'),

    // Remove listeners
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}

contextBridge.exposeInMainWorld('overlayAPI', overlayAPI)
