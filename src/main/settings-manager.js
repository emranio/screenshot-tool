import Store from 'electron-store'
import { app } from 'electron'
import { join } from 'path'
import { homedir } from 'os'

export class SettingsManager {
    constructor() {
        this.store = new Store({
            defaults: {
                shortcuts: {
                    screenshotWithSelection: 'CommandOrControl+Shift+1',
                    screenshotWithEditor: 'CommandOrControl+Shift+2',
                    videoWithSelection: 'CommandOrControl+Shift+3',
                    fullscreenScreenshot: 'CommandOrControl+Shift+4',
                    fullscreenWithEditor: 'CommandOrControl+Shift+5',
                    fullscreenVideo: 'CommandOrControl+Shift+6'
                },
                localSavePath: join(homedir(), 'Screenshots'),
                ftp: {
                    enabled: false,
                    host: '',
                    port: 21,
                    username: '',
                    password: '',
                    remotePath: '',
                    baseUrl: '',
                    secure: false
                },
                ui: {
                    startMinimized: true,
                    showNotifications: true,
                    imageFormat: 'png',
                    videoFormat: 'mp4'
                }
            }
        })
    }

    getSettings() {
        return this.store.store
    }

    saveSettings(settings) {
        // Validate shortcuts for conflicts
        const shortcuts = settings.shortcuts || {}
        const usedShortcuts = new Set()
        const conflicts = []

        Object.entries(shortcuts).forEach(([action, shortcut]) => {
            if (shortcut && usedShortcuts.has(shortcut)) {
                conflicts.push({ action, shortcut })
            } else if (shortcut) {
                usedShortcuts.add(shortcut)
            }
        })

        if (conflicts.length > 0) {
            throw new Error(`Shortcut conflicts detected: ${conflicts.map(c => `${c.action}: ${c.shortcut}`).join(', ')}`)
        }

        this.store.set(settings)
        return true
    }

    getShortcuts() {
        return this.store.get('shortcuts', {})
    }

    getFtpSettings() {
        return this.store.get('ftp', {})
    }

    getLocalSavePath() {
        return this.store.get('localSavePath', '')
    }

    reset() {
        this.store.clear()
    }
}
