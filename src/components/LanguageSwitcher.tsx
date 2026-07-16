'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const LOCALES = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
] as const;

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === currentLang) ?? LOCALES[0];

  function swapLocale(code: string) {
    return pathname.replace(/^\/[^/]+/, `/${code}`);
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-body-text/70 hover:text-primary hover:bg-primary-tint transition-colors"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-44 bg-surface border border-primary-tint rounded-xl shadow-lg py-1 z-50"
        >
          {LOCALES.map((locale) => {
            const isActive = locale.code === currentLang;
            return (
              <button
                key={locale.code}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setOpen(false);
                  router.push(swapLocale(locale.code));
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'text-primary font-semibold bg-primary-tint/60'
                    : 'text-body-text/70 hover:bg-primary-tint/40 hover:text-primary'
                }`}
              >
                <span className="text-base leading-none">{locale.flag}</span>
                <span>{locale.label}</span>
                {isActive && (
                  <svg
                    className="w-3.5 h-3.5 ml-auto shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
