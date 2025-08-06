import { ipcMain, dialog } from 'electron'

export class IPCManager {
    constructor() {
        this.settingsManager = null
        this.ftpManager = null
        this.captureManager = null
        this.shortcutManager = null
        this.windowManager = null
        this.app = null
    }

    initialize(settingsManager, ftpManager, captureManager, shortcutManager, windowManager = null, app = null) {
        this.settingsManager = settingsManager
        this.ftpManager = ftpManager
        this.captureManager = captureManager
        this.shortcutManager = shortcutManager
        this.windowManager = windowManager
        this.app = app
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

        ipcMain.handle('select-directory', async () => {
            const result = await dialog.showOpenDialog({
                properties: ['openDirectory'],
                title: 'Select Directory for Screenshots'
            })

            if (!result.canceled && result.filePaths.length > 0) {
                return result.filePaths[0]
            }
            return null
        })

        ipcMain.handle('overlay-selection-complete', async (event, selection) => {
            // Process the selection and hide overlay
            const result = await this.captureManager.processSelection(selection)

            // Hide overlay window
            if (this.windowManager) {
                this.windowManager.hideOverlayWindow()
            }

            // Process the capture (save/upload)
            if (this.app && this.app.processCapture) {
                await this.app.processCapture(result)
            }

            return result
        })

        ipcMain.handle('overlay-cancel', () => {
            // Hide overlay window
            if (this.windowManager) {
                this.windowManager.hideOverlayWindow()
            }
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
