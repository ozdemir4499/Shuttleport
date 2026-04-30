import type { Metadata } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Istanbul Transfer - VIP Transfer Hizmetleri',
    description: 'Havalimanı ve şehir içi transfer hizmetleri için online rezervasyon platformu',
};

import ConditionalFooter from '@/components/layout/ConditionalFooter';
import CookieBanner from '@/components/common/CookieBanner';
import Script from 'next/script';

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
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            </body>
        </html>
    );
}
