import { useState, useEffect, useCallback } from 'react';
import type { CategoryId } from '@/config/site';

const STORAGE_KEY = 'porzhali_feed_prefs';

function loadPrefs(): CategoryId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CategoryId[];
  } catch {
    // ignore
  }
  return [];
}

export function useFeedPreferences() {
  const [prefs, setPrefs] = useState<CategoryId[]>(loadPrefs);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  const toggle = useCallback((id: CategoryId) => {
    setPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const clear = useCallback(() => setPrefs([]), []);

  return { prefs, toggle, clear };
}
