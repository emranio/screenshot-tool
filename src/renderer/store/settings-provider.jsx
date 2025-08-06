import React, { createContext, useContext, useEffect } from 'react'
import { useSettingsStore } from '../hooks/use-settings-store'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
    const store = useSettingsStore()

    useEffect(() => {
        store.loadSettings()
    }, [])

    return (
        <SettingsContext.Provider value={store}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}
