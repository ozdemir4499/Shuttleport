import type { Metadata, ResolvingMetadata } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(
  { params: { locale } }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://shuttleport.com'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://shuttleport.com',
      siteName: 'Istanbul Transfer',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 800,
          height: 600,
          alt: 'Istanbul Transfer Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/logo.png'],
    },
    alternates: {
      canonical: `https://shuttleport.com/${locale}`,
      languages: {
        'en': 'https://shuttleport.com/en',
        'tr': 'https://shuttleport.com/tr',
        'de': 'https://shuttleport.com/de',
        'ru': 'https://shuttleport.com/ru',
      },
    },
  };
}

import ConditionalFooter from '@/components/layout/ConditionalFooter';
import CookieBanner from '@/components/common/CookieBanner';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout({
    children,
    params: {locale}
}: {
    children: React.ReactNode;
    params: {locale: string};
}) {
    const messages = await getMessages();
    
    // JSON-LD Structured Data for Tourism Service
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Istanbul Transfer",
      "image": "https://shuttleport.com/logo.png",
      "description": "Premium Airport and City Transfer Service",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Istanbul",
        "addressCountry": "TR"
      },
      "priceRange": "$$$",
      "telephone": "+905550000000"
    };

    return (
        <html lang={locale}>
            <head>
                <script
                    id="jsonld-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    suppressHydrationWarning
                />
            </head>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <CookieBanner />
                    <ConditionalFooter />
                </NextIntlClientProvider>
                <Script 
                    src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`} 
                    strategy="beforeInteractive" 
                />
                <GoogleAnalytics gaId="G-XYZ1234567" />
            </body>
        </html>
    );
}
