import { ipcMain } from 'electron'

export class IPCManager {
    constructor() {
        this.settingsManager = null
        this.ftpManager = null
        this.captureManager = null
        this.shortcutManager = null
    }

    initialize(settingsManager, ftpManager, captureManager, shortcutManager) {
        this.settingsManager = settingsManager
        this.ftpManager = ftpManager
        this.captureManager = captureManager
        this.shortcutManager = shortcutManager
        this.setupIpcHandlers()
    }

    setupIpcHandlers() {
        ipcMain.handle('get-settings', () => {
            return this.settingsManager.getSettings()
        })

        ipcMain.handle('save-settings', (event, settings) => {
            this.settingsManager.saveSettings(settings)
            this.shortcutManager.updateShortcuts()
            return true
        })

        ipcMain.handle('test-ftp-connection', async (event, ftpSettings) => {
            return await this.ftpManager.testConnection(ftpSettings)
        })

        ipcMain.handle('overlay-selection-complete', async (event, selection) => {
            // This will be handled by the app instance
            const result = await this.captureManager.processSelection(selection)
            return result
        })

        ipcMain.handle('overlay-cancel', () => {
            // This will be handled by the app instance
            return true
        })

        ipcMain.handle('minimize-to-tray', () => {
            // This will be handled by the window manager
            return true
        })
    }

    removeAllHandlers() {
        ipcMain.removeAllListeners('get-settings')
        ipcMain.removeAllListeners('save-settings')
        ipcMain.removeAllListeners('test-ftp-connection')
        ipcMain.removeAllListeners('overlay-selection-complete')
        ipcMain.removeAllListeners('overlay-cancel')
        ipcMain.removeAllListeners('minimize-to-tray')
    }
}
