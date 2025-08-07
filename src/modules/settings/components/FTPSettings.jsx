import React from 'react';
import { TextInput, NumberInput, PasswordInput, Button, Text, Alert } from '@mantine/core';
import { IconServer, IconCheck, IconX, IconLoader } from '@tabler/icons-react';
import FormSection from '../../common/Form/FormSection.jsx';
import FormField from '../../common/Form/FormField.jsx';
import { useFTPValidation } from '../hooks/useFTPValidation.js';
import { useSettingsStore } from '../../../store/settingsStore.js';

const FTPSettings = () => {
  const { settings, updateFTPSettings } = useSettingsStore();
  const { 
    errors, 
    isTestingConnection, 
    connectionStatus, 
    testConnection, 
    hasErrors 
  } = useFTPValidation();

  const handleFTPChange = (field, value) => {
    updateFTPSettings({ [field]: value });
  };

  const handleToggleEnabled = (enabled) => {
    updateFTPSettings({ enabled });
  };

  const getStatusIcon = () => {
    if (!connectionStatus) return null;
    
    switch (connectionStatus.type) {
      case 'success':
        return <IconCheck size={16} />;
      case 'error':
        return <IconX size={16} />;
      case 'loading':
        return <IconLoader size={16} />;
      default:
        return null;
    }
  };

  return (
    <FormSection
      id="ftp"
      title="FTP Upload Settings"
      description="Configure FTP server settings for automatic file uploads"
      toggle={settings.ftp.enabled}
      onToggleChange={handleToggleEnabled}
      enabled={settings.ftp.enabled}
    >
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
          <FormField
            label="Host"
            description="FTP server hostname or IP address"
            error={errors.host}
            required={settings.ftp.enabled}
          >
            <TextInput
              placeholder="ftp.example.com"
              value={settings.ftp.host}
              onChange={(event) => handleFTPChange('host', event.target.value)}
              error={!!errors.host}
              disabled={!settings.ftp.enabled}
            />
          </FormField>
          
          <FormField
            label="Port"
            description="FTP server port (usually 21)"
            error={errors.port}
            required={settings.ftp.enabled}
          >
            <NumberInput
              placeholder="21"
              value={settings.ftp.port}
              onChange={(value) => handleFTPChange('port', value)}
              error={!!errors.port}
              min={1}
              max={65535}
              disabled={!settings.ftp.enabled}
            />
          </FormField>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <FormField
            label="Username"
            error={errors.username}
            required={settings.ftp.enabled}
          >
            <TextInput
              placeholder="your-username"
              value={settings.ftp.username}
              onChange={(event) => handleFTPChange('username', event.target.value)}
              error={!!errors.username}
              disabled={!settings.ftp.enabled}
            />
          </FormField>
          
          <FormField
            label="Password"
            error={errors.password}
            required={settings.ftp.enabled}
          >
            <PasswordInput
              placeholder="your-password"
              value={settings.ftp.password}
              onChange={(event) => handleFTPChange('password', event.target.value)}
              error={!!errors.password}
              disabled={!settings.ftp.enabled}
            />
          </FormField>
        </div>
        
        <FormField
          label="Remote Path"
          description="Directory path on the FTP server where files will be uploaded"
          error={errors.remotePath}
        >
          <TextInput
            placeholder="/screenshots"
            value={settings.ftp.remotePath}
            onChange={(event) => handleFTPChange('remotePath', event.target.value)}
            error={!!errors.remotePath}
            disabled={!settings.ftp.enabled}
          />
        </FormField>
        
        <FormField
          label="URL Prefix"
          description="Base URL that will be combined with filename to create the final URL"
          error={errors.urlPrefix}
        >
          <TextInput
            placeholder="https://your-domain.com"
            value={settings.ftp.urlPrefix}
            onChange={(event) => handleFTPChange('urlPrefix', event.target.value)}
            error={!!errors.urlPrefix}
            disabled={!settings.ftp.enabled}
          />
        </FormField>
        
        {settings.ftp.enabled && (
          <div>
            <Button
              leftSection={<IconServer size={16} />}
              onClick={testConnection}
              loading={isTestingConnection}
              disabled={hasErrors}
              className="test-connection__button"
            >
              Test Connection
            </Button>
            
            {connectionStatus && (
              <div className={`test-connection__status test-connection__status--${connectionStatus.type}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getStatusIcon()}
                  <Text size="sm">{connectionStatus.message}</Text>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default FTPSettings;
