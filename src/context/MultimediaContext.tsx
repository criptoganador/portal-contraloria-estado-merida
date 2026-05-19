import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Video {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'youtube' | 'local';
  src: string; // URL de youtube o base64 del MP4
  fecha: string;
}

const mockVideos: Video[] = [
  {
    id: 1,
    titulo: 'Presentación Institucional - Contraloría del Estado Mérida',
    descripcion: 'Conoce nuestro rol, funciones y el compromiso que tenemos con la vigilancia fiscal de los recursos públicos.',
    tipo: 'youtube',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    fecha: '2026-05-01'
  },
  {
    id: 2,
    titulo: 'Taller de Contraloría Social y Participación Ciudadana',
    descripcion: 'Resumen de las actividades de capacitación comunitaria dictadas por la Oficina de Atención al Ciudadano.',
    tipo: 'youtube',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    fecha: '2026-04-15'
  }
];

interface DBVideo {
  id: number;
  titulo: string;
  descripcion?: string;
  tipo: 'youtube' | 'local';
  src: string;
  fecha: string;
}

interface MultimediaContextType {
  videos: Video[];
  agregarVideo: (video: Omit<Video, 'id'>) => Promise<void>;
  eliminarVideo: (id: number) => Promise<void>;
}

const MultimediaContext = createContext<MultimediaContextType | undefined>(undefined);

export function MultimediaProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_URL}/videos`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener videos');
        return res.json();
      })
      .then((data: DBVideo[]) => {
        const mapped = data.map((v) => ({
          id: v.id,
          titulo: v.titulo,
          descripcion: v.descripcion || '',
          tipo: v.tipo || 'youtube',
          src: v.src,
          fecha: v.fecha.split('T')[0]
        }));
        setVideos(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener videos de la API, usando fallback:", err);
        const saved = localStorage.getItem('site_videos');
        if (saved) {
          try {
            setVideos(JSON.parse(saved));
          } catch (e) {
            console.error("Error al parsear videos locales:", e);
            setVideos(mockVideos);
          }
        } else {
          setVideos(mockVideos);
        }
        setLoading(false);
      });
  }, []);

  const agregarVideo = async (nuevo: Omit<Video, 'id'>) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevo),
      });
      if (!res.ok) throw new Error('Error al guardar el video en el servidor');
      const creado: DBVideo = await res.json();
      const mapped = {
        id: creado.id,
        titulo: creado.titulo,
        descripcion: creado.descripcion || '',
        tipo: creado.tipo || 'youtube',
        src: creado.src,
        fecha: creado.fecha.split('T')[0]
      };
      setVideos((prev) => [mapped, ...prev]);
    } catch (err) {
      console.error("Error al guardar en Neon, guardando localmente:", err);
      const maxId = videos.reduce((max, v) => Math.max(max, v.id), 0);
      const tempNuevo = { id: maxId + 1, ...nuevo };
      const updated = [tempNuevo, ...videos];
      setVideos(updated);
      localStorage.setItem('site_videos', JSON.stringify(updated));
    }
  };

  const eliminarVideo = async (id: number) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/videos/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Error al eliminar el video en el servidor');
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Error al eliminar de Neon, eliminando localmente:", err);
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      localStorage.setItem('site_videos', JSON.stringify(updated));
    }
  };

  return (
    <MultimediaContext.Provider value={{ videos, agregarVideo, eliminarVideo }}>
      {!loading && children}
    </MultimediaContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMultimedia() {
  const context = useContext(MultimediaContext);
  if (context === undefined) {
    throw new Error('useMultimedia must be used within a MultimediaProvider');
  }
  return context;
}
