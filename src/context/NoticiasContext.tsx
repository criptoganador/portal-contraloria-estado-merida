import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { noticias as mockNoticias } from '../data/mockData';
import { useAuth } from './AuthContext';

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
  total: number;
  totalPages: number;
  loading: boolean;
  fetchNoticias: (page?: number, limit?: number, search?: string, categoria?: string) => Promise<void>;
  agregarNoticia: (noticia: Omit<Noticia, 'id'>) => void;
  editarNoticia: (id: number, noticia: Omit<Noticia, 'id'>) => void;
  eliminarNoticia: (id: number) => void;
}

const NoticiasContext = createContext<NoticiasContextType | undefined>(undefined);

export function NoticiasProvider({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNoticias = async (page = 1, limit = 10, search = '', categoria = 'Todos') => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (categoria && categoria !== 'Todos') params.append('categoria', categoria);

      const res = await fetch(`${API_URL}/noticias?${params.toString()}`);
      if (!res.ok) throw new Error('Error al obtener noticias');
      
      const data = await res.json();
      setNoticias(data.data || data); // data.data is from new API, data is fallback
      setTotal(data.total || data.length || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error al obtener noticias de la API, usando fallback local:", err);
      const saved = localStorage.getItem('site_noticias');
      let fallbackData: Noticia[] = mockNoticias as Noticia[];
      if (saved) {
        try {
          fallbackData = JSON.parse(saved);
        } catch {
          // fallback to mockNoticias
        }
      }
      setNoticias(fallbackData);
      setTotal(fallbackData.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNoticias();
  }, []);

  const agregarNoticia = async (nueva: Omit<Noticia, 'id'>) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/noticias`, {
        method: 'POST',
        headers,
        body: JSON.stringify(nueva),
      });
      if (!res.ok) throw new Error('Error al crear la noticia en el servidor');
      const creada = await res.json();
      setNoticias((prev) => [creada, ...prev]);
    } catch (err) {
      console.error("Error al guardar noticia en Neon, guardando localmente:", err);
      const maxId = noticias.reduce((max, n) => Math.max(max, n.id), 0);
      const tempNueva = { id: maxId + 1, ...nueva } as Noticia;
      const updated = [tempNueva, ...noticias];
      setNoticias(updated);
      localStorage.setItem('site_noticias', JSON.stringify(updated));
    }
  };

  const editarNoticia = async (id: number, editada: Omit<Noticia, 'id'>) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/noticias/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editada),
      });
      if (!res.ok) throw new Error('Error al actualizar la noticia en el servidor');
      const actualizada = await res.json();
      setNoticias((prev) => prev.map((n) => (n.id === id ? actualizada : n)));
    } catch (err) {
      console.error("Error al editar noticia en Neon, editando localmente:", err);
      const updated = noticias.map((n) => (n.id === id ? { id, ...editada } : n));
      setNoticias(updated);
      localStorage.setItem('site_noticias', JSON.stringify(updated));
    }
  };

  const eliminarNoticia = async (id: number) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/noticias/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Error al eliminar la noticia en el servidor');
      setNoticias((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error al eliminar noticia en Neon, eliminando localmente:", err);
      const updated = noticias.filter((n) => n.id !== id);
      setNoticias(updated);
      localStorage.setItem('site_noticias', JSON.stringify(updated));
    }
  };

  return (
    <NoticiasContext.Provider value={{ noticias, total, totalPages, loading, fetchNoticias, agregarNoticia, editarNoticia, eliminarNoticia }}>
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
