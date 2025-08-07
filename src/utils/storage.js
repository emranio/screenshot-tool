// Storage utility for electron-store
let Store;

// Initialize the store (will be properly setup when Electron is integrated)
const initializeStore = () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
        // When Electron is available, use the proper store
        return window.electronAPI.store;
    } else {
        // Fallback to localStorage for development
        return {
            get: (key, defaultValue) => {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch {
                    return defaultValue;
                }
            },
            set: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (error) {
                    console.error('Failed to save to localStorage:', error);
                }
            },
            delete: (key) => {
                localStorage.removeItem(key);
            },
            clear: () => {
                localStorage.clear();
            }
        };
    }
};

const store = initializeStore();

export const storage = {
    get: (key, defaultValue = null) => {
        return store.get(key, defaultValue);
    },

    set: (key, value) => {
        store.set(key, value);
    },

    remove: (key) => {
        store.delete(key);
    },

    clear: () => {
        store.clear();
    },

    // Settings specific methods
    getSettings: (defaultSettings) => {
        return store.get('settings', defaultSettings);
    },

    saveSettings: (settings) => {
        store.set('settings', settings);
    },

    updateSetting: (path, value) => {
        const settings = store.get('settings', {});
        const keys = path.split('.');
        let current = settings;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        store.set('settings', settings);
    }
};

export default storage;
