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
    id: 'humor-simons-cat',
    title: 'Кот Саймона — как разбудить хозяина',
    description: 'Голодный кот изобретает всё новые способы разбудить хозяина. Автор: Simon’s Cat.',
    url: 'https://www.youtube.com/watch?v=w0ffwDYo00Q',
    source: 'youtube',
    date: '2008-03-04',
    emoji: '🐈',
    featured: true,
  },
  {
    id: 'humor-mr-bean-sandwich',
    title: 'Мистер Бин готовит бутерброд',
    description: 'Самый необычный способ перекусить. Канал: Classic Mr Bean.',
    url: 'https://www.youtube.com/watch?v=t0956BTFpQM',
    source: 'youtube',
    date: '2026-01-10',
    emoji: '🥪',
    featured: true,
  },
  {
    id: 'humor-just-for-laughs',
    title: 'Розыгрыш: когда ничего не страшно',
    description: 'Неожиданные реакции в юмористическом розыгрыше. Канал: Just For Laughs Gags.',
    url: 'https://www.youtube.com/watch?v=gqI9MB221kw',
    source: 'youtube',
    date: '2024-01-31',
    emoji: '🤣',
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
  {
    id: 'volk-zayac-03',
    title: 'Волк и Заяц — Серия 3. Первый указ мэра',
    description: 'Волк стал мэром и объявляет первый указ. Но кому повысят зарплаты?',
    url: 'https://youtu.be/ULHh33wwkpY',
    source: 'youtube',
    date: '2026-10-22',
    emoji: '🐺',
    featured: true,
  },
];
