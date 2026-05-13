'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Calendar, Users, MapPin, CreditCard, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function TourConfirmationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    
    const [bookingData, setBookingData] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('tourConfirmationData');
        if (stored) {
            setBookingData(JSON.parse(stored));
        } else {
            router.push('/turlar');
        }
    }, [router]);

    if (!bookingData) return null;

    const currencySymbols: Record<string, string> = {
        try: '₺',
        eur: '€',
        usd: '$',
        gbp: '£',
        TRY: '₺',
        EUR: '€',
        USD: '$',
        GBP: '£'
    };

    const symbol = currencySymbols[bookingData.currency] || '₺';

    return (
        <main className="min-h-screen bg-gray-50 pt-20">
            <Header />

            {/* STEPPER */}
            <div className="bg-white py-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-900 hidden sm:block">Tur Seçimi</span>
                        </div>
                        <div className="w-12 sm:w-24 h-[2px] bg-green-500 opacity-60"></div>
                        
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-900 hidden sm:block">Katılımcı Bilgileri & Ödeme</span>
                        </div>
                        <div className="w-12 sm:w-24 h-[2px] bg-green-500 opacity-60"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-green-500 text-green-600 bg-green-50 flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-green-50">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-green-600 hidden sm:block">Onay</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
                
                {/* SUCCESS MESSAGE */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Rezervasyonunuz Alındı!</h1>
                    <p className="text-gray-500 text-lg">
                        Teşekkür ederiz <span className="font-bold text-gray-900">{bookingData.customer_name}</span>. Tur rezervasyonunuz başarıyla oluşturuldu.
                    </p>
                    <div className="inline-block bg-white px-6 py-3 rounded-xl border border-gray-200 mt-6 shadow-sm">
                        <span className="text-gray-500 text-sm">Rezervasyon Kodu: </span>
                        <span className="font-bold text-gray-900 text-lg tracking-widest ml-2">#{bookingData.id || bookingId || 'PENDING'}</span>
                    </div>
                </div>

                {/* DETAILS CARD */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                    <div className="h-48 relative">
                        <img src={bookingData.image_url} alt="Tour" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                            <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold uppercase tracking-wider mb-2 w-max">VIP Tur</div>
                            <h3 className="text-white font-extrabold text-2xl leading-tight">{bookingData.tourName}</h3>
                        </div>
                    </div>

                    <div className="p-8">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Özet Bilgiler</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tarih</div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#e63946]" />
                                    {bookingData.date}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Katılımcı</div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#e63946]" />
                                    {bookingData.passengers} Kişi
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Telefon</div>
                                <div className="font-medium text-gray-900">{bookingData.customer_phone}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">E-posta</div>
                                <div className="font-medium text-gray-900">{bookingData.customer_email}</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">Ödeme Yöntemi</span>
                                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm text-sm">
                                    {bookingData.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                                <span className="text-gray-600 font-bold">Toplam Tutar</span>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-green-600 mr-1">{symbol}</span>
                                    <span className="text-3xl font-black text-green-600 tracking-tight">
                                        {bookingData.payment_method === 'credit_card' 
                                            ? Math.round(bookingData.total_price * 1.04).toLocaleString('tr-TR')
                                            : bookingData.total_price.toLocaleString('tr-TR')
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => router.push('/turlar')}
                        className="flex-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        Başka Bir Tur İncele
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="flex-1 bg-[#0a192f] hover:bg-[#B58A32] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                    >
                        <Download className="w-5 h-5" />
                        Rezervasyon Çıktısı Al
                    </button>
                </div>
            </div>
        </main>
    );
}
