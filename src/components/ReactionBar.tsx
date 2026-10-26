import { memo } from 'react';
import type { Post, ReactionType } from '@/types';

interface Props {
  post: Post;
  hasReacted: (postId: string, type: ReactionType) => boolean;
  onReact: (postId: string, type: ReactionType) => void;
  compact?: boolean;
}

const reactionConfig: {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
}[] = [
  { type: 'like', emoji: '❤️', label: 'Нравится', color: 'text-rose-500' },
  { type: 'funny', emoji: '😂', label: 'Смешно', color: 'text-amber-500' },
  { type: 'fire', emoji: '🔥', label: 'Жиза', color: 'text-orange-500' },
  { type: 'wow', emoji: '🤯', label: 'Вау', color: 'text-sky-500' },
];

function ReactionBarBase({ post, hasReacted, onReact, compact }: Props) {
  return (
    <div className={`flex min-w-0 flex-wrap items-center ${compact ? 'gap-x-0.5 gap-y-1' : 'mt-4 gap-1.5'}`} aria-label="Реакции">
      {reactionConfig.map(({ type, emoji, label, color }) => {
        const active = hasReacted(post.id, type);
        const count = post.reactions[type] + (active ? 1 : 0);
        return (
          <button
            key={type}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReact(post.id, type);
            }}
            className={`inline-flex min-h-9 items-center justify-center gap-1 rounded-full font-medium transition-all duration-200 active:scale-90 ${compact ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1 text-xs'} ${
              active
                ? `${color} bg-gray-50 ring-1 ring-current/20`
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
            aria-label={`${label}: ${count}`}
            aria-pressed={active}
          >
            <span aria-hidden="true" className={`transition-transform duration-200 ${compact ? 'text-[13px]' : 'text-sm'} ${active ? 'scale-125' : 'scale-100'}`}>
              {emoji}
            </span>
            <span className="tabular-nums">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export const ReactionBar = memo(ReactionBarBase);
