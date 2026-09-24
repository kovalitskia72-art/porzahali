export const siteConfig = {
  name: 'ПОРЖАЛИ',
  slogan: 'Порция юмора на сегодня',
  tagline: 'Здесь смеются каждый день',
  url: 'https://porzhali.ru',
  vkUrl: 'https://vk.com/porzhali',
  apiUrl: '/api',
  description:
    'ПОРЖАЛИ — мемы, смешные истории, анекдоты, переписки и жизненный юмор. Порция юмора на каждый день.',
  analytics: {
    yandexMetrika: '' as string,
    googleAnalytics: '' as string,
  },
} as const;

export type CategoryId =
  | 'memy'
  | 'anekdoty'
  | 'istorii'
  | 'perepiski'
  | 'zhizn'
  | 'rabota'
  | 'otnosheniya'
  | 'semiya';

export interface CategoryDef {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export const categories: CategoryDef[] = [
  {
    id: 'memy',
    label: 'Мемы',
    emoji: '😂',
    color: 'from-orange-400 to-amber-500',
    description: 'Свежие мемы и смешные картинки',
  },
  {
    id: 'anekdoty',
    label: 'Анекдоты',
    emoji: '🤣',
    color: 'from-rose-400 to-red-500',
    description: 'Короткие шутки и анекдоты',
  },
  {
    id: 'istorii',
    label: 'Истории из жизни',
    emoji: '🤯',
    color: 'from-sky-400 to-blue-500',
    description: 'Реальные истории, после которых хочется плакать от смеха',
  },
  {
    id: 'perepiski',
    label: 'Переписки',
    emoji: '💬',
    color: 'from-violet-400 to-purple-500',
    description: 'Смешные переписки и диалоги',
  },
  {
    id: 'rabota',
    label: 'Работа',
    emoji: '💼',
    color: 'from-emerald-400 to-teal-500',
    description: 'Офисный юмор и рабочие ситуации',
  },
  {
    id: 'otnosheniya',
    label: 'Отношения',
    emoji: '❤️',
    color: 'from-pink-400 to-rose-500',
    description: 'Юмор про любовь и отношения',
  },
  {
    id: 'semiya',
    label: 'Семья',
    emoji: '👨‍👩‍👧',
    color: 'from-yellow-400 to-orange-500',
    description: 'Семейные истории и бытовой юмор',
  },
  {
    id: 'zhizn',
    label: 'Жизнь',
    emoji: '🧠',
    color: 'from-indigo-400 to-blue-600',
    description: 'Жизненные наблюдения и философия с юмором',
  },
];

export const navItems = categories.map((c) => ({
  id: c.id,
  label: c.label,
}));

export function getCategory(id: string): CategoryDef | undefined {
  return categories.find((c) => c.id === id);
}
