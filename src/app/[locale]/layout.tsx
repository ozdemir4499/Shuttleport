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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asitanetravel.com';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Asitane Travel';

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: siteUrl,
      siteName: siteName,
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 800,
          height: 600,
          alt: `${siteName} Logo`,
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
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'en': `${siteUrl}/en`,
        'tr': `${siteUrl}/tr`,
        'de': `${siteUrl}/de`,
        'ru': `${siteUrl}/ru`,
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
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asitanetravel.com';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Asitane Travel';
    const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+905550000000';
    const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XYZ1234567';

    // JSON-LD Structured Data for Tourism Service
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": siteName,
      "image": `${siteUrl}/logo.png`,
      "description": "Premium Airport and City Transfer Service",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Istanbul",
        "addressCountry": "TR"
      },
      "priceRange": "$$$",
      "telephone": contactPhone
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
                {gaId !== 'G-XYZ1234567' && <GoogleAnalytics gaId={gaId} />}
            </body>
        </html>
    );
}
