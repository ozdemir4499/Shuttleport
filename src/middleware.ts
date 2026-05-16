import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['tr', 'en', 'de', 'ru'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
  localeDetection: false // SEO İÇİN KRİTİK: Googlebot'un yanlış dile yönlendirilmesini engeller
});

export default function middleware(req: NextRequest) {
  return intlMiddleware(req);
}

export const config = {
  // api, _next, _vercel ve dosya uzantılarını (.*\\..*) yoksay
  matcher: ['/', '/(tr|en|de|ru)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
