import { useState } from 'react';
import { Film, Plus, Sparkles } from 'lucide-react';
import { AddVideoModal } from '@/components/AddVideoModal';
import { VideoCard } from '@/components/VideoCard';
import { useVideos } from '@/hooks/useVideos';

export function VideosPage() {
  const [open, setOpen] = useState(false);
  const { videos, userVideos, addVideo, removeVideo } = useVideos();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-orange-200 text-xs sm:text-sm font-semibold px-3 py-2 rounded-full mb-4">
                <Sparkles size={15} /> Свежак каждый день
              </div>
              <h1 className="text-page-title font-black">Смешное видео</h1>
              <p className="mt-3 text-gray-300 max-w-2xl">Короткие ролики, над которыми можно поржать. Добавляй свежие находки и собирай свою видеополку.</p>
            </div>
            <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-5 py-3 rounded-xl hover:bg-orange-600 transition-colors shrink-0">
              <Plus size={19} /> Добавить свежак
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex items-center gap-2 mb-6">
          <Film className="text-orange-500" size={26} />
          <h2 className="text-section-title font-black text-gray-900">Сейчас смотрят</h2>
          <span className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 rounded-full px-2.5 py-1">{videos.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} removable={userVideos.some((item) => item.id === video.id)} onRemove={() => removeVideo(video.id)} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-white border border-gray-100 p-5 sm:p-7">
          <h3 className="font-black text-gray-900 text-lg">Как будем обновлять раздел</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-3xl">Сейчас уже можно добавлять свежие ссылки прямо на сайте. Следующим этапом подключим редакторскую базу: ты добавляешь ролик один раз — он появляется у всех посетителей, а старые ролики можно удалять, менять порядок и отмечать как «Свежак».</p>
        </div>
      </main>

      <AddVideoModal open={open} onClose={() => setOpen(false)} onAdd={addVideo} />
    </div>
  );
}
