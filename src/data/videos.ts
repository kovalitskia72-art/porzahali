export type VideoSourceType = 'mp4' | 'youtube' | 'external';

export interface HumorVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  source: VideoSourceType;
  date: string;
  emoji: string;
  featured?: boolean;
}

export const videos: HumorVideo[] = [
  {
    id: 'demo-late-night',
    title: 'Ещё один ролик — и спать',
    description: 'Классическая ошибка человека, который решил лечь пораньше.',
    url: '/videos/late-night.mp4',
    source: 'mp4',
    date: '2026-09-23',
    emoji: '🌙',
    featured: true,
  },
  {
    id: 'demo-five-minutes',
    title: 'Это всего на пять минут',
    description: 'Когда пять минут у начальника имеют собственную систему измерения времени.',
    url: '/videos/five-minutes.mp4',
    source: 'mp4',
    date: '2026-09-23',
    emoji: '💼',
    featured: true,
  },
  {
    id: 'demo-cleaning',
    title: 'У меня дома убрано',
    description: 'Главное — уверенно сказать. Остальное камера переживёт.',
    url: '/videos/cleaning.mp4',
    source: 'mp4',
    date: '2026-09-23',
    emoji: '😅',
    featured: true,
  },
];
