import { create } from 'zustand'

export const useSettingsStore = create((set, get) => ({
    settings: {
        shortcuts: {},
        localSavePath: '',
        ftp: {},
        ui: {}
    },
    loading: false,
    error: null,

    loadSettings: async () => {
        set({ loading: true, error: null })
        try {
            // Check if electronAPI is available (only in Electron environment)
            if (window.electronAPI && window.electronAPI.getSettings) {
                const settings = await window.electronAPI.getSettings()
                set({ settings, loading: false })
            } else {
                // Fallback for development/web environment
                const fallbackSettings = {
                    shortcuts: {
                        screenshotWithSelection: 'CommandOrControl+Shift+1',
                        screenshotWithEditor: 'CommandOrControl+Shift+2',
                        videoWithSelection: 'CommandOrControl+Shift+3',
                        fullscreenScreenshot: 'CommandOrControl+Shift+4',
                        fullscreenWithEditor: 'CommandOrControl+Shift+5',
                        fullscreenVideo: 'CommandOrControl+Shift+6'
                    },
                    localSavePath: '',
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
                set({ settings: fallbackSettings, loading: false })
            }
        } catch (error) {
            set({ error: error.message, loading: false })
        }
    },

    saveSettings: async (newSettings) => {
        set({ loading: true, error: null })
        try {
            if (window.electronAPI && window.electronAPI.saveSettings) {
                await window.electronAPI.saveSettings(newSettings)
                set({ settings: newSettings, loading: false })
                return { success: true }
            } else {
                // Fallback for development - just update local state
                console.log('Development mode: Settings would be saved:', newSettings)
                set({ settings: newSettings, loading: false })
                return { success: true }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save settings'
            set({ error: errorMessage, loading: false })
            return { success: false, error: errorMessage }
        }
    },

    updateSettings: (updates) => {
        const currentSettings = get().settings
        const newSettings = { ...currentSettings, ...updates }
        set({ settings: newSettings })
    },

    testFtpConnection: async (ftpSettings) => {
        set({ loading: true, error: null })
        try {
            if (window.electronAPI && window.electronAPI.testFtpConnection) {
                const result = await window.electronAPI.testFtpConnection(ftpSettings)
                set({ loading: false })
                return result
            } else {
                // Fallback for development
                console.log('Development mode: FTP test would be performed with:', ftpSettings)
                set({ loading: false })
                return { success: true, message: 'Development mode - FTP test simulated' }
            }
        } catch (error) {
            set({ error: error.message, loading: false })
            return { success: false, error: error.message }
        }
    }
}))
