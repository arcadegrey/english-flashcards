import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const applyInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('flashcards_theme')
    const hasThemePreference = localStorage.getItem('flashcards_theme_explicit') === '1'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = hasThemePreference ? savedTheme === 'dark' : prefersDark

    document.documentElement.classList.toggle('dark', shouldUseDark)
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
