import React from 'react'
import { useSettings } from '../../store/settings-provider.jsx'

const StatusBar = () => {
  const { settings } = useSettings()

  const getStatusItems = () => {
    const items = []

    // Local save status
    if (settings.localSavePath) {
      items.push({
        icon: '💾',
        text: 'Local Save: Enabled',
        color: 'text-green-600'
      })
    } else {
      items.push({
        icon: '💾',
        text: 'Local Save: Disabled',
        color: 'text-gray-500'
      })
    }

    // FTP status
    if (settings.ftp?.enabled && settings.ftp?.host) {
      items.push({
        icon: '🌐',
        text: 'FTP Upload: Enabled',
        color: 'text-green-600'
      })
    } else {
      items.push({
        icon: '🌐',
        text: 'FTP Upload: Disabled',
        color: 'text-gray-500'
      })
    }

    // Shortcuts status
    const enabledShortcuts = Object.values(settings.shortcuts || {}).filter(Boolean).length
    items.push({
      icon: '⌨️',
      text: `Shortcuts: ${enabledShortcuts}/6`,
      color: enabledShortcuts > 0 ? 'text-green-600' : 'text-gray-500'
    })

    return items
  }

  return (
    <div className="bg-gray-50 border-t px-6 py-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          {getStatusItems().map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span>{item.icon}</span>
              <span className={item.color}>{item.text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <span>🖥️</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar
