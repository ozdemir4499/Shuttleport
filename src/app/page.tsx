'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, Shield, Clock, Car, Globe, Menu, X } from 'lucide-react';

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Scroll effect for navbar
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            setIsScrolled(window.scrollY > 50);
        });
    }

    return (
        <main className="min-h-screen bg-white">
            {/* HEADER - Sticky Navigation */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
                    }`}
            >
                <nav className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'
                                }`}>
                                ShuttlePort
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="#"
                                className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
                                    }`}
                            >
                                Anasayfa
                            </Link>
                            <Link
                                href="#"
                                className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
                                    }`}
                            >
                                Transfer
                            </Link>
                            <Link
                                href="#"
                                className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
                                    }`}
                            >
                                Turlar
                            </Link>
                            <Link
                                href="#"
                                className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
                                    }`}
                            >
                                Filo
                            </Link>
                            <Link
                                href="#"
                                className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
                                    }`}
                            >
                                İletişim
                            </Link>
                        </div>

                        {/* Right Side - Language & Login */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button className={`flex items-center space-x-1 font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-orange-600' : 'text-white hover:text-orange-300'
                                }`}>
                                <Globe className="w-4 h-4" />
                                <span>TR</span>
                            </button>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                                Giriş Yap
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className={isScrolled ? 'text-gray-900' : 'text-white'} />
                            ) : (
                                <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-3">
                            <Link href="#" className="block text-gray-700 hover:text-orange-600 font-medium">Anasayfa</Link>
                            <Link href="#" className="block text-gray-700 hover:text-orange-600 font-medium">Transfer</Link>
                            <Link href="#" className="block text-gray-700 hover:text-orange-600 font-medium">Turlar</Link>
                            <Link href="#" className="block text-gray-700 hover:text-orange-600 font-medium">Filo</Link>
                            <Link href="#" className="block text-gray-700 hover:text-orange-600 font-medium">İletişim</Link>
                            <button className="w-full bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg">
                                Giriş Yap
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            {/* HERO SECTION with Background Image */}
            <section className="relative h-screen flex items-center justify-center">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container-custom text-center px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
                        İstanbul'un En Konforlu<br />VIP Transfer Hizmeti
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
                        Havalimanı ve Şehir İçi Transferlerde 7/24 Yanınızdayız
                    </p>

                    {/* BOOKING WIDGET - Main Reservation Form */}
                    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
                        {/* Tab Menu - Transfer / Saatlik Kirala / Turlar */}
                        <div className="flex space-x-8 mb-8 border-b border-gray-200">
                            <button
                                onClick={() => setTripType('oneway')}
                                className={`flex items-center space-x-2 pb-4 font-semibold transition-all duration-200 border-b-2 ${tripType === 'oneway'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Car className="w-5 h-5" />
                                <span>Transfer</span>
                            </button>
                            <button
                                onClick={() => setTripType('roundtrip')}
                                className={`flex items-center space-x-2 pb-4 font-semibold transition-all duration-200 border-b-2 ${tripType === 'roundtrip'
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Clock className="w-5 h-5" />
                                <span>Saatlik Kirala</span>
                            </button>
                            <button
                                className="flex items-center space-x-2 pb-4 font-semibold transition-all duration-200 border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                            >
                                <MapPin className="w-5 h-5" />
                                <span>Turlar</span>
                            </button>
                        </div>

                        {/* Main Form Layout - Exactly as in reference image */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Left Section: NEREDEN and NEREYE (side by side) */}
                            <div className="col-span-12 lg:col-span-5">
                                <div className="grid grid-cols-2 gap-4 relative">
                                    {/* NEREDEN */}
                                    <div className="relative h-[100px] w-full group cursor-pointer">
                                        {/* Pin Icon - Positioned Absolutely */}
                                        <div className="absolute left-[15px] top-1/2 -translate-y-1/2 z-10">
                                            <div className="w-10 h-10 bg-[#27ae60] rounded-full flex items-center justify-center shadow-sm">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        {/* Input Field */}
                                        <input
                                            id="aNoktasi"
                                            type="text"
                                            title="NEREDEN"
                                            required
                                            autoComplete="off"
                                            className="peer h-full w-full rounded-[10px] border-2 border-[#F2F2F2] bg-white pt-[35px] pr-[35px] pb-[10px] pl-[65px] text-[14px] font-semibold text-black outline-none transition-all focus:border-orange-500 placeholder-transparent"
                                            placeholder="NEREDEN"
                                        />

                                        {/* Floating Labels */}
                                        <label
                                            htmlFor="aNoktasi"
                                            className="pointer-events-none absolute left-0 top-0 pt-[28px] pl-[65px] text-[13px] font-bold uppercase text-black transition-all peer-placeholder-shown:pt-[33px]"
                                        >
                                            NEREDEN
                                        </label>
                                        <span className="pointer-events-none absolute left-0 top-0 pt-[50px] pl-[65px] text-[11px] font-normal text-[#999999] transition-all">
                                            Adres, Havalimanı, Otel, Hastane...
                                        </span>
                                    </div>

                                    {/* Swap Button */}
                                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                        <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md group">
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* NEREYE */}
                                    <div className="relative h-[100px] w-full group cursor-pointer">
                                        {/* Pin Icon */}
                                        <div className="absolute left-[15px] top-1/2 -translate-y-1/2 z-10">
                                            <div className="w-10 h-10 bg-[#2f80ed] rounded-full flex items-center justify-center shadow-sm">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        {/* Input Field */}
                                        <input
                                            id="bNoktasi"
                                            type="text"
                                            title="NEREYE"
                                            required
                                            autoComplete="off"
                                            className="peer h-full w-full rounded-[10px] border-2 border-[#F2F2F2] bg-white pt-[35px] pr-[35px] pb-[10px] pl-[65px] text-[14px] font-semibold text-black outline-none transition-all focus:border-orange-500 placeholder-transparent"
                                            placeholder="NEREYE"
                                        />

                                        {/* Floating Labels */}
                                        <label
                                            htmlFor="bNoktasi"
                                            className="pointer-events-none absolute left-0 top-0 pt-[28px] pl-[65px] text-[13px] font-bold uppercase text-black transition-all peer-placeholder-shown:pt-[33px]"
                                        >
                                            NEREYE
                                        </label>
                                        <span className="pointer-events-none absolute left-0 top-0 pt-[50px] pl-[65px] text-[11px] font-normal text-[#999999] transition-all">
                                            Adres, Havalimanı, Otel, Hastane...
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Section: TARİH & SAAT */}
                            <div className="col-span-12 lg:col-span-3">
                                <div className="relative h-[100px] w-full group cursor-pointer">
                                    {/* Calendar Icon */}
                                    <div className="absolute left-[15px] top-1/2 -translate-y-1/2 z-10">
                                        <div className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center shadow-sm">
                                            <Calendar className="w-5 h-5 text-gray-600" />
                                        </div>
                                    </div>

                                    {/* Input Field */}
                                    <input
                                        type="text"
                                        required
                                        autoComplete="off"
                                        className="peer h-full w-full rounded-[10px] border-2 border-[#F2F2F2] bg-white pt-[35px] pr-[35px] pb-[10px] pl-[65px] text-[14px] font-semibold text-black outline-none transition-all focus:border-orange-500 placeholder-transparent"
                                        placeholder="Başlangıç Tarihi"
                                    />

                                    {/* Floating Labels */}
                                    <label className="pointer-events-none absolute left-0 top-0 pt-[28px] pl-[65px] text-[13px] font-bold uppercase text-black transition-all peer-placeholder-shown:pt-[33px]">
                                        TARİH & SAAT
                                    </label>
                                    <span className="pointer-events-none absolute left-0 top-0 pt-[50px] pl-[65px] text-[11px] font-normal text-[#999999] transition-all">
                                        Başlangıç Tarihi
                                    </span>
                                </div>
                            </div>

                            {/* Right Section: GİDİŞ-DÖNÜŞ, KİŞİ SAYISI, and Ara Button */}
                            <div className="col-span-12 lg:col-span-4">
                                <div className="grid grid-cols-12 gap-3 h-[100px]">
                                    {/* GİDİŞ-DÖNÜŞ Toggle */}
                                    <div className="col-span-4 bg-white border-2 border-[#F2F2F2] rounded-[10px] h-full flex flex-col items-center justify-center p-2 relative group hover:border-gray-300 transition-colors">
                                        <span className="text-[11px] font-bold text-gray-900 mb-2 text-center uppercase">GİDİŞ-DÖNÜŞ</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-orange-500 transition-colors"></div>
                                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                                        </label>
                                    </div>

                                    {/* KİŞİ SAYISI Dropdown */}
                                    <div className="col-span-4 bg-white border-2 border-[#F2F2F2] rounded-[10px] h-full flex flex-col items-center justify-center p-2 relative group hover:border-gray-300 transition-colors">
                                        <span className="text-[11px] font-bold text-gray-900 mb-1 text-center uppercase">KİŞİ SAYISI</span>
                                        <select className="bg-transparent text-[13px] font-semibold text-gray-900 outline-none cursor-pointer text-center w-full appearance-none">
                                            <option>1 Kişi</option>
                                            <option>2 Kişi</option>
                                            <option>3 Kişi</option>
                                            <option>4 Kişi</option>
                                            <option>5+ Kişi</option>
                                        </select>
                                        <div className="text-gray-400 absolute bottom-3 right-3 pointer-events-none">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    {/* Ara Button - Matches height and positioned in grid */}
                                    <div className="col-span-4 h-full">
                                        <button className="w-full h-full bg-[#D0142D] hover:bg-[#b01126] text-white font-bold text-lg rounded-[10px] transition-all duration-200 shadow-md flex flex-col items-center justify-center space-y-1">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span className="text-sm">Ara</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION - Below Fold */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Güvenli Ödeme */}
                        <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Güvenli Ödeme</h3>
                            <p className="text-gray-600 leading-relaxed">
                                256-bit SSL sertifikası ile korunan ödeme sistemi. Kredi kartı bilgileriniz güvende.
                            </p>
                        </div>

                        {/* 7/24 Destek */}
                        <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Clock className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">7/24 Destek</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Günün her saati müşteri hizmetlerimiz sizin için hazır. Anında destek alın.
                            </p>
                        </div>

                        {/* Son Model Araçlar */}
                        <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Car className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Son Model Araçlar</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Mercedes Vito, Sprinter ve VIP araçlarla konforlu yolculuk deneyimi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                                    <Car className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold">ShuttlePort</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                İstanbul'un en güvenilir VIP transfer hizmeti. Konfor ve kalite bir arada.
                            </p>
                        </div>

                        {/* Hizmetler */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Hizmetler</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Havalimanı Transferi</Link></li>
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Şehir İçi Transfer</Link></li>
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Saatlik Kiralama</Link></li>
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Kurumsal Hizmetler</Link></li>
                            </ul>
                        </div>

                        {/* Şirket */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Şirket</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Hakkımızda</Link></li>
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Filo</Link></li>
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Kariyer</Link></li>
                                <li><Link href="#" className="hover:text-orange-500 transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        {/* İletişim */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">İletişim</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start space-x-2">
                                    <span>📧</span>
                                    <span>info@shuttleport.com</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span>📞</span>
                                    <span>+90 555 123 4567</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span>📍</span>
                                    <span>İstanbul, Türkiye</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 ShuttlePort. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Float Button */}
            <a
                href="https://wa.me/905551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
                aria-label="WhatsApp ile iletişime geç"
            >
                <svg
                    className="w-9 h-9 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
            </a>
        </main>
    );
}
