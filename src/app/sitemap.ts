import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shuttleport.com';

  const locales = ['tr', 'en', 'de', 'ru'];
  const routes = [
    { path: '', priority: 1, freq: 'daily' as const },
    { path: '/vehicles', priority: 0.8, freq: 'weekly' as const },
    { path: '/hakkimizda', priority: 0.5, freq: 'monthly' as const },
    { path: '/iletisim', priority: 0.5, freq: 'yearly' as const },
  ];

  return locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.freq,
      priority: route.priority,
    }))
  );
}
