import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface Props {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="text-sm font-semibold text-gray-500 w-full sm:w-auto sm:mr-2">
        Поделиться:
      </span>
      <a
        href={`https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#0077FF] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0066dd] transition-colors"
      >
        <ExternalLink size={16} />
        ВКонтакте
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#0088CC] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0077bb] transition-colors"
      >
        <Share2 size={16} />
        Telegram
      </a>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
        {copied ? 'Скопировано!' : 'Копировать ссылку'}
      </button>
    </div>
  );
}
