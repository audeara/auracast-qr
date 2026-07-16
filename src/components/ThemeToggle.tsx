'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: '☀' },
  { value: 'system', label: 'Auto' },
  { value: 'dark', label: '☽' },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    if (next === 'system') {
      localStorage.removeItem('theme');
      document.documentElement.removeAttribute('data-theme');
    } else {
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
    }
  }

  return (
    <div className="flex items-center rounded-lg border border-primary-tint p-0.5 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => apply(opt.value)}
          className={[
            'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
            theme === opt.value
              ? 'bg-primary text-white'
              : 'text-body-text/50 hover:text-body-text',
          ].join(' ')}
          aria-label={opt.value === 'system' ? 'Use system theme' : `Switch to ${opt.value} mode`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
