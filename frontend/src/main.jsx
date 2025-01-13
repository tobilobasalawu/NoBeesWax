import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TempoDevtools } from "tempo-devtools"

// Initialize TempoDevtools before anything else
TempoDevtools.init();

// Create root after initialization
const root = createRoot(document.getElementById('root'))

// Render app
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
