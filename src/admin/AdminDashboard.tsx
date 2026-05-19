import { FileText, BookOpen, Mail, TrendingUp, Clock, ArrowRight } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: 'dashboard' | 'noticias' | 'documentos' | 'contralor') => void;
}

const metricas = [
  { label: 'Total Noticias', valor: 12, icono: FileText, color: 'bg-blue-500', cambio: '+2 esta semana' },
  { label: 'Gacetas Subidas', valor: 45, icono: BookOpen, color: 'bg-emerald-500', cambio: '+5 este mes' },
  { label: 'Mensajes de Contacto', valor: 3, icono: Mail, color: 'bg-amber-500', cambio: '1 sin leer' },
  { label: 'Visitas del Mes', valor: 1248, icono: TrendingUp, color: 'bg-purple-500', cambio: '+12% vs anterior' },
];

const actividadReciente = [
  { usuario: 'Juan Pérez', accion: 'subió la Gaceta Nro 402', tiempo: 'Hace 2 horas', tipo: 'documento' },
  { usuario: 'María López', accion: 'publicó la noticia "Jornada de Capacitación"', tiempo: 'Hace 5 horas', tipo: 'noticia' },
  { usuario: 'Carlos Rivas', accion: 'actualizó el perfil del Contralor', tiempo: 'Ayer, 3:45 PM', tipo: 'perfil' },
  { usuario: 'Ana Morales', accion: 'respondió el mensaje de contacto #127', tiempo: 'Ayer, 11:20 AM', tipo: 'mensaje' },
  { usuario: 'Juan Pérez', accion: 'subió la Resolución N° 003-2026', tiempo: 'Hace 2 días', tipo: 'documento' },
];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {metricas.map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`${m.color} p-2.5 rounded-lg text-white`}>
                <m.icono className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{m.valor.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">{m.cambio}</p>
          </div>
        ))}
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('noticias')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Nueva Noticia
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('documentos')}
              className="w-full flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-medium text-emerald-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Subir Documento
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contralor')}
              className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-sm font-medium text-amber-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Editar Perfil
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Actividad Reciente
          </h2>
          <div className="space-y-1">
            {actividadReciente.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 shrink-0 mt-0.5">
                  {item.usuario.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{item.usuario}</span>{' '}
                    {item.accion}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
