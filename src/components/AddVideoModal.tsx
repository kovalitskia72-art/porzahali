import { useState, type FormEvent } from 'react';
import { X, Link as LinkIcon, PlusCircle } from 'lucide-react';
import { normalizeVideoUrl } from '@/components/VideoCard';
import type { HumorVideo } from '@/data/videos';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (video: HumorVideo) => void;
}

export function AddVideoModal({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    if (!cleanTitle || !cleanUrl) {
      setError('Укажи название и ссылку на видео.');
      return;
    }
    try {
      new URL(cleanUrl);
    } catch {
      setError('Похоже, ссылка введена неправильно.');
      return;
    }
    const normalized = normalizeVideoUrl(cleanUrl);
    onAdd({
      id: `user-${Date.now()}`,
      title: cleanTitle,
      description: 'Свежак от редакции ПОРЖАЛИ.',
      url: normalized.url,
      source: normalized.source,
      date: new Date().toISOString(),
      emoji: '🔥',
    });
    setTitle('');
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Добавить свежак</h2>
            <p className="text-sm text-gray-500 mt-1">YouTube, прямая MP4-ссылка или ссылка на ролик.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500" aria-label="Закрыть">
            <X size={22} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Название</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Когда зарплата пришла" className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Ссылка на видео</span>
            <div className="relative mt-1.5">
              <LinkIcon size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtu.be/..." className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:border-orange-400" />
            </div>
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-xs text-orange-800">
            Пока добавленные тобой ролики сохраняются на этом устройстве. Для общей редакторской ленты позже подключим базу, чтобы новый ролик видели все посетители.
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-5 py-3.5 rounded-xl hover:bg-orange-600 transition-colors">
            <PlusCircle size={19} /> Добавить видео
          </button>
        </form>
      </div>
    </div>
  );
}
