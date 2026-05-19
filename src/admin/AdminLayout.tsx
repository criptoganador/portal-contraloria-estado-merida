import { useState } from 'react';
import {
  LayoutDashboard, FileText, FilePlus, UserCheck, LogOut,
  Menu, ChevronRight, Shield, Settings, Video, KeyRound,
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminNoticias from './AdminNoticias';
import AdminDocumentos from './AdminDocumentos';
import AdminVideos from './AdminVideos';
import AdminContralor from './AdminContralor';
import AdminConfiguracion from './AdminConfiguracion';
import AdminAudit from './AdminAudit';
import AdminPassword from './AdminPassword';
import { useAuth } from '../context/AuthContext';

type AdminView = 'dashboard' | 'noticias' | 'documentos' | 'contralor' | 'videos' | 'configuracion' | 'audit' | 'password';

interface SidebarLink {
  id: AdminView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarLinks: SidebarLink[] = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'noticias', label: 'Gestión de Noticias', icon: FileText },
  { id: 'documentos', label: 'Repositorio Legal', icon: FilePlus },
  { id: 'videos', label: 'Gestión Multimedia', icon: Video },
  { id: 'contralor', label: 'Perfil del Contralor', icon: UserCheck },
  { id: 'configuracion', label: 'Configuración del Sitio', icon: Settings },
  { id: 'audit', label: 'Bitácora de Auditoría', icon: Shield },
  { id: 'password', label: 'Cambiar Contraseña', icon: KeyRound },
];

export default function AdminLayout() {
  const { usuario, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const usuarioInitials = usuario?.nombre
    ? usuario.nombre.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'AD';

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setCurrentView} />;
      case 'noticias':
        return <AdminNoticias />;
      case 'documentos':
        return <AdminDocumentos />;
      case 'videos':
        return <AdminVideos />;
      case 'contralor':
        return <AdminContralor />;
      case 'configuracion':
        return <AdminConfiguracion />;
      case 'audit':
        return <AdminAudit />;
      case 'password':
        return <AdminPassword />;
    }
  };

  const handleNavClick = (view: AdminView) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white flex flex-col transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo area */}
        <div className="p-5 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-950" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Panel Admin</p>
              <p className="text-blue-300 text-xs">Contraloría Mérida</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentView === link.id
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-200 hover:bg-blue-900 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {link.label}
              {currentView === link.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-blue-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-800 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {usuarioInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{usuario?.nombre || 'Administrador'}</p>
              <p className="text-xs text-blue-300">Administrador</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {sidebarLinks.find((l) => l.id === currentView)?.label || 'Dashboard'}
            </h1>
            <p className="text-xs text-gray-500">Panel de Administración</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
