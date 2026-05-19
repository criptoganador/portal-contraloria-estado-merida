import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { noticias as mockNoticias } from '../data/mockData';

export interface Noticia {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  contenido: string;
  imagen: string; // URL o Base64
  publicada: boolean;
  resumen?: string;
}

interface NoticiasContextType {
  noticias: Noticia[];
  agregarNoticia: (noticia: Omit<Noticia, 'id'>) => void;
  editarNoticia: (id: number, noticia: Omit<Noticia, 'id'>) => void;
  eliminarNoticia: (id: number) => void;
}

const NoticiasContext = createContext<NoticiasContextType | undefined>(undefined);

export function NoticiasProvider({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>(() => {
    const saved = localStorage.getItem('site_noticias');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing noticias from local storage", e);
      }
    }
    // Si no hay nada guardado, usamos los mock data iniciales
    return mockNoticias as Noticia[];
  });

  useEffect(() => {
    localStorage.setItem('site_noticias', JSON.stringify(noticias));
  }, [noticias]);

  const agregarNoticia = (nueva: Omit<Noticia, 'id'>) => {
    setNoticias(prev => {
      const maxId = prev.reduce((max, n) => Math.max(max, n.id), 0);
      return [{ id: maxId + 1, ...nueva }, ...prev];
    });
  };

  const editarNoticia = (id: number, editada: Omit<Noticia, 'id'>) => {
    setNoticias(prev => prev.map(n => n.id === id ? { id, ...editada } : n));
  };

  const eliminarNoticia = (id: number) => {
    setNoticias(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NoticiasContext.Provider value={{ noticias, agregarNoticia, editarNoticia, eliminarNoticia }}>
      {children}
    </NoticiasContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNoticias() {
  const context = useContext(NoticiasContext);
  if (context === undefined) {
    throw new Error('useNoticias must be used within a NoticiasProvider');
  }
  return context;
}
