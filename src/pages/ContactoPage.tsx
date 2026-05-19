import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import type { ContactFormData } from '../types';

export default function ContactoPage() {
  const { config } = useSiteConfig();
  const [form, setForm] = useState<ContactFormData>({
    nombre: '',
    cedula: '',
    correo: '',
    mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
    setForm({ nombre: '', cedula: '', correo: '', mensaje: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Comunícate con Nosotros</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Atención Ciudadana</h1>
          <p className="text-blue-200 mt-4 max-w-2xl text-lg">
            Estamos a tu disposición para atender tus consultas, denuncias y solicitudes.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Formulario de Contacto</h2>

                {enviado && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">Su mensaje ha sido enviado exitosamente.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Ingrese su nombre"
                      />
                    </div>
                    <div>
                      <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Cédula de Identidad *
                      </label>
                      <input
                        type="text"
                        id="cedula"
                        name="cedula"
                        value={form.cedula}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="V-12.345.678"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Escriba su consulta, denuncia o solicitud..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Ubicación y Horarios</h3>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <span>{config.contactoDireccion}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{config.contactoTelefono}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{config.contactoEmail}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Horario de Atención</p>
                      {config.contactoHorario.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-3">¿Necesitas ayuda urgente?</h3>
                <p className="text-blue-200 text-sm mb-4">
                  Para denuncias urgentes sobre irregularidades administrativas, comunícate directamente con nuestra línea de atención.
                </p>
                <p className="text-amber-400 font-bold text-lg">{config.contactoTelefono.split('/')[0].trim()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
