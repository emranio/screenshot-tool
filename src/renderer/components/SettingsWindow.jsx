import React, { useState } from 'react'
import { useSettings } from '../store/settings-provider'
import ShortcutsTab from './tabs/ShortcutsTab'
import FtpTab from './tabs/FtpTab'
import GeneralTab from './tabs/GeneralTab'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorBanner from './ui/ErrorBanner'
import Button from './ui/Button'

const SettingsWindow = () => {
  const [activeTab, setActiveTab] = useState('general')
  const { settings, loading, error, saveSettings } = useSettings()

  const tabs = [
    { id: 'general', label: 'General', component: GeneralTab },
    { id: 'shortcuts', label: 'Shortcuts', component: ShortcutsTab },
    { id: 'ftp', label: 'FTP Upload', component: FtpTab }
  ]

  const handleSave = async () => {
    try {
      await saveSettings(settings)
      // Show success message
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Configure your screenshot tool preferences</p>
      </div>

      {/* Error Banner */}
      <ErrorBanner error={error} />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            {tabs.map((tab) => {
              if (tab.id === activeTab) {
                const TabComponent = tab.component
                return <TabComponent key={tab.id} />
              }
              return null
            })}
          </div>

          {/* Footer */}
          <div className="bg-white border-t px-6 py-4 flex justify-end space-x-3">
            <Button
              onClick={handleSave}
              loading={loading}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsWindow
