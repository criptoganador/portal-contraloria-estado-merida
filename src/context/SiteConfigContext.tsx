import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SiteConfig {
  titulo: string;
  subtitulo: string;
  logoBase64: string; // Puede ser un SVG (string) o base64
  navColor: string;
  heroTitulo: string;
  heroTexto: string;
  heroImagenesBase64: string[];
  contactoDireccion: string;
  contactoTelefono: string;
  contactoEmail: string;
  contactoHorario: string;
  redesFacebook: string;
  redesTwitter: string;
  redesInstagram: string;
  redesYoutube: string;
  botonesAcceso: { label: string; desc: string; to: string; color: string; icono: string }[];
}

const defaultConfig: SiteConfig = {
  titulo: 'Contraloría del',
  subtitulo: 'Estado Mérida',
  logoBase64: '', // Por defecto usamos el de SVG inline si esto está vacío
  navColor: '#172554', // Hex para bg-blue-950 de Tailwind
  heroTitulo: 'Transparencia y Control Fiscal',
  heroTexto: 'Órgano de control fiscal del Estado Mérida, comprometido con la vigilancia de los recursos públicos, la rendición de cuentas y el fortalecimiento de la gestión pública.',
  heroImagenesBase64: [],
  contactoDireccion: 'Av. 3 Independencia, Edificio Contraloría del Estado, Mérida, Estado Mérida, Venezuela',
  contactoTelefono: '(0274) 252-5555 / 252-6666',
  contactoEmail: 'contacto@contraloriaestadomerida.gob.ve',
  contactoHorario: 'Lunes a Viernes: 8:00 AM – 4:00 PM',
  redesFacebook: '',
  redesTwitter: '',
  redesInstagram: '',
  redesYoutube: '',
  botonesAcceso: [
    { label: 'Control Fiscal', desc: 'Vigilancia y fiscalización', to: '/competencias', color: 'bg-blue-600', icono: 'Shield' },
    { label: 'Marco Legal', desc: 'Gacetas y resoluciones', to: '/marco-legal', color: 'bg-emerald-600', icono: 'FileText' },
    { label: 'Rendición de Cuentas', desc: 'Transparencia pública', to: '/institucion', color: 'bg-amber-600', icono: 'BarChart3' },
    { label: 'Atención Ciudadana', desc: 'Contacto y denuncias', to: '/contacto', color: 'bg-purple-600', icono: 'Users' },
  ],
};

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultConfig, ...parsed };
      } catch (e) {
        console.error("Error parsing site config from local storage", e);
      }
    }
    return defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('site_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
