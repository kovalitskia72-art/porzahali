import { useState, useEffect } from 'react';
import { categories } from '@/config/site';
import type { CategoryId } from '@/config/site';
import { useFeedPreferences } from '@/hooks/useFeedPreferences';
import { X, Check } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (selected: CategoryId[]) => void;
}

export function FeedModal({ open, onClose, onApply }: Props) {
  const { prefs } = useFeedPreferences();
  const [localSelected, setLocalSelected] = useState<CategoryId[]>(prefs);

  useEffect(() => {
    if (open) {
      setLocalSelected(prefs);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, prefs]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleToggle = (id: CategoryId) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-black text-gray-900">Собрать ленту под себя</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Закрыть"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-gray-500 mb-4">
            Выбери категории, которые тебе интересны. Мы соберём ленту только из них.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const active = localSelected.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleToggle(cat.id)}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all text-left ${
                    active
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{cat.emoji}</span>
                  <span className={`font-semibold text-sm ${active ? 'text-orange-700' : 'text-gray-700'}`}>
                    {cat.label}
                  </span>
                  {active && (
                    <span className="ml-auto shrink-0">
                      <Check size={18} className="text-orange-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3 rounded-b-2xl">
          <button
            onClick={() => setLocalSelected([])}
            className="px-5 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Очистить
          </button>
          <button
            onClick={handleApply}
            disabled={localSelected.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-500 text-white text-base font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Показать мою ленту
            {localSelected.length > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                {localSelected.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
