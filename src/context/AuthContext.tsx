import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
}

interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tiempo de inactividad antes de cerrar sesión automáticamente (30 minutos)
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('admin_token');
  });
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Error restaurando usuario:', e);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    return null;
  });
  const [loading] = useState(false);

  const login = async (email: string, contrasena: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: contrasena }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    const data = await res.json();
    setToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.usuario));
  };

  const logout = useCallback(() => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }, []);

  // ─── Desconexión automática por inactividad ────────────────────
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.warn('Sesión cerrada por inactividad (30 minutos).');
      logout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    // Solo activar el detector de inactividad si hay una sesión activa
    if (!token) return;

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];

    // Iniciar el temporizador al montar
    resetInactivityTimer();

    // Reajustar el temporizador en cada interacción del usuario
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    return () => {
      // Limpiar listeners y temporizador al desmontar o al cambiar de estado
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [token, resetInactivityTimer]);

  return (
    <AuthContext.Provider value={{ token, usuario, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
