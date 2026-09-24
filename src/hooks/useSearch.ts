import { useState, useMemo } from 'react';
import { posts as allPosts } from '@/data/posts';
import type { Post } from '@/types';
import type { CategoryId } from '@/config/site';

export function useSearch(query: string, category?: CategoryId | null): Post[] {
  return useMemo(() => {
    let result = allPosts;
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.content.some((line) => line.toLowerCase().includes(q))
      );
    }
    return result;
  }, [query, category]);
}
