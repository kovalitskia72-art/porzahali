import { useState, useCallback, useEffect } from 'react';
import type { ReactionType } from '@/types';

const STORAGE_KEY = 'porzhali_reactions';

type ReactionState = Record<string, ReactionType[]>;

function loadState(): ReactionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ReactionState;
  } catch {
    // ignore
  }
  return {};
}

export function useReactions() {
  const [userReactions, setUserReactions] = useState<ReactionState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userReactions));
    } catch {
      // ignore
    }
  }, [userReactions]);

  const toggleReaction = useCallback(
    (postId: string, type: ReactionType) => {
      setUserReactions((prev) => {
        const current = prev[postId] ?? [];
        const has = current.includes(type);
        if (has) {
          return { ...prev, [postId]: current.filter((t) => t !== type) };
        }
        return { ...prev, [postId]: [...current, type] };
      });
    },
    []
  );

  const hasReacted = useCallback(
    (postId: string, type: ReactionType): boolean => {
      return (userReactions[postId] ?? []).includes(type);
    },
    [userReactions]
  );

  return { userReactions, toggleReaction, hasReacted };
}
