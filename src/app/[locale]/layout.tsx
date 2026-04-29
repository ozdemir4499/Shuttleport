import type { Metadata } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Luxe Transfer - VIP Transfer Hizmetleri',
    description: 'Havalimanı ve şehir içi transfer hizmetleri için online rezervasyon platformu',
};

import ConditionalFooter from '@/components/layout/ConditionalFooter';

export default async function RootLayout({
    children,
    params: {locale}
}: {
    children: React.ReactNode;
    params: {locale: string};
}) {
    const messages = await getMessages();
    return (
        <html lang={locale}>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <ConditionalFooter />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
