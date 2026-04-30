import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Luxe Transfer - VIP Transfer Hizmetleri',
    description: 'Havalimanı ve şehir içi transfer hizmetleri için online rezervasyon platformu',
};

import ConditionalFooter from '@/components/layout/ConditionalFooter';
import Script from 'next/script';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                {children}
                <ConditionalFooter />
                <Script 
                    src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`} 
                    strategy="beforeInteractive" 
                />
            </body>
        </html>
    );
}
