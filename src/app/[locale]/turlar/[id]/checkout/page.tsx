'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, Check, Calendar, Users, MapPin, CreditCard, Banknote } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function TourCheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const tourId = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: ''
    });

    const [pendingBooking, setPendingBooking] = useState<any>(null);
    const [passengerNames, setPassengerNames] = useState<Array<{fullName: string}>>([]);

    useEffect(() => {
        const stored = localStorage.getItem('pendingTourBooking');
        if (stored) {
            const parsed = JSON.parse(stored);
            setPendingBooking(parsed);
            
            if (parsed.passengers > 1) {
                setPassengerNames(Array.from({ length: parsed.passengers - 1 }, () => ({ fullName: '' })));
            }
        } else {
            router.push(`/turlar/${tourId}`);
        }
    }, [router, tourId]);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePassengerChange = (index: number, value: string) => {
        const newPassengers = [...passengerNames];
        newPassengers[index] = { ...newPassengers[index], fullName: value };
        setPassengerNames(newPassengers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const extraPassengers = passengerNames
                .filter(p => p.fullName)
                .map((p, i) => `${i + 2}. Yolcu: ${p.fullName}`)
                .join('\n');
            
            const finalNotes = extraPassengers 
                ? `${formData.notes ? formData.notes + '\n\n' : ''}Ekstra Yolcular:\n${extraPassengers}`
                : formData.notes || null;

            const bookingPayload = {
                customer_name: `${formData.firstName} ${formData.lastName}`,
                customer_email: formData.email,
                customer_phone: formData.phone,
                origin: 'Tur Rezervasyonu',
                destination: pendingBooking.tourName,
                transfer_datetime: pendingBooking.rawDate,
                flight_number: null,
                passengers: pendingBooking.passengers,
                vehicle_type: 'VIP Tur Aracı',
                total_price: pendingBooking.totalPrice,
                currency: pendingBooking.currency.toUpperCase(),
                payment_method: paymentMethod === 'credit-card' ? 'credit_card' : 'cash_in_car',
                notes: finalNotes
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            if (res.ok) {
                const data = await res.json();
                
                // Kaydet confirmation'da göstermek için
                const confData = {
                    ...bookingPayload,
                    id: data.id,
                    tourName: pendingBooking.tourName,
                    date: pendingBooking.date,
                    image_url: pendingBooking.image_url,
                    paymentMethod: paymentMethod === 'credit-card' ? 'Kredi Kartı ile Ödeme' : 'Tur Günü Nakit'
                };
                localStorage.setItem('tourConfirmationData', JSON.stringify(confData));
                localStorage.removeItem('pendingTourBooking');
                
                if (data.payment_url && !data.payment_url.includes('mock')) {
                    window.location.href = data.payment_url;
                } else {
                    router.push(`/turlar/${tourId}/confirmation?bookingId=${data.id}`);
                }
            } else {
                setErrorMsg('Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setErrorMsg('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!pendingBooking) return null;

    const symbol = currencySymbols[pendingBooking.currency] || '₺';

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
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-800 text-gray-900 bg-gray-50 flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-gray-100">2</div>
                            <span className="text-sm font-bold text-gray-900 hidden sm:block">Katılımcı Bilgileri & Ödeme</span>
                        </div>
                        <div className="w-12 sm:w-24 h-[1px] bg-gray-200"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-100 text-gray-300 bg-white flex items-center justify-center font-medium text-sm">3</div>
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">Onay</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* LEFT - FORM */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Yolcu Bilgileri */}
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-red-50 text-[#e63946] flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">1. Yolcu Bilgileri <span className="text-sm font-normal text-gray-500">(Rezervasyon Sahibi)</span></h2>
                            </div>

                            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Adınız <span className="text-[#e63946]">*</span></label>
                                        <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400" placeholder="Örn: Ahmet" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Soyadınız <span className="text-[#e63946]">*</span></label>
                                        <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400" placeholder="Örn: Yılmaz" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Telefon Numarası <span className="text-[#e63946]">*</span></label>
                                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400" placeholder="+90 555 123 4567" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresi <span className="text-[#e63946]">*</span></label>
                                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400" placeholder="mail@ornek.com" />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ekstra Notlarınız / İstekleriniz</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400 resize-none" placeholder="Belirtmek istediğiniz özel bir durum var mı?"></textarea>
                                </div>
                            </form>
                        </div>

                        {/* Ekstra Yolcular */}
                        {passengerNames.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Diğer Katılımcılar</h2>
                                </div>
                                <div className="space-y-4">
                                    {passengerNames.map((passenger, index) => (
                                        <div key={index}>
                                            <input
                                                type="text"
                                                value={passenger.fullName}
                                                onChange={(e) => handlePassengerChange(index, e.target.value)}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                                                placeholder={`${index + 2}. Katılımcı Adı Soyadı`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ödeme Yöntemi */}
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Ödeme Yöntemi</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Credit Card */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('credit-card')}
                                    className={`p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                                        paymentMethod === 'credit-card'
                                        ? 'border-[#0a192f] bg-slate-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                            paymentMethod === 'credit-card' ? 'border-[#0a192f]' : 'border-gray-300'
                                        }`}>
                                            {paymentMethod === 'credit-card' && <div className="w-3 h-3 rounded-full bg-[#0a192f]"></div>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-base mb-1">Kredi Kartı</div>
                                            <p className="text-xs text-gray-500 leading-relaxed">Güvenli altyapımız ile ödemenizi şimdi tamamlayın.</p>
                                        </div>
                                    </div>
                                    <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-100 opacity-50" />
                                </button>

                                {/* Cash */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                                        paymentMethod === 'cash'
                                        ? 'border-[#0a192f] bg-slate-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                            paymentMethod === 'cash' ? 'border-[#0a192f]' : 'border-gray-300'
                                        }`}>
                                            {paymentMethod === 'cash' && <div className="w-3 h-3 rounded-full bg-[#0a192f]"></div>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-base mb-1">Tur Günü Nakit</div>
                                            <p className="text-xs text-gray-500 leading-relaxed">Ödemenizi tura katıldığınız gün aracımızda yapın.</p>
                                        </div>
                                    </div>
                                    <Banknote className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-100 opacity-50" />
                                </button>
                            </div>

                            {errorMsg && (
                                <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 font-medium">
                                    {errorMsg}
                                </div>
                            )}

                        </div>
                        
                    </div>

                    {/* RIGHT - SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden sticky top-28">
                            <div className="h-48 relative">
                                <img src={pendingBooking.image_url} alt="Tour" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                    <h3 className="text-white font-extrabold text-xl leading-tight">{pendingBooking.tourName}</h3>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar className="w-5 h-5 text-[#e63946]" />
                                        <div>
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tarih</div>
                                            <div className="font-bold text-gray-900">{pendingBooking.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Users className="w-5 h-5 text-[#e63946]" />
                                        <div>
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Katılımcı Sayısı</div>
                                            <div className="font-bold text-gray-900">
                                                {pendingBooking.adultCount > 0 && `${pendingBooking.adultCount} Yetişkin`}
                                                {pendingBooking.childCount > 0 && `, ${pendingBooking.childCount} Çocuk`}
                                                {pendingBooking.babyCount > 0 && `, ${pendingBooking.babyCount} Bebek`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">Tur Ücreti</span>
                                        <span className="font-bold text-gray-900">{symbol}{pendingBooking.totalPrice.toLocaleString('tr-TR')}</span>
                                    </div>
                                    {paymentMethod === 'credit-card' && (
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-gray-500">Kredi Kartı Komisyonu (%4)</span>
                                            <span className="font-bold text-gray-900">{symbol}{Math.round(pendingBooking.totalPrice * 0.04).toLocaleString('tr-TR')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-end mb-6">
                                    <span className="font-bold text-gray-600 text-sm">Toplam Tutar</span>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-[#e63946] mr-1">{symbol}</span>
                                        <span className="text-3xl font-black text-[#e63946] tracking-tight">
                                            {paymentMethod === 'credit-card' 
                                                ? Math.round(pendingBooking.totalPrice * 1.04).toLocaleString('tr-TR')
                                                : pendingBooking.totalPrice.toLocaleString('tr-TR')
                                            }
                                        </span>
                                    </div>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-[#0a192f] hover:bg-[#B58A32] text-white font-bold py-4.5 rounded-xl uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(10,25,47,0.39)] hover:shadow-[0_6px_20px_rgba(181,138,50,0.23)] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                                >
                                    {isSubmitting ? 'İŞLENİYOR...' : 'REZERVASYONU ONAYLA'}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    "Rezervasyonu Onayla" butonuna tıklayarak Hizmet Şartları'nı kabul etmiş olursunuz.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
