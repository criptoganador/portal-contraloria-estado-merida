import {
  Shield, Search, Scale, FileText, Eye,
  ClipboardCheck, BarChart3, Users,
} from 'lucide-react';
import { competencias } from '../data/mockData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Search, Scale, FileText, Eye, ClipboardCheck, BarChart3, Users,
};

export default function CompetenciasPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Atribuciones Legales</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Funciones y Competencias</h1>
          <p className="text-blue-200 mt-4 max-w-2xl text-lg">
            Conoce las atribuciones que la Constitución y las leyes confieren a la Contraloría del Estado Mérida.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {competencias.map((comp) => {
              const Icon = iconMap[comp.icono] || Shield;
              return (
                <div key={comp.id} className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex gap-5">
                  <div className="w-14 h-14 bg-blue-900 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{comp.titulo}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{comp.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-10 border border-blue-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Fundamento Legal</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Las competencias de la Contraloría del Estado Mérida se fundamentan en la Constitución de la República Bolivariana de Venezuela, la Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal, la Constitución del Estado Bolivariano de Mérida y demás leyes y reglamentos aplicables.
            </p>
            <p className="text-gray-600 leading-relaxed">
              El ejercicio de estas competencias se realiza con estricto apego a los principios de legalidad, transparencia, eficiencia, economía, celeridad y participación ciudadana.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
