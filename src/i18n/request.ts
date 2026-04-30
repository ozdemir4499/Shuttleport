import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['tr', 'en', 'de', 'ru'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  const currentLocale = locale || 'tr';
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(currentLocale as string)) notFound();

  return {
    locale: currentLocale,
    messages: (await import(`../../messages/${currentLocale}.json`)).default
  };
});
