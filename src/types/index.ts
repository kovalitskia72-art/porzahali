import type { CategoryId } from '@/config/site';

export type ReactionType = 'like' | 'funny' | 'fire' | 'wow';

export interface ReactionCounts {
  like: number;
  funny: number;
  fire: number;
  wow: number;
}

export interface Post {
  id: string;
  category: CategoryId;
  title: string;
  description: string;
  content: string[];
  date: string;
  readTime: number;
  views: number;
  reactions: ReactionCounts;
  visual: {
  type: 'gradient' | 'meme' | 'chat' | 'image';
    text: string;
  gradient: string;
  imageUrl?: string; 
  };
  featured?: boolean;
}

export type SortMode = 'new' | 'popular';
