import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Image, Search } from 'lucide-react';

interface NoticiaAdmin {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  contenido: string;
  imagen: string;
  publicada: boolean;
}

const noticiasIniciales: NoticiaAdmin[] = [
  {
    id: 1,
    titulo: 'Contraloría inicia auditoría a la gestión fiscal del ejercicio 2025',
    categoria: 'Auditoría',
    fecha: '2026-05-15',
    contenido: 'El órgano contralor dio inicio a las actuaciones de control fiscal correspondientes al ejercicio económico financiero 2025.',
    imagen: 'auditoria-2025.jpg',
    publicada: true,
  },
  {
    id: 2,
    titulo: 'Jornada de capacitación sobre rendición de cuentas para funcionarios públicos',
    categoria: 'Formación',
    fecha: '2026-05-10',
    contenido: 'Se llevó a cabo una jornada de formación dirigida a los responsables de la administración activa.',
    imagen: 'capacitacion.jpg',
    publicada: true,
  },
  {
    id: 3,
    titulo: 'Publicada la Resolución de Normas para la Declaración Jurada de Patrimonio',
    categoria: 'Normativa',
    fecha: '2026-05-05',
    contenido: 'La Contraloría del Estado Mérida publica las normas actualizadas que regulan la presentación de la Declaración Jurada.',
    imagen: 'resolucion.jpg',
    publicada: true,
  },
];

const categorias = ['Auditoría', 'Formación', 'Normativa', 'Institucional', 'Participación'];

const formularioVacio: Omit<NoticiaAdmin, 'id'> = {
  titulo: '',
  categoria: 'Auditoría',
  fecha: new Date().toISOString().split('T')[0],
  contenido: '',
  imagen: '',
  publicada: true,
};

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<NoticiaAdmin[]>(noticiasIniciales);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState(formularioVacio);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const nextId = useRef(100);

  const noticiasFiltradas = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirNueva = () => {
    setForm(formularioVacio);
    setEditandoId(null);
    setMostrarForm(true);
  };

  const abrirEditar = (noticia: NoticiaAdmin) => {
    setForm({
      titulo: noticia.titulo,
      categoria: noticia.categoria,
      fecha: noticia.fecha,
      contenido: noticia.contenido,
      imagen: noticia.imagen,
      publicada: noticia.publicada,
    });
    setEditandoId(noticia.id);
    setMostrarForm(true);
  };

  const guardar = () => {
    if (!form.titulo.trim() || !form.contenido.trim()) return;

    if (editandoId !== null) {
      setNoticias((prev) =>
        prev.map((n) => (n.id === editandoId ? { ...n, ...form } : n))
      );
      mostrarMensaje('Noticia actualizada exitosamente');
    } else {
      const nueva: NoticiaAdmin = {
        id: nextId.current++,
        ...form,
      };
      setNoticias((prev) => [nueva, ...prev]);
      mostrarMensaje('Noticia creada exitosamente');
    }
    setMostrarForm(false);
    setForm(formularioVacio);
    setEditandoId(null);
  };

  const eliminar = (id: number) => {
    setNoticias((prev) => prev.filter((n) => n.id !== id));
    mostrarMensaje('Noticia eliminada');
  };

  const mostrarMensaje = (msg: string) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      {/* Success message */}
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
            placeholder="Buscar noticias..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={abrirNueva}
          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nueva Noticia
        </button>
      </div>

      {/* Form modal */}
      {mostrarForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {editandoId ? 'Editar Noticia' : 'Nueva Noticia'}
            </h2>
            <button
              onClick={() => setMostrarForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1.5">
                Título de la Noticia *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ingrese el título"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Categoría
                </label>
                <select
                  id="categoria"
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
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fecha de Publicación
                </label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contenido *
              </label>
              <textarea
                id="contenido"
                name="contenido"
                value={form.contenido}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Escriba el contenido de la noticia..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Imagen de Portada
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Image className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Haz clic para seleccionar una imagen
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG — Máx. 2MB</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setMostrarForm(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                {editandoId ? 'Actualizar' : 'Guardar Noticia'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Noticias list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Categoría</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Fecha</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Estado</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticiasFiltradas.map((n) => (
                <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{n.titulo}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">{n.categoria}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(n.fecha).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${n.publicada ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {n.publicada ? 'Publicada' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => abrirEditar(n)}
                        className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => eliminar(n.id)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {noticiasFiltradas.map((n) => (
            <div key={n.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{n.titulo}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{n.categoria}</span>
                    <span className="text-xs text-gray-400">{new Date(n.fecha).toLocaleDateString('es-VE')}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => abrirEditar(n)} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => eliminar(n.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {noticiasFiltradas.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No se encontraron noticias.
          </div>
        )}
      </div>
    </div>
  );
}
