'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, Clock, Navigation, Instagram, Globe, MessageCircle, User, ChevronDown, Menu, X, ArrowLeftRight, Search, Edit2, RotateCcw } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LocationAutocomplete } from '@/features/maps';
import { mapsService } from '@/features/maps/services/maps-service';
import { InlineDateTimePicker } from '@/features/booking/components/InlineDateTimePicker';
import { InlinePassengerSelector } from '@/features/booking/components/InlinePassengerSelector';

interface Location {
    lat: number;
    lng: number;
    address: string;
    name?: string;
}

interface VehiclePricing {
    vehicle_type: string;
    vehicle_name: string;
    final_price: number;
    price_breakdown: {
        minimum_applied: number;
    };
}

// Exchange rates state (fetched from API)
interface ExchangeRates {
    TRY: number;
    EUR: number;
    USD: number;
    GBP: number;
}

// Fallback rates (used if API fails)
const FALLBACK_RATES: ExchangeRates = {
    TRY: 1,
    EUR: 0.029,
    USD: 0.031,
    GBP: 0.025
};

// Helper to convert price from TRY to other currencies
const convertPrice = (tryPrice: number, currency: keyof ExchangeRates, rates: ExchangeRates): number => {
    return Math.round(tryPrice * rates[currency]);
};

