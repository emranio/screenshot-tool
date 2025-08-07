import React from 'react';
import { Switch, Text, Select } from '@mantine/core';
import { IconClipboard, IconBell, IconPalette } from '@tabler/icons-react';
import FormSection from '../../common/Form/FormSection.jsx';
import FormField from '../../common/Form/FormField.jsx';
import { useSettingsStore } from '../../../store/settingsStore.js';

const ToggleSettings = () => {
  const { settings, updateUISettings } = useSettingsStore();

  const handleUIChange = (field, value) => {
    updateUISettings({ [field]: value });
  };

  return (
    <FormSection
      id="toggles"
      title="Application Settings"
      description="Configure general application behavior and preferences"
    >
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <FormField
          label="Auto-copy URL to Clipboard"
          description="Automatically copy the file URL or path to clipboard after capture"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <IconClipboard size={20} color="var(--text-secondary)" />
            <Switch
              checked={settings.ui.autoCopyUrl}
              onChange={(event) => handleUIChange('autoCopyUrl', event.currentTarget.checked)}
              size="md"
            />
            <Text size="sm" c={settings.ui.autoCopyUrl ? 'green' : 'dimmed'}>
              {settings.ui.autoCopyUrl ? 'Enabled' : 'Disabled'}
            </Text>
          </div>
        </FormField>
        
        <FormField
          label="Show Notifications"
          description="Display system notifications for captures, uploads, and errors"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <IconBell size={20} color="var(--text-secondary)" />
            <Switch
              checked={settings.ui.showNotifications}
              onChange={(event) => handleUIChange('showNotifications', event.currentTarget.checked)}
              size="md"
            />
            <Text size="sm" c={settings.ui.showNotifications ? 'green' : 'dimmed'}>
              {settings.ui.showNotifications ? 'Enabled' : 'Disabled'}
            </Text>
          </div>
        </FormField>
        
        <FormField
          label="Theme"
          description="Choose the application appearance theme"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <IconPalette size={20} color="var(--text-secondary)" />
            <Select
              value={settings.ui.theme}
              onChange={(value) => handleUIChange('theme', value)}
              data={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'System' }
              ]}
              style={{ minWidth: '150px' }}
            />
          </div>
        </FormField>
        
        <div style={{ 
          padding: 'var(--spacing-md)', 
          background: 'var(--surface-color)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <Text size="sm" fw={500} mb="xs">Current Settings Summary:</Text>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <Text size="sm" c="dimmed">
                Auto-copy: {settings.ui.autoCopyUrl ? 'Enabled' : 'Disabled'}
              </Text>
            </li>
            <li>
              <Text size="sm" c="dimmed">
                Notifications: {settings.ui.showNotifications ? 'Enabled' : 'Disabled'}
              </Text>
            </li>
            <li>
              <Text size="sm" c="dimmed">
                Theme: {settings.ui.theme.charAt(0).toUpperCase() + settings.ui.theme.slice(1)}
              </Text>
            </li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
};

export default ToggleSettings;
