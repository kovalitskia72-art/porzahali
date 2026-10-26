import { memo } from 'react';
import type { Post } from '@/types';
import { getCategory } from '@/config/site';
import { PostVisual } from './PostVisual';
import { ReactionBar } from './ReactionBar';
import { buildHash } from '@/hooks/useRouter';
import { CalendarDays, Eye, ArrowRight } from 'lucide-react';

interface Props {
  post: Post;
  hasReacted: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => boolean;
  onReact: (postId: string, type: 'like' | 'funny' | 'fire' | 'wow') => void;
}

function formatDate(dateStr: string): string {
  const months = [
    'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return String(views);
}

/**
 * The shared editorial card for all eight content categories.
 * Art/photography is data-driven through PostVisual; the layout stays consistent.
 */
function PostCardBase({ post, hasReacted, onReact }: Props) {
  const category = getCategory(post.category);
  const href = buildHash({ name: 'post', id: post.id });

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-300/50 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/70">
      <a href={href} className="relative block overflow-hidden" aria-label={`Открыть: ${post.title}`}>
        <PostVisual post={post} className="aspect-[16/9] w-full" />
        <span className="absolute left-3 top-3 inline-flex max-w-[80%] items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-md backdrop-blur-sm">
          <span aria-hidden="true">{category?.emoji}</span>
          <span className="truncate">{category?.label}</span>
        </span>
      </a>

      <div className="flex flex-1 flex-col px-4 pb-3 pt-3.5 sm:px-4">
        <a href={href} className="block">
          <h3 className="line-clamp-2 min-h-[2.7rem] text-base font-extrabold leading-snug tracking-tight text-gray-950 transition-colors group-hover:text-orange-600 sm:text-[17px]">
            {post.title}
          </h3>
        </a>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-[13px] leading-5 text-gray-500">
          {post.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] font-medium text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} aria-hidden="true" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1.5" title="Просмотры">
            <Eye size={14} aria-hidden="true" />
            {formatViews(post.views)}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 border-t border-gray-100 pt-2.5">
          <ReactionBar
            post={post}
            hasReacted={hasReacted}
            onReact={onReact}
            compact
          />
          <a
            href={href}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-orange-50 px-3.5 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-500 hover:text-white focus-visible:bg-orange-500 focus-visible:text-white"
            aria-label={`Читать: ${post.title}`}
          >
            Читать
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export const PostCard = memo(PostCardBase);
