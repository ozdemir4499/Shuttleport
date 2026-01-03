'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Users, Clock, Instagram, Globe, MessageCircle, User, ChevronDown, Menu, X, Check, Printer, Phone } from 'lucide-react';


export default function ConfirmationContent() {
    const searchParams = useSearchParams();
    const reservationId = searchParams.get('id') || '1452134';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [reservation, setReservation] = useState<any>(null);

    useEffect(() => {
        // Read reservation data from localStorage
        const savedData = localStorage.getItem('reservationData');
        if (savedData) {
            setReservation(JSON.parse(savedData));
        } else {
            // Fallback to mock data
            setReservation({
                id: reservationId,
                passengerName: 'efe karahanlı',
                email: 'kumorales@gmail.com',
                phone: '+905342513283',
                flightNumber: 'PC 352',
                from: 'Sabiha Gökçen Havalimanı (SAW), Sanayi, Pendik, İstanbul, Türkiye',
                to: 'Fatih, İstanbul, Türkiye',
                date: '01/01/2026 - 13:15',
                vehicle: 'Mercedes Vito & VW Özel',
                distance: '44 KM',
                duration: '47 Dk',
                passengers: 1,
                tripType: 'HAYIR',
                basePrice: 3086,
                additionalServices: [
                    { name: 'Sabiha Gökçen Vip Otopark Ücreti', price: 60 },
                    { name: '15 Temmuz veya F.S.M. Köprü Geçiş Ücreti', price: 60 }
                ],
                total: 3206,
                paymentMethod: 'Seyahat Günü, Araçta Nakit Ödeme'
            });
        }
    }, [reservationId]);

    if (!reservation) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Yükleniyor...</div>
        </div>;
    }

    const handlePrint = () => {
        window.print();
    };

    const handleWhatsApp = () => {
        const message = `Rezervasyon No: ${reservation.id}\nİsim: ${reservation.passengerName}\nTarih: ${reservation.date}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HEADER - Same as homepage */}
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
                        <Link href="/turlar" className="hover:text-[#D32F2F] transition-colors">Turlar</Link>
                        <Link href="/hakkimizda" className="hover:text-[#D32F2F] transition-colors">Hakkımızda</Link>
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">İşveren Olun</Link>
                        <Link href="#" className="hover:text-[#D32F2F] transition-colors">Taşıyıcı Olun</Link>
                        <Link href="/iletisim" className="hover:text-[#D32F2F] transition-colors">İletişim</Link>
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
                            <Link href="/turlar" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Turlar</Link>
                            <Link href="/hakkimizda" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Hakkımızda</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">İşveren Olun</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Taşıyıcı Olun</Link>
                            <Link href="/iletisim" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">İletişim</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">S.S.S</Link>

                            <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
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
                        {/* Step 1 - Completed */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
                                    Araç & Hizmetler
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-16 sm:w-24 h-0.5 bg-green-500 mx-2" />

                        {/* Step 2 - Completed */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
                                    Yolcu & Ödeme
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-16 sm:w-24 h-0.5 bg-green-500 mx-2" />

                        {/* Step 3 - Active */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                                    3
                                </div>
                                <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
                                    Rezervasyon
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Reservation ID & Success Message */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reservation Number */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xs text-blue-600 font-medium">Rezervasyon No:</div>
                                <div className="text-lg font-bold text-blue-900">{reservation.id}</div>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                                <Check className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-green-900">Tebrikler! Rezervasyonunuz Başarılı Alındı.</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                        >
                            <Printer className="w-5 h-5" />
                            Yazdır
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp
                        </button>
                    </div>

                    {/* Passenger Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="w-5 h-5 text-red-600" />
                            <h2 className="text-lg font-bold text-gray-900">Rezervasyon Sahibi Yolcu Detayları</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">AD SOYAD</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.passengerName}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">E-POSTA ADRESİNİZ</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.email}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">TELEFON NUMARASI</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.phone}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">UÇUŞ NUMARASI</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.flightNumber}</div>
                            </div>
                        </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h2 className="text-lg font-bold text-gray-900">Rezervasyon</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">NEREDEN</div>
                                    <div className="text-sm font-medium text-gray-900">{reservation.from}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">NEREYE</div>
                                    <div className="text-sm font-medium text-gray-900">{reservation.to}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">TRANSFER TARİHİ VE SAATİ</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.date}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">ARAÇ</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.vehicle}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">MESAFE</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.distance}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">SÜRE</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.duration}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">GİDİŞ - DÖNÜŞ</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.tripType}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">KİŞİ SAYISI</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.passengers}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <h2 className="text-lg font-bold text-gray-900">Ödeme Detayları</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">YOLCULUK ÜCRETİ</span>
                                <span className="font-semibold text-gray-900">{reservation.basePrice}₺</span>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs text-gray-500 uppercase font-medium">EK HİZMETLER</div>
                                {reservation.additionalServices.map((service: any, index: number) => (
                                    <div key={index} className="flex items-start gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="text-gray-600">{service.name}</span>
                                            <span className="font-semibold text-gray-900">{service.price}₺</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t-2 border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-bold text-gray-900">TUTAR</span>
                                    <span className="text-2xl font-bold text-gray-900">{reservation.total}₺</span>
                                </div>
                                <button className="w-full bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-md hover:shadow-lg">
                                    Ödeme Yap
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="text-xs text-gray-500 uppercase mb-1">ÖDEME</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.paymentMethod}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
