import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, AlertTriangle, Shield, BarChart3, Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useNoticias } from '../context/NoticiasContext';

export default function HomePage() {
  const { config } = useSiteConfig();
  const { noticias } = useNoticias();
  const ultimasNoticias = noticias.filter(n => n.publicada).slice(0, 10);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const images = config.heroImagenesBase64 || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Cambia de imagen cada 5 segundos
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
        
        {/* Carousel Backgrounds */}
        {images.length > 0 ? (
          <>
            {images.map((img, idx) => (
              <div
                key={idx}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: idx === currentImageIndex ? 1 : 0,
                  zIndex: 0
                }}
              />
            ))}
            {/* Overlay para oscurecer las imágenes y que el texto se lea bien */}
            <div className="absolute inset-0 bg-blue-950/70 z-[1]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl z-[1]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl z-[1]" />
          </>
        )}

        {/* Indicadores del carrusel */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white'
                }`}
                aria-label={`Ir a la imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Contraloría del Estado Mérida
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                dangerouslySetInnerHTML={{ __html: config.heroTitulo.replace('Control Fiscal', '<span class="text-amber-400">Control Fiscal</span>') }}
            />
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-10 max-w-2xl font-medium drop-shadow-sm">
              {config.heroTexto}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/marco-legal"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-blue-950 font-semibold px-6 py-3.5 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <FileText className="w-5 h-5" />
                Ir a Gacetas
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <AlertTriangle className="w-5 h-5" />
                Denuncias
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="bg-white border-b border-gray-100 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(config.botonesAcceso || []).map((item, idx) => {
              const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Shield, FileText, BarChart3, Users, AlertTriangle };
              const IconComp = iconMap[item.icono] || Shield;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className="flex items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-lg p-5 transition-shadow duration-200 border border-gray-100"
                >
                  <div className={`${item.color} p-3 rounded-lg text-white shrink-0`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-2">Sala de Prensa</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Últimas Noticias</h2>
            </div>
            <Link
              to="/prensa"
              className="hidden sm:inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors"
            >
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative group">
            {/* Botón izquierdo */}
            {ultimasNoticias.length > 3 && (
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-5 z-10 bg-white shadow-lg text-blue-900 p-2 rounded-full border border-gray-100 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                aria-label="Noticias anteriores"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Contenedor scrolleable */}
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-8 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {ultimasNoticias.map((noticia) => (
                <article
                  key={noticia.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col shrink-0 snap-start w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-21px)]"
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
                  <span className="absolute top-3 left-3 bg-amber-500 text-blue-950 text-xs font-semibold px-2.5 py-1 rounded-md z-10">
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
                  <Link
                    to="/prensa"
                    className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium mt-4 transition-colors"
                  >
                    Leer más
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
            </div>

            {/* Botón derecho */}
            {ultimasNoticias.length > 3 && (
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-5 z-10 bg-white shadow-lg text-blue-900 p-2 rounded-full border border-gray-100 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                aria-label="Siguientes noticias"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/prensa"
              className="inline-flex items-center gap-1 text-blue-700 font-medium"
            >
              Ver todas las noticias
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">¿Deseas realizar una denuncia?</h2>
            <p className="text-blue-200">Ejerce tu derecho al control fiscal participativo.</p>
          </div>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-blue-950 font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shrink-0"
          >
            Atención Ciudadana
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
