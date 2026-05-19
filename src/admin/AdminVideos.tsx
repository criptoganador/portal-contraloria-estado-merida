import { useState, useRef } from 'react';
import { Plus, Trash2, Video as VideoIcon, X, Save, Search, Link as LinkIcon, FileVideo } from 'lucide-react';
import { useMultimedia } from '../context/MultimediaContext';
import { useAuth } from '../context/AuthContext';
import { uploadFile, getMimeFromBase64 } from '../utils/uploadFile';
import type { Video } from '../context/MultimediaContext';

const formVacio: Omit<Video, 'id'> = {
  titulo: '',
  descripcion: '',
  tipo: 'youtube',
  src: '',
  fecha: new Date().toISOString().split('T')[0],
};

export default function AdminVideos() {
  const { videos, agregarVideo, eliminarVideo } = useMultimedia();
  const { token } = useAuth();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videosFiltrados = videos.filter((v) =>
    v.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const guardar = async () => {
    if (!form.titulo.trim() || !form.src.trim()) {
      alert('Por favor completa los campos requeridos (*)');
      return;
    }

    const dataToSave = { ...form };

    // Si es un video local (Base64), subirlo como BYTEA
    if (dataToSave.tipo === 'local' && dataToSave.src.startsWith('data:')) {
      const mime = getMimeFromBase64(dataToSave.src);
      const ext = mime.split('/')[1] || 'mp4';
      dataToSave.src = await uploadFile(dataToSave.src, `${dataToSave.titulo}.${ext}`, mime, token);
    }

    await agregarVideo(dataToSave);
    setForm(formVacio);
    setMostrarForm(false);
    mostrarMensaje('Video agregado exitosamente');
  };

  const eliminar = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este video?')) {
      await eliminarVideo(id);
      mostrarMensaje('Video eliminado');
    }
  };

  const mostrarMensaje = (msg: string) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Por favor selecciona un archivo de video válido (MP4/WebM)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, src: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getYoutubeId = (url: string) => {
    try {
      if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0];
      if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
      if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0];
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert message */}
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
            placeholder="Buscar videos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={() => {
            setForm(formVacio);
            setMostrarForm(true);
          }}
          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm shrink-0 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Nuevo Video
        </button>
      </div>

      {/* Form modal */}
      {mostrarForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Agregar Video</h2>
            <button
              onClick={() => setMostrarForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="video-titulo" className="block text-sm font-medium text-gray-700 mb-1.5">
                Título del Video *
              </label>
              <input
                type="text"
                id="video-titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ej: Reporte de Gestión 2025"
              />
            </div>

            <div>
              <label htmlFor="video-desc" className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción
              </label>
              <textarea
                id="video-desc"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Breve descripción del video..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="video-tipo" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tipo de Video
                </label>
                <select
                  id="video-tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={(e) => {
                    handleChange(e);
                    // Clear source when type changes to prevent type issues
                    setForm((prev) => ({ ...prev, src: '' }));
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="youtube">YouTube Embed (URL)</option>
                  <option value="local">Archivo de Video (MP4)</option>
                </select>
              </div>
              <div>
                <label htmlFor="video-fecha" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fecha de Publicación
                </label>
                <input
                  type="date"
                  id="video-fecha"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Dynamic input depending on Type */}
            {form.tipo === 'youtube' ? (
              <div>
                <label htmlFor="video-src" className="block text-sm font-medium text-gray-700 mb-1.5">
                  URL de YouTube *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="video-src"
                    name="src"
                    value={form.src}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Archivo de Video MP4/WebM *
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer relative overflow-hidden"
                >
                  <FileVideo className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">
                    {form.src ? '✓ Video cargado en memoria' : 'Selecciona un archivo de video'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">MP4 o WebM — Máx. 15MB</p>
                  <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setMostrarForm(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm font-semibold"
              >
                <Save className="w-4 h-4" />
                Guardar Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Tipo</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Fecha</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {videosFiltrados.map((v) => {
                const ytId = v.tipo === 'youtube' ? getYoutubeId(v.src) : null;
                const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/default.jpg` : null;

                return (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 w-28">
                      <div className="w-16 h-10 bg-gray-950 rounded-md overflow-hidden flex items-center justify-center border border-gray-100">
                        {thumbUrl ? (
                          <img src={thumbUrl} alt="thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <VideoIcon className="w-4 h-4 text-white/50" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      <p className="line-clamp-1">{v.titulo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${v.tipo === 'youtube' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                        {v.tipo === 'youtube' ? 'YouTube' : 'Subido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(v.fecha).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => eliminar(v.id)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {videosFiltrados.map((v) => (
            <div key={v.id} className="p-4 flex items-center gap-3">
              <div className="w-16 h-10 bg-gray-950 rounded overflow-hidden flex items-center justify-center shrink-0">
                {v.tipo === 'youtube' && getYoutubeId(v.src) ? (
                  <img src={`https://img.youtube.com/vi/${getYoutubeId(v.src)}/default.jpg`} alt="thumb" className="w-full h-full object-cover" />
                ) : (
                  <VideoIcon className="w-4 h-4 text-white/50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{v.titulo}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded capitalize">{v.tipo}</span>
                  <span className="text-xs text-gray-400">{new Date(v.fecha).toLocaleDateString('es-VE')}</span>
                </div>
              </div>
              <button
                onClick={() => eliminar(v.id)}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {videosFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No se encontraron videos.
          </div>
        )}
      </div>
    </div>
  );
}
