import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { documentosLegales } from '../data/mockData';

const categorias = ['Todos', 'Gaceta', 'Resolución', 'Providencia', 'Circular'] as const;

export default function MarcoLegalPage() {
  const [filtro, setFiltro] = useState<string>('Todos');

  const documentosFiltrados = filtro === 'Todos'
    ? documentosLegales
    : documentosLegales.filter((d) => d.categoria === filtro);

  return (
    <>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Repositorio Documental</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Marco Legal</h1>
          <p className="text-blue-200 mt-4 max-w-2xl text-lg">
            Consulta las gacetas, resoluciones y normativa vigente de la Contraloría del Estado Mérida.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filtro === cat
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Título del Documento</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-36">Fecha</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-36">Categoría</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 w-32">Acción</th>
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800">{doc.titulo}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(doc.fecha).toLocaleDateString('es-VE', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        {doc.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {documentosFiltrados.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 mb-3">
                  {doc.categoria}
                </span>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{doc.titulo}</h3>
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(doc.fecha).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <button className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium">
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </button>
              </div>
            ))}
          </div>

          {documentosFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No se encontraron documentos en esta categoría.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
