'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Menu,
    X,
    ChevronDown,
    Instagram,
    Globe,
    MessageCircle,
    User
} from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: 'Turlar', href: '/turlar' },
        { name: 'Hakkımızda', href: '/hakkimizda' },
        { name: 'İş Ortağı Ol', href: '/is-ortagi-ol' },
        { name: 'Taşıyıcı Olun', href: '#' },
        { name: 'İletişim', href: '/iletisim' },
        { name: 'S.S.S', href: '/sss' },
    ];

    const isActive = (href: string) => {
        if (href === '#') return false;
        return pathname === href;
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container-custom flex items-center justify-between py-4 px-4">
                {/* LOGO */}
                <Link href="/" className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                        <img 
                            src="/red_lion_icon.png" 
                            alt="Lion Icon" 
                            className="w-full h-full object-contain scale-110 mix-blend-multiply"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-[11px] md:text-[13px] font-bold tracking-[0.2em] text-[#D32F2F] leading-tight">İSTANBUL</span>
                        <span className="text-xl md:text-[28px] font-black text-gray-900 leading-none tracking-tight mt-0.5">TRANSFER</span>
                    </div>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden xl:flex items-center space-x-6 text-[13px] font-bold text-gray-800">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`transition-colors ${isActive(link.href) ? 'text-[#D32F2F]' : 'hover:text-[#D32F2F]'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* RIGHT ACTIONS */}
                <div className="hidden lg:flex items-center space-x-4">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-4 border-r border-gray-200 pr-5">
                        <Link href="#" className="text-gray-900 hover:text-[#D32F2F]"><Instagram className="w-5 h-5 stroke-2" /></Link>
                        <Link href="#" className="text-gray-900 hover:text-[#D32F2F]"><Globe className="w-5 h-5 stroke-2" /></Link>
                        <Link href="https://wa.me/905324178963" target="_blank" className="text-gray-900 hover:text-green-600"><MessageCircle className="w-5 h-5 stroke-2" /></Link>
                    </div>

                    {/* Language */}
                    <div className="flex items-center space-x-2 cursor-pointer group">
                        <div className="w-6 h-6 rounded-full bg-[#D32F2F] flex items-center justify-center text-[9px] text-white font-bold ring-2 ring-transparent group-hover:ring-red-100 transition-all">TR</div>
                        <span className="text-sm font-bold text-gray-900">TR</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>

                    {/* Auth */}
                    <div className="flex items-center space-x-4 ml-2">
                        <Link href="#" className="text-sm font-bold text-gray-900 hover:text-[#D32F2F]">Üye Ol</Link>
                        <Link href="#" className="flex items-center space-x-2 border border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition-all group">
                            <User className="w-4 h-4 group-hover:text-white" />
                            <span className="text-sm font-bold">Giriş</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="w-8 h-8 text-gray-900" />
                    ) : (
                        <Menu className="w-8 h-8 text-gray-900" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                    <div className="container-custom py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block font-bold p-2 rounded-lg ${isActive(link.href) ? 'text-[#D32F2F] bg-red-50' : 'text-gray-900 hover:text-[#D32F2F] hover:bg-red-50'}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 my-2 pt-2"></div>

                        <div className="flex items-center justify-between p-2">
                            <div className="flex space-x-4">
                                <Instagram className="w-5 h-5 text-gray-600" />
                                <Globe className="w-5 h-5 text-gray-600" />
                                <MessageCircle className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-[#D32F2F] flex items-center justify-center text-[9px] text-white font-bold">TR</div>
                                <span className="font-bold">TR</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-2">
                            <Link href="#" className="flex-1 text-center py-3 border border-gray-300 rounded-lg font-bold hover:border-[#D32F2F] hover:text-[#D32F2F]">
                                Üye Ol
                            </Link>
                            <Link href="#" className="flex-1 text-center py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800">
                                Giriş
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
