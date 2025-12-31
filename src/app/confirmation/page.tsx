'use client';

import { Suspense } from 'react';
import ConfirmationContent from './ConfirmationContent';

export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
