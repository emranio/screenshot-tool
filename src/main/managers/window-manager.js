import { BrowserWindow } from 'electron'
import { join } from 'path'

export class WindowManager {
    constructor(dirname) {
        this.mainWindow = null
        this.overlayWindow = null
        this.__dirname = dirname
        this.isDev = false
    }

    initialize(isDev) {
        this.isDev = isDev
        this.createMainWindow()
    }

    createMainWindow() {
        this.mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: join(this.__dirname, 'preload.js')
            },
            show: false
        })

        if (this.isDev) {
            this.mainWindow.loadURL('http://localhost:3000')
            this.mainWindow.webContents.openDevTools()
        } else {
            this.mainWindow.loadFile(join(this.__dirname, '../../build/index.html'))
        }

        this.mainWindow.once('ready-to-show', () => {
            // Don't show main window by default, app runs in tray
        })
    }

    showMainWindow() {
        if (this.mainWindow) {
            this.mainWindow.show()
            this.mainWindow.focus()
        }
    }

    hideMainWindow() {
        if (this.mainWindow) {
            this.mainWindow.hide()
        }
    }

    async showSelectionOverlay(screenshot, display, mode) {
        if (this.mainWindow) {
            this.mainWindow.hide()
        }

        this.overlayWindow = new BrowserWindow({
            fullscreen: true,
            frame: false,
            resizable: false,
            alwaysOnTop: true,
            transparent: true,
            kiosk: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: join(this.__dirname, 'overlay-preload.js')
            },
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height
        })

        if (this.isDev) {
            this.overlayWindow.loadURL('http://localhost:3000/overlay.html')
        } else {
            this.overlayWindow.loadFile(join(this.__dirname, '../../build/overlay.html'))
        }

        this.overlayWindow.once('ready-to-show', () => {
            this.overlayWindow.webContents.send('initialize-overlay', {
                screenshot: screenshot.toString('base64'),
                display,
                mode
            })
        })

        this.overlayWindow.on('closed', () => {
            this.overlayWindow = null
        })
    }

    hideOverlayWindow() {
        if (this.overlayWindow) {
            this.overlayWindow.close()
        }
    }

    getMainWindow() {
        return this.mainWindow
    }

    getOverlayWindow() {
        return this.overlayWindow
    }
}
