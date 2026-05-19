import { useState, useEffect } from 'react';
import { FileText, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNoticias } from '../context/NoticiasContext';

export default function PrensaPage() {
  const { noticias, totalPages, fetchNoticias } = useNoticias();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNoticias(page, 9); // Mostrar 9 por página en el grid
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const publicadas = noticias.filter(n => n.publicada);
  return (
    <>
      <section className="bg-slate-50 py-14 md:py-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-700 text-sm font-bold uppercase tracking-wider mb-2">Comunicaciones</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 tracking-tight">Sala de Prensa</h1>
          <p className="text-gray-600 mt-4 max-w-2xl text-lg font-medium">
            Mantente informado sobre las actividades y actuaciones de la Contraloría del Estado Mérida.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {publicadas.map((noticia) => (
              <article
                key={noticia.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col"
              >
                <div className="relative h-48 bg-blue-900 flex items-center justify-center overflow-hidden">
                  {noticia.imagen && noticia.imagen !== 'auditoria-2025.jpg' && noticia.imagen !== 'capacitacion.jpg' && noticia.imagen !== 'resolucion.jpg' ? (
                    <img src={noticia.imagen} alt={noticia.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-white/60">
                      <FileText className="w-10 h-10 mx-auto mb-2" />
                      <span className="text-xs">Imagen de noticia</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-md z-10 shadow-sm uppercase tracking-wider">
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
                  <div className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 text-sm font-bold mt-4 transition-colors uppercase tracking-wide cursor-pointer">
                    Leer más
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
          {publicadas.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg">No hay noticias publicadas en este momento.</p>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-blue-900 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-gray-600">
                Página {page} de {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-blue-900 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
