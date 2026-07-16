import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['en', 'fr', 'nl', 'es', 'zh'] as const;
const DEFAULT_LOCALE = 'en';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  for (const part of acceptLanguage.split(',')) {
    const tag = part.trim().split(';')[0].trim().toLowerCase();
    if ((LOCALES as readonly string[]).includes(tag)) return tag;
    const primary = tag.split('-')[0];
    if ((LOCALES as readonly string[]).includes(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
