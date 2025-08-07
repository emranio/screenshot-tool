# 📌 Specification Document: Desktop Screenshot & Recording Tool

### Overview

This project is a **cross-platform desktop application** built with **ElectronJS** and **React**, designed for **Windows and macOS**.
It enables users to take screenshots or record screen captures with customizable keyboard shortcuts, with optional editing and automatic FTP upload.

The application must work seamlessly with **multiple monitors** of different resolutions, always targeting the **currently active monitor** when a shortcut is triggered.

---

## 1. Technology Stack

* **Frontend:** React (NO TYPESCRIPT) + SCSS + tailwind (no CSSinJS)
* **Desktop Shell:** ElectronJS
* **Screenshot / Video Capture:** Electron’s native APIs + `nashaofu/screenshots` for editing: https://github.com/nashaofu/screenshots
* **Clipboard:** Electron Clipboard API
* **FTP Upload:** `basic-ftp` npm package (or equivalent)
* **State Management:** Zustand
* **Build Tools:** Electron Forge or Vite with Electron builder

---

## 2. Core Features

### 2.1 Settings Window

* **Hotkey configuration** for each action (user can set or change global shortcuts).
* **FTP settings**:

  * Host, Port, Username, Password, Remote Path.
  * If fields are left empty, uploading is disabled.
* **Local save location**:

  * Default path configurable.
  * If empty, no files are saved locally.
* **UI controls** for toggling upload/save behavior.
* **Validation** for hotkey conflicts.

---

### 2.2 Actions

#### **Action 1: Screenshot with Selection → Save + Upload**

* User presses assigned shortcut.
* App detects **current active monitor**.
* Captures **entire active monitor** as an image (invisible to the user).
* Opens a **borderless fullscreen overlay window** (kiosk mode) on the same monitor.
* The captured image is displayed as a static background.
* User selects a rectangular area:

  * Drag-and-select with mouse.
  * Selection highlighted with semi-transparent overlay.
* On mouse release:

  * Crop the selected area.
  * Save cropped image to local path (if set).
  * Upload via FTP (if enabled).
  * Copy resulting remote URL to clipboard.

---

#### **Action 2: Screenshot with Editing Toolbar**

* Same as Action 1, but after area selection:
* Launch embedded editor using [nashaofu/screenshots](https://github.com/nashaofu/screenshots).
* User can annotate, draw shapes, blur, or highlight.
* Once editing is finished:

  * Save, upload, and copy URL as in Action 1.

---

#### **Action 3: Video Recording with Selection**

* Shortcut triggers full-monitor capture (as in Action 1).
* Overlay fullscreen window appears.
* User selects area for recording.
* Recording starts after confirmation (small floating toolbar).
* User can stop recording via:

  * Floating toolbar stop button.
  * Assigned hotkey.
* On stop:

  * Save MP4/WebM locally (if set).
  * Upload via FTP (if enabled).
  * Copy URL.

---

#### **Action 4: Fullscreen Screenshot**

* Shortcut triggers instant screenshot of active monitor.
* No selection step.
* Automatically save, upload, copy URL.

---

#### **Action 5: Fullscreen Screenshot with Editing**

* Like Action 4, but launches editor for annotations before save/upload.

---

#### **Action 6: Fullscreen Recording**

* Shortcut triggers recording of entire active monitor.
* Small floating toolbar: Stop, Pause, Cancel.
* On stop: save, upload, copy URL.

---

## 3. Overlay Capture Mechanism (Detailed)

This is the **critical user flow**:

1. **Shortcut Fired**

   * Global hotkey captured via Electron globalShortcut API.
   * Determine the **active monitor** (window under cursor).

2. **Screen Capture**

   * Use Electron `desktopCapturer` to capture the **entire active monitor** as a bitmap.
   * Hide the main Electron window (if open).

3. **Overlay Window Initialization**

   * Open a **borderless, fullscreen Electron BrowserWindow** on the active monitor.
   * Properties:

     * `fullscreen: true`
     * `frame: false`
     * `resizable: false`
     * `alwaysOnTop: true`
     * `transparent: true`
     * `kiosk: true` (no exit buttons, no OS chrome)

4. **Rendering the Screenshot**

   * Render the captured monitor image as the **background** of the overlay window.
   * Disable system interactions (e.g., user cannot alt-tab easily).
   * Overlay a semi-transparent black layer at 40–60% opacity.

5. **Selection Interaction**

   * Mouse click and drag to define a rectangle.
   * As the user drags:

     * Dark overlay remains everywhere except selection area (showing the original screenshot).
     * Dimensions displayed in a floating tooltip.
   * On mouse release:

     * Selected region coordinates saved.
     * Overlay closes automatically.

6. **Post-Selection Flow**

   * If editing required: open editing toolbar in overlay (Action 2 / 5).
   * Otherwise: crop captured image and continue to save/upload pipeline.

7. **Performance & UX Requirements**

   * Must not show flicker between capture and overlay.
   * User should feel like the screen froze naturally.
   * Cursor must remain visible and responsive.
   * Must support dual-monitor setups with different resolutions.

     * Overlay always launches on the **monitor where the cursor currently is**.

---

## 4. File Handling

* **File Format**:

  * Screenshots: PNG by default (JPEG optional in settings).
  * Video: MP4 (H.264) or WebM.
* **Naming Convention**:

  * Format: `screenshot_YYYYMMDD_HHMMSS.png`
  * Same for video.
* **Temporary Storage**:

  * All captures first written to a temp directory.
  * Then copied/moved to configured save path if set.

---

## 5. Upload Mechanism

* FTP Upload via `basic-ftp`.
* Target path from settings.
* Remote URL generated based on configured domain prefix (e.g., `https://myserver.com/screenshots/filename.png`).
* On successful upload:

  * Remote URL copied to clipboard.
* On failure:

  * Local file path copied instead.

---

## 6. Security & Permissions

* **macOS**: App must request Screen Recording permission (System Preferences → Security & Privacy → Screen Recording).
* **Windows**: No explicit permission needed, but must handle UAC properly.
* FTP credentials stored securely (preferably encrypted with OS keychain APIs).

---

## 7. Future-Proofing (Optional)

* Support for SFTP in addition to FTP.
* Integration with cloud storage (Dropbox, Google Drive, S3).
* Option for GIF recording for short loops.

---

Would you like me to also draft a **sequence diagram** (or flow diagram) showing the **overlay capture flow** step by step? That would make the mechanism crystal clear for your AI coder.