// Image Slider Component
function VehicleImageSlider({ images, name }: { images: string[], name: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000); // 3 saniyede bir geçiş

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="w-full h-full relative overflow-hidden group bg-gray-100">
            {/* Slider Track */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0">
                        <img
                            src={img}
                            alt={`${name} - ${idx + 1}`}
                            className="w-full h-full object-cover min-h-[200px] md:min-h-[260px]"
                        />
                    </div>
                ))}
            </div>

            {/* Dots Indicators (Only if multiple images) */}
            {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.preventDefault(); // Link tıklamasını engelle
                                setCurrentIndex(idx);
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function VehiclesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedCurrencies, setSelectedCurrencies] = useState<Record<number, string>>({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // API Pricing State
    const [vehiclePricing, setVehiclePricing] = useState<VehiclePricing[]>([]);
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);

    // Exchange rates state
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(FALLBACK_RATES);

    // Fetch exchange rates from backend
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/exchange-rates');
                const data = await response.json();
                if (data.rates) {
                    setExchangeRates(data.rates);
                    console.log('Exchange rates loaded:', data.cached ? '(cached)' : '(fresh)');
                }
            } catch (error) {
                console.error('Failed to fetch exchange rates, using fallback:', error);
                setExchangeRates(FALLBACK_RATES);
            }
        };

        fetchExchangeRates();
    }, []);

    // --- Search & Edit States ---
    const [isEditing, setIsEditing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [originLocation, setOriginLocation] = useState<Location | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [passengerCount, setPassengerCount] = useState(1);
    const [isRoundTrip, setIsRoundTrip] = useState(false);

    // UI Helper States
    const [activeLocationInput, setActiveLocationInput] = useState<'origin' | 'destination' | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPassengerSelector, setShowPassengerSelector] = useState(false);

    const dropdownContainerRef = useRef<HTMLDivElement>(null);

    // Initialize states from URL parameters
    useEffect(() => {
        const fromLat = searchParams.get('fromLat');
        const fromLng = searchParams.get('fromLng');
        const fromAddress = searchParams.get('fromAddress') || searchParams.get('from');

        const toLat = searchParams.get('toLat');
        const toLng = searchParams.get('toLng');
        const toAddress = searchParams.get('toAddress') || searchParams.get('to');

        const dateParam = searchParams.get('date');
        const passengersParam = searchParams.get('passengers');
        const roundTripParam = searchParams.get('isRoundTrip');

        if (fromAddress) {
            setOriginLocation({
                address: fromAddress,
                lat: fromLat ? parseFloat(fromLat) : 0,
                lng: fromLng ? parseFloat(fromLng) : 0
            });
        }

        if (toAddress) {
            setDestinationLocation({
                address: toAddress,
                lat: toLat ? parseFloat(toLat) : 0,
                lng: toLng ? parseFloat(toLng) : 0
            });
        }

        if (dateParam) {
            setStartDate(new Date(dateParam));
        }

        if (passengersParam) {
            setPassengerCount(parseInt(passengersParam, 10));
        }

        if (roundTripParam === 'true') {
            setIsRoundTrip(true);
        }
    }, [searchParams]);

    // Fetch prices from backend API
    useEffect(() => {
        const fetchPrices = async () => {
            const fromLat = searchParams.get('fromLat');
            const fromLng = searchParams.get('fromLng');
            const fromAddress = searchParams.get('fromAddress') || searchParams.get('from');
            const toLat = searchParams.get('toLat');
            const toLng = searchParams.get('toLng');
            const toAddress = searchParams.get('toAddress') || searchParams.get('to');
            const distance = searchParams.get('distance');

            if (!fromLat || !toLat || !fromAddress || !toAddress) {
                setIsLoadingPrices(false);
                return;
            }

            try {
                const distanceKm = distance ? parseFloat(distance.replace(' km', '').replace(',', '.')) : 50;

                const response = await fetch('http://localhost:8000/api/pricing/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        origin_lat: parseFloat(fromLat),
                        origin_lng: parseFloat(fromLng),
                        origin_name: fromAddress,
                        destination_lat: parseFloat(toLat),
                        destination_lng: parseFloat(toLng),
                        destination_name: toAddress,
                        distance_km: distanceKm,
                        duration_minutes: 40,
                        passenger_count: parseInt(searchParams.get('passengers') || '1'),
                        is_round_trip: searchParams.get('isRoundTrip') === 'true',
                        is_airport_transfer: fromAddress.toLowerCase().includes('airport') || toAddress.toLowerCase().includes('airport')
                    })
                });

                const data = await response.json();
                setVehiclePricing(data.vehicles || []);
            } catch (error) {
                console.error('Failed to fetch prices:', error);
            } finally {
                setIsLoadingPrices(false);
            }
        };

        fetchPrices();
    }, [searchParams]);

    const handleUpdateSearch = async () => {
        if (!originLocation || !destinationLocation || !startDate) {
            alert('Lütfen tüm alanları doldurunuz.');
            return;
        }

        setIsSearching(true);
        try {
            // Recalculate distance
            const distanceData = await mapsService.calculateDistance(originLocation, destinationLocation);

            const queryParams = new URLSearchParams({
                fromLat: originLocation.lat.toString(),
                fromLng: originLocation.lng.toString(),
                fromAddress: originLocation.address,
                toLat: destinationLocation.lat.toString(),
                toLng: destinationLocation.lng.toString(),
                toAddress: destinationLocation.address,
                date: startDate.toISOString(),
                passengers: passengerCount.toString(),
                isRoundTrip: isRoundTrip.toString(),
                distance: distanceData.distance_text,
                duration: distanceData.duration_text
            });

            router.push(`/vehicles?${queryParams.toString()}`);
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error('Update failed:', error);
            alert('Güncelleme sırasında bir hata oluştu.');
        } finally {
            setIsSearching(false);
        }
    };

    // Format date for display
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    // Get reservation data from URL params
    const reservation = {
        from: searchParams.get('fromAddress') || searchParams.get('from') || 'Seçilmedi',
        to: searchParams.get('toAddress') || searchParams.get('to') || 'Seçilmedi',
        date: formatDate(searchParams.get('date')),
        distance: searchParams.get('distance') || '-', // Will be passed from homepage eventually
        duration: searchParams.get('duration') || '-',
        passengers: searchParams.get('passengers') || 1,
        tripType: searchParams.get('isRoundTrip') === 'true' ? 'Gidiş-Dönüş' : 'Tek Yön'
    };

    // Vehicle display info (static UI data only - prices come from API)
    const vehicleDisplayInfo = [
        {
            id: 1,
            type: 'luxury_sedan',
            name: 'Sedan Private',
            images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800'],
            capacity: '1-3',
            baggage: '1 - 3'
        },
        {
            id: 2,
            type: 'vito',
            name: 'Mercedes Vito & VW Private',
            images: [
                '/images/mercedes-vito.jpg',
                '/images/mercedes-vito-front-new.jpg',
                '/images/mercedes-vito-int-green.jpg',
                '/images/mercedes-vito-int-white.jpg',
                '/images/mercedes-vito-int-tv.jpg',
                '/images/mercedes-vito-int-red.jpg'
            ],
            capacity: '1-6',
            baggage: '1 - 6'
        },
        {
            id: 3,
            type: 'sprinter',
            name: 'Mercedes Sprinter Private',
            images: [
                '/images/mercedes-sprinter-trees.jpg',
                '/images/mercedes-sprinter-front-2.jpg'
            ],
            capacity: '1-14',
            baggage: '1 - 14'
        }
    ];

    // Merge API pricing with display info
    const vehicles = vehicleDisplayInfo.map(displayVehicle => {
        const apiPricing = vehiclePricing.find(p => p.vehicle_type === displayVehicle.type);
        return {
            ...displayVehicle,
            apiPricing: apiPricing || null
        };
    });

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
                    <div className="lg:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl overflow-hidden">
                        <div className="container-custom py-4 space-y-2">
                            <Link href="/turlar" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Turlar</Link>
                            <Link href="/hakkimizda" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Hakkımızda</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">İşveren Olun</Link>
                            <Link href="#" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">Taşıyıcı Olun</Link>
                            <Link href="/iletisim" className="block text-gray-900 font-bold hover:text-[#D32F2F] p-2 rounded-lg hover:bg-red-50">İletişim</Link>
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
                                    {/* Vehicle Images Slider - Left Side */}
                                    <div className="md:w-60 lg:w-72 flex-shrink-0">
                                        <VehicleImageSlider images={vehicle.images} name={vehicle.name} />
                                    </div>

                                    {/* Vehicle Info - Right Side */}
                                    <div className="flex-1 p-6 flex flex-col">
                                        {/* Header with Title and Capacity */}
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex-1 min-w-0 pr-2">{vehicle.name}</h3>
                                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-red-600 font-semibold flex-shrink-0">
                                                <span className="flex items-center gap-1 whitespace-nowrap">
                                                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    {vehicle.capacity} Kişi
                                                </span>
                                                <span className="flex items-center gap-1 whitespace-nowrap">
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <div className="flex flex-col gap-4 mt-auto">
                                            {isLoadingPrices ? (
                                                <div className="text-center py-8">
                                                    <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto mb-2"></div>
                                                    <p className="text-sm text-gray-500">Fiyatlar yükleniyor...</p>
                                                </div>
                                            ) : !vehicle.apiPricing ? (
                                                <div className="text-center py-8">
                                                    <p className="text-sm text-red-500">Bu araç için fiyat bilgisi bulunamadı</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Currency Options - Responsive Grid */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                        {Object.keys(currencySymbols).map((currency) => {
                                                            const currencyKey = currency as keyof ExchangeRates;
                                                            const convertedPrice = convertPrice(vehicle.apiPricing!.final_price, currencyKey, exchangeRates);
                                                            const originalPrice = Math.round(convertedPrice * 1.25);

                                                            return (
                                                                <div key={currency} className="relative pb-3">
                                                                    <button
                                                                        onClick={() => setSelectedCurrencies(prev => ({ ...prev, [vehicle.id]: currency }))}
                                                                        className={`w-full px-2 sm:px-3 py-2.5 rounded-lg border-2 transition-all ${(selectedCurrencies[vehicle.id] || 'TRY') === currency
                                                                            ? 'border-green-500 bg-green-50'
                                                                            : 'border-gray-200 hover:border-gray-300'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-start gap-1">
                                                                            {(selectedCurrencies[vehicle.id] || 'TRY') === currency && (
                                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                </svg>
                                                                            )}
                                                                            <div className="text-left flex-1 min-w-0">
                                                                                <div className="text-sm sm:text-base font-bold text-gray-900 truncate">
                                                                                    {currencySymbols[currencyKey]} {convertedPrice}
                                                                                </div>
                                                                                <div className="text-[10px] text-gray-400 line-through truncate">
                                                                                    {currencySymbols[currencyKey]} {originalPrice}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                    {/* Discount badge - only show on selected currency */}
                                                                    {(selectedCurrencies[vehicle.id] || 'TRY') === currency && (
                                                                        <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
                                                                            %20 indirim
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Action Section */}
                                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                                                        <span className="text-xs text-red-600 font-semibold text-center sm:text-left">Toplam araç fiyatıdır.</span>
                                                        <Link
                                                            href={`/checkout?vehicleId=${vehicle.id}&currency=${selectedCurrencies[vehicle.id] || 'TRY'}`}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-md hover:shadow-lg whitespace-nowrap text-center"
                                                        >
                                                            Rezervasyon Yap
                                                        </Link>
                                                    </div>
                                                </>
                                            )}
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
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-semibold transition-colors group"
                                    >
                                        <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Düzenle
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-semibold transition-colors group"
                                    >
                                        <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        İptal
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                /* --- EDIT FORM --- */
                                <div className="space-y-4" ref={dropdownContainerRef}>
                                    {/* Konumlar */}
                                    <div className="relative space-y-3">
                                        <div className="relative z-[30]">
                                            <LocationAutocomplete
                                                type="origin"
                                                label="NEREDEN"
                                                placeholder="Nereden?"
                                                value={originLocation}
                                                onChange={setOriginLocation}
                                                isActive={activeLocationInput === 'origin'}
                                                onActivate={() => setActiveLocationInput('origin')}
                                                onDeactivate={() => setActiveLocationInput(null)}
                                                dropdownPortalRef={dropdownContainerRef}
                                            />
                                        </div>

                                        <div className="relative z-[20]">
                                            <LocationAutocomplete
                                                type="destination"
                                                label="NEREYE"
                                                placeholder="Nereye?"
                                                value={destinationLocation}
                                                onChange={setDestinationLocation}
                                                isActive={activeLocationInput === 'destination'}
                                                onActivate={() => setActiveLocationInput('destination')}
                                                onDeactivate={() => setActiveLocationInput(null)}
                                                dropdownPortalRef={dropdownContainerRef}
                                            />
                                        </div>
                                    </div>

                                    {/* Tarih */}
                                    <div className="relative z-[10]">
                                        <button
                                            onClick={() => setShowDatePicker(!showDatePicker)}
                                            className="w-full bg-white rounded-xl p-3 border border-gray-200 text-left flex items-center gap-3 hover:border-red-500 transition-colors shadow-sm"
                                        >
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase">TARİH & SAAT</div>
                                                <div className="text-sm font-bold text-gray-900">
                                                    {startDate ? new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(startDate) : 'Seçiniz'}
                                                </div>
                                            </div>
                                        </button>
                                        <InlineDateTimePicker
                                            isOpen={showDatePicker}
                                            onClose={() => setShowDatePicker(false)}
                                            onSelectDateTime={(d) => { setStartDate(d); setShowDatePicker(false); }}
                                            initialDate={startDate || undefined}
                                            position="right"
                                        />
                                    </div>

                                    {/* Kişi Sayısı & Gidiş Dönüş */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative z-[10]">
                                            <button
                                                onClick={() => setShowPassengerSelector(!showPassengerSelector)}
                                                className="w-full bg-white rounded-xl p-3 border border-gray-200 text-left hover:border-red-500 transition-colors shadow-sm"
                                            >
                                                <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">KİŞİ SAYISI</div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-gray-900">{passengerCount} Kişi</span>
                                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                                </div>
                                            </button>
                                            <InlinePassengerSelector
                                                isOpen={showPassengerSelector}
                                                onClose={() => setShowPassengerSelector(false)}
                                                value={passengerCount}
                                                onChange={setPassengerCount}
                                            />
                                        </div>

                                        <button
                                            onClick={() => setIsRoundTrip(!isRoundTrip)}
                                            className={`w-full rounded-xl p-2 border transition-all flex flex-col items-center justify-center shadow-sm ${isRoundTrip ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">GİDİŞ - DÖNÜŞ</div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold ${isRoundTrip ? 'text-red-600' : 'text-gray-400'}`}>{isRoundTrip ? 'EVET' : 'HAYIR'}</span>
                                                <div className={`w-8 h-4 rounded-full relative transition-colors ${isRoundTrip ? 'bg-red-500' : 'bg-gray-300'}`}>
                                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${isRoundTrip ? 'left-4.5' : 'left-0.5'}`} style={{ left: isRoundTrip ? '18px' : '2px' }} />
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* SEARCH BUTTON */}
                                    <button
                                        onClick={handleUpdateSearch}
                                        disabled={isSearching}
                                        className="w-full bg-[#D0142D] hover:bg-[#b01126] text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-4"
                                    >
                                        {isSearching ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        )}
                                        {isSearching ? 'Güncelleniyor...' : ''}
                                        {/* Icon only on search state is redundant if text is there, removing empty text check */}
                                    </button>
                                </div>
                            ) : (
                                /* --- READ ONLY --- */
                                <>
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
                                                <ArrowLeftRight className="w-4 h-4" />
                                                <span className="text-xs">Gidiş - Dönüş</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{reservation.tripType}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}
