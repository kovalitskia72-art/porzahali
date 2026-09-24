import { useMemo, useState, useRef } from 'react';
import { posts as allPosts } from '@/data/posts';
import { categories, siteConfig } from '@/config/site';
import type { CategoryId } from '@/config/site';
import { PostCard } from '@/components/PostCard';
import { PostVisual } from '@/components/PostVisual';
import { AdSlot } from '@/components/AdSlot';
import { FeedModal } from '@/components/FeedModal';
import { buildHash, type Route } from '@/hooks/useRouter';
import { Sparkles, TrendingUp, ExternalLink, ArrowRight, Film, Plus } from 'lucide-react';
import { VideoCard } from '@/components/VideoCard';
import { useVideos } from '@/hooks/useVideos';

interface Props {
  hasReacted: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => boolean;
  onReact: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => void;
  onNavigate: (r: Route) => void;
}

function formatDate(dateStr: string): string {
  const months = [
    'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export function HomePage({ hasReacted, onReact, onNavigate }: Props) {
  const [feedOpen, setFeedOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState<CategoryId | null>(null);
  const [feedPrefs, setFeedPrefs] = useState<CategoryId[] | null>(null);
  const { videos } = useVideos();
  const feedRef = useRef<HTMLDivElement>(null);

  const featured = useMemo(() => allPosts.filter((p) => p.featured).slice(0, 3), []);
  const trending = useMemo(
    () =>
      [...allPosts]
        .sort(
          (a, b) =>
            b.reactions.funny + b.reactions.like - a.reactions.funny - a.reactions.like
        )
        .slice(0, 6),
    []
  );
  const lifeStories = useMemo(
    () => allPosts.filter((p) => p.category === 'istorii').slice(0, 3),
    []
  );
  const weekBest = useMemo(
    () =>
      [...allPosts]
        .sort((a, b) => b.reactions.fire + b.reactions.wow - a.reactions.fire - a.reactions.wow)
        .slice(0, 5),
    []
  );

  const feedPosts = useMemo(() => {
    let result = allPosts;
    if (feedPrefs && feedPrefs.length > 0) {
      result = result.filter((p) => feedPrefs.includes(p.category));
    }
    if (feedFilter) {
      result = result.filter((p) => p.category === feedFilter);
    }
    return [...result].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [feedFilter, feedPrefs]);

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApplyFeed = (selected: CategoryId[]) => {
    setFeedPrefs(selected.length > 0 ? selected : null);
    setFeedFilter(null);
    setTimeout(scrollToFeed, 100);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(251,146,60,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251,191,36,0.15) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full mb-5 sm:mb-6">
                <Sparkles size={16} />
                {siteConfig.tagline}
              </div>
              <h1 className="text-hero font-black tracking-tight text-gray-900">
                Порция юмора
                <br />
                <span className="text-orange-500">на сегодня</span>
              </h1>
              <p className="mt-5 sm:mt-6 text-hero-subtitle text-gray-600 max-w-lg mx-auto lg:mx-0">
                Мемы, истории, анекдоты и жизненные ситуации, над которыми невозможно не
                смеяться.
              </p>
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3 max-w-md sm:max-w-none mx-auto lg:mx-0">
                <button
                  onClick={scrollToFeed}
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white text-base font-bold px-6 sm:px-8 py-3.5 rounded-xl hover:bg-orange-600 transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 w-full sm:w-auto"
                >
                  Поржать
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => setFeedOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 text-base font-bold px-6 sm:px-8 py-3.5 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-all active:scale-95 w-full sm:w-auto"
                >
                  Собрать ленту под себя
                </button>
              </div>
            </div>

            {/* Hero visual cards — desktop */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {featured.map((post, i) => (
                <a
                  key={post.id}
                  href={buildHash({ name: 'post', id: post.id })}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                    i === 0 ? 'col-span-2' : ''
                  }`}
                  style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both` }}
                >
                  <PostVisual post={post} className="aspect-[16/9] w-full" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      😂 {post.reactions.funny} · ❤️ {post.reactions.like}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile visual cards — below buttons */}
          <div className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
            {featured.map((post) => (
              <a
                key={post.id}
                href={buildHash({ name: 'post', id: post.id })}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <PostVisual post={post} className="aspect-square w-full" />
                <div className="p-2">
                  <h3 className="font-bold text-xs text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Full feed — "Сейчас смешно" */}
      <section ref={feedRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 scroll-mt-20">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-orange-500 shrink-0" size={28} />
          <h2 className="text-section-title font-black text-gray-900">
            Сейчас смешно
          </h2>
        </div>

        {/* Feed preference banner */}
        {feedPrefs && feedPrefs.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-orange-700">
              Твоя лента:
            </span>
            {feedPrefs.map((id) => {
              const cat = categories.find((c) => c.id === id);
              return (
                <span key={id} className="text-xs bg-white text-orange-600 px-2.5 py-1 rounded-full font-medium">
                  {cat?.emoji} {cat?.label}
                </span>
              );
            })}
            <button
              onClick={() => {
                setFeedPrefs(null);
                setFeedFilter(null);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
            >
              Сбросить
            </button>
          </div>
        )}

        {/* Filters — horizontal scroll on mobile */}
        <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible no-scrollbar">
          <div className="flex gap-2 sm:flex-wrap min-w-max sm:min-w-0">
            <button
              onClick={() => setFeedFilter(null)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                !feedFilter
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFeedFilter(feedFilter === c.id ? null : c.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  feedFilter === c.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-gray-400">
          {feedPosts.length} публикаций
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feedPosts.slice(0, 9).map((post) => (
            <PostCard key={post.id} post={post} hasReacted={hasReacted} onReact={onReact} />
          ))}
        </div>

        {feedPosts.length > 9 && (
          <>
            <div className="my-5">
              <AdSlot variant="inline" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {feedPosts.slice(9).map((post, i) => (
                <PostCard key={post.id} post={post} hasReacted={hasReacted} onReact={onReact} />
              ))}
            </div>
          </>
        )}

        {feedPosts.length === 0 && (
          <div className="mt-12 text-center text-gray-400">
            <p className="text-lg">
              Ничего не нашли. Но не расстраивайся — попробуй другой запрос 😄
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate({ name: 'all' })}
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all active:scale-95"
          >
            Смотреть все публикации
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-section-title font-black text-gray-900 mb-6">
            Выбери свой юмор
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => onNavigate({ name: 'category', id: cat.id })}
                className="group relative bg-white rounded-2xl p-4 sm:p-5 text-left shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative">
                  <span className="text-2xl sm:text-3xl block mb-2">{cat.emoji}</span>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-orange-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 hidden sm:block">
                    {cat.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Funny video */}
      <section className="bg-gray-50 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Film className="text-orange-500" size={27} />
                <h2 className="text-section-title font-black text-gray-900">Смешное видео</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">Свежак, который хочется переслать другу.</p>
            </div>
            <button
              onClick={() => onNavigate({ name: 'videos' })}
              className="text-sm font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 shrink-0"
            >
              Все видео <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.slice(0, 3).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate({ name: 'videos' })}
              className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 font-bold px-5 py-3 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              <Plus size={18} /> Добавить свежак
            </button>
          </div>
        </div>
      </section>

      {/* Life stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-section-title font-black text-gray-900">
            Истории из жизни
          </h2>
          <button
            onClick={() => onNavigate({ name: 'category', id: 'istorii' })}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 shrink-0"
          >
            Все истории <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lifeStories.map((post) => (
            <a
              key={post.id}
              href={buildHash({ name: 'post', id: post.id })}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <PostVisual post={post} className="aspect-[16/9] w-full" />
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  {formatDate(post.date)} · {post.readTime} мин
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Best of week */}
      <section className="bg-gray-900 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-section-title font-black text-white mb-6">
            Лучшее за неделю
          </h2>
          <div className="space-y-3">
            {weekBest.map((post, i) => (
              <a
                key={post.id}
                href={buildHash({ name: 'post', id: post.id })}
                className="group flex items-center gap-3 sm:gap-4 bg-gray-800 rounded-xl p-3 sm:p-4 hover:bg-gray-700 transition-all"
              >
                <span className="text-xl sm:text-2xl font-black text-orange-500 w-7 sm:w-8 text-center shrink-0">
                  {i + 1}
                </span>
                <PostVisual post={post} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 mt-0.5">
                    {post.description}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-sm text-gray-400 shrink-0">
                  <span>🔥 {post.reactions.fire}</span>
                  <span>😂 {post.reactions.funny}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-center">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 30%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="relative">
            <h2 className="text-section-title font-black text-white">
              Самое смешное — прямо в твоей ленте
            </h2>
            <p className="mt-2 text-white/80 text-base sm:text-lg">
              Подписывайся на ПОРЖАЛИ во ВКонтакте и не пропускай новые мемы, истории и жизненный юмор.
            </p>
            <a
              href={siteConfig.vkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-white text-orange-600 text-base font-bold px-6 sm:px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-lg"
            >
              <ExternalLink size={20} />
              Перейти во ВКонтакте
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Feed modal */}
      <FeedModal
        open={feedOpen}
        onClose={() => setFeedOpen(false)}
        onApply={handleApplyFeed}
      />
    </div>
  );
}
