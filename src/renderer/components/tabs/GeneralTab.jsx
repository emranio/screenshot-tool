import React from 'react'
import { useSettings } from '../../store/settings-provider'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Checkbox from '../ui/Checkbox'
import Button from '../ui/Button'

const GeneralTab = () => {
  const { settings, updateSettings } = useSettings()

  const handleLocalPathChange = (e) => {
    updateSettings({ localSavePath: e.target.value })
  }

  const handleSelectLocalPath = async () => {
    // This would open a directory picker dialog
    // For now, just show an alert
    alert('Directory picker would open here')
  }

  const handleImageFormatChange = (e) => {
    updateSettings({ 
      ui: { 
        ...settings.ui, 
        imageFormat: e.target.value 
      } 
    })
  }

  const handleVideoFormatChange = (e) => {
    updateSettings({ 
      ui: { 
        ...settings.ui, 
        videoFormat: e.target.value 
      } 
    })
  }

  const handleStartMinimizedChange = (e) => {
    updateSettings({ 
      ui: { 
        ...settings.ui, 
        startMinimized: e.target.checked 
      } 
    })
  }

  const handleNotificationsChange = (e) => {
    updateSettings({ 
      ui: { 
        ...settings.ui, 
        showNotifications: e.target.checked 
      } 
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
        
        {/* Local Save Path */}
        <div className="space-y-4">
          <div>
            <div className="flex space-x-2">
              <Input
                label="Local Save Path"
                value={settings.localSavePath || ''}
                onChange={handleLocalPathChange}
                placeholder="Leave empty to disable local saving"
                helperText="Choose where screenshots and recordings will be saved locally"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={handleSelectLocalPath}
                className="mt-7"
              >
                Browse
              </Button>
            </div>
          </div>

          <Select
            label="Image Format"
            value={settings.ui?.imageFormat || 'png'}
            onChange={handleImageFormatChange}
            className="w-48"
          >
            <option value="png">PNG (Lossless)</option>
            <option value="jpeg">JPEG (Smaller size)</option>
          </Select>

          <Select
            label="Video Format"
            value={settings.ui?.videoFormat || 'mp4'}
            onChange={handleVideoFormatChange}
            className="w-48"
          >
            <option value="mp4">MP4 (H.264)</option>
            <option value="webm">WebM</option>
          </Select>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Interface Options</h3>
            
            <Checkbox
              id="start-minimized"
              label="Start minimized to system tray"
              checked={settings.ui?.startMinimized || false}
              onChange={handleStartMinimizedChange}
            />

            <Checkbox
              id="show-notifications"
              label="Show notifications for captures"
              checked={settings.ui?.showNotifications || false}
              onChange={handleNotificationsChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralTab
