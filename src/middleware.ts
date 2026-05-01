import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['tr', 'en', 'de', 'ru'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed'
});

export default function middleware(req: NextRequest) {
  console.log('MIDDLEWARE CALLED FOR:', req.nextUrl.pathname);
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(tr|en|de|ru)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
