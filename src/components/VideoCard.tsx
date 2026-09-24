import { ExternalLink, Play } from 'lucide-react';
import type { HumorVideo } from '@/data/videos';

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1) || null;
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/')[2] || null;
      if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/')[2] || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeVideoUrl(url: string): { source: HumorVideo['source']; url: string } {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return { source: 'youtube', url: `https://www.youtube.com/embed/${youtubeId}` };
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { source: 'mp4', url };
  return { source: 'external', url };
}

export function VideoCard({ video, removable, onRemove }: { video: HumorVideo; removable?: boolean; onRemove?: () => void }) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {video.source === 'mp4' ? (
          <video
            src={video.url}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            aria-label={video.title}
          />
        ) : video.source === 'youtube' ? (
          <iframe
            src={video.url}
            title={video.title}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 text-white p-6 text-center">
            <span className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <ExternalLink size={28} />
            </span>
            <span className="font-bold">Открыть видео</span>
          </a>
        )}
        {video.source !== 'external' && (
          <div className="absolute left-3 top-3 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 bg-black/60 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full backdrop-blur-sm">
              <Play size={12} fill="currentColor" /> ВИДЕО
            </span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-2">
          <span className="text-xl shrink-0" aria-hidden="true">{video.emoji}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {video.title}
            </h3>
            <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{video.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-400">
          <span>{new Date(video.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
          {removable && onRemove && (
            <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
              Удалить моё видео
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
