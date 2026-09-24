interface Props {
  variant?: 'inline' | 'sidebar' | 'article';
  className?: string;
}

export function AdSlot({ variant = 'inline', className = '' }: Props) {
  const styles: Record<string, string> = {
    inline: 'h-24 sm:h-28',
    sidebar: 'h-64',
    article: 'h-28 sm:h-32',
  };

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-200 ${styles[variant]} ${className}`}
      role="complementary"
      aria-label="Реклама"
    >
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
        Рекламное место
      </span>
    </div>
  );
}
