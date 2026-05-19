import { useState, useRef } from 'react';
import { Save, Image as ImageIcon, CheckCircle, X, Plus, Trash2 } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useAuth } from '../context/AuthContext';
import { uploadFile, getMimeFromBase64 } from '../utils/uploadFile';

export default function AdminConfiguracion() {
  const { config, updateConfig } = useSiteConfig();
  const { token } = useAuth();
  const [form, setForm] = useState(config);
  const [guardado, setGuardado] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setGuardado(false);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave = { ...form };

    // Subir logo como binario si es Base64
    if (dataToSave.logoBase64 && dataToSave.logoBase64.startsWith('data:')) {
      const mime = getMimeFromBase64(dataToSave.logoBase64);
      dataToSave.logoBase64 = await uploadFile(dataToSave.logoBase64, 'logo_sitio.png', mime, token);
    }

    // Subir imágenes del hero como binario si son Base64
    if (dataToSave.heroImagenesBase64 && dataToSave.heroImagenesBase64.length > 0) {
      const uploadedImages = [];
      for (let i = 0; i < dataToSave.heroImagenesBase64.length; i++) {
        const img = dataToSave.heroImagenesBase64[i];
        if (img.startsWith('data:')) {
          const mime = getMimeFromBase64(img);
          const ext = mime.split('/')[1] || 'jpg';
          const url = await uploadFile(img, `hero_banner_${i + 1}.${ext}`, mime, token);
          uploadedImages.push(url);
        } else {
          uploadedImages.push(img); // Ya es una URL, mantener
        }
      }
      dataToSave.heroImagenesBase64 = uploadedImages;
    }

    updateConfig(dataToSave);
    setForm(dataToSave);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, logoBase64: reader.result as string }));
        setGuardado(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ 
          ...prev, 
          heroImagenesBase64: [...(prev.heroImagenesBase64 || []), reader.result as string] 
        }));
        setGuardado(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBannerImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      heroImagenesBase64: prev.heroImagenesBase64.filter((_, i) => i !== index)
    }));
    setGuardado(false);
  };

  const agregarBotónAcceso = () => {
    setForm((prev) => ({
      ...prev,
      botonesAcceso: [
        ...(prev.botonesAcceso || []),
        {
          label: 'Nuevo Acceso',
          desc: 'Descripción del acceso',
          to: '/',
          color: 'bg-blue-600',
          icono: 'Shield'
        }
      ]
    }));
    setGuardado(false);
  };

  const eliminarBotónAcceso = (index: number) => {
    setForm((prev) => ({
      ...prev,
      botonesAcceso: (prev.botonesAcceso || []).filter((_, i) => i !== index)
    }));
    setGuardado(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {guardado && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium">
          <CheckCircle className="w-5 h-5 shrink-0" />
          Configuración del sitio actualizada exitosamente.
        </div>
      )}

      <form onSubmit={guardar} className="space-y-6">
        {/* Identidad visual */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-5">Identidad Visual</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1.5">Título Principal</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="subtitulo" className="block text-sm font-medium text-gray-700 mb-1.5">Subtítulo (Ubicación/Entidad)</label>
                <input
                  type="text"
                  id="subtitulo"
                  name="subtitulo"
                  value={form.subtitulo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="navColor" className="block text-sm font-medium text-gray-700 mb-1.5">Color del Menú (Barra de Navegación)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="navColor"
                  name="navColor"
                  value={form.navColor}
                  onChange={handleChange}
                  className="w-12 h-12 p-1 border border-gray-200 rounded-lg cursor-pointer"
                />
                <span className="text-sm text-gray-500 uppercase">{form.navColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo del Sitio</label>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-950 rounded-xl flex items-center justify-center shrink-0 shadow-md overflow-hidden p-2">
                  {form.logoBase64 ? (
                    <img src={form.logoBase64} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-white/40" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-3">Sube el logo de la institución. Se recomienda formato PNG con fondo transparente.</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Seleccionar Archivo
                    </button>
                    {form.logoBase64 && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => ({ ...prev, logoBase64: '' }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Principal */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-5">Banner Principal (Inicio)</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="heroTitulo" className="block text-sm font-medium text-gray-700 mb-1.5">Título Principal</label>
              <input
                type="text"
                id="heroTitulo"
                name="heroTitulo"
                value={form.heroTitulo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="heroTexto" className="block text-sm font-medium text-gray-700 mb-1.5">Texto Descriptivo</label>
              <textarea
                id="heroTexto"
                name="heroTexto"
                value={form.heroTexto}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Imágenes de Fondo (Carrusel o Única)</label>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Sube una o varias imágenes de alta calidad. Si subes más de una, se mostrarán como un carrusel animado automáticamente.</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={bannerInputRef}
                  onChange={handleBannerChange}
                />
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  Agregar Imagen
                </button>
              </div>

              {/* Grid de imágenes */}
              {form.heroImagenesBase64 && form.heroImagenesBase64.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {form.heroImagenesBase64.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 h-24 bg-blue-950 flex items-center justify-center">
                      <img src={img} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeBannerImage(idx)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                          title="Eliminar imagen"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm">Ninguna imagen seleccionada</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Contacto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Información de Contacto</h2>
            <p className="text-sm text-gray-500 mt-1">Dirección, teléfonos y horarios de atención al público.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="contactoDireccion" className="block text-sm font-medium text-gray-700 mb-1.5">Dirección Física</label>
                <input
                  type="text"
                  id="contactoDireccion"
                  name="contactoDireccion"
                  value={form.contactoDireccion}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="contactoTelefono" className="block text-sm font-medium text-gray-700 mb-1.5">Teléfonos</label>
                <input
                  type="text"
                  id="contactoTelefono"
                  name="contactoTelefono"
                  value={form.contactoTelefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="contactoEmail" className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  id="contactoEmail"
                  name="contactoEmail"
                  value={form.contactoEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="contactoHorario" className="block text-sm font-medium text-gray-700 mb-1.5">Horario de Atención (Puedes usar varias líneas)</label>
                <textarea
                  id="contactoHorario"
                  name="contactoHorario"
                  value={form.contactoHorario}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Redes Sociales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Redes Sociales</h2>
            <p className="text-sm text-gray-500 mt-1">Enlaces a los perfiles oficiales de la institución. Si dejas el campo vacío, el icono se ocultará en el pie de página.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="redesFacebook" className="block text-sm font-medium text-gray-700 mb-1.5">Enlace a Facebook</label>
                <input
                  type="url"
                  id="redesFacebook"
                  name="redesFacebook"
                  value={form.redesFacebook || ''}
                  onChange={handleChange}
                  placeholder="https://facebook.com/contraloriacem"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="redesTwitter" className="block text-sm font-medium text-gray-700 mb-1.5">Enlace a Twitter (X)</label>
                <input
                  type="url"
                  id="redesTwitter"
                  name="redesTwitter"
                  value={form.redesTwitter || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/contraloriacem"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="redesInstagram" className="block text-sm font-medium text-gray-700 mb-1.5">Enlace a Instagram</label>
                <input
                  type="url"
                  id="redesInstagram"
                  name="redesInstagram"
                  value={form.redesInstagram || ''}
                  onChange={handleChange}
                  placeholder="https://instagram.com/contraloriacem"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="redesYoutube" className="block text-sm font-medium text-gray-700 mb-1.5">Enlace a YouTube</label>
                <input
                  type="url"
                  id="redesYoutube"
                  name="redesYoutube"
                  value={form.redesYoutube || ''}
                  onChange={handleChange}
                  placeholder="https://youtube.com/contraloriacem"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Botones de Acceso Rápido */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Botones de Acceso Rápido</h2>
              <p className="text-sm text-gray-500 mt-1">Las tarjetas de acceso directo que aparecen debajo del banner principal. Puedes agregar o quitar botones a tu gusto.</p>
            </div>
            <button
              type="button"
              onClick={agregarBotónAcceso}
              className="inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded-lg transition-colors text-xs shrink-0 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              Agregar Botón
            </button>
          </div>
          <div className="p-6 space-y-6">
            {(form.botonesAcceso || []).length > 0 ? (
              (form.botonesAcceso || []).map((btn, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50/50 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`${btn.color} p-2 rounded-lg text-white shrink-0`}>
                        <span className="text-xs font-bold">{idx + 1}</span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">Botón #{idx + 1}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarBotónAcceso(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Eliminar botón"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                      <input
                        type="text"
                        value={btn.label}
                        onChange={(e) => {
                          const updated = [...(form.botonesAcceso || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setForm(prev => ({ ...prev, botonesAcceso: updated }));
                          setGuardado(false);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                      <input
                        type="text"
                        value={btn.desc}
                        onChange={(e) => {
                          const updated = [...(form.botonesAcceso || [])];
                          updated[idx] = { ...updated[idx], desc: e.target.value };
                          setForm(prev => ({ ...prev, botonesAcceso: updated }));
                          setGuardado(false);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Enlace (Ruta)</label>
                      <input
                        type="text"
                        value={btn.to}
                        onChange={(e) => {
                          const updated = [...(form.botonesAcceso || [])];
                          updated[idx] = { ...updated[idx], to: e.target.value };
                          setForm(prev => ({ ...prev, botonesAcceso: updated }));
                          setGuardado(false);
                        }}
                        placeholder="/competencias"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
                        <select
                          value={btn.color}
                          onChange={(e) => {
                            const updated = [...(form.botonesAcceso || [])];
                            updated[idx] = { ...updated[idx], color: e.target.value };
                            setForm(prev => ({ ...prev, botonesAcceso: updated }));
                            setGuardado(false);
                          }}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                          <option value="bg-blue-600">Azul</option>
                          <option value="bg-emerald-600">Verde</option>
                          <option value="bg-amber-600">Ámbar</option>
                          <option value="bg-purple-600">Morado</option>
                          <option value="bg-red-600">Rojo</option>
                          <option value="bg-sky-600">Celeste</option>
                          <option value="bg-pink-600">Rosa</option>
                          <option value="bg-teal-600">Turquesa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Icono</label>
                        <select
                          value={btn.icono}
                          onChange={(e) => {
                            const updated = [...(form.botonesAcceso || [])];
                            updated[idx] = { ...updated[idx], icono: e.target.value };
                            setForm(prev => ({ ...prev, botonesAcceso: updated }));
                            setGuardado(false);
                          }}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                          <option value="Shield">Escudo / Control</option>
                          <option value="FileText">Documento / Ley</option>
                          <option value="BarChart3">Gráfico / Reportes</option>
                          <option value="Users">Atención Ciudadana</option>
                          <option value="AlertTriangle">Alerta / Denuncias</option>
                          <option value="BookOpen">Libro / Gacetas</option>
                          <option value="Building">Edificio / Sede</option>
                          <option value="HelpCircle">Ayuda / Preguntas</option>
                          <option value="Phone">Teléfono / Contacto</option>
                          <option value="Newspaper">Noticias / Prensa</option>
                          <option value="Briefcase">Trámites / Servicios</option>
                          <option value="Scale">Balanza / Justicia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
                <span className="text-sm">No hay botones de acceso rápido configurados.</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
