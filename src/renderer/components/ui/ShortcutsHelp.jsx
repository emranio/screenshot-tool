import React, { useState } from 'react'
import { useSettings } from '../../store/settings-provider.jsx'
import Button from '../ui/Button'

const ShortcutsHelp = ({ isOpen, onClose }) => {
  const { settings } = useSettings()

  const shortcutActions = [
    {
      id: 'screenshotWithSelection',
      label: 'Screenshot with Selection',
      description: 'Capture a selected area of the screen',
      icon: '📷'
    },
    {
      id: 'screenshotWithEditor',
      label: 'Screenshot with Editor',
      description: 'Capture with selection and open editor',
      icon: '✏️'
    },
    {
      id: 'videoWithSelection',
      label: 'Video Recording with Selection',
      description: 'Record a selected area of the screen',
      icon: '🎥'
    },
    {
      id: 'fullscreenScreenshot',
      label: 'Fullscreen Screenshot',
      description: 'Capture the entire active monitor',
      icon: '🖥️'
    },
    {
      id: 'fullscreenWithEditor',
      label: 'Fullscreen Screenshot with Editor',
      description: 'Capture fullscreen and open editor',
      icon: '🖥️✏️'
    },
    {
      id: 'fullscreenVideo',
      label: 'Fullscreen Video Recording',
      description: 'Record the entire active monitor',
      icon: '🎬'
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {shortcutActions.map((action) => {
              const shortcut = settings.shortcuts?.[action.id]
              return (
                <div key={action.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{action.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {shortcut ? (
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                        {shortcut}
                      </kbd>
                    ) : (
                      <span className="text-xs text-gray-400">Not set</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Tips:</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Press the shortcut key combination to trigger the action</li>
              <li>• Shortcuts work globally, even when the app is minimized</li>
              <li>• You can change shortcuts in the Shortcuts tab</li>
              <li>• Use Cmd (Mac) or Ctrl (Windows/Linux) + Shift combinations</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ShortcutsHelp
