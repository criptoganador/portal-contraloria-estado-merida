import { useState } from 'react';
import { Save, User, CheckCircle } from 'lucide-react';

interface ContraloreProfile {
  nombre: string;
  titulo: string;
  cargo: string;
  biografia: string;
}

const perfilInicial: ContraloreProfile = {
  nombre: 'María Elena Rodríguez Peña',
  titulo: 'Abogada — Especialista en Derecho Administrativo',
  cargo: 'Contralora del Estado Mérida',
  biografia:
    'Abogada egresada de la Universidad de Los Andes (ULA), con especialización en Derecho Administrativo y Gestión Pública. Cuenta con más de 20 años de experiencia en el ámbito del control fiscal y la administración pública.\n\nHa desempeñado cargos de alta responsabilidad en diversos organismos del Estado, destacándose por su compromiso con la transparencia, la rendición de cuentas y el fortalecimiento institucional.\n\nBajo su gestión, la Contraloría del Estado Mérida ha implementado programas de modernización tecnológica y fortalecimiento del control fiscal participativo, promoviendo la cercanía con el ciudadano.',
};

export default function AdminContralor() {
  const [perfil, setPerfil] = useState<ContraloreProfile>(perfilInicial);
  const [guardado, setGuardado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPerfil((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setGuardado(false);
  };

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 4000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Success */}
      {guardado && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium">
          <CheckCircle className="w-5 h-5 shrink-0" />
          Perfil del Contralor actualizado exitosamente.
        </div>
      )}

      <form onSubmit={guardar} className="space-y-6">
        {/* Photo section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-5">
            Foto Oficial
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <User className="w-14 h-14 text-white/40" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Sube la foto oficial del Contralor(a). Se recomienda una imagen de 400×500px en formato JPG o PNG.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Cambiar Foto
              </button>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-5">
            Información del Perfil
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={perfil.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Título Profesional
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={perfil.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="cargo"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Cargo
                </label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  value={perfil.cargo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="biografia"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Perfil Biográfico
              </label>
              <textarea
                id="biografia"
                name="biografia"
                value={perfil.biografia}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Use saltos de línea para separar párrafos. Este texto se mostrará
                en la sección "La Institución" del portal público.
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Vista Previa
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-white/40" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{perfil.nombre || 'Nombre del Contralor(a)'}</h3>
                <p className="text-amber-600 text-sm font-medium">{perfil.cargo || 'Cargo'}</p>
                <p className="text-gray-500 text-xs mt-0.5">{perfil.titulo || 'Título profesional'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {(perfil.biografia || 'Biografía del contralor...').split('\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            Actualizar Perfil
          </button>
        </div>
      </form>
    </div>
  );
}
