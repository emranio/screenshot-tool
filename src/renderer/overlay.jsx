import React from 'react'
import ReactDOM from 'react-dom/client'
import OverlayApp from './components/OverlayApp'
import '../styles/overlay.scss'

ReactDOM.createRoot(document.getElementById('overlay-container')).render(
  <React.StrictMode>
    <OverlayApp />
  </React.StrictMode>,
)
