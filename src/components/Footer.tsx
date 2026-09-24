import { siteConfig, navItems } from '@/config/site';

interface Props {
  onNavigate: (r: { name: 'home' } | { name: 'category'; id: string } | { name: 'search' } | { name: 'videos' }) => void;
}

export function Footer({ onNavigate }: Props) {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-black text-white mb-2">
              ПОРЖА<span className="text-orange-500">ЛИ</span>
            </div>
            <p className="text-sm text-gray-400">{siteConfig.slogan}</p>
            <p className="text-sm text-gray-500 mt-1">{siteConfig.tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Навигация
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate({ name: 'home' })}
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Главная
                </button>
              </li>
              {navItems.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate({ name: 'category', id: item.id })}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate({ name: 'videos' })}
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Смешное видео
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ name: 'search' })}
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Поиск
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Ещё
            </h4>
            <ul className="space-y-2">
              {navItems.slice(3).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate({ name: 'category', id: item.id })}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Сообщество
            </h4>
            <a
              href={siteConfig.vkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0077FF] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#0066dd] transition-colors"
            >
              Мы во ВКонтакте
            </a>
            <p className="text-xs text-gray-500 mt-3">
              © 2026 ПОРЖАЛИ. Юмор каждый день.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
