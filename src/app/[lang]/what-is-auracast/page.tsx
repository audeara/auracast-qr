import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '../dictionaries';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const d = dict.whatIsAuracast;
  const pageUrl = `${SITE_URL}/${lang}/what-is-auracast`;
  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${SITE_URL}/en/what-is-auracast`,
        fr: `${SITE_URL}/fr/what-is-auracast`,
        nl: `${SITE_URL}/nl/what-is-auracast`,
        es: `${SITE_URL}/es/what-is-auracast`,
        zh: `${SITE_URL}/zh/what-is-auracast`,
      },
    },
    openGraph: { title: d.meta.title, description: d.meta.description, url: pageUrl, type: 'article', locale: lang },
    twitter: { title: d.meta.title, description: d.meta.description },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Card({ icon, heading, body }: { icon: string; heading: string; body: string }) {
  return (
    <div className="bg-surface rounded-xl border border-primary-tint p-5 flex gap-4">
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <h3 className="font-semibold text-body-text mb-1">{heading}</h3>
        <p className="text-sm text-body-text/70 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default async function WhatIsAuracast({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const d = dict.whatIsAuracast;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.hero.heading,
    description: d.meta.description,
    url: `${SITE_URL}/${lang}/what-is-auracast`,
    author: { '@type': 'Organization', name: 'Audeara', url: 'https://audeara.com' },
    publisher: { '@type': 'Organization', name: 'Audeara', url: 'https://audeara.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${lang}/what-is-auracast` },
    about: { '@type': 'Thing', name: 'Auracast', description: 'Bluetooth LE Audio broadcast standard developed by the Bluetooth SIG' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-body-text">{d.hero.heading}</h1>
          <p className="text-lg text-body-text/70 leading-relaxed">{d.hero.p1}</p>
          <p className="text-body-text/70 leading-relaxed">{d.hero.p2}</p>
        </div>

        <Section title={d.difference.heading}>
          <p className="text-body-text/70 leading-relaxed">{d.difference.p}</p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-primary-tint rounded-xl p-5">
              <p className="font-semibold text-body-text mb-2">{d.difference.classicTitle}</p>
              <ul className="text-sm text-body-text/70 space-y-1 list-disc list-inside">
                {d.difference.classicBullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
            <div className="bg-primary rounded-xl p-5">
              <p className="font-semibold text-white mb-2">{d.difference.auracastTitle}</p>
              <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
                {d.difference.auracastBullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </div>
        </Section>

        <Section title={d.who.heading}>
          <p className="text-body-text/70 leading-relaxed">{d.who.p}</p>
          <div className="space-y-3 pt-2">
            {d.who.cards.map((card) => (
              <Card key={card.heading} icon={card.icon} heading={card.heading} body={card.body} />
            ))}
          </div>
        </Section>

        <Section title={d.where.heading}>
          <p className="text-body-text/70 leading-relaxed">{d.where.p}</p>
          <ul className="grid sm:grid-cols-2 gap-3 pt-2">
            {d.where.venues.map((venue) => (
              <li key={venue.heading} className="bg-surface border border-primary-tint rounded-xl p-4 flex gap-3 list-none">
                <span className="text-xl shrink-0">{venue.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-body-text">{venue.heading}</p>
                  <p className="text-xs text-body-text/60 mt-0.5">{venue.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={d.qrCodes.heading}>
          <p className="text-body-text/70 leading-relaxed">{d.qrCodes.p1}</p>
          <p className="text-body-text/70 leading-relaxed">{d.qrCodes.p2}</p>
          <p className="text-body-text/70 leading-relaxed">{d.qrCodes.p3}</p>
        </Section>

        <div className="bg-primary-tint rounded-2xl p-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="font-bold text-body-text text-lg">{d.cta.heading}</p>
            <p className="text-sm text-body-text/60 mt-1">{d.cta.subtext}</p>
          </div>
          <Link
            href={`/${lang}`}
            className="shrink-0 bg-primary hover:bg-primary-active text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            {d.cta.button}
          </Link>
        </div>

        <p className="text-sm text-body-text/50 text-center">
          {d.learnMore.text}{' '}
          <Link href={`/${lang}/how-codes-are-generated`} className="text-primary hover:text-primary-active transition-colors">
            {d.learnMore.link}
          </Link>
        </p>
      </div>
    </>
  );
}
