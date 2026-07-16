import { notFound } from 'next/navigation';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDictionary, hasLocale, LOCALES } from './dictionaries';

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <NuqsAdapter>
      <Header dict={dict.header} lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict.footer} />
    </NuqsAdapter>
  );
}
