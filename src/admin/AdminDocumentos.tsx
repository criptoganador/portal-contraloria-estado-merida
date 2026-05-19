import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Upload, X, Search, FileUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDocumentos } from '../context/DocumentosContext';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../utils/uploadFile';
import type { Documento } from '../context/DocumentosContext';

const categorias = ['Gaceta', 'Resolución', 'Providencia', 'Circular'];

const formVacio = { titulo: '', categoria: 'Gaceta', fecha: new Date().toISOString().split('T')[0], archivo: '', estado: 'Publicado' as const };

export default function AdminDocumentos() {
  const { documentos, totalPages, fetchDocumentos, agregarDocumento, eliminarDocumento } = useDocumentos();
  const { token } = useAuth();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todos');
  const [page, setPage] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocumentos(page, 10, busqueda, filtroCategoria);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, busqueda, filtroCategoria]);

  const publicar = async () => {
    if (!form.titulo.trim()) return;
    try {
      setSubiendo(true);
      // Subir el archivo PDF como binario BYTEA y obtener la URL
      let archivoUrl = form.archivo;
      if (form.archivo && form.archivo.startsWith('data:')) {
        archivoUrl = await uploadFile(form.archivo, `${form.titulo}.pdf`, 'application/pdf', token);
      }
      await agregarDocumento({
        titulo: form.titulo,
        categoria: form.categoria,
        fecha: form.fecha,
        estado: form.estado,
        archivo: archivoUrl || '#',
      });
      setForm(formVacio);
      setMostrarForm(false);
      mostrarMsg('Documento publicado exitosamente');
    } catch (err) {
      console.error(err);
      mostrarMsg('Error al subir el documento');
    } finally {
      setSubiendo(false);
    }
  };

  const eliminar = async (id: number) => {
    await eliminarDocumento(id);
    mostrarMsg('Documento eliminado');
  };

  const mostrarMsg = (msg: string) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor selecciona un archivo PDF válido');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, archivo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
        {['Todos', ...categorias].map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroCategoria(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filtroCategoria === cat
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat}
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
                <label htmlFor="doc-categoria" className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
                <select
                  id="doc-categoria"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doc-estado" className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                <select
                  id="doc-estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="Publicado">Publicado</option>
                  <option value="Borrador">Borrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Archivo PDF *</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-blue-300 transition-colors cursor-pointer relative"
                >
                  <FileUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 font-medium">
                    {form.archivo ? '✓ PDF Cargado' : 'Seleccionar archivo PDF'}
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setMostrarForm(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={publicar} disabled={subiendo} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                <Upload className="w-4 h-4" />
                {subiendo ? 'Subiendo...' : 'Publicar'}
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
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Categoría</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Fecha</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Estado</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((d: Documento) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{d.titulo}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">{d.categoria}</span>
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
          {documentos.map((d: Documento) => (
            <div key={d.id} className="p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{d.titulo}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{d.categoria}</span>
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

        {documentos.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No se encontraron documentos.</div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
