'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Clock, Instagram, Globe, MessageCircle, User, ChevronDown, Menu, X, Check } from 'lucide-react';
import Header from '@/components/layout/Header';


export default function CheckoutContent() {
    const t = useTranslations('BookingFlow');
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = searchParams.get('vehicleId');
    const currency = searchParams.get('currency') || 'TRY';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [additionalServices, setAdditionalServices] = useState<Record<string, boolean>>({});

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: '',
        departureAirport: '',
        arrivalAirport: '',
        flightNumber: ''
    });

    // Load pending booking from vehicles page
    const [pendingBooking, setPendingBooking] = useState<Record<string, unknown> | null>(null);
    const [passengerNames, setPassengerNames] = useState<Array<{fullName: string}>>([]);

    // Dynamic services from API
    const [services, setServices] = useState<Array<{id: string; name: string; price: number; description: string}>>([]);

    useEffect(() => {
        const stored = localStorage.getItem('pendingBooking');
        if (stored) {
            const parsed = JSON.parse(stored);
            setPendingBooking(parsed);
            
            const count = parseInt(parsed.passengers) || 1;
            if (count > 1) {
                setPassengerNames(Array.from({ length: count - 1 }, () => ({ fullName: '' })));
            }
        }
    }, [router]);

    // Fetch extra services from API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/extra-services/`);
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.map((s: any) => ({
                        id: `service_${s.id}`,
                        name: s.name_tr,
                        price: s.price,
                        description: s.description_tr || ''
                    }));
                    setServices(mapped);
                    // Set default selections
                    const defaults: Record<string, boolean> = {};
                    data.forEach((s: any) => {
                        defaults[`service_${s.id}`] = s.is_default_selected;
                    });
                    setAdditionalServices(defaults);
                }
            } catch {
                // Fallback to hardcoded if API fails
                const fallback = [
                    { id: 'welcomeSign', name: 'Karşılama Tabelası', price: 120, description: '' },
                    { id: 'jetValet', name: 'Jet Valet Karşılama Hizmeti', price: 1000, description: '' },
                    { id: 'childSeat', name: 'Çocuk Koltuğu (0-3 yaş)', price: 800, description: '' },
                    { id: 'flowers', name: 'Çiçek Buketi', price: 3000, description: '' },
                    { id: 'diapers', name: '15 Adet Üst Bebek Bezi', price: 6000, description: '' },
                    { id: 'parkingFee', name: 'Sabiha Gökçen Vip Otopark Ücreti', price: 80, description: '' },
                    { id: 'bridgeFee', name: '15 Temmuz veya F.S.M. Köprü Geçiş Ücreti', price: 80, description: '' },
                    { id: 'tunnel', name: 'Araçta Tünel', price: 335, description: '' }
                ];
                setServices(fallback);
                setAdditionalServices({
                    welcomeSign: false, jetValet: false, childSeat: false, flowers: false,
                    diapers: false, parkingFee: true, bridgeFee: true, tunnel: false
                });
            }
        };
        fetchServices();
    }, []);

    const reservation = {
        from: (pendingBooking?.from as string) || 'Seçilmedi',
        to: (pendingBooking?.to as string) || 'Seçilmedi',
        date: (pendingBooking?.date as string) || '',
        distance: (pendingBooking?.distance as string) || '',
        duration: (pendingBooking?.duration as string) || '',
        passengers: Number(pendingBooking?.passengers) || 1,
        luggage: Number(pendingBooking?.passengers) || 1,
        tripType: (pendingBooking?.tripType as string) || 'Tek Yön',
        rawDate: (pendingBooking?.rawDate as string) || new Date().toISOString()
    };

    const vehicle = {
        name: (pendingBooking?.vehicle_name as string) || 'Araç',
        basePrice: pendingBooking?.basePrice ? Math.round(Number(pendingBooking.basePrice) * Number(pendingBooking.exchangeRate || 1)) : 0,
        currency: (pendingBooking?.currency as string) || 'TRY'
    };

    const currencySymbols = {
        TRY: '₺',
        EUR: '€',
        USD: '$',
        GBP: '£'
    };

    const calculateTotal = () => {
        let total = vehicle.basePrice;
        services.forEach(service => {
            if (additionalServices[service.id]) {
                total += service.price;
            }
        });
        return total;
    };

    const toggleService = (serviceId: string) => {
        setAdditionalServices(prev => ({
            ...prev,
            [serviceId]: !prev[serviceId]
        }));
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
                .join(', ');
            
            const finalNotes = extraPassengers 
                ? `${formData.notes ? formData.notes + '\n\n' : ''}Ekstra Yolcular:\n${extraPassengers}`
                : formData.notes || null;

            const bookingPayload = {
                customer_name: `${formData.firstName} ${formData.lastName}`,
                customer_email: formData.email,
                customer_phone: formData.phone,
                origin: reservation.from,
                destination: reservation.to,
                transfer_datetime: reservation.rawDate,
                flight_number: formData.flightNumber || null,
                passengers: parseInt(String(reservation.passengers)) || 1,
                vehicle_type: vehicle.name,
                total_price: calculateTotal(),
                currency: vehicle.currency,
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
                const reservationData = {
                    ...bookingPayload,
                    id: data.id,
                    paymentMethod: paymentMethod === 'credit-card' ? 'Kredi Kartı ile Ödeme' : 'Seyahat Günü Nakit',
                    date: reservation.date,
                    distance: reservation.distance,
                    duration: reservation.duration
                };
                localStorage.setItem('reservationData', JSON.stringify(reservationData));
                localStorage.removeItem('pendingBooking'); // clear pending
                
                // Eğer backend bir ödeme linki (Stripe/Iyzico) döndürdüyse, oraya yönlendir
                if (data.payment_url && !data.payment_url.includes('mock')) {
                    window.location.href = data.payment_url;
                } else {
                    router.push(`/confirmation?id=${data.id}`);
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

    return (
        <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
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
                                    {t('step1')}
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-16 sm:w-24 h-0.5 bg-green-500 mx-2" />

                        {/* Step 2 - Active */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                                    2
                                </div>
                                <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
                                    {t('step2')}
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-16 sm:w-24 h-0.5 bg-gray-300 mx-2" />

                        {/* Step 3 - Pending */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                                    3
                                </div>
                                <span className="text-sm font-semibold text-gray-500 hidden sm:inline">
                                    {t('step3')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Passenger Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-bold text-gray-900">1. Yolcu Bilgileri (Rezervasyon Sahibi)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adınız <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Adınız"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Soyadınız <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Soyadınız"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefon Numarası <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Telefon Numarası"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-posta Adresiniz <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="E-posta Adresiniz"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ayrıca belirtmek istediğiniz bir detay var mı?
                                </label>
                                <textarea
                                    rows={4}
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    placeholder="Detaylı adres bilgisi..."
                                />
                            </div>

                            <div className="mt-4 space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500" />
                                    <span className="text-sm text-gray-700">Kurumsal Fatura</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500" />
                                    <span className="text-sm text-gray-700">Kampanya/promosyon kodlarından haberdar et</span>
                                </label>
                            </div>
                        </div>

                        {/* Extra Passengers (if any) */}
                        {passengerNames.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <User className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-lg font-bold text-gray-900">Diğer Yolcu Bilgileri</h2>
                                </div>
                                <div className="space-y-4">
                                    {passengerNames.map((passenger, index) => (
                                        <div key={index}>
                                            <input
                                                type="text"
                                                value={passenger.fullName}
                                                onChange={(e) => handlePassengerChange(index, e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase placeholder:normal-case"
                                                placeholder={`${index + 2}. YOLCU BİLGİSİ AD SOYAD`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Flight Details */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Uçuş Detayları</h2>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Rezervasyon tarihi sadece göz önü amaçlıdır. Lütfen uçuş bilgilerinizi girerek rezervasyonunuzu tamamlayınız.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Kalkış Havalimanı Arayın
                                    </label>
                                    <input
                                        type="text"
                                        name="flightNumber"
                                        value={formData.flightNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Uçuş numarası..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Varış Havalimanı
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Havalimanı ara..."
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500" />
                                    <span className="text-sm text-gray-700">Uygunuzu bize bırakır mısınız? <Link href="#" className="text-blue-600 hover:underline">Buradan manuel giriniz</Link></span>
                                </label>
                            </div>
                        </div>

                        {/* Additional Services */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <h2 className="text-lg font-bold text-gray-900">Ek Hizmetler</h2>
                                </div>
                                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {services.map((service) => {
                                    // Service name'e göre ikon eşleştirme
                                    const getServiceIcon = (name: string) => {
                                        const n = name.toLowerCase();
                                        if (n.includes('karşılama') || n.includes('tabela') || n.includes('welcome'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                                </svg>
                                            );
                                        if (n.includes('valet') || n.includes('jet'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                </svg>
                                            );
                                        if (n.includes('çocuk') || n.includes('cocuk') || n.includes('koltuk') || n.includes('child'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                                </svg>
                                            );
                                        if (n.includes('çiçek') || n.includes('cicek') || n.includes('buket') || n.includes('flower'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                </svg>
                                            );
                                        if (n.includes('bebek') || n.includes('bez') || n.includes('diaper'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            );
                                        if (n.includes('otopark') || n.includes('park'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                                </svg>
                                            );
                                        if (n.includes('köprü') || n.includes('kopru') || n.includes('bridge') || n.includes('geçiş') || n.includes('gecis'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                                                </svg>
                                            );
                                        if (n.includes('tünel') || n.includes('tunel') || n.includes('tunnel'))
                                            return (
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                                </svg>
                                            );
                                        // Varsayılan ikon
                                        return (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                            </svg>
                                        );
                                    };

                                    return (
                                    <button
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`p-4 rounded-lg border-2 transition-all text-left ${additionalServices[service.id]
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                    additionalServices[service.id]
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {getServiceIcon(service.name)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-gray-900 mb-1">{service.name}</div>
                                                    <div className="text-lg font-bold text-gray-900">{service.price}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'}</div>
                                                </div>
                                            </div>
                                            {additionalServices[service.id] && (
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Ödeme Bilgileri</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Credit Card Payment */}
                                <button
                                    onClick={() => setPaymentMethod('credit-card')}
                                    className={`w-full p-5 rounded-lg border-2 transition-all text-left ${paymentMethod === 'credit-card'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'credit-card'
                                            ? 'border-green-500 bg-white'
                                            : 'border-gray-300'
                                            }`}>
                                            {paymentMethod === 'credit-card' && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-1">
                                                <div>
                                                    <div className="font-bold text-gray-900 mb-1">Kredi Kartı ile Ödeme</div>
                                                    <div className="text-sm text-gray-500">Tamamını kredi kartı ile güvenli olarak ödeyin.</div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-2xl font-bold text-gray-900">{Math.round(calculateTotal() * 1.04)}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'}</div>
                                                    <div className="text-xs text-red-600 mt-1">
                                                        ({calculateTotal()}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'} + %4 Kart Ücreti {Math.round(calculateTotal() * 0.04)}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'})
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Cash Payment */}
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`w-full p-5 rounded-lg border-2 transition-all text-left ${paymentMethod === 'cash'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cash'
                                            ? 'border-green-500 bg-white'
                                            : 'border-gray-300'
                                            }`}>
                                            {paymentMethod === 'cash' && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-1">
                                                <div>
                                                    <div className="font-bold text-gray-900 mb-1">{t('cashPayment')}</div>
                                                    <div className="text-sm text-gray-500">Ödemenizin tamamını yolculuk günü ödeyin.</div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-2xl font-bold text-gray-900">{calculateTotal()}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {errorMsg && (
                                <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                                    {errorMsg}
                                </div>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full mt-6 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-md hover:shadow-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {isSubmitting ? t('processing') : 'Ödemeyi Tamamla'}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Reservation Summary (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">{t('step3')}</h3>

                            {/* Route Info */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">NEREDEN</div>
                                    <div className="text-sm text-gray-900 font-medium">{reservation.from}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">NEREYE</div>
                                    <div className="text-sm text-gray-900 font-medium">{reservation.to}</div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs">Başlangıç Tarihi</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{reservation.date}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        <span className="text-xs">Mesafe</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{reservation.distance}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs">Süre</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{reservation.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs">Kişi Sayısı</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{reservation.passengers}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        <span className="text-xs">Gidiş - Dönüş</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{reservation.tripType}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>
                                        <span className="text-xs">Araç</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{vehicle.name}</span>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-bold text-gray-900 mb-4">Ödeme Detayları</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{vehicle.name}</span>
                                        <span className="font-semibold text-gray-900">{vehicle.basePrice}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'}</span>
                                    </div>
                                    {services.map((service) => (
                                        additionalServices[service.id as keyof typeof additionalServices] && (
                                            <div key={service.id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">{service.name}</span>
                                                <span className="font-semibold text-gray-900">{service.price}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'}</span>
                                            </div>
                                        )
                                    ))}
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-bold text-gray-900">Genel Toplam</span>
                                            <span className="text-xl font-bold text-gray-900">{calculateTotal()}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
