import React from 'react';
import { TextInput, Kbd, Alert } from '@mantine/core';
import { IconAlertCircle, IconKeyboard } from '@tabler/icons-react';
import FormSection from '../../common/Form/FormSection.jsx';
import FormField from '../../common/Form/FormField.jsx';
import { useHotkeyValidation } from '../hooks/useHotkeyValidation.js';
import { useSettingsStore } from '../../../store/settingsStore.js';
import { HOTKEY_ACTIONS, HOTKEY_LABELS, HOTKEY_DESCRIPTIONS } from '../../../utils/constants.js';
import { formatHotkeyDisplay } from '../../../utils/validation.js';

const HotkeyConfig = () => {
  const { settings, updateHotkey } = useSettingsStore();
  const { errors, conflicts, hasErrors, hasConflicts } = useHotkeyValidation();

  const handleHotkeyChange = (action, value) => {
    updateHotkey(action, value);
  };

  const getHotkeyError = (action) => {
    const error = errors[action];
    const actionConflicts = conflicts[action];
    
    if (error) return error;
    if (actionConflicts && actionConflicts.length > 0) {
      const conflictLabels = actionConflicts.map(conflictAction => 
        HOTKEY_LABELS[conflictAction] || conflictAction
      ).join(', ');
      return `Conflicts with: ${conflictLabels}`;
    }
    
    return null;
  };

  return (
    <FormSection
      id="hotkeys"
      title="Hotkey Configuration"
      description="Configure keyboard shortcuts for different screenshot and recording actions"
    >
      {(hasErrors || hasConflicts) && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          mb="lg"
        >
          Please resolve hotkey conflicts and validation errors before proceeding.
        </Alert>
      )}
      
      <div className="hotkey-config__grid">
        {Object.values(HOTKEY_ACTIONS).map((action) => {
          const error = getHotkeyError(action);
          const hasConflict = conflicts[action] && conflicts[action].length > 0;
          
          return (
            <div
              key={action}
              className={`hotkey-config__item ${hasConflict ? 'hotkey-config__item--conflict' : ''}`}
            >
              <div>
                <div className="hotkey-config__label">
                  <IconKeyboard size={16} style={{ marginRight: '8px' }} />
                  {HOTKEY_LABELS[action]}
                </div>
                <div className="hotkey-config__description">
                  {HOTKEY_DESCRIPTIONS[action]}
                </div>
                {settings.hotkeys[action] && (
                  <div style={{ marginTop: '8px' }}>
                    <Kbd>{formatHotkeyDisplay(settings.hotkeys[action])}</Kbd>
                  </div>
                )}
              </div>
              
              <div style={{ minWidth: '200px' }}>
                <FormField
                  error={error}
                >
                  <TextInput
                    placeholder="e.g. CommandOrControl+Shift+1"
                    value={settings.hotkeys[action] || ''}
                    onChange={(event) => handleHotkeyChange(action, event.target.value)}
                    error={!!error}
                    size="sm"
                  />
                </FormField>
              </div>
            </div>
          );
        })}
      </div>
      
      <Alert
        icon={<IconKeyboard size={16} />}
        color="blue"
        mt="lg"
      >
        <strong>Hotkey Format:</strong> Use modifiers like CommandOrControl, Alt, Shift followed by a key.
        <br />
        <strong>Examples:</strong> CommandOrControl+Shift+1, Alt+F4, CommandOrControl+Alt+S
      </Alert>
    </FormSection>
  );
};

export default HotkeyConfig;
