import { useState, useRef } from 'react';
import { Plus, Trash2, Upload, X, Search, FileUp } from 'lucide-react';

interface DocumentoAdmin {
  id: number;
  titulo: string;
  tipo: 'Ley' | 'Gaceta' | 'Resolución' | 'Providencia' | 'Circular';
  fecha: string;
  estado: 'Publicado' | 'Borrador';
  archivo: string;
}

const documentosIniciales: DocumentoAdmin[] = [
  { id: 1, titulo: 'Ley Orgánica de la Contraloría General de la República', tipo: 'Ley', fecha: '2024-12-15', estado: 'Publicado', archivo: 'ley-organica.pdf' },
  { id: 2, titulo: 'Resolución N° 001-2026 — Normas para la Rendición de Cuentas', tipo: 'Resolución', fecha: '2026-01-20', estado: 'Publicado', archivo: 'res-001-2026.pdf' },
  { id: 3, titulo: 'Gaceta Oficial Nro 402 — Presupuesto Estadal', tipo: 'Gaceta', fecha: '2026-03-10', estado: 'Publicado', archivo: 'gaceta-402.pdf' },
  { id: 4, titulo: 'Providencia Administrativa N° 012 — Declaración Jurada', tipo: 'Providencia', fecha: '2026-02-10', estado: 'Borrador', archivo: 'prov-012.pdf' },
];

const tiposDocumento: DocumentoAdmin['tipo'][] = ['Ley', 'Gaceta', 'Resolución', 'Providencia', 'Circular'];

const formVacio = { titulo: '', tipo: 'Gaceta' as DocumentoAdmin['tipo'], fecha: new Date().toISOString().split('T')[0], archivo: '' };

export default function AdminDocumentos() {
  const [documentos, setDocumentos] = useState<DocumentoAdmin[]>(documentosIniciales);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [mensaje, setMensaje] = useState('');

  const docsFiltrados = documentos.filter((d) => {
    const matchBusqueda = d.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo === 'Todos' || d.tipo === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  const nextId = useRef(100);

  const publicar = () => {
    if (!form.titulo.trim()) return;
    const nuevo: DocumentoAdmin = {
      id: nextId.current++,
      titulo: form.titulo,
      tipo: form.tipo,
      fecha: form.fecha,
      estado: 'Publicado',
      archivo: form.archivo || 'documento.pdf',
    };
    setDocumentos((prev) => [nuevo, ...prev]);
    setForm(formVacio);
    setMostrarForm(false);
    mostrarMsg('Documento publicado exitosamente');
  };

  const eliminar = (id: number) => {
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
    mostrarMsg('Documento eliminado');
  };

  const mostrarMsg = (msg: string) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      {mensaje && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium">
          ✓ {mensaje}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Subir Documento
        </button>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {['Todos', ...tiposDocumento].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltroTipo(tipo)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filtroTipo === tipo
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Upload form */}
      {mostrarForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Subir Documento</h2>
            <button onClick={() => setMostrarForm(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="doc-titulo" className="block text-sm font-medium text-gray-700 mb-1.5">Título del Documento *</label>
              <input
                type="text"
                id="doc-titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ej: Resolución N° 004-2026"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doc-tipo" className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Documento</label>
                <select
                  id="doc-tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {tiposDocumento.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="doc-fecha" className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Emisión</label>
                <input
                  type="date"
                  id="doc-fecha"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Archivo PDF</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <FileUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Seleccionar archivo PDF</p>
                <p className="text-xs text-gray-400 mt-1">PDF — Máx. 10MB</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setMostrarForm(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={publicar} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                <Upload className="w-4 h-4" />
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Tipo</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Fecha</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Estado</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docsFiltrados.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{d.titulo}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">{d.tipo}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(d.fecha).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${d.estado === 'Publicado' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {d.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => eliminar(d.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100">
          {docsFiltrados.map((d) => (
            <div key={d.id} className="p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{d.titulo}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{d.tipo}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${d.estado === 'Publicado' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{d.estado}</span>
                  <span className="text-xs text-gray-400">{new Date(d.fecha).toLocaleDateString('es-VE')}</span>
                </div>
              </div>
              <button onClick={() => eliminar(d.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {docsFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No se encontraron documentos.</div>
        )}
      </div>
    </div>
  );
}
