import { useState, useEffect } from 'react';
import { validateFTPSettings } from '../../../utils/validation.js';
import { useSettingsStore } from '../../../store/settingsStore.js';

export const useFTPValidation = () => {
    const { settings } = useSettingsStore();
    const [errors, setErrors] = useState({});
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    const validateFTP = () => {
        const validation = validateFTPSettings(settings.ftp);
        setErrors(validation.errors);
        return validation;
    };

    const testConnection = async () => {
        if (!settings.ftp.enabled) {
            setConnectionStatus({
                type: 'error',
                message: 'FTP is not enabled'
            });
            return;
        }

        const validation = validateFTP();
        if (!validation.isValid) {
            setConnectionStatus({
                type: 'error',
                message: 'Please fix validation errors first'
            });
            return;
        }

        setIsTestingConnection(true);
        setConnectionStatus({
            type: 'loading',
            message: 'Testing connection...'
        });

        try {
            // Simulate connection test - in real app, this would call Electron main process
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock success/failure for demo
            const success = Math.random() > 0.3; // 70% success rate

            if (success) {
                setConnectionStatus({
                    type: 'success',
                    message: 'Connection successful!'
                });
            } else {
                setConnectionStatus({
                    type: 'error',
                    message: 'Connection failed: Invalid credentials or host not reachable'
                });
            }
        } catch (error) {
            setConnectionStatus({
                type: 'error',
                message: `Connection failed: ${error.message}`
            });
        } finally {
            setIsTestingConnection(false);
        }
    };

    const clearConnectionStatus = () => {
        setConnectionStatus(null);
    };

    useEffect(() => {
        validateFTP();
        // Clear connection status when settings change
        setConnectionStatus(null);
    }, [settings.ftp]);

    return {
        errors,
        isTestingConnection,
        connectionStatus,
        validateFTP,
        testConnection,
        clearConnectionStatus,
        hasErrors: Object.keys(errors).length > 0
    };
};
