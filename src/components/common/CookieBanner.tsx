'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Consent kategorileri
type ConsentState = {
    analytics: boolean;
    marketing: boolean;
};

// Google Consent Mode v2 güncelle
function updateGoogleConsent(consent: ConsentState) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            analytics_storage: consent.analytics ? 'granted' : 'denied',
            ad_storage: consent.marketing ? 'granted' : 'denied',
            ad_user_data: consent.marketing ? 'granted' : 'denied',
            ad_personalization: consent.marketing ? 'granted' : 'denied',
        });
    }
}

// Kayıtlı consent'i oku
function getSavedConsent(): ConsentState | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
}

// Consent'i kaydet
function saveConsent(consent: ConsentState) {
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    localStorage.setItem('kvkk_consent', 'true'); // Eski uyumluluk
}

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [consent, setConsent] = useState<ConsentState>({
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const saved = getSavedConsent();
        if (saved) {
            // Daha önce tercih yapılmış — Google'a bildir
            setConsent(saved);
            updateGoogleConsent(saved);
        } else {
            // İlk ziyaret — banner göster
            setIsVisible(true);
        }
    }, []);

    // Tümünü kabul et
    const acceptAll = useCallback(() => {
        const fullConsent: ConsentState = { analytics: true, marketing: true };
        setConsent(fullConsent);
        saveConsent(fullConsent);
        updateGoogleConsent(fullConsent);
        setIsVisible(false);
    }, []);

    // Sadece gerekli çerezler
    const rejectOptional = useCallback(() => {
        const minConsent: ConsentState = { analytics: false, marketing: false };
        setConsent(minConsent);
        saveConsent(minConsent);
        updateGoogleConsent(minConsent);
        setIsVisible(false);
    }, []);

    // Özel seçim kaydet
    const saveCustom = useCallback(() => {
        saveConsent(consent);
        updateGoogleConsent(consent);
        setIsVisible(false);
        setShowDetails(false);
    }, [consent]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
            <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700 shadow-2xl">
                <div className="max-w-6xl mx-auto p-4 md:p-6">
                    
                    {/* Ana Banner */}
                    <div className="flex flex-col gap-4">
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
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex-1 md:flex-none text-sm text-gray-300 hover:text-white border border-slate-600 hover:border-slate-400 px-4 py-2.5 rounded-lg transition-colors"
                                >
                                    Özelleştir
                                </button>
                                <button
                                    onClick={rejectOptional}
                                    className="flex-1 md:flex-none text-sm text-gray-300 hover:text-white border border-slate-600 hover:border-slate-400 px-4 py-2.5 rounded-lg transition-colors"
                                >
                                    Reddet
                                </button>
                                <button
                                    onClick={acceptAll}
                                    className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
                                >
                                    Tümünü Kabul Et
                                </button>
                            </div>
                        </div>

                        {/* Detaylı Seçim Paneli */}
                        {showDetails && (
                            <div className="border-t border-slate-700 pt-4 mt-2 space-y-3 animate-fade-in">
                                
                                {/* Gerekli Çerezler */}
                                <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                                    <div>
                                        <p className="text-white text-sm font-medium">🔒 Gerekli Çerezler</p>
                                        <p className="text-gray-400 text-xs mt-0.5">Sitenin çalışması için zorunludur. Kapatılamaz.</p>
                                    </div>
                                    <div className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full">
                                        Her Zaman Aktif
                                    </div>
                                </div>

                                {/* Analitik Çerezler */}
                                <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                                    <div>
                                        <p className="text-white text-sm font-medium">📊 Analitik Çerezler</p>
                                        <p className="text-gray-400 text-xs mt-0.5">Site kullanımını analiz etmemize yardımcı olur (Google Analytics).</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={consent.analytics}
                                            onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                {/* Pazarlama Çerezler */}
                                <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                                    <div>
                                        <p className="text-white text-sm font-medium">📢 Pazarlama Çerezleri</p>
                                        <p className="text-gray-400 text-xs mt-0.5">Kişiselleştirilmiş reklamlar için kullanılır (Google Ads).</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={consent.marketing}
                                            onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                {/* Kaydet Butonu */}
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={saveCustom}
                                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
                                    >
                                        Seçimi Kaydet
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
