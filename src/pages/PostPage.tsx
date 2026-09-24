import { useMemo, useState } from 'react';
import { posts as allPosts } from '@/data/posts';
import { getCategory } from '@/config/site';
import { PostVisual } from '@/components/PostVisual';
import { ReactionBar } from '@/components/ReactionBar';
import { AdSlot } from '@/components/AdSlot';
import { ShareButtons } from '@/components/ShareButtons';
import { buildHash, type Route } from '@/hooks/useRouter';
import { ArrowLeft, Clock, Eye } from 'lucide-react';

interface Props {
  postId: string;
  hasReacted: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => boolean;
  onReact: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => void;
  onNavigate: (r: Route) => void;
}

function formatDate(dateStr: string): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return String(views);
}

export function PostPage({ postId, hasReacted, onReact, onNavigate }: Props) {
  const post = useMemo(() => allPosts.find((p) => p.id === postId), [postId]);
  const related = useMemo(() => {
    if (!post) return [];
    const sameCat = allPosts.filter((p) => p.category === post.category && p.id !== post.id);
    if (sameCat.length >= 3) return sameCat.slice(0, 3);
    const otherPopular = allPosts
      .filter((p) => p.id !== post.id && p.category !== post.category)
      .sort((a, b) => b.reactions.funny + b.reactions.like - a.reactions.funny - a.reactions.like);
    return [...sameCat, ...otherPopular].slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">Публикация не найдена</p>
          <button
            onClick={() => onNavigate({ name: 'home' })}
            className="mt-4 text-orange-600 font-semibold hover:text-orange-700"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const cat = getCategory(post.category);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => onNavigate({ name: 'all' })}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Назад к юмору
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
            {cat?.emoji} {cat?.label}
          </span>
        </div>

        <h1 className="text-post-title font-black text-gray-900 leading-tight">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
          <span>{formatDate(post.date)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} />
            {post.readTime} мин чтения
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye size={14} />
            {formatViews(post.views)} просмотров
          </span>
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden">
          <PostVisual post={post} className="aspect-[16/9] w-full" />
        </div>

        <div className="mt-6 max-w-none">
          <p className="text-base sm:text-lg text-gray-600 font-medium mb-4">{post.description}</p>
          {post.content.map((line, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-3">
              {line}
            </p>
          ))}
        </div>

        <AdSlot variant="article" className="my-8" />

        {/* Reactions */}
        <div className="my-8 p-6 bg-gray-50 rounded-2xl">
          <p className="text-center text-base font-bold text-gray-700 mb-4">
            Ну как? 😄
          </p>
          <ReactionBar
            post={post}
            hasReacted={hasReacted}
            onReact={onReact}
          />
        </div>

        {/* Share */}
        <div className="mb-8">
          <ShareButtons title={post.title} />
        </div>

        {/* JSON-LD Article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              articleSection: cat?.label,
              inLanguage: 'ru-RU',
              publisher: {
                '@type': 'Organization',
                name: 'ПОРЖАЛИ',
              },
            }),
          }}
        />

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">Читайте также</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rp) => (
                <a
                  key={rp.id}
                  href={buildHash({ name: 'post', id: rp.id })}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
                >
                  <PostVisual post={rp} className="aspect-[16/10] w-full" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
