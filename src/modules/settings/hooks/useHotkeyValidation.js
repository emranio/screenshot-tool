import { useState, useEffect } from 'react';
import { validateHotkey, checkHotkeyConflicts } from '../../../utils/validation.js';
import { useSettingsStore } from '../../../store/settingsStore.js';

export const useHotkeyValidation = () => {
    const { settings } = useSettingsStore();
    const [errors, setErrors] = useState({});
    const [conflicts, setConflicts] = useState({});

    const validateSingleHotkey = (action, hotkey) => {
        const validation = validateHotkey(hotkey);
        const hotkeyConflicts = checkHotkeyConflicts(settings.hotkeys, action, hotkey);

        return {
            isValid: validation.isValid && hotkeyConflicts.length === 0,
            error: validation.error,
            conflicts: hotkeyConflicts
        };
    };

    const validateAllHotkeys = () => {
        const newErrors = {};
        const newConflicts = {};

        Object.entries(settings.hotkeys).forEach(([action, hotkey]) => {
            const validation = validateSingleHotkey(action, hotkey);

            if (!validation.isValid) {
                if (validation.error) {
                    newErrors[action] = validation.error;
                }
                if (validation.conflicts.length > 0) {
                    newConflicts[action] = validation.conflicts;
                }
            }
        });

        setErrors(newErrors);
        setConflicts(newConflicts);

        return {
            hasErrors: Object.keys(newErrors).length > 0,
            hasConflicts: Object.keys(newConflicts).length > 0,
            errors: newErrors,
            conflicts: newConflicts
        };
    };

    useEffect(() => {
        validateAllHotkeys();
    }, [settings.hotkeys]);

    return {
        errors,
        conflicts,
        validateSingleHotkey,
        validateAllHotkeys,
        hasErrors: Object.keys(errors).length > 0,
        hasConflicts: Object.keys(conflicts).length > 0
    };
};
