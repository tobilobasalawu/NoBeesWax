import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TempoDevtools } from "tempo-devtools"

// Wait for TempoDevtools initialization before rendering
async function initApp() {
  try {
    await TempoDevtools.init();
    
    // Only create root and render after successful initialization
    const root = createRoot(document.getElementById('root'))
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    console.error('Failed to initialize TempoDevtools:', error);
  }
}

initApp();
