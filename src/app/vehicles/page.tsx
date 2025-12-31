'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, Clock, Navigation, Instagram, Globe, MessageCircle, User, ChevronDown, Menu, X } from 'lucide-react';

export default function VehiclesPage() {
    const [selectedCurrency, setSelectedCurrency] = useState('TRY');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mock reservation data (would come from query params or state)
    const reservation = {
        from: 'Sabiha Gökçen Havalimanı (SAW)',
        to: 'Fatih, İstanbul',
        date: '01/01/2026 - 12:45',
        distance: '44 KM',
        duration: '47 dk',
        passengers: 1,
        tripType: 'HAVL'
    };

    // Mock vehicle data
    const vehicles = [
        {
            id: 1,
            name: 'Sedan Private',
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
            capacity: '1-3',
            baggage: '1 - 3',
            features: [
                { icon: '🧊', text: 'Soğuk İçecek' },
                { icon: '✈️', text: 'Havalimanı Karşılama' },
                { icon: '❌', text: 'Ücretsiz İptal' }
            ],
            prices: {
                TRY: 234,
                EUR: 58,
                USD: 88,
                GBP: 50
            }
        },
        {
            id: 2,
            name: 'Mercedes Vito & VW Private',
            image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800',
            capacity: '1-6',
            baggage: '1 - 6',
            features: [
                { icon: '🧊', text: 'Soğuk İçecek' },
                { icon: '✈️', text: 'Havalimanı Karşılama' },
                { icon: '❌', text: 'Ücretsiz İptal' }
            ],
            prices: {
                TRY: 286,
                EUR: 61,
                USD: 72,
                GBP: 53
            }
        },
        {
            id: 3,
            name: 'Mercedes Sprinter Private',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800',
            capacity: '1-14',
            baggage: '1 - 14',
            features: [
                { icon: '🧊', text: 'Soğuk İçecek' },
                { icon: '✈️', text: 'Havalimanı Karşılama' },
                { icon: '❌', text: 'Ücretsiz İptal' }
            ],
            prices: {
                TRY: 450,
                EUR: 95,
                USD: 115,
                GBP: 85
            }
        }
    ];

    const currencySymbols = {
        TRY: '₺',
        EUR: '€',
        USD: '$',
        GBP: '£'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Same as homepage */}
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
                    <div className="lg:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl overflow-hidden">
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
                                    <span className="text-sm font-bold">TR</span>
                                </div>
                            </div>

                            <div className="flex space-x-2 pt-2">
                                <Link href="#" className="flex-1 text-center text-sm font-bold text-gray-900 hover:text-[#D32F2F] border border-gray-300 rounded-lg py-2">Üye Ol</Link>
                                <Link href="#" className="flex-1 text-center text-sm font-bold text-white bg-black rounded-lg py-2">Giriş</Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Progress Stepper */}
            <div className="bg-white border-b pt-24 md:pt-28">
                <div className="container-custom py-6">
                    <div className="flex items-center justify-center max-w-2xl mx-auto">
                        {/* Step 1 - Active */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                                    1
                                </div>
                                <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
                                    Araç & Hizmetler
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-16 sm:w-32 h-0.5 bg-gray-300 mx-2"></div>

                        {/* Step 2 */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                                    2
                                </div>
                                <span className="text-sm font-semibold text-gray-500 hidden sm:inline">
                                    Yolcu & Ödeme
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-16 sm:w-32 h-0.5 bg-gray-300 mx-2"></div>

                        {/* Step 3 */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                                    3
                                </div>
                                <span className="text-sm font-semibold text-gray-500 hidden sm:inline">
                                    Rezervasyon
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Vehicle List */}
                    <div className="lg:col-span-2 space-y-6">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="flex flex-col md:flex-row">
                                    {/* Vehicle Image - Left Side */}
                                    <div className="md:w-60 lg:w-72 flex-shrink-0">
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover min-h-[200px] md:min-h-[260px]"
                                        />
                                    </div>

                                    {/* Vehicle Info - Right Side */}
                                    <div className="flex-1 p-6 flex flex-col">
                                        {/* Header with Title and Capacity */}
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{vehicle.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-red-600 font-semibold flex-shrink-0">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {vehicle.capacity} Kişi
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <rect x="3" y="8" width="18" height="12" rx="2" strokeWidth="2" />
                                                        <path d="M10 8V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" strokeWidth="2" />
                                                    </svg>
                                                    {vehicle.baggage}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-b border-gray-200 mb-4"></div>

                                        {/* Features - Horizontal Icons */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-1.5">
                                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                </div>
                                                <span className="text-[11px] text-gray-600 font-medium leading-tight">Sabit<br />Fiyat</span>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-1.5">
                                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-[11px] text-gray-600 font-medium leading-tight">Uçuş<br />Takibi</span>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-1.5">
                                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-[11px] text-gray-600 font-medium leading-tight">Havalimanı<br />Karşılama</span>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-1.5">
                                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-[11px] text-gray-600 font-medium leading-tight">Ücretsiz<br />İptal</span>
                                            </div>
                                        </div>

                                        {/* Warning Text */}
                                        <p className="text-xs text-gray-500 mb-4">
                                            Lütfen ödeme yapmak istediğiniz para birimi seçiniz
                                        </p>

                                        {/* Pricing and Action */}
                                        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mt-auto gap-4">
                                            {/* Currency Options */}
                                            <div className="flex items-center gap-2">
                                                {/* All currencies with dynamic discount badge */}
                                                {Object.keys(vehicle.prices).map((currency) => (
                                                    <div key={currency} className="relative pb-3">
                                                        <button
                                                            onClick={() => setSelectedCurrency(currency)}
                                                            className={`px-3 py-2.5 rounded-lg border-2 transition-all ${selectedCurrency === currency
                                                                ? 'border-green-500 bg-green-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-1">
                                                                {selectedCurrency === currency && (
                                                                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                                <div className="text-left">
                                                                    <div className="text-base font-bold text-gray-900 whitespace-nowrap">
                                                                        {currencySymbols[currency as keyof typeof currencySymbols]} {vehicle.prices[currency as keyof typeof vehicle.prices]}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-400 line-through whitespace-nowrap">
                                                                        {currencySymbols[currency as keyof typeof currencySymbols]} {Math.round((vehicle.prices[currency as keyof typeof vehicle.prices] as number) * 1.25)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                        {/* Discount badge - only show on selected currency */}
                                                        {selectedCurrency === currency && (
                                                            <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
                                                                %20 indirim
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                <span className="text-xs text-red-600 font-semibold">Toplam araç fiyatıdır.</span>
                                                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-md hover:shadow-lg whitespace-nowrap">
                                                    Rezervasyon Yap
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side - Reservation Summary (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Rezervasyon</h3>
                                <button className="text-sm text-red-600 hover:text-red-700 font-semibold">
                                    Düzenle
                                </button>
                            </div>

                            {/* Route Info */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-gray-700">{reservation.from}</div>
                                </div>
                                <div className="flex items-start">
                                    <Navigation className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-gray-700">{reservation.to}</div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Kalkış/Alış Tarihi
                                    </span>
                                    <span className="font-semibold text-gray-900">{reservation.date}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Mesafe
                                    </span>
                                    <span className="font-semibold text-gray-900">{reservation.distance}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Süre
                                    </span>
                                    <span className="font-semibold text-gray-900">{reservation.duration}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        Kişi Sayısı
                                    </span>
                                    <span className="font-semibold text-gray-900">{reservation.passengers}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Gidiş - Dönüş</span>
                                    <span className="font-semibold text-gray-900">{reservation.tripType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
