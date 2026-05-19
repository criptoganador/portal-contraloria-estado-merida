import { useState } from 'react';
import { Play, Calendar, Video as VideoIcon, X, Filter } from 'lucide-react';
import { useMultimedia } from '../context/MultimediaContext';
import type { Video } from '../context/MultimediaContext';

export default function MultimediaPage() {
  const { videos } = useMultimedia();
  const [filtro, setFiltro] = useState<'todos' | 'youtube' | 'local'>('todos');
  const [videoActivo, setVideoActivo] = useState<Video | null>(null);

  const videosFiltrados = videos.filter((v) => {
    if (filtro === 'todos') return true;
    return v.tipo === filtro;
  });

  // Helper to extract YouTube video ID to generate a high quality preview thumbnail
  const getYoutubeId = (url: string) => {
    try {
      // Handles embed URLs, full URLs, and short URLs
      if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0];
      if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
      if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0];
      return null;
    } catch {
      return null;
    }
  };

  return (
    <>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Galería Audiovisual</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Multimedia</h1>
          <p className="text-blue-200 mt-4 max-w-2xl text-lg">
            Sigue de cerca las actividades institucionales, talleres e informes de gestión a través de nuestra galería de videos.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtro === 'todos'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Todos los Videos
            </button>
            <button
              onClick={() => setFiltro('youtube')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtro === 'youtube'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              YouTube
            </button>
            <button
              onClick={() => setFiltro('local')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtro === 'local'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Subidos
            </button>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {videosFiltrados.map((video) => {
              const ytId = video.tipo === 'youtube' ? getYoutubeId(video.src) : null;
              const thumbUrl = ytId
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                : null;

              return (
                <article
                  key={video.id}
                  onClick={() => setVideoActivo(video)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer group"
                >
                  {/* Thumbnail / Video Preview Area */}
                  <div className="relative h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={video.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-blue-950 flex flex-col items-center justify-center text-white/50">
                        <VideoIcon className="w-12 h-12 mb-2 opacity-70 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">Reproducir video subido</span>
                      </div>
                    )}
                    {/* Dark overlay with Play button */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-blue-950 shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <span className="absolute top-3 left-3 bg-blue-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                      {video.tipo === 'youtube' ? 'YouTube' : 'Institucional'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <time>
                        {new Date(video.fecha).toLocaleDateString('es-VE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 leading-snug line-clamp-2 group-hover:text-blue-900 transition-colors">
                      {video.titulo}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                      {video.descripcion}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {videosFiltrados.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <VideoIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg">No hay videos en esta categoría en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal Player */}
      {videoActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fadeIn">
          <div className="relative bg-black w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Close Button */}
            <button
              onClick={() => setVideoActivo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player Container */}
            <div className="aspect-video w-full bg-black">
              {videoActivo.tipo === 'youtube' ? (
                <iframe
                  src={
                    videoActivo.src.includes('embed')
                      ? videoActivo.src
                      : `https://www.youtube.com/embed/${getYoutubeId(videoActivo.src)}?autoplay=1`
                  }
                  title={videoActivo.titulo}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={videoActivo.src}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                ></video>
              )}
            </div>

            {/* Video Meta Info */}
            <div className="p-5 bg-gray-900 border-t border-gray-800 text-white">
              <h2 className="text-lg md:text-xl font-bold mb-2">{videoActivo.titulo}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{videoActivo.descripcion}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
