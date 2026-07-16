import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from './dictionaries';
import { SITE_URL } from '@/lib/site';
import HomeContent from '@/components/HomeContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: {
      absolute: 'Free Auracast QR Code Generator | Audeara',
    },
    description:
      'Free Auracast QR code generator. Create SIG-compliant Bluetooth broadcast codes for venues and assistive listening. Customise colours and download as SVG or PNG.',
    alternates: {
      canonical: SITE_URL,
      languages: {
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
        nl: `${SITE_URL}/nl`,
        es: `${SITE_URL}/es`,
        zh: `${SITE_URL}/zh`,
      },
    },
    openGraph: {
      title: 'Free Auracast QR Code Generator | Audeara',
      description:
        'Generate SIG-compliant Bluetooth Auracast QR codes in seconds. Customise, preview, and download — free.',
      url: SITE_URL,
      type: 'website',
      locale: lang,
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Auracast QR Code Generator',
  description:
    'Free online tool to generate SIG-compliant Bluetooth Auracast QR codes for venues, hearing loops, and assistive listening deployments.',
  url: SITE_URL,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  creator: { '@type': 'Organization', name: 'Audeara', url: 'https://audeara.com' },
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <HomeContent dict={dict} />
      </Suspense>
    </>
  );
}
