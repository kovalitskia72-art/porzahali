import { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { categories } from '@/config/site';
import type { CategoryId } from '@/config/site';
import { PostCard } from '@/components/PostCard';
import { Search as SearchIcon, X, RotateCcw } from 'lucide-react';

interface Props {
  hasReacted: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => boolean;
  onReact: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => void;
}

export function SearchPage({ hasReacted, onReact }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const results = useSearch(query, category);

  const hasFilters = query || category;

  const resetSearch = () => {
    setQuery('');
    setCategory(null);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-page-title font-black text-gray-900 mb-6">
          Поиск
        </h1>

        <div className="relative">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={24}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти мем, историю или анекдот…"
            autoFocus
            className="w-full pl-12 pr-12 py-4 text-base sm:text-lg bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-400 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Очистить запрос"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Category filters — horizontal scroll on mobile */}
        <div className="mt-4 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible no-scrollbar">
          <div className="flex gap-2 sm:flex-wrap min-w-max sm:min-w-0">
            <button
              onClick={() => setCategory(null)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                !category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Все категории
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  category === c.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Найдено: {results.length} {results.length === 1 ? 'публикация' : 'публикаций'}
          </p>
          {hasFilters && (
            <button
              onClick={resetSearch}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <RotateCcw size={14} />
              Сбросить поиск
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {results.map((post) => (
              <PostCard key={post.id} post={post} hasReacted={hasReacted} onReact={onReact} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-gray-400">
            <p className="text-lg">
              {hasFilters
                ? 'Ничего не нашли 😄\nПопробуй поискать что-нибудь другое.'
                : 'Начни вводить запрос выше 🔍'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
