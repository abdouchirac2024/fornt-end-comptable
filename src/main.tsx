import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Supprimer les avertissements en mode développement
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('Download the React DevTools') || 
         args[0].includes('React has detected a change in the order of Hooks') ||
         args[0].includes('-webkit-text-size-adjust') ||
         args[0].includes('-moz-column-gap'))) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
