import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  // Gelen isteğin bir Arama Motoru Botu (Google, Yandex, Bing vb.) olup olmadığını anla
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|yandexbot|slurp|duckduckbot|baiduspider/i.test(userAgent);

  // Middleware'i dinamik olarak oluştur
  const intlMiddleware = createMiddleware({
    locales: ['tr', 'en', 'de', 'ru'],
    defaultLocale: 'tr',
    localePrefix: 'as-needed',
    // Eğer bot ise otomatik yönlendirmeyi kapat (SEO koruması), insansa aç (UX için Rusça vb.)
    localeDetection: !isBot
  });

  return intlMiddleware(req);
}

export const config = {
  // api, _next, _vercel ve dosya uzantılarını yoksay
  matcher: ['/', '/(tr|en|de|ru)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
