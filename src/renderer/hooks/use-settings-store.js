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
            const settings = await window.electronAPI.getSettings()
            set({ settings, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
        }
    },

    saveSettings: async (newSettings) => {
        set({ loading: true, error: null })
        try {
            await window.electronAPI.saveSettings(newSettings)
            set({ settings: newSettings, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
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
            const result = await window.electronAPI.testFtpConnection(ftpSettings)
            set({ loading: false })
            return result
        } catch (error) {
            set({ error: error.message, loading: false })
            return { success: false, error: error.message }
        }
    }
}))
