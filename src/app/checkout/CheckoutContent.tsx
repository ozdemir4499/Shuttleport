'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Clock, Instagram, Globe, MessageCircle, User, ChevronDown, Menu, X, Check } from 'lucide-react';


export default function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const vehicleId = searchParams.get('vehicleId');
    const currency = searchParams.get('currency') || 'TRY';

    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [additionalServices, setAdditionalServices] = useState({
        welcomeSign: false,
        jetValet: false,
        childSeat: false,
        flowers: false,
        diapers: false,
        parkingFee: true,
        bridgeFee: true,
        tunnel: false
    });

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
    const [pendingBooking, setPendingBooking] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('pendingBooking');
        if (stored) {
            setPendingBooking(JSON.parse(stored));
        } else {
            // Optional: redirect to home if no booking data
            // router.push('/');
        }
    }, [router]);

    const reservation = {
        from: pendingBooking?.from || 'Seçilmedi',
        to: pendingBooking?.to || 'Seçilmedi',
        date: pendingBooking?.date || '',
        distance: pendingBooking?.distance || '',
        duration: pendingBooking?.duration || '',
        passengers: pendingBooking?.passengers || 1,
        luggage: pendingBooking?.passengers || 1,
        tripType: pendingBooking?.tripType || 'Tek Yön',
        rawDate: pendingBooking?.rawDate || new Date().toISOString()
    };

    const vehicle = {
        name: pendingBooking?.vehicle_name || 'Araç',
        basePrice: pendingBooking?.basePrice ? Math.round(pendingBooking.basePrice * (pendingBooking.exchangeRate || 1)) : 0,
        currency: pendingBooking?.currency || 'TRY'
    };

    const services = [
        { id: 'welcomeSign', name: 'Karşılama Tabelası', price: 120, description: '' },
        { id: 'jetValet', name: 'Jet Valet Karşılama Hizmeti', price: 1000, description: '' },
        { id: 'childSeat', name: 'Çocuk Koltuğu (0-3 yaş)', price: 800, description: '' },
        { id: 'flowers', name: 'Çiçek Buketi', price: 3000, description: '' },
        { id: 'diapers', name: '15 Adet Üst Bebek Bezi', price: 6000, description: '' },
        { id: 'parkingFee', name: 'Sabiha Gökçen Vip Otopark Ücreti', price: 80, description: '' },
        { id: 'bridgeFee', name: '15 Temmuz veya F.S.M. Köprü Geçiş Ücreti', price: 80, description: '' },
        { id: 'tunnel', name: 'Araçta Tünel', price: 335, description: '' }
    ];

    const currencySymbols = {
        TRY: '₺',
        EUR: '€',
        USD: '$',
        GBP: '£'
    };

    const calculateTotal = () => {
        let total = vehicle.basePrice;
        services.forEach(service => {
            if (additionalServices[service.id as keyof typeof additionalServices]) {
                total += service.price;
            }
        });
        return total;
    };

    const toggleService = (serviceId: string) => {
        setAdditionalServices(prev => ({
            ...prev,
            [serviceId]: !prev[serviceId as keyof typeof additionalServices]
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
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
                notes: formData.notes || null
            };

            const res = await fetch('http://localhost:8000/api/bookings', {
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

                        {/* Step 2 - Active */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                                    2
                                </div>
                                <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
                                    Yolcu & Ödeme
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
                    {/* Left Side - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Passenger Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-bold text-gray-900">Rezervasyon Sahibi Yolcu Bilgileri</h2>
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
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`p-4 rounded-lg border-2 transition-all text-left ${additionalServices[service.id as keyof typeof additionalServices]
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-gray-900 mb-1">{service.name}</div>
                                                <div className="text-lg font-bold text-gray-900">{service.price}{currencySymbols[vehicle.currency as keyof typeof currencySymbols] || '₺'}</div>
                                            </div>
                                            {additionalServices[service.id as keyof typeof additionalServices] && (
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                ))}
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
                                                    <div className="font-bold text-gray-900 mb-1">Araçta Nakit Ödeme</div>
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
                                {isSubmitting ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Reservation Summary (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Rezervasyon</h3>

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
