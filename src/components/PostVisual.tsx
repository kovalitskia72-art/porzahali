import type { Post } from '@/types';
import { getCategory } from '@/config/site';

export function PostVisual({
  post,
  className = '',
}: {
  post: Post;
  className?: string;
}) {
  const category = getCategory(post.category);
  const altText = `Иллюстрация: ${post.title}`;

  if (post.visual.type === 'image' && post.visual.imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
        <img
          src={post.visual.imageUrl}
          alt={altText}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-950/50 to-transparent" />
        <span className="absolute bottom-3 right-3 rounded-full border border-white/30 bg-gray-950/50 px-2.5 py-1 text-[10px] font-black tracking-wide text-white backdrop-blur-sm">
          ПОРЖАЛИ · ФОТО
        </span>
      </div>
    );
  }

  if (post.visual.type === 'chat') {
    const messages = post.content
      .filter((line) => /^[А-ЯЁA-Za-z][^:]{0,24}:/.test(line))
      .slice(0, 3);

    return (
      <div
        className={`relative isolate overflow-hidden bg-gradient-to-br ${post.visual.gradient} ${className}`}
        role="img"
        aria-label={altText}
      >
        <div className="pointer-events-none absolute -left-12 -top-14 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-fuchsia-950/20 blur-2xl" />
        <div className="relative flex h-full flex-col justify-end gap-2 p-4 sm:p-5">
          <div className="absolute right-4 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black tracking-widest text-white backdrop-blur-sm">
            💬 ПЕРЕПИСКА
          </div>
          <div className="flex min-h-0 flex-col justify-end gap-1.5 pt-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[91%] rounded-2xl px-3 py-2 text-[11px] font-semibold leading-snug shadow-sm sm:text-sm ${
                  index % 2 === 0
                    ? 'self-start rounded-bl-sm bg-white text-gray-900'
                    : 'self-end rounded-br-sm bg-white/30 text-white ring-1 ring-white/30'
                }`}
              >
                <span className="block line-clamp-2">{message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Give each text-based story the feel of a small editorial cover rather
  // than using a giant emoji as a placeholder illustration.
  const isMeme = post.visual.type === 'meme';
  const eyebrow = isMeme ? 'ЖИЗНЕННЫЙ МЕМ' : (category?.label.toUpperCase() ?? 'ИСТОРИЯ');
  const titleSize = post.title.length > 55
    ? 'text-lg sm:text-xl'
    : 'text-xl sm:text-2xl';

  return (
    <div
      className={`relative isolate overflow-hidden bg-gradient-to-br ${post.visual.gradient} ${className}`}
      role="img"
      aria-label={altText}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="pointer-events-none absolute -left-10 -top-16 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-52 w-52 rounded-full bg-gray-950/15 blur-2xl" />
      <div className="pointer-events-none absolute right-4 top-9 -rotate-12 select-none text-7xl opacity-45 drop-shadow-md sm:text-8xl" aria-hidden="true">
        {post.visual.text}
      </div>
      <div className="relative flex h-full flex-col justify-between gap-3 p-4 sm:p-5">
        <div className="flex justify-end">
          <span className="rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-[10px] font-black tracking-[0.13em] text-white backdrop-blur-sm">
            ПОРЖАЛИ
          </span>
        </div>
        <div className="max-w-[92%]">
          <span className="mb-1.5 inline-block rounded bg-gray-950/20 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/95">
            {eyebrow}
          </span>
          <p className={`line-clamp-3 font-black leading-tight tracking-tight text-white drop-shadow-md ${titleSize}`}>
            {post.title}
          </p>
        </div>
        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-white/85">
          <span>Улыбнись, это про нас</span>
          <span className="rounded-full border border-white/35 px-2 py-0.5 text-sm">↗</span>
        </div>
      </div>
    </div>
  );
}
