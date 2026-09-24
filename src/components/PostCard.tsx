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
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      <a
        href={buildHash({ name: 'post', id: post.id })}
        className="block relative"
      >
        <PostVisual post={post} className="aspect-[16/10] w-full" />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {cat?.emoji} {cat?.label}
          </span>
        </div>
      </a>
      <div className="flex flex-col flex-1 p-4">
        <a href={buildHash({ name: 'post', id: post.id })}>
          <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </a>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
          {post.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
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
          className="mt-3 inline-flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 text-sm font-semibold py-2.5 rounded-xl transition-colors"
          aria-label={`Читать: ${post.title}`}
        >
          Читать
          <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
}

export const PostCard = memo(PostCardBase);
