import React, { useState } from 'react';
import { TextInput, Select, Button, Text } from '@mantine/core';
import { IconFolder, IconFolderOpen } from '@tabler/icons-react';
import FormSection from '../../common/Form/FormSection.jsx';
import FormField from '../../common/Form/FormField.jsx';
import { useSettingsStore } from '../../../store/settingsStore.js';
import { FILE_FORMATS } from '../../../utils/constants.js';
import { getDefaultSavePath } from '../../../utils/helpers.js';

const LocalSettings = () => {
  const { settings, updateLocalSettings } = useSettingsStore();
  const [isSelectingPath, setIsSelectingPath] = useState(false);

  const handleLocalChange = (field, value) => {
    updateLocalSettings({ [field]: value });
  };

  const handleToggleEnabled = (enabled) => {
    updateLocalSettings({ enabled });
  };

  const handleSelectPath = async () => {
    setIsSelectingPath(true);
    
    try {
      // In a real Electron app, this would open a directory picker
      // For now, we'll simulate the functionality
      if (typeof window !== 'undefined' && window.electronAPI) {
        const selectedPath = await window.electronAPI.selectDirectory();
        if (selectedPath) {
          handleLocalChange('savePath', selectedPath);
        }
      } else {
        // Fallback for development - just use a default path
        const defaultPath = getDefaultSavePath();
        handleLocalChange('savePath', defaultPath);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    } finally {
      setIsSelectingPath(false);
    }
  };

  const handleUseDefault = () => {
    const defaultPath = getDefaultSavePath();
    handleLocalChange('savePath', defaultPath);
  };

  return (
    <FormSection
      id="local"
      title="Local Save Settings"
      description="Configure local file saving options"
      toggle={settings.local.enabled}
      onToggleChange={handleToggleEnabled}
      enabled={settings.local.enabled}
    >
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <FormField
          label="Save Location"
          description="Directory where screenshots and recordings will be saved locally"
        >
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <TextInput
              placeholder="Select a folder..."
              value={settings.local.savePath}
              onChange={(event) => handleLocalChange('savePath', event.target.value)}
              disabled={!settings.local.enabled}
              style={{ flex: 1 }}
              leftSection={<IconFolder size={16} />}
            />
            <Button
              variant="outline"
              leftSection={<IconFolderOpen size={16} />}
              onClick={handleSelectPath}
              loading={isSelectingPath}
              disabled={!settings.local.enabled}
              className="file-picker__button"
            >
              Browse
            </Button>
            <Button
              variant="light"
              onClick={handleUseDefault}
              disabled={!settings.local.enabled}
            >
              Use Default
            </Button>
          </div>
          {!settings.local.savePath && settings.local.enabled && (
            <Text size="sm" c="orange" mt="xs">
              Files will be saved to the default desktop folder if no path is specified
            </Text>
          )}
        </FormField>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <FormField
            label="File Format"
            description="Default file format for screenshots"
          >
            <Select
              value={settings.local.fileFormat}
              onChange={(value) => handleLocalChange('fileFormat', value)}
              data={FILE_FORMATS}
              disabled={!settings.local.enabled}
            />
          </FormField>
          
          <FormField
            label="Naming Convention"
            description="Template for generating file names"
          >
            <Select
              value={settings.local.namingConvention}
              onChange={(value) => handleLocalChange('namingConvention', value)}
              disabled={!settings.local.enabled}
              data={[
                { value: 'screenshot_YYYYMMDD_HHMMSS', label: 'screenshot_20250807_143052' },
                { value: 'YYYYMMDD_HHMMSS', label: '20250807_143052' },
                { value: 'screenshot_YYYY-MM-DD_HH-mm-SS', label: 'screenshot_2025-08-07_14-30-52' },
                { value: 'YYYY-MM-DD_HH-mm-SS', label: '2025-08-07_14-30-52' }
              ]}
            />
          </FormField>
        </div>
        
        {settings.local.enabled && (
          <div style={{ 
            padding: 'var(--spacing-md)', 
            background: 'var(--surface-color)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <Text size="sm" fw={500} mb="xs">Preview:</Text>
            <Text size="sm" c="dimmed">
              screenshot_20250807_143052.{settings.local.fileFormat}
            </Text>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default LocalSettings;
