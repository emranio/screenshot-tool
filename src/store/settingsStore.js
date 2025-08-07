import { create } from 'zustand';
import { storage } from '../utils/storage.js';
import { DEFAULT_SETTINGS } from '../utils/constants.js';

export const useSettingsStore = create((set, get) => ({
    // Initial state
    settings: storage.getSettings(DEFAULT_SETTINGS),
    isLoading: false,
    hasUnsavedChanges: false,

    // Actions
    loadSettings: () => {
        set({ isLoading: true });
        try {
            const settings = storage.getSettings(DEFAULT_SETTINGS);
            set({ settings, isLoading: false });
        } catch (error) {
            console.error('Failed to load settings:', error);
            set({ settings: DEFAULT_SETTINGS, isLoading: false });
        }
    },

    saveSettings: () => {
        const { settings } = get();
        try {
            storage.saveSettings(settings);
            set({ hasUnsavedChanges: false });
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    },

    updateSettings: (newSettings) => {
        set({
            settings: { ...get().settings, ...newSettings },
            hasUnsavedChanges: true
        });
    },

    updateHotkey: (action, hotkey) => {
        const { settings } = get();
        const updatedSettings = {
            ...settings,
            hotkeys: {
                ...settings.hotkeys,
                [action]: hotkey
            }
        };
        set({ settings: updatedSettings, hasUnsavedChanges: true });
    },

    updateFTPSettings: (ftpSettings) => {
        const { settings } = get();
        const updatedSettings = {
            ...settings,
            ftp: { ...settings.ftp, ...ftpSettings }
        };
        set({ settings: updatedSettings, hasUnsavedChanges: true });
    },

    updateLocalSettings: (localSettings) => {
        const { settings } = get();
        const updatedSettings = {
            ...settings,
            local: { ...settings.local, ...localSettings }
        };
        set({ settings: updatedSettings, hasUnsavedChanges: true });
    },

    updateUISettings: (uiSettings) => {
        const { settings } = get();
        const updatedSettings = {
            ...settings,
            ui: { ...settings.ui, ...uiSettings }
        };
        set({ settings: updatedSettings, hasUnsavedChanges: true });
    },

    resetSettings: () => {
        const initialSettings = storage.getSettings(DEFAULT_SETTINGS);
        set({
            settings: initialSettings,
            hasUnsavedChanges: false
        });
    },

    resetToDefaults: () => {
        storage.saveSettings(DEFAULT_SETTINGS);
        set({
            settings: DEFAULT_SETTINGS,
            hasUnsavedChanges: false
        });
    }
}));
