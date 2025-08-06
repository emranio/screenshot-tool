import React, { useState } from 'react'
import { useSettings } from '../store/settings-provider'
import ShortcutsTab from './tabs/ShortcutsTab'
import FtpTab from './tabs/FtpTab'
import GeneralTab from './tabs/GeneralTab'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorBanner from './ui/ErrorBanner'
import SuccessBanner from './ui/SuccessBanner'
import Button from './ui/Button'
import StatusBar from './ui/StatusBar'
import ShortcutsHelp from './ui/ShortcutsHelp'

const SettingsWindow = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [successMessage, setSuccessMessage] = useState('')
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const { settings, loading, error, saveSettings } = useSettings()

  const tabs = [
    { id: 'general', label: 'General', component: GeneralTab },
    { id: 'shortcuts', label: 'Shortcuts', component: ShortcutsTab },
    { id: 'ftp', label: 'FTP Upload', component: FtpTab }
  ]

  const handleSave = async () => {
    try {
      const result = await saveSettings(settings)
      if (result?.success !== false) {
        // Show success message
        if (window.showToast) {
          window.showToast('Settings saved successfully!', 'success')
        }
      } else {
        // Show error message
        if (window.showToast) {
          window.showToast(result.error || 'Failed to save settings', 'error')
        }
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      if (window.showToast) {
        window.showToast('Failed to save settings', 'error')
      }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Configure your screenshot tool preferences</p>
          </div>
          <button
            onClick={() => setShowShortcutsHelp(true)}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
            title="View keyboard shortcuts"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
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
      
      {/* Status Bar */}
      <StatusBar />
      
      {/* Shortcuts Help Dialog */}
      <ShortcutsHelp 
        isOpen={showShortcutsHelp} 
        onClose={() => setShowShortcutsHelp(false)} 
      />
    </div>
  )
}

export default SettingsWindow
