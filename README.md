# Screenshot Tool

A cross-platform desktop application built with ElectronJS and React for taking screenshots and recording screen captures with customizable keyboard shortcuts, optional editing, and automatic FTP upload.

## Features

- **Screenshot with Selection**: Capture a selected area of the screen
- **Screenshot with Editor**: Capture with selection and open editor for annotations
- **Video Recording**: Record selected area or fullscreen
- **Fullscreen Capture**: Instant screenshot of active monitor
- **Multiple Monitor Support**: Automatically detects and targets the active monitor
- **FTP Upload**: Automatic upload to FTP server with URL copying
- **Customizable Shortcuts**: Set your own global keyboard shortcuts
- **System Tray Integration**: Runs quietly in the background

## Technology Stack

- **Frontend**: React + SCSS + Tailwind CSS
- **Desktop Shell**: ElectronJS
- **State Management**: Zustand
- **Build Tools**: Vite + Electron Builder

## Project Structure

```
src/
├── main/                    # Electron main process
│   ├── app.js              # Main application class
│   ├── main.js             # Entry point
│   ├── preload.js          # Main window preload script
│   ├── overlay-preload.js  # Overlay window preload script
│   └── managers/           # Modular managers
│       ├── capture-manager.js
│       ├── ftp-manager.js
│       ├── ipc-manager.js
│       ├── settings-manager.js
│       ├── shortcut-manager.js
│       ├── tray-manager.js
│       └── window-manager.js
├── renderer/               # React frontend
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── tabs/          # Settings tabs
│   │   └── overlay/       # Overlay components
│   ├── hooks/             # Custom React hooks
│   ├── store/             # State management
│   ├── styles/            # SCSS stylesheets
│   └── utils/             # Utility functions
└── styles/                # Global styles
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm start` - Start the Electron app
- `npm run dev` - Start development with hot reload
- `npm run build` - Build for production
- `npm run dist` - Build and package for distribution

## Configuration

The app stores settings using `electron-store`. You can configure:

- **Keyboard Shortcuts**: Customize global shortcuts for each action
- **Local Save Path**: Where to save screenshots locally
- **FTP Settings**: Server details for automatic upload
- **UI Preferences**: Image/video formats, notifications, etc.

## Keyboard Shortcuts (Default)

- `Cmd/Ctrl + Shift + 1` - Screenshot with Selection
- `Cmd/Ctrl + Shift + 2` - Screenshot with Editor
- `Cmd/Ctrl + Shift + 3` - Video Recording with Selection
- `Cmd/Ctrl + Shift + 4` - Fullscreen Screenshot
- `Cmd/Ctrl + Shift + 5` - Fullscreen Screenshot with Editor
- `Cmd/Ctrl + Shift + 6` - Fullscreen Video Recording

## Code Architecture

The application follows a modular architecture:

### Main Process (Electron)
- **App.js**: Main application coordinator
- **Managers**: Separate managers for different concerns (windows, shortcuts, capture, etc.)
- **Clean separation**: Each manager handles a specific domain

### Renderer Process (React)
- **Component-based**: Small, focused components
- **Hooks**: Custom hooks for state management
- **UI Components**: Reusable UI elements
- **Store**: Zustand for state management

### Benefits of This Architecture
- **Maintainable**: Small files, clear responsibilities
- **Testable**: Isolated modules are easier to test
- **Scalable**: Easy to add new features
- **Readable**: Clear separation of concerns

## Building for Production

1. Build the React app:
   ```bash
   npm run build
   ```

2. Package the Electron app:
   ```bash
   npm run dist
   ```

## License

MIT License - see LICENSE file for details.