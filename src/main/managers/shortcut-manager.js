import { globalShortcut } from 'electron'

export class ShortcutManager {
    constructor() {
        this.settingsManager = null
        this.app = null
        this.registeredShortcuts = new Set()
    }

    initialize(settingsManager, app) {
        this.settingsManager = settingsManager
        this.app = app
        this.setupGlobalShortcuts()
    }

    setupGlobalShortcuts() {
        const shortcuts = this.settingsManager.getShortcuts()

        Object.entries(shortcuts).forEach(([action, shortcut]) => {
            if (shortcut) {
                try {
                    globalShortcut.register(shortcut, () => {
                        this.handleShortcutAction(action)
                    })
                    this.registeredShortcuts.add(shortcut)
                } catch (error) {
                    console.error(`Failed to register shortcut ${shortcut}:`, error)
                }
            }
        })
    }

    handleShortcutAction(action) {
        switch (action) {
            case 'screenshotWithSelection':
                this.app.handleScreenshotWithSelection()
                break
            case 'screenshotWithEditor':
                this.app.handleScreenshotWithEditor()
                break
            case 'videoWithSelection':
                this.app.handleVideoWithSelection()
                break
            case 'fullscreenScreenshot':
                this.app.handleFullscreenScreenshot()
                break
            case 'fullscreenWithEditor':
                this.app.handleFullscreenWithEditor()
                break
            case 'fullscreenVideo':
                this.app.handleFullscreenVideo()
                break
            default:
                console.warn(`Unknown shortcut action: ${action}`)
        }
    }

    updateShortcuts() {
        this.unregisterAll()
        this.setupGlobalShortcuts()
    }

    unregisterAll() {
        globalShortcut.unregisterAll()
        this.registeredShortcuts.clear()
    }

    isShortcutRegistered(shortcut) {
        return this.registeredShortcuts.has(shortcut)
    }
}
