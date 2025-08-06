import React, { useState } from 'react'
import { useSettings } from '../../store/settings-provider.jsx'

const ShortcutsTab = () => {
  const { settings, updateSettings } = useSettings()
  const [recordingShortcut, setRecordingShortcut] = useState('')
  const [conflicts, setConflicts] = useState([])

  const shortcutActions = [
    {
      id: 'screenshotWithSelection',
      label: 'Screenshot with Selection',
      description: 'Capture a selected area of the screen'
    },
    {
      id: 'screenshotWithEditor',
      label: 'Screenshot with Editor',
      description: 'Capture with selection and open editor'
    },
    {
      id: 'videoWithSelection',
      label: 'Video Recording with Selection',
      description: 'Record a selected area of the screen'
    },
    {
      id: 'fullscreenScreenshot',
      label: 'Fullscreen Screenshot',
      description: 'Capture the entire active monitor'
    },
    {
      id: 'fullscreenWithEditor',
      label: 'Fullscreen Screenshot with Editor',
      description: 'Capture fullscreen and open editor'
    },
    {
      id: 'fullscreenVideo',
      label: 'Fullscreen Video Recording',
      description: 'Record the entire active monitor'
    }
  ]

  const handleShortcutChange = (actionId, value) => {
    const newShortcuts = {
      ...settings.shortcuts,
      [actionId]: value
    }

    // Check for conflicts
    const usedShortcuts = new Set()
    const newConflicts = []

    Object.entries(newShortcuts).forEach(([action, shortcut]) => {
      if (shortcut && shortcut.trim() !== '') {
        if (usedShortcuts.has(shortcut)) {
          newConflicts.push(shortcut)
        } else {
          usedShortcuts.add(shortcut)
        }
      }
    })

    setConflicts(newConflicts)
    updateSettings({ shortcuts: newShortcuts })
  }

  const handleShortcutKeyDown = (e, actionId) => {
    e.preventDefault()
    
    const keys = []
    
    if (e.ctrlKey || e.metaKey) keys.push(process.platform === 'darwin' ? 'Command' : 'Control')
    if (e.altKey) keys.push('Alt')
    if (e.shiftKey) keys.push('Shift')
    
    if (e.key && !['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
      keys.push(e.key.toUpperCase())
    }
    
    if (keys.length > 1) {
      const shortcut = keys.join('+')
      handleShortcutChange(actionId, shortcut)
    }
  }

  const clearShortcut = (actionId) => {
    handleShortcutChange(actionId, '')
  }

  const isConflicted = (shortcut) => {
    return shortcut && conflicts.includes(shortcut)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Keyboard Shortcuts</h2>
        <p className="text-sm text-gray-600 mb-6">
          Click in the input field and press your desired key combination. Use Cmd/Ctrl + Shift + keys for best compatibility.
        </p>

        {conflicts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Shortcut Conflicts Detected</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>The following shortcuts are assigned to multiple actions: {conflicts.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {shortcutActions.map((action) => {
            const currentShortcut = settings.shortcuts?.[action.id] || ''
            const hasConflict = isConflicted(currentShortcut)
            
            return (
              <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{action.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <input
                      type="text"
                      value={currentShortcut}
                      onKeyDown={(e) => handleShortcutKeyDown(e, action.id)}
                      onChange={() => {}} // Controlled by keydown
                      placeholder="Click and press keys"
                      className={`w-48 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        hasConflict 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-primary-500'
                      }`}
                    />
                    
                    {currentShortcut && (
                      <button
                        onClick={() => clearShortcut(action.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        title="Clear shortcut"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {hasConflict && (
                  <p className="text-xs text-red-600 mt-2">
                    This shortcut conflicts with another action
                  </p>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Tips:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Use Cmd+Shift (Mac) or Ctrl+Shift (Windows) combinations for system-wide shortcuts</li>
            <li>• Avoid common shortcuts like Cmd+C, Cmd+V that are used by other applications</li>
            <li>• Function keys (F1-F12) work well for global shortcuts</li>
            <li>• Leave fields empty to disable specific shortcuts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ShortcutsTab
