import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['tr', 'en', 'de', 'ru'],

  // Used when no locale matches
  defaultLocale: 'tr',
  
  // Hide the locale prefix for the default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(tr|en|de|ru)/:path*']
};
