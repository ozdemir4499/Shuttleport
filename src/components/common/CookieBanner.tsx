'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('kvkk_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('kvkk_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-xl z-50 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-700">
            <div className="text-sm md:text-base">
                KVKK ve GDPR kapsamında deneyiminizi iyileştirmek için çerezler kullanıyoruz. Sitemizi kullanmaya devam ederek {' '}
                <Link href="/tr/gizlilik" className="text-amber-400 hover:underline font-semibold">Gizlilik Politikamızı</Link> ve {' '}
                <Link href="/tr/kullanim" className="text-amber-400 hover:underline font-semibold">Kullanım Koşullarımızı</Link> {' '}
                kabul etmiş sayılırsınız.
            </div>
            <button 
                onClick={acceptCookies}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-lg whitespace-nowrap transition-colors"
            >
                Kabul Ediyorum
            </button>
        </div>
    );
}
