import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const applyInitialTheme = () => {
  try {
    localStorage.setItem('flashcards_theme', 'light')
    localStorage.setItem('flashcards_theme_explicit', '1')
    document.documentElement.classList.remove('dark')
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
