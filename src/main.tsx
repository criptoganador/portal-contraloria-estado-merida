import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteConfigProvider } from './context/SiteConfigContext'
import { NoticiasProvider } from './context/NoticiasContext'
import { DocumentosProvider } from './context/DocumentosContext'
import { MultimediaProvider } from './context/MultimediaContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SiteConfigProvider>
        <NoticiasProvider>
          <DocumentosProvider>
            <MultimediaProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </MultimediaProvider>
          </DocumentosProvider>
        </NoticiasProvider>
      </SiteConfigProvider>
    </AuthProvider>
  </StrictMode>,
)
