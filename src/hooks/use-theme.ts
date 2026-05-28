import { useEffect, useState } from 'react';

const THEME_EVENT = 'theme-change';

function getInitial(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('theme') === 'dark';
}

export function useTheme(): [boolean, (v: boolean | ((p: boolean) => boolean)) => void] {
  const [dark, setDarkState] = useState<boolean>(getInitial);

  useEffect(() => {
    const sync = () => setDarkState(getInitial());
    window.addEventListener(THEME_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    const metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (metaTheme) {
      metaTheme.setAttribute('content', dark ? '#0c1211' : '#059669');
    }
  }, [dark]);

  const setDark = (v: boolean | ((p: boolean) => boolean)) => {
    setDarkState(prev => {
      const next = typeof v === 'function' ? (v as (p: boolean) => boolean)(prev) : v;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      window.dispatchEvent(new Event(THEME_EVENT));
      return next;
    });
  };

  return [dark, setDark];
}
