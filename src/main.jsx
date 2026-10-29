import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/app-base.css'
import './styles/image-assets.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
