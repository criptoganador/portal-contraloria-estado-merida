import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { documentosLegales as mockDocs } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface Documento {
  id: number;
  titulo: string;
  fecha: string;
  categoria: string;
  archivo: string;
  estado: 'Publicado' | 'Borrador';
}

interface DBDocumento {
  id: number;
  titulo: string;
  fecha: string;
  categoria: string;
  archivo: string;
  estado?: 'Publicado' | 'Borrador';
}

interface DocumentosContextType {
  documentos: Documento[];
  total: number;
  totalPages: number;
  loading: boolean;
  fetchDocumentos: (page?: number, limit?: number, search?: string, categoria?: string) => Promise<void>;
  agregarDocumento: (doc: Omit<Documento, 'id'>) => Promise<void>;
  eliminarDocumento: (id: number) => Promise<void>;
}

const DocumentosContext = createContext<DocumentosContextType | undefined>(undefined);

export function DocumentosProvider({ children }: { children: ReactNode }) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();

  const fetchDocumentos = async (page = 1, limit = 10, search = '', categoria = 'Todos') => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (categoria && categoria !== 'Todos') params.append('categoria', categoria);

      const res = await fetch(`${API_URL}/documentos?${params.toString()}`);
      if (!res.ok) throw new Error('Error al obtener documentos');
      
      const resData = await res.json();
      const rawData = resData.data || resData; // data.data is from new API, data is fallback
      
      const mapped = rawData.map((d: DBDocumento) => ({
        id: d.id,
        titulo: d.titulo,
        fecha: d.fecha.split('T')[0],
        categoria: d.categoria,
        archivo: d.archivo || '#',
        estado: d.estado || 'Publicado'
      }));
      
      setDocumentos(mapped);
      setTotal(resData.total || rawData.length || 0);
      setTotalPages(resData.totalPages || 1);
    } catch (err) {
      console.error("Error al obtener documentos de la API, usando fallback local:", err);
      const saved = localStorage.getItem('site_documentos');
      let fallbackData: Documento[] = mockDocs as Documento[];
      if (saved) {
        try {
          fallbackData = JSON.parse(saved);
        } catch {
          // fallback to mockDocs
        }
      }
      setDocumentos(fallbackData);
      setTotal(fallbackData.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocumentos();
  }, []);

  const agregarDocumento = async (nuevo: Omit<Documento, 'id'>) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/documentos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevo),
      });
      if (!res.ok) throw new Error('Error al guardar el documento en el servidor');
      const creado: DBDocumento = await res.json();
      const mapped = {
        id: creado.id,
        titulo: creado.titulo,
        fecha: creado.fecha.split('T')[0],
        categoria: creado.categoria,
        archivo: creado.archivo || '#',
        estado: creado.estado || 'Publicado'
      } as Documento;
      setDocumentos((prev) => [mapped, ...prev]);
    } catch (err) {
      console.error("Error al guardar en Neon, guardando localmente:", err);
      const maxId = documentos.reduce((max, d) => Math.max(max, d.id), 0);
      const tempNuevo = { id: maxId + 1, ...nuevo };
      const updated = [tempNuevo, ...documentos];
      setDocumentos(updated);
      localStorage.setItem('site_documentos', JSON.stringify(updated));
    }
  };

  const eliminarDocumento = async (id: number) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/documentos/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Error al eliminar el documento en el servidor');
      setDocumentos((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error al eliminar de Neon, eliminando localmente:", err);
      const updated = documentos.filter((d) => d.id !== id);
      setDocumentos(updated);
      localStorage.setItem('site_documentos', JSON.stringify(updated));
    }
  };

  return (
    <DocumentosContext.Provider value={{ documentos, total, totalPages, loading, fetchDocumentos, agregarDocumento, eliminarDocumento }}>
      {children}
    </DocumentosContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDocumentos() {
  const context = useContext(DocumentosContext);
  if (context === undefined) {
    throw new Error('useDocumentos must be used within a DocumentosProvider');
  }
  return context;
}
