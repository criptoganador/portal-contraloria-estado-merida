import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteConfigProvider } from './context/SiteConfigContext'
import { NoticiasProvider } from './context/NoticiasContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteConfigProvider>
      <NoticiasProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NoticiasProvider>
    </SiteConfigProvider>
  </StrictMode>,
)
