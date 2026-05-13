'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Google Consent Mode v2 güncelle
function updateGoogleConsent(granted: boolean) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const value = granted ? 'granted' : 'denied';
        window.gtag('consent', 'update', {
            analytics_storage: value,
            ad_storage: value,
            ad_user_data: value,
            ad_personalization: value,
        });
    }
}

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('cookie_consent');
        if (saved) {
            updateGoogleConsent(saved === 'accepted');
        } else {
            setIsVisible(true);
        }
    }, []);

    const accept = useCallback(() => {
        localStorage.setItem('cookie_consent', 'accepted');
        localStorage.setItem('kvkk_consent', 'true');
        updateGoogleConsent(true);
        setIsVisible(false);
    }, []);

    const reject = useCallback(() => {
        localStorage.setItem('cookie_consent', 'rejected');
        updateGoogleConsent(false);
        setIsVisible(false);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
            <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700 shadow-2xl">
                <div className="max-w-6xl mx-auto p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <h3 className="text-white font-bold text-sm md:text-base">Çerez Tercihleri</h3>
                            </div>
                            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                                KVKK ve GDPR kapsamında deneyiminizi iyileştirmek için çerezler kullanıyoruz.{' '}
                                <Link href="/tr/gizlilik" className="text-amber-400 hover:underline font-medium">Gizlilik Politikası</Link> ve{' '}
                                <Link href="/tr/kullanim" className="text-amber-400 hover:underline font-medium">Kullanım Koşulları</Link>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                                onClick={reject}
                                className="flex-1 md:flex-none text-sm text-gray-300 hover:text-white border border-slate-600 hover:border-slate-400 px-5 py-2.5 rounded-lg transition-colors"
                            >
                                Reddet
                            </button>
                            <button
                                onClick={accept}
                                className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
                            >
                                Kabul Et
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
