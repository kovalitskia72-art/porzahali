import { useState, useEffect } from 'react';
import { Menu, X, Search, ExternalLink, Film } from 'lucide-react';
import { siteConfig, navItems } from '@/config/site';
import { buildHash, type Route } from '@/hooks/useRouter';

interface Props {
  currentRoute: Route;
  onNavigate: (r: Route) => void;
}

export function Header({ currentRoute, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isActive = (id: string): boolean =>
    currentRoute.name === 'category' && currentRoute.id === id;

  const handleNav = (id: string) => {
    onNavigate({ name: 'category', id });
    setOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a
              href={buildHash({ name: 'home' })}
              className="flex items-center gap-2 shrink-0"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 whitespace-nowrap">
                ПОРЖА<span className="text-orange-500">ЛИ</span>
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => onNavigate({ name: 'videos' })}
                className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                  currentRoute.name === 'videos'
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Film size={16} /> Видео
              </button>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive(item.id)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => onNavigate({ name: 'search' })}
                className="p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                aria-label="Поиск"
              >
                <Search size={20} />
              </button>
              <a
                href={siteConfig.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#0077FF] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0066dd] transition-colors whitespace-nowrap"
              >
                <ExternalLink size={16} />
                ВКонтакте
              </a>
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Меню"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 bg-white flex flex-col transition-transform duration-300 ${
            open ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Menu header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 shrink-0">
            <span className="text-xl font-black text-gray-900">
              ПОРЖА<span className="text-orange-500">ЛИ</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Закрыть меню"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu body */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <button
              onClick={() => {
                onNavigate({ name: 'home' });
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3.5 text-left text-lg font-semibold rounded-xl text-gray-800 hover:bg-gray-50 transition-colors mb-2"
            >
              Главная
            </button>
            <button
              onClick={() => {
                onNavigate({ name: 'videos' });
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3.5 text-left text-lg font-semibold rounded-xl transition-colors mb-3 ${
                currentRoute.name === 'videos' ? 'text-orange-600 bg-orange-50' : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Film size={21} /> Смешное видео
            </button>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Категории
            </p>
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-left text-lg font-semibold rounded-xl transition-colors ${
                    isActive(item.id)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Menu footer */}
          <div className="px-4 py-4 border-t border-gray-100 shrink-0 space-y-3">
            <button
              onClick={() => {
                onNavigate({ name: 'search' });
                setOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-800 text-base font-semibold px-4 py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Search size={20} />
              Поиск
            </button>
            <a
              href={siteConfig.vkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0077FF] text-white text-base font-semibold px-4 py-3.5 rounded-xl hover:bg-[#0066dd] transition-colors"
            >
              <ExternalLink size={20} />
              Мы ВКонтакте
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
