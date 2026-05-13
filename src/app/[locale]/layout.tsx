import type { Metadata, ResolvingMetadata, Viewport } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Viewport — tüm mobil cihazlarda doğru render için zorunlu
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover', // iPhone çentikli ekranlar için
};

export async function generateMetadata(
  { params: { locale } }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Index' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rideportx.com';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'RidePortX';

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
import { GoogleTagManager } from '@next/third-parties/google';

export default async function RootLayout({
    children,
    params: {locale}
}: {
    children: React.ReactNode;
    params: {locale: string};
}) {
    const messages = await getMessages();
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rideportx.com';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'RidePortX';
    const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+905550000000';
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';

    // JSON-LD Structured Data for Tourism Service
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": siteName,
      "image": `${siteUrl}/logo.png`,
      "description": "RidePortX Havalimanı Transfer Hizmetleri",
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
                {/* Google Consent Mode v2 — GTM'den ÖNCE yüklenmeli */}
                <script
                    id="consent-defaults"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('consent', 'default', {
                                'analytics_storage': 'denied',
                                'ad_storage': 'denied',
                                'ad_user_data': 'denied',
                                'ad_personalization': 'denied',
                                'wait_for_update': 500
                            });
                        `
                    }}
                />
                {gtmId && <GoogleTagManager gtmId={gtmId} />}
            </body>
        </html>
    );
}
