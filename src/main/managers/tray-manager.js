import { Menu, Tray, nativeImage, app } from 'electron'

export class TrayManager {
    constructor() {
        this.tray = null
        this.windowManager = null
        this.app = null
    }

    initialize(windowManager, app) {
        this.windowManager = windowManager
        this.app = app
        this.createTray()
    }

    createTray() {
        const icon = this.getAppIcon()
        this.tray = new Tray(icon)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show Settings',
                click: () => this.windowManager.showMainWindow()
            },
            {
                label: 'Screenshot with Selection',
                click: () => this.app.handleScreenshotWithSelection()
            },
            {
                label: 'Fullscreen Screenshot',
                click: () => this.app.handleFullscreenScreenshot()
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ])

        this.tray.setContextMenu(contextMenu)
        this.tray.setToolTip('Screenshot Tool')

        this.tray.on('double-click', () => {
            this.windowManager.showMainWindow()
        })
    }

    getAppIcon() {
        // Create a simple colored icon using nativeImage
        const size = 16
        const buffer = Buffer.alloc(size * size * 4) // RGBA

        // Fill with blue color
        for (let i = 0; i < buffer.length; i += 4) {
            buffer[i] = 59     // R
            buffer[i + 1] = 130 // G
            buffer[i + 2] = 246 // B
            buffer[i + 3] = 255 // A
        }

        return nativeImage.createFromBuffer(buffer, { width: size, height: size })
    }

    updateMenu() {
        // Re-create the menu with updated options
        this.createTray()
    }

    destroy() {
        if (this.tray) {
            this.tray.destroy()
        }
    }
}
