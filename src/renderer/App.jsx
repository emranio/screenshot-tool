import React from 'react'
import { SettingsProvider } from './store/settings-provider.jsx'
import SettingsWindow from './components/SettingsWindow'
import ToastContainer from './components/ui/Toast'

function App() {
  return (
    <SettingsProvider>
      <div className="app">
        <SettingsWindow />
        <ToastContainer />
      </div>
    </SettingsProvider>
  )
}

export default App
