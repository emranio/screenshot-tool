import { useEffect } from 'react';
import { useForm } from 'rc-field-form';
import { useSettingsStore } from '../../../store/settingsStore.js';
import { debounce } from '../../../utils/helpers.js';

export const useSettingsForm = () => {
    const [form] = useForm();
    const {
        settings,
        updateSettings,
        saveSettings,
        hasUnsavedChanges,
        loadSettings,
        resetSettings
    } = useSettingsStore();

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        form.setFieldsValue(settings);
    }, [settings, form]);

    const handleFormChange = (changedValues, allValues) => {
        updateSettings(allValues);
    };

    const handleSave = () => {
        form.validateFields().then(() => {
            saveSettings();
        }).catch(errorInfo => {
            console.error('Validation failed:', errorInfo);
        });
    };

    const handleDiscard = () => {
        resetSettings();
    };

    return {
        form,
        settings,
        hasUnsavedChanges,
        handleFormChange,
        handleSave,
        handleDiscard
    };
};
