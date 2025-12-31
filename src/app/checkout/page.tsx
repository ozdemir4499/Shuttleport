'use client';

import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
