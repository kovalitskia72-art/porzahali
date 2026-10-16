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
  url: '/porzahali/videos/late-night.mp4',
    source: 'mp4',
    date: '2026-09-23',
    emoji: '🌙',
    featured: true,
  },
  {
    id: 'demo-five-minutes',
    title: 'Это всего на пять минут',
    description: 'Когда пять минут у начальника имеют собственную систему измерения времени.',
  url: '/porzahali/videos/five-minutes.mp4',
    source: 'mp4',
    date: '2026-09-23',
    emoji: '💼',
    featured: true,
  },
  {
    id: 'demo-cleaning',
    title: 'У меня дома убрано',
    description: 'Главное — уверенно сказать. Остальное камера переживёт.',
   url: '/porzahali/videos/cleaning.mp4',
    source: 'mp4',
    date: '2026-09-23',
    emoji: '😅',
    featured: true,
  },

  {
    id: 'volk-zayac-01',
    title: 'Волк и Заяц — Серия 1. Выборы',
    description: 'Первая серия городского юмористического мультсериала про Волка и Зайца.',
    url: 'https://youtu.be/ZakbKsQnD3g',
    source: 'youtube',
    date: '2026-10-14',
    emoji: '🐺',
    featured: true,
  },

  {
    id: 'volk-zayac-02',
    title: 'Волк и Заяц — Серия 2. После выборов',
    description: 'Продолжение юмористического мультсериала. А что мы выиграли?',
    url: 'https://youtu.be/tknTiVpWVUs',
    source: 'youtube',
    date: '2026-10-15',
    emoji: '🐺',
    featured: true,
  },
];
