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
        // Create a simple icon for now
        const canvas = new OffscreenCanvas(16, 16)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#3b82f6'
        ctx.fillRect(0, 0, 16, 16)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(2, 2, 12, 12)

        return nativeImage.createFromBuffer(Buffer.from(canvas.toDataURL().split(',')[1], 'base64'))
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
