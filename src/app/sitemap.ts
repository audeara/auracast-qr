import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const LOCALES = ['en', 'fr', 'nl', 'es', 'zh'];

const PATHS = ['', '/what-is-auracast', '/how-codes-are-generated'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.8,
      });
    }
  }

  return entries;
}
