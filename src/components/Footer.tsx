import type en from '@/dictionaries/en.json';
import ThemeToggle from './ThemeToggle';

type FooterDict = typeof en.footer;

export default function Footer({ dict }: { dict: FooterDict }) {
  return (
    <footer className="bg-surface border-t border-primary-tint px-6 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <a
            href="https://audeara.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary-active transition-colors"
          >
            {dict.poweredBy}
          </a>
          <p className="text-xs text-body-text/40 leading-relaxed max-w-xl">
            Auracast™ is a registered trademark of{' '}
            <a
              href="https://www.bluetooth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-body-text/60 transition-colors"
            >
              Bluetooth SIG, Inc.
            </a>{' '}
            All brand names are the property of their respective owners.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  );
}
