import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '../dictionaries';
import { SITE_URL } from '@/lib/site';
import Code from '@/components/Code';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const d = dict.howCodesAreGenerated;
  const pageUrl = `${SITE_URL}/${lang}/how-codes-are-generated`;
  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${SITE_URL}/en/how-codes-are-generated`,
        fr: `${SITE_URL}/fr/how-codes-are-generated`,
        nl: `${SITE_URL}/nl/how-codes-are-generated`,
        es: `${SITE_URL}/es/how-codes-are-generated`,
        zh: `${SITE_URL}/zh/how-codes-are-generated`,
      },
    },
    openGraph: { title: d.meta.title, description: d.meta.description, url: pageUrl, type: 'article', locale: lang },
    twitter: { title: d.meta.title, description: d.meta.description },
  };
}

const FULL_URI = 'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==;AT:0;AD:A1B2C3D4E5F6;AS:8;BI:1A2B3C;PI:FFFF;HQ:1;;';

const STEP_URIS = [
  'BLUETOOTH:UUID:184F',
  'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==',
  'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==;AT:0',
  'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==;AT:0;AD:A1B2C3D4E5F6',
  'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==;AT:0;AD:A1B2C3D4E5F6;AS:8',
  'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==;AT:0;AD:A1B2C3D4E5F6;AS:8;BI:1A2B3C',
  'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==;AT:0;AD:A1B2C3D4E5F6;AS:8;BI:1A2B3C;PI:FFFF',
  'BLUETOOTH:UUID:184F;BN:QWlycG9ydA==;AT:0;AD:A1B2C3D4E5F6;AS:8;BI:1A2B3C;PI:FFFF;HQ:1',
  FULL_URI,
];

function FieldRow({ field, value, label, description, optional, note }: {
  field: string; value: string; label: string; description: string; optional?: boolean; note?: string;
}) {
  return (
    <div className="border border-primary-tint rounded-xl overflow-hidden">
      <div className="flex items-start gap-4 p-4 bg-surface">
        <div className="shrink-0 w-36">
          <code className="text-sm font-bold text-primary bg-primary-tint px-2 py-0.5 rounded">{field}</code>
          {optional && <span className="block text-xs text-body-text/40 mt-1 ml-1">optional</span>}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-body-text text-sm">{label}</p>
          <p className="text-sm text-body-text/60 mt-1 leading-relaxed">{description}</p>
          <p className="text-xs text-body-text/40 mt-2">
            Example value: <code className="text-primary">{value}</code>
          </p>
          {note && (
            <p className="text-xs text-body-text/50 bg-primary-tint border border-primary/20 rounded-lg px-3 py-2 mt-3 leading-relaxed">{note}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function HowCodesAreGenerated({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const d = dict.howCodesAreGenerated;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: d.hero.heading,
    description: d.meta.description,
    url: `${SITE_URL}/${lang}/how-codes-are-generated`,
    proficiencyLevel: 'Beginner',
    author: { '@type': 'Organization', name: 'Audeara', url: 'https://audeara.com' },
    publisher: { '@type': 'Organization', name: 'Audeara', url: 'https://audeara.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${lang}/how-codes-are-generated` },
    about: { '@type': 'Thing', name: 'Auracast Bluetooth URI', description: 'The Bluetooth URI string encoded inside Auracast QR codes' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-body-text">{d.hero.heading}</h1>
          <p className="text-lg text-body-text/70 leading-relaxed">{d.hero.p}</p>
        </div>

        {/* URI at a glance */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-primary">{d.atAGlance.heading}</h2>
          <p className="text-body-text/70 leading-relaxed">{d.atAGlance.p}</p>
          <Code>
            <pre className="text-sm font-mono text-primary whitespace-nowrap">{FULL_URI}</pre>
          </Code>
          <p className="text-sm text-body-text/50">
            {d.atAGlance.note.split(';')[0]}{' '}
            <code className="text-primary">;</code>
            {'. '}
            {d.atAGlance.note.split('. ')[1] ?? ''}
            {' '}<code className="text-primary">;;</code>.
          </p>
        </section>

        {/* Fields */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-primary">{d.fields.heading}</h2>
          <div className="space-y-3">
            {d.fields.rows.map((row) => (
              <FieldRow
                key={row.field}
                field={row.field}
                value={row.value}
                label={row.label}
                description={row.description}
                optional={row.optional}
                note={'note' in row ? (row as typeof row & { note: string }).note : undefined}
              />
            ))}
          </div>
        </section>

        {/* Why Base64 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-primary">{d.base64.heading}</h2>
          <p className="text-body-text/70 leading-relaxed">
            {d.base64.p.split('A–Z')[0]}
            <code className="text-primary text-sm">A–Z a–z 0–9 + /</code>
            {' '}plus optional <code className="text-primary text-sm">=</code> padding.
          </p>
          <div className="bg-primary-tint rounded-xl p-5 space-y-2 text-sm font-mono">
            <div className="flex gap-4 items-center">
              <span className="text-body-text/50 w-24 shrink-0">Input text</span>
              <span className="text-body-text font-semibold">&quot;Airport&quot;</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-body-text/50 w-24 shrink-0 font-sans">Base64</span>
              <span className="text-primary font-semibold">QWlycG9ydA==</span>
            </div>
            <div className="border-t border-primary-tint pt-2 mt-2 flex gap-4 items-center">
              <span className="text-body-text/50 w-24 shrink-0">Input text</span>
              <span className="text-body-text font-semibold">&quot;Café du Monde&quot;</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-body-text/50 w-24 shrink-0 font-sans">Base64</span>
              <span className="text-primary font-semibold">Q2Fmw6kgZHUgTW9uZGU=</span>
            </div>
          </div>
          <p className="text-sm text-body-text/50">{d.base64.notice}</p>

          <div className="space-y-4 pt-1">
            <h3 className="font-semibold text-body-text">{d.base64.terminal.heading}</h3>

            {/* macOS */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-body-text">{d.base64.terminal.macos.title}</p>
              <Code className="p-4 rounded-xl space-y-3">
                <div>
                  <p className="text-xs text-body-text/40 mb-1.5">{d.base64.terminal.macos.encode}</p>
                  <code className="text-primary text-sm">echo -n &quot;Your Broadcast Name&quot; | base64</code>
                </div>
                <div className="border-t border-body-text/10 pt-3">
                  <p className="text-xs text-body-text/40 mb-1.5">{d.base64.terminal.macos.decode}</p>
                  <code className="text-primary text-sm">echo &quot;WW91ciBCcm9hZGNhc3QgTmFtZQ==&quot; | base64 --decode</code>
                </div>
              </Code>
            </div>

            {/* Linux */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-body-text">{d.base64.terminal.linux.title}</p>
              <p className="text-xs text-body-text/50">{d.base64.terminal.linux.note}</p>
              <Code className="p-4 rounded-xl space-y-3">
                <div>
                  <p className="text-xs text-body-text/40 mb-1.5">{d.base64.terminal.linux.encode}</p>
                  <code className="text-primary text-sm">echo -n &quot;Your Broadcast Name&quot; | base64</code>
                </div>
                <div className="border-t border-body-text/10 pt-3">
                  <p className="text-xs text-body-text/40 mb-1.5">{d.base64.terminal.linux.decode}</p>
                  <code className="text-primary text-sm">echo &quot;WW91ciBCcm9hZGNhc3QgTmFtZQ==&quot; | base64 --decode</code>
                </div>
              </Code>
            </div>

            {/* Windows */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-body-text">{d.base64.terminal.windows.title}</p>
              <p className="text-xs text-body-text/50">{d.base64.terminal.windows.note}</p>
              <Code className="p-4 rounded-xl space-y-3">
                <div>
                  <p className="text-xs text-body-text/40 mb-1.5">{d.base64.terminal.windows.encode}</p>
                  <code className="text-primary text-sm break-all">[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes(&quot;Your Broadcast Name&quot;))</code>
                </div>
                <div className="border-t border-body-text/10 pt-3">
                  <p className="text-xs text-body-text/40 mb-1.5">{d.base64.terminal.windows.decode}</p>
                  <code className="text-primary text-sm break-all">[System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String(&quot;WW91ciBCcm9hZGNhc3QgTmFtZQ==&quot;))</code>
                </div>
              </Code>
            </div>

            <p className="text-xs text-body-text/50">{d.base64.terminal.flagNote}</p>
          </div>
        </section>

        {/* Worked example */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold text-primary">{d.workedExample.heading}</h2>
          <p className="text-body-text/70 leading-relaxed">{d.workedExample.p}</p>

          <div className="bg-surface border border-primary-tint rounded-xl p-5 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {Object.entries(d.workedExample.tableLabels).map(([key, label]) => (
              <div key={key} className="flex gap-2">
                <span className="text-body-text/50 shrink-0 w-36">{label}</span>
                <span className="text-body-text font-semibold">
                  {d.workedExample.tableValues[key as keyof typeof d.workedExample.tableValues]}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {d.workedExample.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center mt-1">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="font-semibold text-body-text text-sm">{step.label}</p>
                  <Code className="px-4 py-2.5 rounded-lg">
                    <code className="text-primary text-xs whitespace-nowrap">{STEP_URIS[i]}</code>
                  </Code>
                  <p className="text-xs text-body-text/50">{step.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Complete URI */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-primary">{d.completeUri.heading}</h2>
          <p className="text-body-text/70 leading-relaxed">{d.completeUri.p}</p>
          <Code>
            <pre className="text-sm font-mono text-primary whitespace-nowrap">{FULL_URI}</pre>
          </Code>
          <p className="text-sm text-body-text/50">{d.completeUri.note}</p>
        </section>

        {/* CTA */}
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
          <Link href={`/${lang}/what-is-auracast`} className="text-primary hover:text-primary-active transition-colors">
            {d.learnMore.link}
          </Link>
        </p>
      </div>
    </>
  );
}
