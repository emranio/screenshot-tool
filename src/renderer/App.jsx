import React from 'react'
import { SettingsProvider } from './store/settings-provider.jsx'
import SettingsWindow from './components/SettingsWindow'

function App() {
  return (
    <SettingsProvider>
      <div className="app">
        <SettingsWindow />
      </div>
    </SettingsProvider>
  )
}

export default App
