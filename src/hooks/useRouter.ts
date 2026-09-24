import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'category'; id: string }
  | { name: 'post'; id: string }
  | { name: 'search' }
  | { name: 'videos' }
  | { name: 'all' };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  if (hash === '/' || hash === '') return { name: 'home' };
  if (hash === '/search') return { name: 'search' };
  if (hash === '/videos') return { name: 'videos' };
  if (hash === '/all') return { name: 'all' };
  const postMatch = hash.match(/^\/post\/(.+)$/);
  if (postMatch) return { name: 'post', id: postMatch[1] };
  const catMatch = hash.match(/^\/category\/(.+)$/);
  if (catMatch) return { name: 'category', id: catMatch[1] };
  return { name: 'home' };
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '/';
    case 'category':
      return `/category/${route.id}`;
    case 'post':
      return `/post/${route.id}`;
    case 'search':
      return '/search';
    case 'videos':
      return '/videos';
    case 'all':
      return '/all';
  }
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((r: Route) => {
    window.location.hash = routeToHash(r);
  }, []);

  return { route, navigate };
}

export function buildHash(route: Route): string {
  return `#${routeToHash(route)}`;
}
