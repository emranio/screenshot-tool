import { app, BrowserWindow, globalShortcut, ipcMain, screen, clipboard, Menu, Tray, nativeImage, Notification } from 'electron'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { CaptureManager } from './managers/capture-manager.js'
import { FTPManager } from './managers/ftp-manager.js'
import { SettingsManager } from './managers/settings-manager.js'
import { WindowManager } from './managers/window-manager.js'
import { ShortcutManager } from './managers/shortcut-manager.js'
import { TrayManager } from './managers/tray-manager.js'
import { IPCManager } from './managers/ipc-manager.js'
import { MemoryManager } from './utils/memory-manager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class ScreenshotApp {
    constructor() {
        this.captureManager = new CaptureManager()
        this.ftpManager = new FTPManager()
        this.settingsManager = new SettingsManager()
        this.windowManager = new WindowManager(__dirname)
        this.shortcutManager = new ShortcutManager()
        this.trayManager = new TrayManager()
        this.ipcManager = new IPCManager()
        this.memoryManager = new MemoryManager()

        this.isDev = process.env.NODE_ENV === 'development'
    }

    async initialize() {
        await app.whenReady()

        // Start memory monitoring in development
        if (this.isDev) {
            this.memoryManager.startMonitoring()
        }

        this.setupManagers()
        this.setupAppEvents()
    }

    setupManagers() {
        // Initialize all managers with dependencies
        this.windowManager.initialize(this.isDev)
        this.trayManager.initialize(this.windowManager, this)
        this.shortcutManager.initialize(this.settingsManager, this)
        this.ipcManager.initialize(
            this.settingsManager,
            this.ftpManager,
            this.captureManager,
            this.shortcutManager,
            this.windowManager,
            this
        )
    }

    setupAppEvents() {
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.windowManager.createMainWindow()
            }
        })

        app.on('will-quit', () => {
            globalShortcut.unregisterAll()
            this.memoryManager.cleanupResources()
        })
    }

    // Capture action handlers
    async handleScreenshotWithSelection() {
        const activeDisplay = this.getActiveDisplay()
        const screenshot = await this.captureManager.captureDisplay(activeDisplay)
        await this.windowManager.showSelectionOverlay(screenshot, activeDisplay, 'screenshot')
    }

    async handleScreenshotWithEditor() {
        const activeDisplay = this.getActiveDisplay()
        const screenshot = await this.captureManager.captureDisplay(activeDisplay)
        await this.windowManager.showSelectionOverlay(screenshot, activeDisplay, 'screenshotWithEditor')
    }

    async handleVideoWithSelection() {
        const activeDisplay = this.getActiveDisplay()
        const screenshot = await this.captureManager.captureDisplay(activeDisplay)
        await this.windowManager.showSelectionOverlay(screenshot, activeDisplay, 'video')
    }

    async handleFullscreenScreenshot() {
        const activeDisplay = this.getActiveDisplay()
        const result = await this.captureManager.captureFullscreen(activeDisplay)
        await this.processCapture(result)
    }

    async handleFullscreenWithEditor() {
        const activeDisplay = this.getActiveDisplay()
        const screenshot = await this.captureManager.captureDisplay(activeDisplay)
        const result = await this.captureManager.openEditor(screenshot)
        await this.processCapture(result)
    }

    async handleFullscreenVideo() {
        const activeDisplay = this.getActiveDisplay()
        await this.captureManager.startFullscreenRecording(activeDisplay)
    }

    getActiveDisplay() {
        const cursor = screen.getCursorScreenPoint()
        return screen.getDisplayNearestPoint(cursor)
    }

    async processCapture(result) {
        const settings = this.settingsManager.getSettings()
        let finalUrl = null
        let localPath = null

        // Save locally if configured
        if (settings.localSavePath) {
            try {
                localPath = await this.captureManager.saveLocally(result.buffer, settings.localSavePath)
                finalUrl = localPath
            } catch (error) {
                console.error('Failed to save locally:', error)
            }
        }

        // Upload via FTP if configured
        if (settings.ftp.enabled && settings.ftp.host) {
            try {
                const remoteUrl = await this.ftpManager.upload(result.buffer, result.filename, settings.ftp)
                finalUrl = remoteUrl
            } catch (error) {
                console.error('FTP upload failed:', error)
            }
        }

        // Copy URL to clipboard
        if (finalUrl) {
            clipboard.writeText(finalUrl)
        }

        // Show notification if enabled
        if (settings.ui?.showNotifications) {
            this.showNotification(result, finalUrl, localPath)
        }

        return finalUrl
    }

    showNotification(result, finalUrl, localPath) {
        if (!Notification.isSupported()) return

        const settings = this.settingsManager.getSettings()
        let title = 'Screenshot Captured'
        let body = ''

        if (finalUrl) {
            if (finalUrl.startsWith('http')) {
                body = 'Uploaded and URL copied to clipboard'
            } else {
                body = `Saved to ${localPath ? 'local folder' : 'clipboard'}`
            }
        } else {
            body = 'Capture completed'
        }

        const notification = new Notification({
            title,
            body,
            silent: false
        })

        notification.show()
    }

    showMainWindow() {
        this.windowManager.showMainWindow()
    }

    hideOverlayWindow() {
        this.windowManager.hideOverlayWindow()
    }
}
