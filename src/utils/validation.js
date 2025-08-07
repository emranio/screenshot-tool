// Validation utilities
export const validateHotkey = (hotkey) => {
    if (!hotkey || typeof hotkey !== 'string') {
        return { isValid: false, error: 'Hotkey is required' };
    }

    const parts = hotkey.split('+');
    if (parts.length < 2) {
        return { isValid: false, error: 'Hotkey must include at least one modifier and one key' };
    }

    const key = parts[parts.length - 1];
    const modifiers = parts.slice(0, -1);

    // Check if key is valid
    const validKeys = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
        'Space', 'Tab', 'Enter', 'Escape', 'Backspace', 'Delete',
        'Up', 'Down', 'Left', 'Right'
    ];

    if (!validKeys.includes(key)) {
        return { isValid: false, error: `Invalid key: ${key}` };
    }

    // Check if modifiers are valid
    const validModifiers = ['CommandOrControl', 'Alt', 'Shift', 'Super'];
    for (const modifier of modifiers) {
        if (!validModifiers.includes(modifier)) {
            return { isValid: false, error: `Invalid modifier: ${modifier}` };
        }
    }

    return { isValid: true };
};

export const checkHotkeyConflicts = (hotkeys, currentKey, currentValue) => {
    const conflicts = [];

    Object.entries(hotkeys).forEach(([key, value]) => {
        if (key !== currentKey && value === currentValue && value.trim() !== '') {
            conflicts.push(key);
        }
    });

    return conflicts;
};

export const validateFTPSettings = (ftpSettings) => {
    const errors = {};

    if (ftpSettings.enabled) {
        if (!ftpSettings.host || ftpSettings.host.trim() === '') {
            errors.host = 'Host is required when FTP is enabled';
        } else {
            // Basic hostname/IP validation
            const hostRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$|^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!hostRegex.test(ftpSettings.host.trim())) {
                errors.host = 'Invalid host format';
            }
        }

        if (!ftpSettings.port || ftpSettings.port < 1 || ftpSettings.port > 65535) {
            errors.port = 'Port must be between 1 and 65535';
        }

        if (!ftpSettings.username || ftpSettings.username.trim() === '') {
            errors.username = 'Username is required when FTP is enabled';
        }

        if (!ftpSettings.password || ftpSettings.password.trim() === '') {
            errors.password = 'Password is required when FTP is enabled';
        }

        if (ftpSettings.urlPrefix && ftpSettings.urlPrefix.trim() !== '') {
            try {
                new URL(ftpSettings.urlPrefix);
            } catch {
                errors.urlPrefix = 'Invalid URL format';
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateLocalSettings = (localSettings) => {
    const errors = {};

    if (localSettings.enabled && localSettings.savePath) {
        // Basic path validation - more thorough validation would require file system access
        if (localSettings.savePath.trim() === '') {
            errors.savePath = 'Save path cannot be empty when local save is enabled';
        }
    }

    const validFormats = ['png', 'jpg', 'webp'];
    if (!validFormats.includes(localSettings.fileFormat)) {
        errors.fileFormat = 'Invalid file format';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const formatHotkeyDisplay = (hotkey) => {
    if (!hotkey) return '';

    return hotkey
        .replace('CommandOrControl', '⌘/Ctrl')
        .replace('Alt', '⌥/Alt')
        .replace('Shift', '⇧')
        .replace('Super', '⊞')
        .replace(/\+/g, ' + ');
};
