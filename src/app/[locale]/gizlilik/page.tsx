'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import { useTranslations } from 'next-intl';

export default function GizlilikPage() {
    const t = useTranslations('Legal.gizlilik');
    
    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-16 pt-28 text-slate-800">
                <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
                <div 
                    className="prose lg:prose-xl" 
                    dangerouslySetInnerHTML={{ __html: t.raw('content') }} 
                />
            </div>
        </>
    );
}
