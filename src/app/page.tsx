'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, Shield, Clock, Car, Globe, Menu, X, Instagram, MessageCircle, User, ChevronDown } from 'lucide-react';
import { LocationAutocomplete } from '@/features/maps';
import { ServiceTypeSelector } from '@/features/booking/components/ServiceTypeSelector';
import { InlineDateTimePicker } from '@/features/booking/components/InlineDateTimePicker';
import { InlinePassengerSelector } from '@/features/booking/components/InlinePassengerSelector';

interface Location {
    lat: number;
    lng: number;
    address: string;
    name?: string;
}



export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [serviceType, setServiceType] = useState<'transfer' | 'hourly' | 'tour'>('transfer');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [datePickerType, setDatePickerType] = useState<'departure' | 'return'>('departure');

    // Location states
    const [originLocation, setOriginLocation] = useState<Location | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
    const [activeLocationInput, setActiveLocationInput] = useState<'origin' | 'destination' | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPassengerSelector, setShowPassengerSelector] = useState(false);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);

    // Ref for Tours Slider
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Ref for dropdown portal container (spans NEREDEN + NEREYE)
    const dropdownContainerRef = useRef<HTMLDivElement>(null);

    // Hero carousel headlines
    const heroHeadlines = [
        "İstanbul'un En Konforlu\nVIP Transfer Hizmeti",
        "7/24 Profesyonel\nHavalimanı Transfer Hizmeti",
        "Güvenli ve Lüks\nŞehir İçi Transfer Çözümleri"
    ];

    // Auto-rotate hero carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroHeadlines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Scroll effect for navbar
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            setIsScrolled(window.scrollY > 50);
        });
    }

    // Handlers for Slider Navigation
    const scrollPrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    // Swap locations
    const handleSwapLocations = useCallback(() => {
        const temp = originLocation;
        setOriginLocation(destinationLocation);
        setDestinationLocation(temp);
    }, [originLocation, destinationLocation]);

    // Handle search button click with validation
    const handleSearch = () => {
        // Validate required fields
        if (!originLocation) {
            alert('Lütfen nereden konumunu seçiniz.');
            return;
        }

        if (!destinationLocation) {
            alert('Lütfen nereye konumunu seçiniz.');
            return;
        }

        if (!startDate) {
            alert('Lütfen tarih ve saat seçiniz.');
            return;
        }

        // All required fields are filled, proceed to next step
        // TODO: Navigate to the next page or perform the search
        console.log('Arama yapılıyor...', {
            from: originLocation,
            to: destinationLocation,
            date: startDate,
            passengers: passengerCount,
            isRoundTrip
        });

        // You can navigate to results page or show results here
        alert('Arama başarılı! Sonuçlar yükleniyor...');
    };

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            {/* HEADER - Sticky Navigation */}
            <header className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm h-20 md:h-24">
                <div className="container-custom h-full flex items-center justify-between px-4">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center space-x-3 md:space-x-4">
                        <div className="text-[#D32F2F]">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10">
                                <path d="M20 0C18.5 10 10 18.5 0 20C10 21.5 18.5 30 20 40C21.5 30 30 21.5 40 20C30 18.5 21.5 10 20 0Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="20" cy="20" r="4" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-900 leading-tight">SHUTTLE</span>
                            <span className="text-lg md:text-2xl font-black italic text-gray-900 leading-none tracking-tighter">TRANSFER</span>
                        </div>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden xl:flex items-center space-x-6 text-[13px] font-bold text-gray-800">
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">Turlar</Link>
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">Kurumsal</Link>
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">İşveren Olun</Link>
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">Taşıyıcı Olun</Link>
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">İletişim</Link>
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">S.S.S</Link>
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {/* Social Icons */}
                        <div className="flex items-center space-x-4 border-r border-gray-200 pr-5">
                            <Link href="#" className="text-gray-900 hover:text-[#D32F2F]"><Instagram className="w-5 h-5 stroke-2" /></Link>
                            <Link href="#" className="text-gray-900 hover:text-[#D32F2F]"><Globe className="w-5 h-5 stroke-2" /></Link>
                            <Link href="#" className="text-gray-900 hover:text-green-600"><MessageCircle className="w-5 h-5 stroke-2" /></Link>
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
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Turlar</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Kurumsal</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">İşveren Olun</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Taşıyıcı Olun</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">İletişim</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">S.S.S</Link>

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

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <Link href="#" className="flex justify-center items-center py-3 text-gray-900 font-bold border border-gray-200 rounded-lg">Üye Ol</Link>
                                <Link href="#" className="flex justify-center items-center py-3 bg-black text-white font-bold rounded-lg space-x-2">
                                    <User className="w-4 h-4" />
                                    <span>Giriş</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* HERO SECTION with Background Image */}
            <section className="relative min-h-screen md:h-screen flex items-center justify-center pt-24 md:pt-0">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/hero_transfer_background_1767168320181.png)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container-custom px-4 w-full">
                    {/* Mobile Banner Image (Simulated) */}
                    <div className="md:hidden mb-6 bg-white rounded-lg overflow-hidden shadow-lg mx-auto max-w-sm">

                    </div>

                    {/* Auto-Scrolling Hero Carousel */}
                    <div className="relative h-32 md:h-48 mb-6 overflow-hidden">
                        <div
                            className="absolute inset-0 transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            <div className="flex h-full">
                                {heroHeadlines.map((headline, index) => (
                                    <h1
                                        key={index}
                                        className="min-w-full text-3xl md:text-6xl lg:text-7xl font-bold text-white text-center flex items-center justify-center whitespace-pre-line"
                                    >
                                        {headline}
                                    </h1>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BOOKING WIDGET - Main Reservation Form */}
                    <div className="max-w-7xl mx-auto bg-transparent md:bg-white rounded-2xl md:shadow-2xl md:p-8">
                        {/* Tab Menu - White with shadow on Mobile */}
                        <ServiceTypeSelector activeType={serviceType} onChange={setServiceType} />

                        {/* Main Form Layout - Mobile Optimized Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Left Section: NEREDEN and NEREYE */}
                            <div className="col-span-12 lg:col-span-6 relative">
                                <div ref={dropdownContainerRef} className="flex flex-col md:grid md:grid-cols-2 gap-4 relative">
                                    {/* NEREDEN Card */}
                                    <LocationAutocomplete
                                        type="origin"
                                        label="NEREDEN"
                                        placeholder="Adres, Havalimanı, Otel, Hastane..."
                                        value={originLocation}
                                        onChange={setOriginLocation}
                                        isActive={activeLocationInput === 'origin'}
                                        onActivate={() => setActiveLocationInput('origin')}
                                        onDeactivate={() => setActiveLocationInput(null)}
                                        dropdownPortalRef={dropdownContainerRef}
                                    />

                                    {/* Swap Button - Center Absolute for Mobile & Desktop */}
                                    <div className="absolute left-1/2 md:left-1/2 top-1/2 md:top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                                        <button
                                            onClick={handleSwapLocations}
                                            disabled={!originLocation && !destinationLocation}
                                            className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-xl hover:bg-[#D32F2F] hover:border-[#D32F2F] hover:scale-110 transition-all rotate-90 md:rotate-0 disabled:opacity-40 disabled:cursor-not-allowed group"
                                        >
                                            <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* NEREYE Card */}
                                    <LocationAutocomplete
                                        type="destination"
                                        label="NEREYE"
                                        placeholder="Adres, Havalimanı, Otel, Hastane..."
                                        value={destinationLocation}
                                        onChange={setDestinationLocation}
                                        isActive={activeLocationInput === 'destination'}
                                        onActivate={() => setActiveLocationInput('destination')}
                                        onDeactivate={() => setActiveLocationInput(null)}
                                        dropdownPortalRef={dropdownContainerRef}
                                    />
                                </div>


                            </div>


                            {/* Middle Section: TARİH */}
                            <div className="col-span-12 lg:col-span-2 relative">
                                {!isRoundTrip ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setDatePickerType('departure');
                                                setShowDatePicker(!showDatePicker || datePickerType !== 'departure');
                                            }}
                                            className="w-full bg-white rounded-xl shadow-md p-1 border border-gray-100 relative h-[80px] md:h-[100px] flex items-center hover:border-[#D32F2F] hover:shadow-lg transition-all group text-left"
                                        >
                                            <div className="absolute left-4 z-10">
                                                <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center group-hover:bg-[#D32F2F] transition-colors">
                                                    <Calendar className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                            <div className="w-full h-full pl-[70px] pr-4 flex flex-col justify-center">
                                                <label className="text-[10px] font-bold text-gray-800 uppercase">TARİH & SAAT</label>
                                                <span className={`text-sm font-bold ${startDate ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {startDate
                                                        ? `${startDate.getDate().toString().padStart(2, '0')} ${['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'][startDate.getMonth()]}, ${['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT'][startDate.getDay()]}`
                                                        : 'Tarih Seçiniz'}
                                                </span>
                                                {startDate && (
                                                    <span className="text-[10px] text-[#D32F2F] font-bold">
                                                        {startDate.getHours().toString().padStart(2, '0')}:{startDate.getMinutes().toString().padStart(2, '0')}
                                                    </span>
                                                )}
                                            </div>
                                        </button>

                                        <InlineDateTimePicker
                                            isOpen={showDatePicker && datePickerType === 'departure'}
                                            onClose={() => setShowDatePicker(false)}
                                            onSelectDateTime={(date) => {
                                                setStartDate(date);
                                                setShowDatePicker(false);
                                            }}
                                            initialDate={startDate || undefined}
                                            position="left"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 h-[80px] md:h-[100px]">
                                        {/* Gidiş */}
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    setDatePickerType('departure');
                                                    setShowDatePicker(!showDatePicker || datePickerType !== 'departure');
                                                }}
                                                className="w-full bg-white rounded-xl shadow-md border border-gray-100 p-2 hover:border-[#D32F2F] hover:shadow-lg transition-all group text-left flex flex-col justify-center h-full"
                                            >
                                                <label className="text-[9px] font-bold text-gray-800 uppercase mb-1">GİDİŞ</label>
                                                <span className={`text-xs font-bold ${startDate ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {startDate
                                                        ? `${startDate.getDate().toString().padStart(2, '0')} ${['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'][startDate.getMonth()]}`
                                                        : 'Seçiniz'}
                                                </span>
                                                {startDate && (
                                                    <span className="text-[9px] text-gray-400">
                                                        {startDate.getHours().toString().padStart(2, '0')}:{startDate.getMinutes().toString().padStart(2, '0')}
                                                    </span>
                                                )}
                                            </button>

                                            <InlineDateTimePicker
                                                isOpen={showDatePicker && datePickerType === 'departure'}
                                                onClose={() => setShowDatePicker(false)}
                                                onSelectDateTime={(date) => {
                                                    setStartDate(date);
                                                    setShowDatePicker(false);
                                                }}
                                                initialDate={startDate || undefined}
                                                position="left"
                                            />
                                        </div>

                                        {/* Dönüş */}
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    setDatePickerType('return');
                                                    setShowDatePicker(!showDatePicker || datePickerType !== 'return');
                                                }}
                                                className="w-full bg-white rounded-xl shadow-md border border-gray-100 p-2 hover:border-[#D32F2F] hover:shadow-lg transition-all group text-left flex flex-col justify-center h-full"
                                            >
                                                <label className="text-[9px] font-bold text-gray-800 uppercase mb-1">DÖNÜŞ</label>
                                                <span className={`text-xs font-bold ${returnDate ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {returnDate
                                                        ? `${returnDate.getDate().toString().padStart(2, '0')} ${['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'][returnDate.getMonth()]}`
                                                        : 'Seçiniz'}
                                                </span>
                                                {returnDate && (
                                                    <span className="text-[9px] text-gray-400">
                                                        {returnDate.getHours().toString().padStart(2, '0')}:{returnDate.getMinutes().toString().padStart(2, '0')}
                                                    </span>
                                                )}
                                            </button>

                                            <InlineDateTimePicker
                                                isOpen={showDatePicker && datePickerType === 'return'}
                                                onClose={() => setShowDatePicker(false)}
                                                onSelectDateTime={(date) => {
                                                    setReturnDate(date);
                                                    setShowDatePicker(false);
                                                }}
                                                initialDate={returnDate || undefined}
                                                position="right"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Section: Controls (3 Column Grid on Mobile) */}
                            <div className="col-span-12 lg:col-span-4">
                                <div className="grid grid-cols-3 md:grid-cols-12 gap-3 md:h-[100px]">
                                    {/* Toggle */}
                                    <button
                                        onClick={() => setIsRoundTrip(!isRoundTrip)}
                                        className="col-span-1 md:col-span-4 bg-white rounded-xl shadow-md border border-gray-100 h-[80px] md:h-full flex flex-col items-center justify-center p-2 hover:border-orange-500 transition-colors"
                                    >
                                        <span className="text-[9px] font-bold text-gray-800 mb-1">GİDİŞ-DÖNÜŞ</span>
                                        <div className="relative inline-flex items-center cursor-pointer scale-75">
                                            <input
                                                type="checkbox"
                                                checked={isRoundTrip}
                                                onChange={() => setIsRoundTrip(!isRoundTrip)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                        </div>
                                    </button>

                                    {/* Kişi Counter */}
                                    <div className="col-span-1 md:col-span-4 relative bg-white rounded-xl shadow-md border border-gray-100 h-[80px] md:h-full">
                                        <button
                                            onClick={() => setShowPassengerSelector(!showPassengerSelector)}
                                            className="w-full h-full flex flex-col items-center justify-center p-2 hover:border-blue-500 transition-colors rounded-xl"
                                        >
                                            <span className="text-[9px] font-bold text-gray-800 mb-1">KİŞİ SAYISI</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {passengerCount} Kişi
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showPassengerSelector ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>

                                        <InlinePassengerSelector
                                            isOpen={showPassengerSelector}
                                            onClose={() => setShowPassengerSelector(false)}
                                            value={passengerCount}
                                            onChange={setPassengerCount}
                                        />
                                    </div>

                                    {/* Ara Button */}
                                    <div className="col-span-1 md:col-span-4 h-[80px] md:h-full">
                                        <button
                                            onClick={handleSearch}
                                            className="w-full h-full bg-[#D0142D] hover:bg-[#b01126] text-white rounded-xl shadow-md flex flex-col items-center justify-center p-2"
                                        >
                                            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <span className="text-xs font-bold">Ara</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TOURS SECTION */}
            <section className="py-10 md:py-20 bg-gray-50">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">
                        {/* Left Content */}
                        <div className="col-span-12 lg:col-span-4 space-y-6 md:space-y-8">
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Harika bir tur gezisine<br />ne dersiniz?
                            </h2>
                            <p className="text-gray-500 text-lg">
                                Eşsiz rotalar ve kişiye özel maceralarla dolu turlarımızla unutulmaz anılar yaratmaya hazır olun!
                            </p>

                            <button className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                                Daha Fazla Tur
                            </button>

                            {/* Navigation Buttons */}
                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={scrollPrev}
                                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:border-orange-500 hover:text-orange-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Slider */}
                        <div className="col-span-12 lg:col-span-8 lg:-mr-[50vw] lg:pr-[10vw]">
                            <div
                                ref={scrollContainerRef}
                                className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                            >
                                {/* Tour Card 1 */}
                                <div className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex-shrink-0 flex flex-col h-full border border-gray-100">
                                    <div className="h-[200px] overflow-hidden rounded-t-2xl relative">
                                        <img src="https://images.unsplash.com/photo-1516281717304-184375a5765c?q=80&w=800" alt="New Year" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                            Özel Fırsat
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                                        <h3 className="text-gray-900 font-semibold leading-snug min-h-[48px]">
                                            Havai Fişekler Eşliğinde Boğaz'da Yılbaşı Kutlaması - Sınırsız Alkollü İçecek
                                        </h3>
                                        <div className="w-10 h-1 bg-gray-200">
                                            <div className="w-5 h-full bg-red-500"></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 mt-auto">
                                            <span className="text-2xl font-bold text-gray-900">10.108₺</span>
                                            <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Card 2 */}
                                <div className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex-shrink-0 flex flex-col h-full border border-gray-100">
                                    <div className="h-[200px] overflow-hidden rounded-t-2xl relative">
                                        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800" alt="Meyhane" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                                        <h3 className="text-gray-900 font-semibold leading-snug min-h-[48px]">
                                            Geleneksel Türk Meyhanesinde Yılbaşı Paketi - Araç Tahsisi Dahil
                                        </h3>
                                        <div className="w-10 h-1 bg-gray-200">
                                            <div className="w-5 h-full bg-red-500"></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 mt-auto">
                                            <span className="text-2xl font-bold text-gray-900">20.216₺</span>
                                            <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Card 3 */}
                                <div className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex-shrink-0 flex flex-col h-full border border-gray-100">
                                    <div className="h-[200px] overflow-hidden rounded-t-2xl relative">
                                        <img src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800" alt="Istanbul" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                                        <h3 className="text-gray-900 font-semibold leading-snug min-h-[48px]">
                                            8 Saatlik Şoförlü İstanbul Turu - Her Şey Dahil Fiyat
                                        </h3>
                                        <div className="w-10 h-1 bg-gray-200">
                                            <div className="w-5 h-full bg-red-500"></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 mt-auto">
                                            <span className="text-2xl font-bold text-gray-900">7.581₺</span>
                                            <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Card 4 */}
                                <div className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex-shrink-0 flex flex-col h-full border border-gray-100">
                                    <div className="h-[200px] overflow-hidden rounded-t-2xl relative">
                                        <img src="https://images.unsplash.com/photo-1516281717304-184375a5765c?q=80&w=800" alt="Special Offer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                            Özel Fırsat
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                                        <h3 className="text-gray-900 font-semibold leading-snug min-h-[48px]">
                                            Sapanca Gölü ve Doğa Yürüyüşü Turu
                                        </h3>
                                        <div className="w-10 h-1 bg-gray-200">
                                            <div className="w-5 h-full bg-red-500"></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 mt-auto">
                                            <span className="text-2xl font-bold text-gray-900">5.500₺</span>
                                            <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Card 5 */}
                                <div className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex-shrink-0 flex flex-col h-full border border-gray-100">
                                    <div className="h-[200px] overflow-hidden rounded-t-2xl relative">
                                        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800" alt="Ski Tour" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                                        <h3 className="text-gray-900 font-semibold leading-snug min-h-[48px]">
                                            Bursa Uludağ Kayak Turu - Günübirlik
                                        </h3>
                                        <div className="w-10 h-1 bg-gray-200">
                                            <div className="w-5 h-full bg-red-500"></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 mt-auto">
                                            <span className="text-2xl font-bold text-gray-900">9.000₺</span>
                                            <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Card 6 */}
                                <div className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex-shrink-0 flex flex-col h-full border border-gray-100">
                                    <div className="h-[200px] overflow-hidden rounded-t-2xl relative">
                                        <img src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800" alt="Balloons" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 space-y-4 flex flex-col flex-grow">
                                        <h3 className="text-gray-900 font-semibold leading-snug min-h-[48px]">
                                            Kapadokya Balon Turu - 2 Gece 3 Gün
                                        </h3>
                                        <div className="w-10 h-1 bg-gray-200">
                                            <div className="w-5 h-full bg-red-500"></div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 mt-auto">
                                            <span className="text-2xl font-bold text-gray-900">15.000₺</span>
                                            <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPULAR LOCATIONS SECTION */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-custom">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Popüler Lokasyonlar</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            İstanbul havalimanı transfer ve taksi hizmetlerinde misafirlerimizin en çok tercih ettiği lokasyonların sizler için listeledik. İstanbul havalimanı, sabiha gökçen havalimanı, istanbul otelleri veya alışveriş merkezlerine seyahat edebileceğiniz bir göz atın.
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button className="flex items-center space-x-2 px-6 py-3 bg-[#D32F2F] text-white rounded-lg font-bold hover:bg-[#B71C1C] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span>Havaalanı</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            <span>Otel</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <span>Hastane</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">
                            <MapPin className="w-5 h-5" />
                            <span>Lokasyon</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span>Avm</span>
                        </button>
                    </div>

                    {/* Transfer Routes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Route 1 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">İstanbul Havalimanı</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">Sabiha Gökçen Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">34 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        {/* Route 2 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">Ortaköy</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">İstanbul Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">32 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        {/* Route 3 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">Alanya</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">Antalya Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">75 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        {/* Route 4 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">Ortaköy</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">Sabiha Gökçen Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">34 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        {/* Route 5 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">Side</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">Antalya Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">55 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        {/* Route 6 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">Karaköy</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">İstanbul Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">32 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        {/* Route 7 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">Kemer</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">Antalya Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">55 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        {/* Route 8 */}
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-gray-900 font-semibold">Karaköy</span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-gray-900 font-semibold">Sabiha Gökçen Havalimanı Transfer</span>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-gray-900">34 €</div>
                                    <div className="text-xs text-gray-500">den başlayan</div>
                                </div>
                                <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION - Below Fold */}
            <section className="py-10 md:py-20 bg-gray-50">
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

            {/* TESTIMONIALS / CUSTOMER MOMENTS SECTION */}
            <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Left Side - Text Content */}
                        <div className="lg:max-w-md lg:flex-shrink-0">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                                Özel anlar, güzel birliktelikler.
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                İstanbul Shuttle Port ile bir çok VIP ve transfer hizmetlerimizi kullanmakta havalimanlara yardımcı olun itibarları gerek karşılamaya, gerek havaalanı transferi veya diğer hizmetlerimiz transferlerinizi gerçekleştirmekte güvenilir ve ekonomik araç ve özel şöför hizmetleri; jet, limuzin ve güvenlik hizmetlerimizi sizin sunuyoruz.
                            </p>
                        </div>

                        {/* Right Side - Auto-Scrolling Photos Carousel (extends to edge) */}
                        <div className="relative overflow-hidden flex-1 w-full lg:-mr-[max(1rem,calc((100vw-1280px)/2+1rem))]">
                            {/* Photos Carousel - Auto-scrolling with infinite loop */}
                            <div
                                ref={(el) => {
                                    if (el && !el.dataset.initialized) {
                                        el.dataset.initialized = 'true';
                                        let scrollPosition = 0;
                                        const scrollSpeed = 1;
                                        const cardWidth = 272; // 256px + 16px gap

                                        const autoScroll = () => {
                                            scrollPosition += scrollSpeed;
                                            el.scrollLeft = scrollPosition;

                                            // Reset to beginning when reaching halfway (original photos end)
                                            if (scrollPosition >= el.scrollWidth / 2) {
                                                scrollPosition = 0;
                                                el.scrollLeft = 0;
                                            }
                                        };

                                        const interval = setInterval(autoScroll, 30);
                                        el.dataset.intervalId = interval.toString();
                                    }
                                }}
                                className="flex space-x-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                            >
                                {/* Original Photos */}
                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800"
                                        alt="Customer moment 1"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=800"
                                        alt="Customer moment 2"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"
                                        alt="Customer moment 3"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800"
                                        alt="Customer moment 4"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800"
                                        alt="Customer moment 5"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800"
                                        alt="Customer moment 6"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800"
                                        alt="Customer moment 7"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800"
                                        alt="Customer moment 8"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Duplicated Photos for Infinite Loop */}
                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800"
                                        alt="Customer moment 1"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=800"
                                        alt="Customer moment 2"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"
                                        alt="Customer moment 3"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800"
                                        alt="Customer moment 4"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800"
                                        alt="Customer moment 5"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800"
                                        alt="Customer moment 6"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800"
                                        alt="Customer moment 7"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800"
                                        alt="Customer moment 8"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
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



        </main >
    );
}
