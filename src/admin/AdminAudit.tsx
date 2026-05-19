import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Search, Shield, History, Info, AlertTriangle } from 'lucide-react';

interface AuditLog {
  id: number;
  usuario_id: number | null;
  usuario_email: string;
  accion: string;
  detalles: string;
  fecha: string;
  ip: string;
}

export default function AdminAudit() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/admin/audit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('No se pudo obtener la bitácora de auditoría');
      }

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar con el servidor.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      Promise.resolve().then(() => {
        fetchLogs();
      });
    }
  }, [token, fetchLogs]);

  // Obtener acciones únicas para el selector de filtro
  const uniqueActions = ['ALL', ...Array.from(new Set(logs.map((log) => log.accion)))];

  // Filtrado de registros
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.usuario_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detalles.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery);

    const matchesFilter = filterAction === 'ALL' || log.accion === filterAction;

    return matchesSearch && matchesFilter;
  });

  // Helper para asignar color a los badges de acciones
  const getActionBadgeStyle = (action: string) => {
    if (action.includes('EXITOSO')) {
      return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
    }
    if (action.includes('FALLIDO') || action.includes('ERROR')) {
      return 'bg-rose-950/60 text-rose-300 border-rose-800/80';
    }
    if (action.startsWith('CREAR')) {
      return 'bg-blue-950/60 text-blue-300 border-blue-800/80';
    }
    if (action.startsWith('ELIMINAR')) {
      return 'bg-amber-950/60 text-amber-300 border-amber-800/80';
    }
    if (action.startsWith('EDITAR') || action.includes('CONFIGURACION')) {
      return 'bg-purple-950/60 text-purple-300 border-purple-800/80';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  // Formatear fecha
  const formatFecha = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('es-VE', {
        timeZone: 'America/Caracas',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-7 h-7 text-amber-500" />
            Bitácora de Auditoría
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Historial de acciones administrativas y eventos de seguridad del portal.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar Registros
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por correo, IP, detalles o acción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="ALL">Todas las acciones</option>
            {uniqueActions
              .filter((a) => a !== 'ALL')
              .map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-950/40 border border-red-800/80 text-red-200 px-4 py-3.5 rounded-xl text-sm font-medium flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Fecha y Hora</th>
                <th className="py-4 px-6">Usuario</th>
                <th className="py-4 px-6">Acción</th>
                <th className="py-4 px-6">Detalles</th>
                <th className="py-4 px-6 text-center">Dirección IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
                    Cargando bitácora...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Info className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                    No se encontraron registros de auditoría que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 text-xs text-slate-400 font-mono">
                      {formatFecha(log.fecha)}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-white max-w-[180px] truncate">
                      {log.usuario_email}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getActionBadgeStyle(
                          log.accion
                        )}`}
                      >
                        {log.accion}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-300 max-w-[320px] break-words">
                      {log.detalles}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono text-xs text-slate-400">
                      {log.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer info */}
        <div className="bg-slate-900/30 border-t border-slate-800 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredLogs.length} registros de auditoría</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" /> Sistema Protegido
          </span>
        </div>
      </div>
    </div>
  );
}
