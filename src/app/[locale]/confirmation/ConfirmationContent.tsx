'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Users, Clock, Instagram, Globe, MessageCircle, User, ChevronDown, Menu, X, Check, Printer, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';


interface ReservationData {
    id?: string | number;
    customer_name?: string;
    passengerName?: string;
    customer_email?: string;
    email?: string;
    customer_phone?: string;
    phone?: string;
    paymentMethod?: string;
    basePrice?: number;
    total?: number;
    total_price?: number;
    currency?: string;
    from?: string;
    to?: string;
    origin?: string;
    destination?: string;
    date?: string;
    distance?: string;
    duration?: string;
    passengers?: number;
    vehicle_type?: string;
    vehicle?: string;
    tripType?: string;
    flightNumber?: string;
    flight_number?: string;
    notes?: string;
    additionalServices?: Array<{name: string, price: number}>;
}

export default function ConfirmationContent() {
    const searchParams = useSearchParams();
    const reservationId = searchParams.get('id') || '1452134';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [reservation, setReservation] = useState<ReservationData | null>(null);

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
        const message = `Rezervasyon No: ${reservation.id}\nİsim: ${reservation.passengerName || reservation.customer_name}\nTarih: ${reservation.date}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HEADER */}
            <Header />

            {/* Progress Stepper */}
            <div className="bg-white border-b">
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
                                <div className="text-sm font-semibold text-gray-900">{reservation.passengerName || reservation.customer_name}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">E-POSTA ADRESİNİZ</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.email || reservation.customer_email}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">TELEFON NUMARASI</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.phone || reservation.customer_phone}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">UÇUŞ NUMARASI</div>
                                <div className="text-sm font-semibold text-gray-900">{reservation.flightNumber || reservation.flight_number || '-'}</div>
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
                                    <div className="text-sm font-medium text-gray-900">{reservation.from || reservation.origin}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">NEREYE</div>
                                    <div className="text-sm font-medium text-gray-900">{reservation.to || reservation.destination}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">TRANSFER TARİHİ VE SAATİ</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.date}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">ARAÇ</div>
                                    <div className="text-sm font-semibold text-gray-900">{reservation.vehicle || reservation.vehicle_type}</div>
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
                                <span className="font-semibold text-gray-900">{reservation.basePrice || reservation.total_price} {reservation.currency || '₺'}</span>
                            </div>

                            <div className="space-y-2">
                                {reservation.additionalServices && reservation.additionalServices.length > 0 && (
                                    <>
                                        <div className="text-xs text-gray-500 uppercase font-medium">EK HİZMETLER</div>
                                        {(reservation.additionalServices || []).map((service, index: number) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span className="text-gray-600">{service.name}</span>
                                                    <span className="font-semibold text-gray-900">{service.price} {reservation.currency || '₺'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className="pt-4 border-t-2 border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-bold text-gray-900">TUTAR</span>
                                    <span className="text-2xl font-bold text-gray-900">{reservation.total || reservation.total_price} {reservation.currency || '₺'}</span>
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
