import { Target, Compass, Heart, User } from 'lucide-react';
import { valoresInstitucionales, contralor } from '../data/mockData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Compass,
  Heart,
};

export default function InstitucionPage() {
  return (
    <>
      {/* Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Conócenos</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">La Institución</h1>
          <p className="text-blue-200 mt-4 max-w-2xl text-lg">
            Conoce la misión, visión y valores que guían la labor de la Contraloría del Estado Mérida.
          </p>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {valoresInstitucionales.map((valor) => {
              const Icon = iconMap[valor.icono] || Target;
              return (
                <div
                  key={valor.titulo}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-14 h-14 bg-blue-900 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{valor.titulo}</h3>
                  <p className="text-gray-600 leading-relaxed">{valor.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contralor */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-2">Máxima Autoridad</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contralor(a) del Estado</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Photo */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl aspect-[3/4] max-w-sm mx-auto lg:mx-0 flex flex-col items-center justify-center text-white/60 shadow-lg overflow-hidden">
                <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <User className="w-16 h-16 text-white/40" />
                </div>
                <p className="text-sm text-white/50">Foto Oficial</p>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-3">
              <div className="border-l-4 border-amber-500 pl-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{contralor.nombre}</h3>
                <p className="text-amber-600 font-medium mt-1">{contralor.cargo}</p>
              </div>

              <div className="space-y-4">
                {contralor.biografia.map((parrafo, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-base">
                    {parrafo}
                  </p>
                ))}
              </div>

              <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                  "Nuestro compromiso es con la transparencia, la rendición de cuentas y el servicio público eficiente, al servicio del pueblo merideño."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
