// App constants
export const HOTKEY_ACTIONS = {
    SCREENSHOT_WITH_SELECTION: 'screenshotWithSelection',
    SCREENSHOT_WITH_EDITING: 'screenshotWithEditing',
    VIDEO_RECORDING_WITH_SELECTION: 'videoRecordingWithSelection',
    FULLSCREEN_SCREENSHOT: 'fullscreenScreenshot',
    FULLSCREEN_SCREENSHOT_WITH_EDITING: 'fullscreenScreenshotWithEditing',
    FULLSCREEN_RECORDING: 'fullscreenRecording'
};

export const HOTKEY_LABELS = {
    [HOTKEY_ACTIONS.SCREENSHOT_WITH_SELECTION]: 'Screenshot with Selection',
    [HOTKEY_ACTIONS.SCREENSHOT_WITH_EDITING]: 'Screenshot with Editing',
    [HOTKEY_ACTIONS.VIDEO_RECORDING_WITH_SELECTION]: 'Video Recording with Selection',
    [HOTKEY_ACTIONS.FULLSCREEN_SCREENSHOT]: 'Fullscreen Screenshot',
    [HOTKEY_ACTIONS.FULLSCREEN_SCREENSHOT_WITH_EDITING]: 'Fullscreen Screenshot with Editing',
    [HOTKEY_ACTIONS.FULLSCREEN_RECORDING]: 'Fullscreen Recording'
};

export const HOTKEY_DESCRIPTIONS = {
    [HOTKEY_ACTIONS.SCREENSHOT_WITH_SELECTION]: 'Take a screenshot by selecting an area on screen',
    [HOTKEY_ACTIONS.SCREENSHOT_WITH_EDITING]: 'Take a screenshot with selection and open editing tools',
    [HOTKEY_ACTIONS.VIDEO_RECORDING_WITH_SELECTION]: 'Record video by selecting an area on screen',
    [HOTKEY_ACTIONS.FULLSCREEN_SCREENSHOT]: 'Take a screenshot of the entire active monitor',
    [HOTKEY_ACTIONS.FULLSCREEN_SCREENSHOT_WITH_EDITING]: 'Take a fullscreen screenshot and open editing tools',
    [HOTKEY_ACTIONS.FULLSCREEN_RECORDING]: 'Record video of the entire active monitor'
};

export const DEFAULT_SETTINGS = {
    hotkeys: {
        [HOTKEY_ACTIONS.SCREENSHOT_WITH_SELECTION]: 'CommandOrControl+Shift+1',
        [HOTKEY_ACTIONS.SCREENSHOT_WITH_EDITING]: 'CommandOrControl+Shift+2',
        [HOTKEY_ACTIONS.VIDEO_RECORDING_WITH_SELECTION]: 'CommandOrControl+Shift+3',
        [HOTKEY_ACTIONS.FULLSCREEN_SCREENSHOT]: 'CommandOrControl+Shift+4',
        [HOTKEY_ACTIONS.FULLSCREEN_SCREENSHOT_WITH_EDITING]: 'CommandOrControl+Shift+5',
        [HOTKEY_ACTIONS.FULLSCREEN_RECORDING]: 'CommandOrControl+Shift+6'
    },
    ftp: {
        enabled: false,
        host: '',
        port: 21,
        username: '',
        password: '',
        remotePath: '/screenshots',
        urlPrefix: 'https://your-domain.com'
    },
    local: {
        enabled: true,
        savePath: '',
        fileFormat: 'png',
        namingConvention: 'screenshot_YYYYMMDD_HHMMSS'
    },
    ui: {
        autoCopyUrl: true,
        showNotifications: true,
        theme: 'light'
    }
};

export const FILE_FORMATS = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' }
];

export const VALID_HOTKEY_MODIFIERS = [
    'CommandOrControl',
    'Alt',
    'Shift',
    'Super'
];

export const VALID_HOTKEY_KEYS = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    'Space', 'Tab', 'Enter', 'Escape', 'Backspace', 'Delete',
    'Up', 'Down', 'Left', 'Right'
];
