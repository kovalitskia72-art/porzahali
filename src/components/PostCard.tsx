import { memo } from 'react';
import type { Post } from '@/types';
import { getCategory } from '@/config/site';
import { PostVisual } from './PostVisual';
import { ReactionBar } from './ReactionBar';
import { buildHash } from '@/hooks/useRouter';
import { Eye, ArrowRight } from 'lucide-react';

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

function PostCardBase({ post, hasReacted, onReact }: Props) {
  const cat = getCategory(post.category);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-orange-100/80 bg-white shadow-md shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/80">
      <a
        href={buildHash({ name: 'post', id: post.id })}
        className="relative block overflow-hidden"
      >
        <PostVisual post={post} className="aspect-[16/10] w-full" />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-extrabold text-gray-800 shadow-md backdrop-blur-sm">
            {cat?.emoji} {cat?.label}
          </span>
        </div>
      </a>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <a href={buildHash({ name: 'post', id: post.id })}>
          <h3 className="line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-orange-600">
            {post.title}
          </h3>
        </a>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">
          {post.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs font-medium text-gray-400">
          <span>{formatDate(post.date)}</span>
          <span className="inline-flex items-center gap-1">
            <Eye size={14} />
            {formatViews(post.views)}
          </span>
        </div>
        <ReactionBar
          post={post}
          hasReacted={hasReacted}
          onReact={onReact}
          compact
        />
        <a
          href={buildHash({ name: 'post', id: post.id })}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-extrabold text-orange-700 transition-all group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white"
          aria-label={`Читать: ${post.title}`}
        >
          Читать полностью
          <ArrowRight size={17} />
        </a>
      </div>
    </article>
  );
}

export const PostCard = memo(PostCardBase);
