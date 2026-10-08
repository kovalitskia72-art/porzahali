import type { Post } from '@/types';
import { getCategory } from '@/config/site';

export function PostVisual({
  post,
  className = '',
}: {
  post: Post;
  className?: string;
}) {
  const cat = getCategory(post.category);
  const altText = `Иллюстрация: ${post.title}`;

if (post.visual.type === 'image' && post.visual.imageUrl) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={post.visual.imageUrl}
        alt={altText}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

  if (post.visual.type === 'chat') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        role="img"
        aria-label={altText}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${post.visual.gradient}`} />
        <div className="relative z-10 flex flex-col gap-1.5 p-4 w-full max-w-[200px]">
          <div className="self-start bg-white/90 rounded-2xl rounded-tl-sm px-3 py-1.5 text-xs text-gray-800 shadow-sm">
            Привет!
          </div>
          <div className="self-end bg-white/40 rounded-2xl rounded-tr-sm px-3 py-1.5 text-xs text-white shadow-sm">
            Ну привет...
          </div>
          <div className="self-start bg-white/90 rounded-2xl rounded-tl-sm px-3 py-1.5 text-xs text-gray-800 shadow-sm">
            😂
          </div>
        </div>
      </div>
    );
  }

  if (post.visual.type === 'meme') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        role="img"
        aria-label={altText}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${post.visual.gradient}`} />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="text-5xl sm:text-6xl drop-shadow-lg select-none">
            {post.visual.text}
          </span>
          <span className="bg-white/90 text-gray-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            {cat?.emoji} МЕМ
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      role="img"
      aria-label={altText}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${post.visual.gradient}`} />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(45deg, transparent 48%, white 48%, white 52%, transparent 52%)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <span className="text-4xl sm:text-5xl drop-shadow-lg select-none">
          {post.visual.text}
        </span>
        <span className="bg-white/90 text-gray-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          {cat?.emoji} {cat?.label}
        </span>
      </div>
    </div>
  );
}
