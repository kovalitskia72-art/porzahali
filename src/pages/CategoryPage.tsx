import { useState, useMemo } from 'react';
import { posts as allPosts } from '@/data/posts';
import { getCategory, categories } from '@/config/site';
import type { SortMode } from '@/types';
import { PostCard } from '@/components/PostCard';
import { AdSlot } from '@/components/AdSlot';
import type { Route } from '@/hooks/useRouter';
import { Clock, Flame, ArrowLeft } from 'lucide-react';
import { Fragment } from 'react';

interface Props {
  hasReacted: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => boolean;
  onReact: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => void;
  onNavigate: (r: Route) => void;
  categoryId?: string | null;
  showAll?: boolean;
}

export function CategoryPage({ hasReacted, onReact, onNavigate, categoryId, showAll }: Props) {
  const [sort, setSort] = useState<SortMode>('new');
  const [selectedCat, setSelectedCat] = useState<string | null>(categoryId ?? null);

  const filtered = useMemo(() => {
    let result = allPosts;
    if (selectedCat) {
      result = result.filter((p) => p.category === selectedCat);
    }
    if (sort === 'new') {
      result = [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      result = [...result].sort(
        (a, b) =>
          b.reactions.funny + b.reactions.like + b.reactions.fire + b.reactions.wow -
          (a.reactions.funny + a.reactions.like + a.reactions.fire + a.reactions.wow)
      );
    }
    return result;
  }, [selectedCat, sort]);

  const cat = selectedCat ? getCategory(selectedCat) : null;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => onNavigate({ name: 'home' })}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          На главную
        </button>

        <h1 className="text-page-title font-black text-gray-900">
          {showAll ? 'Все публикации' : cat ? `${cat.emoji} ${cat.label}` : 'Все публикации'}
        </h1>
        {cat && <p className="mt-2 text-gray-500">{cat.description}</p>}

        {/* Category pills — horizontal scroll on mobile */}
        <div className="mt-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible no-scrollbar">
          <div className="flex gap-2 sm:flex-wrap min-w-max sm:min-w-0">
            <button
              onClick={() => setSelectedCat(null)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                !selectedCat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  selectedCat === c.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Сортировка:</span>
          <button
            onClick={() => setSort('new')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              sort === 'new'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={16} />
            По новизне
          </button>
          <button
            onClick={() => setSort('popular')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              sort === 'popular'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Flame size={16} />
            По популярности
          </button>
        </div>

        {/* Results count */}
        <p className="mt-4 text-sm text-gray-400">
          Найдено: {filtered.length}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post, i) => (
              <Fragment key={post.id}>
                <PostCard post={post} hasReacted={hasReacted} onReact={onReact} />
                {i === 5 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AdSlot variant="inline" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-gray-400">
            <p className="text-lg">Ничего не найдено в этой категории</p>
          </div>
        )}
      </div>
    </div>
  );
}
