import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotesState from './context/NotesState.jsx'
import ToastProvider from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <NotesState>
        <App />
      </NotesState>
    </ToastProvider>
  </StrictMode>
)
