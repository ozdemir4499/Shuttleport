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
    const t = useTranslations('Index'); // Fallback if we need to translate nav

    const toggleLanguage = () => {
        const nextLocale = locale === 'tr' ? 'en' : 'tr';
        // Setting cookie and redirecting to the root of the new locale or reloading
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
        // Quick path replace logic
        let newPath = pathname;
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
            newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
        } else {
            newPath = `/${nextLocale}${pathname === '/' ? '' : pathname}`;
        }
        window.location.href = newPath;
    };

    const navLinks = [
        { name: 'Turlar', href: '/turlar' },
        { name: 'Hakkımızda', href: '/hakkimizda' },
        { name: 'İş Ortağı Ol', href: '/is-ortagi-ol' },
        { name: 'Taşıyıcı Olun', href: '/tasiyici' },
        { name: 'İletişim', href: '/iletisim' },
        { name: 'S.S.S', href: '/sss' },
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
                            alt="RidePortX" 
                            className="h-7 sm:h-9 md:h-[65px] 2xl:h-[80px] w-auto object-contain"
                        />
                        {/* Metinler - Masaüstünde Yanda, Mobilde Altta */}
                        <div className="absolute md:absolute right-0 md:right-0 top-[20%] md:top-[10%] hidden md:flex flex-col items-end justify-center md:translate-x-[14px] md:-translate-y-[8px]">
                            <img 
                                src="/logo_asitane.png?v=13" 
                                alt="RidePortX" 
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
                            alt="RidePortX" 
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
                <nav className="hidden xl:flex items-center space-x-3 2xl:space-x-8 text-[13px] 2xl:text-[14px] font-medium tracking-wide text-[#0a192f]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`transition-colors whitespace-nowrap ${isActive(link.href) ? 'text-[#B58A32]' : 'hover:text-[#B58A32]'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* RIGHT ACTIONS */}
                <div className="hidden xl:flex items-center space-x-2 2xl:space-x-4">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-2 2xl:space-x-3 border-r border-gray-200 pr-3 2xl:pr-5">
                        <Link href="#" className="flex items-center justify-center w-7 h-7 2xl:w-8 2xl:h-8 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full hover:scale-110 transition-transform shadow-sm">
                            <Instagram className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-white stroke-[2.5]" />
                        </Link>
                        
                        <Link href="#" className="flex items-center justify-center w-7 h-7 2xl:w-8 2xl:h-8 bg-[#1877F2] rounded-full hover:scale-110 transition-transform shadow-sm">
                            <Facebook className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-white stroke-[2.5]" />
                        </Link>

                        <Link href="#" className="flex items-center justify-center w-7 h-7 2xl:w-8 2xl:h-8 bg-black rounded-full hover:scale-110 transition-transform shadow-sm">
                            <svg className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917" />
                            </svg>
                        </Link>

                        <Link href="https://wa.me/905324178963" target="_blank" className="flex items-center justify-center w-7 h-7 2xl:w-8 2xl:h-8 bg-[#25D366] rounded-full hover:scale-110 transition-transform shadow-sm">
                            <MessageCircle className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-white stroke-[2.5]" />
                        </Link>
                    </div>

                    {/* Language */}
                    <div className="relative flex items-center space-x-1.5 2xl:space-x-2 cursor-pointer group">
                        <div onClick={toggleLanguage} className="flex items-center space-x-1.5 2xl:space-x-2 py-2">
                            <img src={`https://flagcdn.com/w40/${locale === 'tr' ? 'tr' : 'gb'}.png`} alt={locale.toUpperCase()} className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full object-cover shadow-sm border border-gray-100" />
                            <span className="text-[13px] 2xl:text-[15px] font-bold text-gray-900">{locale.toUpperCase()}</span>
                            <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-gray-500 transition-transform group-hover:rotate-180" />
                        </div>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-1 w-20 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <div className="py-2 flex flex-col">
                                {[
                                    { code: 'EN', flag: 'gb' },
                                    { code: 'DE', flag: 'de' },
                                    { code: 'ES', flag: 'es' },
                                    { code: 'FR', flag: 'fr' },
                                    { code: 'İT', flag: 'it' },
                                    { code: 'PT', flag: 'pt' },
                                    { code: 'RU', flag: 'ru' },
                                    { code: 'HU', flag: 'hu' },
                                    { code: 'NL', flag: 'nl' },
                                    { code: 'AR', flag: 'sa' }
                                ].map((lang) => (
                                    <div key={lang.code} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 transition-colors">
                                        <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.code} className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100" />
                                        <span className="text-[14px] font-semibold text-gray-700">{lang.code}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Auth */}
                    <div className="flex items-center space-x-2 2xl:space-x-4 ml-1 2xl:ml-2">
                        <button onClick={() => setIsRegisterOpen(true)} className="text-[13px] 2xl:text-[15px] font-bold text-gray-900 hover:text-[#0a192f] whitespace-nowrap">Üye Ol</button>
                        <button onClick={() => setIsLoginOpen(true)} className="flex items-center space-x-1.5 2xl:space-x-2 border border-black rounded-lg px-3 py-1.5 2xl:px-5 2xl:py-2.5 hover:bg-black hover:text-white transition-all group whitespace-nowrap">
                            <User className="w-4 h-4 2xl:w-5 2xl:h-5 group-hover:text-white" />
                            <span className="text-[13px] 2xl:text-[15px] font-bold">Giriş</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu & Language */}
                <div className="flex xl:hidden items-center space-x-3">
                    {/* Mobile Language Selector */}
                    <div className="relative group" tabIndex={0}>
                        <div className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                            <img src={`https://flagcdn.com/w40/${locale === 'tr' ? 'tr' : 'gb'}.png`} alt={locale.toUpperCase()} className="w-[22px] h-[22px] rounded-full object-cover object-center shadow-sm ring-1 ring-gray-100" />
                            <span className="text-[14px] font-bold text-gray-900">{locale.toUpperCase()}</span>
                        </div>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-3 w-24 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-[60]">
                            <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {[
                                    { code: 'EN', flag: 'gb' },
                                    { code: 'DE', flag: 'de' },
                                    { code: 'ES', flag: 'es' },
                                    { code: 'FR', flag: 'fr' },
                                    { code: 'İT', flag: 'it' },
                                    { code: 'PT', flag: 'pt' },
                                    { code: 'RU', flag: 'ru' },
                                    { code: 'HU', flag: 'hu' },
                                    { code: 'NL', flag: 'nl' },
                                    { code: 'AR', flag: 'sa' }
                                ].map((lang) => (
                                    <div key={lang.code} className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.code} className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100" />
                                        <span className="text-[14px] font-semibold text-gray-700">{lang.code}</span>
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
                                Üye Ol
                            </button>
                            <button 
                                onClick={() => { setMobileMenuOpen(false); setIsLoginOpen(true); }} 
                                className="flex-1 flex justify-center items-center py-3 bg-[#0a192f] text-white rounded-lg font-medium tracking-wide hover:bg-[#112a52] transition-colors space-x-2"
                            >
                                <User className="w-4 h-4" />
                                <span>Giriş</span>
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
