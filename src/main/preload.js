import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

    // FTP
    testFtpConnection: (ftpSettings) => ipcRenderer.invoke('test-ftp-connection', ftpSettings),

    // File system
    selectDirectory: () => ipcRenderer.invoke('select-directory'),

    // App control
    minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),

    // Platform info
    platform: process.platform
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
