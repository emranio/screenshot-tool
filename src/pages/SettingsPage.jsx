import React, { useState, useEffect } from 'react';
import Form from 'rc-field-form';
import { Title, Text, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy, IconRefresh, IconX } from '@tabler/icons-react';

import AppLayout from '../modules/common/Layout/AppLayout.jsx';
import { 
  HotkeyConfig, 
  FTPSettings, 
  LocalSettings, 
  ToggleSettings,
  useSettingsForm,
  useHotkeyValidation,
  useFTPValidation
} from '../modules/settings/index.js';
import { useSettingsStore } from '../store/settingsStore.js';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('general');
  const { 
    form, 
    settings, 
    hasUnsavedChanges, 
    handleFormChange, 
    handleSave, 
    handleDiscard 
  } = useSettingsForm();
  
  const { resetToDefaults } = useSettingsStore();
  const hotkeyValidator = useHotkeyValidation();
  const ftpValidator = useFTPValidation();

  const sectionHasErrors = () => {
    if (activeSection === 'hotkeys') {
      return hotkeyValidator.hasErrors || hotkeyValidator.hasConflicts;
    }
    if (activeSection === 'ftp') {
      return ftpValidator.hasErrors;
    }
    return false;
  };

  const handleNavigate = (sectionId) => {
    if (sectionHasErrors()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fix the errors in the current section before navigating away.',
        color: 'red',
        icon: <IconX size={16} />,
      });
      return;
    }
    setActiveSection(sectionId);
  };

  const handleSaveChanges = () => {
    handleSave();
    notifications.show({
      title: 'Settings Saved',
      message: 'Your changes have been saved successfully.',
      color: 'green',
    });
  };

  const handleDiscardChanges = () => {
    handleDiscard();
    notifications.show({
      title: 'Changes Discarded',
      message: 'Your changes have been discarded.',
      color: 'yellow',
    });
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    notifications.show({
      title: 'Settings Reset',
      message: 'All settings have been reset to their default values.',
      color: 'blue',
    });
  };

  return (
    <AppLayout 
      activeSection={activeSection}
      onNavigate={handleNavigate}
      hasErrors={sectionHasErrors()}
    >
      <div className="settings-page">
        <header className="settings-page__header">
          <Title className="settings-page__title">Screenshot Tool Settings</Title>
          <Text className="settings-page__subtitle">
            Configure your screenshot and recording preferences, hotkeys, and upload settings.
          </Text>
        </header>

        <Form
          form={form}
          onValuesChange={handleFormChange}
          initialValues={settings}
        >
          <div className="settings-grid">
            {activeSection === 'general' && <ToggleSettings />}
            {activeSection === 'hotkeys' && <HotkeyConfig />}
            {activeSection === 'ftp' && <FTPSettings />}
            {activeSection === 'local' && <LocalSettings />}
          </div>
        </Form>

        <Group justify="space-between" mt="xl" pt="xl" style={{ borderTop: '1px solid var(--border-color)' }}>
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconRefresh size={16} />}
            onClick={handleResetToDefaults}
          >
            Reset to Defaults
          </Button>
          <Group>
            <Button
              variant="light"
              onClick={handleDiscardChanges}
              disabled={!hasUnsavedChanges}
            >
              Discard Changes
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges}
            >
              Save Changes
            </Button>
          </Group>
        </Group>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
