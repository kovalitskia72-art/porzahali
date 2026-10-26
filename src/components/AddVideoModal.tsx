import { useState, type FormEvent } from 'react';
import { X, Link as LinkIcon, PlusCircle, BookmarkPlus } from 'lucide-react';
import { normalizeVideoUrl } from '@/components/VideoCard';
import type { HumorVideo } from '@/data/videos';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (video: HumorVideo) => void;
}

const GITHUB_NEW_ISSUE_URL = 'https://github.com/kovalitskia72-art/porzahali/issues/new';

function getSafeUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed : null;
  } catch {
    return null;
  }
}

function getYouTubeId(url: URL): string | null {
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.toLowerCase();
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null;
  } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    id = url.pathname === '/watch'
      ? url.searchParams.get('v')
      : /^\/(shorts|live|embed)\//.test(url.pathname)
        ? url.pathname.split('/')[2] ?? null
        : null;
  }

  return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}

export function AddVideoModal({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!open) return null;

  const validate = (): { cleanTitle: string; cleanUrl: string; parsedUrl: URL } | null => {
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    setError('');
    setFeedback('');

    if (cleanTitle.length < 2 || cleanTitle.length > 120 || !cleanUrl) {
      setError('Укажи название (2–120 символов) и ссылку на видео.');
      return null;
    }

    const parsedUrl = getSafeUrl(cleanUrl);
    if (!parsedUrl) {
      setError('Нужна обычная ссылка, начинающаяся с https:// или http://.');
      return null;
    }

    return { cleanTitle, cleanUrl, parsedUrl };
  };

  const submitForPublication = (event: FormEvent) => {
    event.preventDefault();
    const values = validate();
    if (!values) return;

    const youtubeId = getYouTubeId(values.parsedUrl);
    if (!youtubeId) {
      setError('Для публикации в общей ленте нужна ссылка на YouTube.');
      return;
    }

    const issueUrl = new URL(GITHUB_NEW_ISSUE_URL);
    issueUrl.searchParams.set('title', '[ВИДЕО] ' + values.cleanTitle);
    issueUrl.searchParams.set(
      'body',
      'Ссылка: https://www.youtube.com/watch?v=' + youtubeId +
      '\n\n' +
      'Предложение видео для сайта «ПОРЖАЛИ». ' +
      'Запись, созданная владельцем репозитория, публикуется в ленте автоматически. ' +
      'Предложения других пользователей видны только редакции до одобрения.'
    );

    // Opens GitHub directly from the submit action; no write token is exposed
    // to the public website. A logged-in GitHub account is required.
    window.open(issueUrl.toString(), '_blank', 'noopener,noreferrer');
    setFeedback('Открыли GitHub. Там нажми «Submit new issue» («Создать»). Только после этого ссылка будет отправлена.');
  };

  const saveForMyself = () => {
    const values = validate();
    if (!values) return;

    const normalized = normalizeVideoUrl(values.cleanUrl);
    onAdd({
      id: 'user-' + Date.now(),
      title: values.cleanTitle,
      description: 'Видео из твоей личной подборки.',
      url: normalized.url,
      source: normalized.source,
      date: new Date().toISOString(),
      emoji: '🔥',
    });
    setTitle('');
    setUrl('');
    setError('');
    setFeedback('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" role="presentation">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[95vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-7" role="dialog" aria-modal="true" aria-labelledby="add-video-title">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 id="add-video-title" className="text-xl sm:text-2xl font-black text-gray-900">Добавить свежак</h2>
            <p className="text-sm text-gray-500 mt-1">Ссылка на YouTube для общей ленты или личная подборка.</p>
          </div>
          <button onClick={onClose} type="button" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500" aria-label="Закрыть">
            <X size={22} />
          </button>
        </div>
        <form onSubmit={submitForPublication} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Название</span>
            <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Когда зарплата пришла" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Ссылка на видео</span>
            <div className="relative mt-1.5">
              <LinkIcon size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtu.be/..." className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:border-orange-400" required />
            </div>
          </label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {feedback && <p role="status" className="text-sm text-green-700">{feedback}</p>}

          <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-sm text-orange-900">
            <p className="font-semibold">Для общей ленты</p>
            <p className="mt-1 text-xs leading-relaxed">
              Откроется GitHub — там нужно подтвердить создание записи. Если ты вошёл как владелец «ПОРЖАЛИ», ролик увидят все посетители. Остальные предложения ждут проверки.
            </p>
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-5 py-3.5 rounded-xl hover:bg-orange-600 transition-colors">
            <PlusCircle size={19} /> Отправить для публикации
          </button>
          <button type="button" onClick={saveForMyself} className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            <BookmarkPlus size={18} /> Сохранить только для себя
          </button>
          <p className="text-xs text-center text-gray-500">
            Личные сохранения видны только в этом браузере. Публикация требует аккаунта GitHub.
          </p>
        </form>
      </div>
    </div>
  );
}
