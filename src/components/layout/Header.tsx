'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import RegisterModal from '@/components/auth/RegisterModal';
import LoginModal from '@/components/auth/LoginModal';
import {
    Menu,
    X,
    ChevronDown,
    Instagram,
    Facebook,
    Globe,
    MessageCircle,
    User
} from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('Header');

    const changeLanguage = (nextLocale: string) => {
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
        const locales = ['/tr', '/en', '/de', '/ru'];
        let pathWithoutLocale = pathname;
        
        for (const loc of locales) {
            if (pathname.startsWith(loc + '/') || pathname === loc) {
                pathWithoutLocale = pathname.replace(loc, '') || '/';
                break;
            }
        }
        
        let finalPath = pathWithoutLocale;
        if (nextLocale !== 'tr') {
            finalPath = `/${nextLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
        }
        window.location.href = finalPath;
    };

    const navLinks = [
        { name: t('nav.tours'), href: '/turlar' },
        { name: t('nav.about'), href: '/hakkimizda' },
        { name: t('nav.partner'), href: '/is-ortagi-ol' },
        { name: t('nav.carrier'), href: '#' },
        { name: t('nav.contact'), href: '/iletisim' },
        { name: t('nav.faq'), href: '/sss' },
    ];

    const isActive = (href: string) => {
        if (href === '#') return false;
        return pathname === href;
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 sm:h-20 md:h-24 flex items-center" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <div className="container-custom flex items-center justify-between w-full px-3 sm:px-4 xl:px-8">
                {/* LOGO */}
                <Link href="/" className="flex flex-col md:flex-row md:items-center transition-opacity hover:opacity-90">
                    <div className="relative flex items-center">
                        {/* Arka Plan (İkon + Silüet) */}
                        <img 
                            src="/logo_bg.png?v=13" 
                            alt="Asitane Travel" 
                            className="h-7 sm:h-9 md:h-[80px] w-auto object-contain"
                        />
                        {/* Metinler - Masaüstünde Yanda, Mobilde Altta */}
                        <div className="absolute md:absolute right-0 md:right-0 top-[20%] md:top-[10%] hidden md:flex flex-col items-end justify-center md:translate-x-[14px] md:-translate-y-[8px]">
                            <img 
                                src="/logo_asitane.png?v=13" 
                                alt="Asitane" 
                                className="md:h-[14.5px] w-auto object-contain"
                            />
                            <img 
                                src="/logo_travel.png?v=13" 
                                alt="Travel" 
                                className="md:h-[16.5px] w-auto object-contain md:mt-0.5"
                            />
                        </div>
                    </div>
                    {/* Mobil için Alt Bölüm */}
                    <div className="flex md:hidden flex-col items-center w-full">
                        <img 
                            src="/logo_asitane.png?v=13" 
                            alt="Asitane" 
                            className="h-[6px] sm:h-[7.5px] w-auto object-contain"
                        />
                        <img 
                            src="/logo_travel.png?v=13" 
                            alt="Travel" 
                            className="h-[10px] sm:h-[12.5px] w-auto object-contain mt-[1px]"
                        />
                    </div>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden xl:flex items-center space-x-8 text-[14px] font-medium tracking-wide text-[#0a192f]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`transition-colors ${isActive(link.href) ? 'text-[#B58A32]' : 'hover:text-[#B58A32]'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* RIGHT ACTIONS */}
                <div className="hidden xl:flex items-center space-x-4">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-3 border-r border-gray-200 pr-5">
                        <Link href="#" className="flex items-center justify-center w-8 h-8 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full hover:scale-110 transition-transform shadow-sm">
                            <Instagram className="w-4 h-4 text-white stroke-[2.5]" />
                        </Link>
                        
                        <Link href="#" className="flex items-center justify-center w-8 h-8 bg-[#1877F2] rounded-full hover:scale-110 transition-transform shadow-sm">
                            <Facebook className="w-4 h-4 text-white stroke-[2.5]" />
                        </Link>

                        <Link href="#" className="flex items-center justify-center w-8 h-8 bg-black rounded-full hover:scale-110 transition-transform shadow-sm">
                            <svg className="w-4 h-4 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917" />
                            </svg>
                        </Link>

                        <Link href="https://wa.me/905324178963" target="_blank" className="flex items-center justify-center w-8 h-8 bg-[#25D366] rounded-full hover:scale-110 transition-transform shadow-sm">
                            <MessageCircle className="w-4 h-4 text-white stroke-[2.5]" />
                        </Link>
                    </div>

                    {/* Language */}
                    <div className="relative flex items-center space-x-2 cursor-pointer group">
                        <div className="flex items-center space-x-2 py-2">
                            <img src={`https://flagcdn.com/w40/${locale === 'en' ? 'gb' : locale}.png`} alt={locale.toUpperCase()} className="w-6 h-6 rounded-full object-cover shadow-sm border border-gray-100" />
                            <span className="text-[15px] font-bold text-gray-900">{locale.toUpperCase()}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
                        </div>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-1 w-20 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <div className="py-2 flex flex-col">
                                {[
                                    { code: 'tr', label: 'TR', flag: 'tr' },
                                    { code: 'en', label: 'EN', flag: 'gb' },
                                    { code: 'de', label: 'DE', flag: 'de' },
                                    { code: 'ru', label: 'RU', flag: 'ru' }
                                ].map((lang) => (
                                    <div key={lang.code} onClick={() => changeLanguage(lang.code)} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.label} className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100" />
                                        <span className="text-[14px] font-semibold text-gray-700">{lang.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Auth */}
                    <div className="flex items-center space-x-4 ml-2">
                        <button onClick={() => setIsRegisterOpen(true)} className="text-[15px] font-bold text-gray-900 hover:text-[#0a192f]">{t('auth.register')}</button>
                        <button onClick={() => setIsLoginOpen(true)} className="flex items-center space-x-2 border border-black rounded-lg px-5 py-2.5 hover:bg-black hover:text-white transition-all group">
                            <User className="w-5 h-5 group-hover:text-white" />
                            <span className="text-[15px] font-bold">{t('auth.login')}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu & Language */}
                <div className="flex xl:hidden items-center space-x-3">
                    {/* Mobile Language Selector */}
                    <div className="relative group" tabIndex={0}>
                        <div className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                            <img src={`https://flagcdn.com/w40/${locale === 'en' ? 'gb' : locale}.png`} alt={locale.toUpperCase()} className="w-[22px] h-[22px] rounded-full object-cover object-center shadow-sm ring-1 ring-gray-100" />
                            <span className="text-[14px] font-bold text-gray-900">{locale.toUpperCase()}</span>
                        </div>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-3 w-24 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-[60]">
                            <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {[
                                    { code: 'tr', label: 'TR', flag: 'tr' },
                                    { code: 'en', label: 'EN', flag: 'gb' },
                                    { code: 'de', label: 'DE', flag: 'de' },
                                    { code: 'ru', label: 'RU', flag: 'ru' }
                                ].map((lang) => (
                                    <div key={lang.code} onClick={() => changeLanguage(lang.code)} className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.label} className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100" />
                                        <span className="text-[14px] font-semibold text-gray-700">{lang.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-1"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-7 h-7 text-gray-900" />
                        ) : (
                            <Menu className="w-7 h-7 text-gray-900" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="xl:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                    <div className="container-custom py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block font-medium tracking-wide p-2 rounded-lg ${isActive(link.href) ? 'text-[#B58A32] bg-amber-50' : 'text-[#0a192f] hover:text-[#B58A32] hover:bg-amber-50'}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 my-2 pt-2"></div>

                        <div className="flex items-center justify-center p-2">
                            <div className="flex space-x-4">
                                <Link href="#" className="flex items-center justify-center w-[30px] h-[30px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full">
                                    <Instagram className="w-4 h-4 text-white stroke-[2.5]" />
                                </Link>
                                <Link href="#" className="flex items-center justify-center w-[30px] h-[30px] bg-[#1877F2] rounded-full">
                                    <Facebook className="w-4 h-4 text-white stroke-[2.5]" />
                                </Link>
                                <Link href="#" className="flex items-center justify-center w-[30px] h-[30px] bg-black rounded-full">
                                    <svg className="w-4 h-4 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917" />
                                    </svg>
                                </Link>
                                <Link href="https://wa.me/905324178963" target="_blank" className="flex items-center justify-center w-[30px] h-[30px] bg-[#25D366] rounded-full">
                                    <MessageCircle className="w-4 h-4 text-white stroke-[2.5]" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button 
                                onClick={() => { setMobileMenuOpen(false); setIsRegisterOpen(true); }} 
                                className="flex-1 text-center py-3 border border-[#0a192f] text-[#0a192f] rounded-lg font-medium tracking-wide hover:border-[#B58A32] hover:text-[#B58A32] transition-colors"
                            >
                                {t('auth.register')}
                            </button>
                            <button 
                                onClick={() => { setMobileMenuOpen(false); setIsLoginOpen(true); }} 
                                className="flex-1 flex justify-center items-center py-3 bg-[#0a192f] text-white rounded-lg font-medium tracking-wide hover:bg-[#112a52] transition-colors space-x-2"
                            >
                                <User className="w-4 h-4" />
                                <span>{t('auth.login')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <RegisterModal 
                isOpen={isRegisterOpen} 
                onClose={() => setIsRegisterOpen(false)} 
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
            />
            
            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />
        </header>
    );
}
