import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Shuttleport - Transfer Rezervasyon Sistemi',
    description: 'Havalimanı ve şehir içi transfer hizmetleri için online rezervasyon platformu',
};

import Footer from '@/components/layout/Footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                {children}
                <Footer />
            </body>
        </html>
    );
}
