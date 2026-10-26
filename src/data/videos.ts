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
    id: 'humor-shorts-bunvjven8u8',
    title: 'Новый Shorts — находка №2',
    description: 'Ещё один короткий ролик для подборки «ПОРЖАЛИ». Смотреть на YouTube.',
    url: 'https://www.youtube.com/shorts/BUNvJveN8U8',
    source: 'youtube',
    date: '2026-10-26',
    emoji: '🔥',
    featured: true,
  },
  {
    id: 'humor-shorts-ut8foumls9y',
    title: 'Новый Shorts — находка дня',
    description: 'Короткий ролик, присланный для подборки «ПОРЖАЛИ». Смотреть на YouTube.',
    url: 'https://www.youtube.com/shorts/ut8FoUmlS9Y',
    source: 'youtube',
    date: '2026-10-26',
    emoji: '🔥',
    featured: true,
  },
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
    id: 'humor-pingu-pinga',
    title: 'Пингу — знакомство с сестрёнкой',
    description: 'Забавные семейные приключения пингвинёнка Пингу. Официальный канал Pingu.',
    url: 'https://www.youtube.com/watch?v=hHjPN-0MYnk',
    source: 'youtube',
    date: '2023-09-21',
    emoji: '🐧',
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
