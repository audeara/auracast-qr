import Image from 'next/image';
import Link from 'next/link';
import type en from '@/dictionaries/en.json';
import LanguageSwitcher from './LanguageSwitcher';

type HeaderDict = typeof en.header;

interface HeaderProps {
  dict: HeaderDict;
  lang: string;
}

export default function Header({ dict, lang }: HeaderProps) {
  return (
    <header className="bg-surface border-b border-primary-tint px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 flex-wrap">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <Image src="/auracast-logo.svg" alt="Auracast logo" width={28} height={28} />
          <span className="text-lg font-bold text-primary">{dict.title}</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href={`/${lang}/what-is-auracast`}
              className="text-body-text/70 hover:text-primary transition-colors"
            >
              {dict.nav.whatIsAuracast}
            </Link>
            <Link
              href={`/${lang}/how-codes-are-generated`}
              className="text-body-text/70 hover:text-primary transition-colors"
            >
              {dict.nav.howCodesWork}
            </Link>
          </nav>
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}
