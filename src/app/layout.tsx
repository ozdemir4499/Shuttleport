import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Shuttleport - Transfer Rezervasyon Sistemi',
    description: 'Havalimanı ve şehir içi transfer hizmetleri için online rezervasyon platformu',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body>{children}</body>
        </html>
    );
}

