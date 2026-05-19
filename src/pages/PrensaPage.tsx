import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { noticias } from '../data/mockData';

export default function PrensaPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Comunicaciones</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Sala de Prensa</h1>
          <p className="text-blue-200 mt-4 max-w-2xl text-lg">
            Mantente informado sobre las actividades y actuaciones de la Contraloría del Estado Mérida.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {noticias.map((noticia) => (
              <article
                key={noticia.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <FileText className="w-10 h-10 mx-auto mb-2" />
                    <span className="text-xs">Imagen de noticia</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-amber-500 text-blue-950 text-xs font-semibold px-2.5 py-1 rounded-md">
                    {noticia.categoria}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <time className="text-xs text-gray-400 mb-2">
                    {new Date(noticia.fecha).toLocaleDateString('es-VE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h3 className="font-semibold text-gray-800 mb-2 leading-snug line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {noticia.resumen}
                  </p>
                  <button className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium mt-4 transition-colors self-start">
                    Leer más
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
