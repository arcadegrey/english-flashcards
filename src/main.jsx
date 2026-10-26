import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const applyInitialTheme = () => {
  try {
    document.documentElement.classList.toggle('dark', localStorage.getItem('flashcards_theme') === 'dark')
  } catch {
    document.documentElement.classList.remove('dark')
  }
}

applyInitialTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
