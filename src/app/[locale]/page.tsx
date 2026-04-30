'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Shield, Clock, Car, Facebook, Menu, X, Instagram, MessageCircle, User, ChevronDown, ChevronLeft, ChevronRight, Star, Plane, Building2, Compass, Crown, Sparkles } from 'lucide-react';
import { LocationAutocomplete } from '@/features/maps';
import { mapsService } from '@/features/maps/services/maps-service';
import { ServiceTypeSelector } from '@/features/booking/components/ServiceTypeSelector';
import { InlineDateTimePicker } from '@/features/booking/components/InlineDateTimePicker';
import { InlinePassengerSelector } from '@/features/booking/components/InlinePassengerSelector';
import { tours } from '@/data/tours';

interface Location {
    lat: number;
    lng: number;
    address: string;
    name?: string;
}

const bannerTexts = [
    {
        subtitle: "İADE GARANTİSİ.",
        title: <>6 saatten önceki rezervasyon <br className="hidden md:block" /> iptallerinde <span className="font-extrabold text-black">%100 iade garantisi.</span></>
    },
    {
        subtitle: "7/24 HAVALİMANI TRANSFERİ.",
        title: <>İstanbul havalimanlarından otelinize <br className="hidden md:block" /> <span className="font-extrabold text-black">VIP ayrıcalığıyla ulaşın.</span></>
    },
    {
        subtitle: "ÖZEL İSTANBUL TURLARI.",
        title: <>Şehrin tarihi güzelliklerini <br className="hidden md:block" /> <span className="font-extrabold text-black">lüks araçlarımızla keşfedin.</span></>
    }
];

const extendedSlides = [bannerTexts[bannerTexts.length - 1], ...bannerTexts, bannerTexts[0]];

export default function Home() {
    const router = useRouter();
    const [isSearching, setIsSearching] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [serviceType, setServiceType] = useState<'transfer' | 'hourly' | 'tour'>('transfer');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [slides, setSlides] = useState(bannerTexts);
    const [sliderState, setSliderState] = useState({ offset: 0, isAnimating: false });
    const [datePickerType, setDatePickerType] = useState<'departure' | 'return'>('departure');

    // Location states
    const [originLocation, setOriginLocation] = useState<Location | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
    const [activeLocationInput, setActiveLocationInput] = useState<'origin' | 'destination' | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPassengerSelector, setShowPassengerSelector] = useState(false);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);

    // Fixed routes state (for popular locations section)
    const [fixedRoutes, setFixedRoutes] = useState<any[]>([]);
    const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);

    // Exchange rates state
    const [exchangeRates, setExchangeRates] = useState({ TRY: 1, EUR: 0.029, USD: 0.031, GBP: 0.025 });

    const nextSlide = useCallback(() => {
        if (sliderState.isAnimating) return;

        // Start sliding left
        setSliderState({ offset: -100, isAnimating: true });

        // After sliding completes, instantly swap items and reset position
        setTimeout(() => {
            setSlides(prev => [...prev.slice(1), prev[0]]);
            setSliderState({ offset: 0, isAnimating: false });
        }, 1000);
    }, [sliderState.isAnimating]);

    const prevSlide = useCallback(() => {
        if (sliderState.isAnimating) return;

        // Instantly move the last slide to the front and hide it off-screen to the left
        setSlides(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
        setSliderState({ offset: -100, isAnimating: false });

        // One frame later, animate it sliding in from the left to the center
        setTimeout(() => {
            setSliderState({ offset: 0, isAnimating: true });
        }, 50);

        // Unlock after animation finishes
        setTimeout(() => {
            setSliderState(prev => ({ ...prev, isAnimating: false }));
        }, 1050);
    }, [sliderState.isAnimating]);

    // Auto-advance banner text
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 8000); // 8 saniye bekleme süresi
        return () => clearInterval(timer);
    }, [nextSlide]);

    // Fetch fixed routes from backend
    useEffect(() => {
        const fetchFixedRoutes = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/pricing/fixed-routes');
                const data = await response.json();
                setFixedRoutes(data.routes || []);
            } catch (error) {
                console.error('Failed to fetch fixed routes:', error);
            } finally {
                setIsLoadingRoutes(false);
            }
        };

        fetchFixedRoutes();
    }, []);

    // Fetch exchange rates
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/exchange-rates');
                const data = await response.json();
                if (data.rates) {
                    setExchangeRates(data.rates);
                }
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
            }
        };

        fetchExchangeRates();
    }, []);

    // Ref for Tours Slider
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Ref for dropdown portal container (spans NEREDEN + NEREYE)
    const dropdownContainerRef = useRef<HTMLDivElement>(null);

    // Hero carousel headlines
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
    const handleSearch = async () => {
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

        setIsSearching(true);

        try {
            // Calculate distance and duration
            const distanceData = await mapsService.calculateDistance(originLocation, destinationLocation);

            // Create query parameters
            const queryParams = new URLSearchParams({
                fromLat: originLocation.lat.toString(),
                fromLng: originLocation.lng.toString(),
                fromAddress: originLocation.address,
                toLat: destinationLocation.lat.toString(),
                toLng: destinationLocation.lng.toString(),
                toAddress: destinationLocation.address,
                date: startDate.toISOString(),
                passengers: passengerCount.toString(),
                serviceType,
                isRoundTrip: isRoundTrip.toString(),
                distance: distanceData.distance_text,
                duration: distanceData.duration_text
            });

            if (isRoundTrip && returnDate) {
                queryParams.append('returnDate', returnDate.toISOString());
            }

            router.push(`/vehicles?${queryParams.toString()}`);
        } catch (error) {
            console.error('Mesafe hesaplanırken hata oluştu:', error);
            // Hata olsa bile devam edelim, mesafe bilgisi boş gider
            const queryParams = new URLSearchParams({
                fromLat: originLocation.lat.toString(),
                fromLng: originLocation.lng.toString(),
                fromAddress: originLocation.address,
                toLat: destinationLocation.lat.toString(),
                toLng: destinationLocation.lng.toString(),
                toAddress: destinationLocation.address,
                date: startDate.toISOString(),
                passengers: passengerCount.toString(),
                serviceType,
                isRoundTrip: isRoundTrip.toString()
            });

            if (isRoundTrip && returnDate) {
                queryParams.append('returnDate', returnDate.toISOString());
            }

            router.push(`/vehicles?${queryParams.toString()}`);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            {/* HEADER - Sticky Navigation */}
            <header className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm h-20 md:h-24">
                <div className="w-full max-w-[1600px] mx-auto h-full flex items-center justify-between px-4 lg:px-8">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                            <img
                                src="/red_lion_icon.png"
                                alt="Lion Icon"
                                className="w-full h-full object-contain scale-110 mix-blend-multiply"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[11px] md:text-[13px] font-bold tracking-[0.2em] text-[#D32F2F] leading-tight">İSTANBUL</span>
                            <span className="text-xl md:text-[28px] font-black text-gray-900 leading-none tracking-tight mt-0.5">TRANSFER</span>
                        </div>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden xl:flex items-center space-x-8 text-[15px] font-bold text-gray-800">
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
                        <div className="flex items-center space-x-3 border-r border-gray-200 pr-5">
                            <Link href="#">
                                <div className="flex items-center justify-center w-[26px] h-[26px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full hover:scale-110 transition-transform shadow-sm">
                                    <Instagram className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                                </div>
                            </Link>
                            
                            <Link href="#">
                                <div className="flex items-center justify-center w-[26px] h-[26px] bg-[#1877F2] rounded-full hover:scale-110 transition-transform shadow-sm">
                                    <Facebook className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                                </div>
                            </Link>

                            <Link href="#">
                                <div className="flex items-center justify-center w-[26px] h-[26px] bg-black rounded-full hover:scale-110 transition-transform shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917" />
                                    </svg>
                                </div>
                            </Link>

                            <Link href="#">
                                <div className="flex items-center justify-center w-[26px] h-[26px] bg-[#25D366] rounded-full hover:scale-110 transition-transform shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                                        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
                                    </svg>
                                </div>
                            </Link>
                        </div>

                        {/* Language */}
                        <div className="relative flex items-center space-x-2 cursor-pointer group">
                            <div className="flex items-center space-x-2 py-2">
                                <img src="https://flagcdn.com/w40/tr.png" alt="TR" className="w-6 h-6 rounded-full object-cover shadow-sm border border-gray-100" />
                                <span className="text-[15px] font-bold text-gray-900">TR</span>
                                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full right-0 mt-1 w-20 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                                <div className="py-2 flex flex-col">
                                    {[
                                        { code: 'EN', flag: 'gb' },
                                        { code: 'DE', flag: 'de' },
                                        { code: 'ES', flag: 'es' },
                                        { code: 'FR', flag: 'fr' },
                                        { code: 'İT', flag: 'it' },
                                        { code: 'PT', flag: 'pt' },
                                        { code: 'RU', flag: 'ru' },
                                        { code: 'HU', flag: 'hu' },
                                        { code: 'NL', flag: 'nl' },
                                        { code: 'AR', flag: 'sa' }
                                    ].map((lang) => (
                                        <div key={lang.code} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 transition-colors">
                                            <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.code} className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100" />
                                            <span className="text-[14px] font-semibold text-gray-700">{lang.code}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Auth */}
                        <div className="flex items-center space-x-4 ml-2">
                            <Link href="#" className="text-[15px] font-bold text-gray-900 hover:text-[#D32F2F]">Üye Ol</Link>
                            <Link href="#" className="flex items-center space-x-2 border border-black rounded-lg px-5 py-2.5 hover:bg-black hover:text-white transition-all group">
                                <User className="w-5 h-5 group-hover:text-white" />
                                <span className="text-[15px] font-bold">Giriş</span>
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

                            <div className="border-t border-gray-100 my-2 pt-2"></div>

                            <div className="flex items-center justify-between p-2">
                                <div className="flex space-x-3">
                                    <Link href="#">
                                        <div className="flex items-center justify-center w-[26px] h-[26px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full">
                                            <Instagram className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                                        </div>
                                    </Link>
                                    <Link href="#">
                                        <div className="flex items-center justify-center w-[26px] h-[26px] bg-[#1877F2] rounded-full">
                                            <Facebook className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                                        </div>
                                    </Link>
                                    <Link href="#">
                                        <div className="flex items-center justify-center w-[26px] h-[26px] bg-black rounded-full">
                                            <svg className="w-3.5 h-3.5 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917" />
                                            </svg>
                                        </div>
                                    </Link>
                                    <Link href="#">
                                        <div className="flex items-center justify-center w-[26px] h-[26px] bg-[#25D366] rounded-full">
                                            <svg className="w-3.5 h-3.5 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                                                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
                                            </svg>
                                        </div>
                                    </Link>
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

            {/* HERO SECTION */}
            <section className="relative pt-[88px] md:pt-[104px] pb-12 bg-gray-50">

                {/* Hero Content */}
                <div className="relative z-10 container-custom px-4 w-full">
                    {/* Mobile Banner Image (Simulated) */}
                    <div className="md:hidden mb-6 bg-white rounded-lg overflow-hidden shadow-lg mx-auto max-w-sm">

                    </div>

                    {/* Hero Banner Image (Matches Booking Widget Width) */}
                    <div className="max-w-[1440px] mx-auto h-48 md:h-[320px] mb-4 rounded-2xl overflow-hidden shadow-2xl relative group">
                        <img
                            src="/coastal_vip_van_banner_v11.png"
                            alt="VIP Transfer & Tours"
                            className="w-full h-full object-cover object-[right_25%] transition-transform duration-1000 group-hover:scale-105"
                        />
                        {/* Gradient to ensure text readability on the left without covering the car on the right */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 from-10% via-white/80 md:via-white/60 via-45% md:via-35% to-white/10 md:to-transparent to-75% md:to-55% pointer-events-none"></div>

                        {/* Container for everything */}
                        <div className="absolute inset-0 flex items-start md:items-center justify-between md:justify-start px-2 md:px-12 pointer-events-none">
                            {/* Left Carousel Button */}
                            <button
                                onClick={prevSlide}
                                className="pointer-events-auto shrink-0 w-7 h-7 md:w-12 md:h-12 bg-white/60 md:bg-transparent hover:bg-white/90 backdrop-blur-md border border-gray-300 md:border-gray-400 rounded-full flex items-center justify-center transition-all group/btn z-10 shadow-sm md:shadow-none mt-7 md:mt-0"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-900 md:text-gray-600 group-hover/btn:text-black" strokeWidth={1.5} />
                            </button>

                            {/* Text Block */}
                            <div
                                className="absolute md:relative top-0 bottom-0 left-10 md:left-auto right-0 md:right-auto flex flex-col md:w-[500px] lg:w-[560px] justify-start md:justify-center overflow-hidden pt-4 md:pt-0 pb-4 md:py-4 md:mx-4"
                                style={{
                                    maskImage: 'linear-gradient(to right, black, black calc(100% - 40px), transparent)',
                                    WebkitMaskImage: 'linear-gradient(to right, black, black calc(100% - 40px), transparent)'
                                }}
                            >
                                <div
                                    className="flex w-full h-full items-start md:items-center"
                                    style={{
                                        transform: `translateX(${sliderState.offset}%)`,
                                        transition: sliderState.isAnimating ? 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                                    }}
                                >
                                    {slides.map((text, idx) => (
                                        <div key={idx} className="w-full flex-shrink-0 flex flex-col justify-start md:justify-center pr-[40px]">
                                            <span className="text-[#D32F2F] font-bold tracking-wider text-[10px] md:text-sm mb-1.5 md:mb-2 drop-shadow-sm md:drop-shadow-none">
                                                {text.subtitle}
                                            </span>
                                            <h2 className="text-[17px] leading-[1.3] md:text-3xl lg:text-4xl text-[#0a0a0a] font-black md:font-bold md:leading-tight">
                                                {text.title}
                                            </h2>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Carousel Button */}
                            <button
                                onClick={nextSlide}
                                className="pointer-events-auto shrink-0 w-7 h-7 md:w-12 md:h-12 bg-white/60 md:bg-transparent hover:bg-white/90 backdrop-blur-md border border-gray-300 md:border-gray-400 rounded-full flex items-center justify-center transition-all group/btn z-10 shadow-sm md:shadow-none mt-7 md:mt-0"
                            >
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-900 md:text-gray-600 group-hover/btn:text-black" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>

                    {/* BOOKING WIDGET CONTAINER */}
                    <div className="max-w-[1440px] mx-auto">

                        {/* Desktop Folder Tab Menu & Badges Container */}
                        <div className="hidden md:flex justify-between items-end relative z-10 translate-y-[1px]">
                            {/* Left Side: Tab Menu & TripAdvisor */}
                            <div className="flex items-end space-x-6">
                                {/* Tab Menu */}
                                <div className="inline-block bg-white rounded-t-2xl px-6 pt-4 pb-0 border border-b-0 border-black relative">
                                    <ServiceTypeSelector activeType={serviceType} onChange={setServiceType} />
                                    {/* Masking element to cover the main border below the tabs */}
                                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-white"></div>
                                </div>

                                {/* TripAdvisor */}
                                <a href="#" className="flex items-center space-x-2 pb-4 group cursor-pointer" target="_blank" rel="noopener noreferrer">
                                    <svg className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="12" cy="12.5" rx="9" ry="6" fill="#00aa6c" />
                                        <path fill="#000000" d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.903C13.943 8.138 12 10.43 12 13.1c0-2.671-1.942-4.962-4.504-5.942A11.72 11.72 0 0 1 12 6.256zM6.002 9.157a4.059 4.059 0 1 1 0 8.118 4.059 4.059 0 0 1 0-8.118zm11.992.002a4.057 4.057 0 1 1 .003 8.115 4.057 4.057 0 0 1-.003-8.115zm-11.992 1.93a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256zm11.992 0a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256z" />
                                    </svg>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="text-[15px] font-extrabold text-gray-900 group-hover:text-gray-700 tracking-tight transition-colors">Tripadvisor</span>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-sm font-bold text-gray-900 leading-none">4.5</span>
                                            <div className="flex items-center space-x-0.5">
                                                {[...Array(4)].map((_, i) => (
                                                    <Star key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" strokeWidth={1} />
                                                ))}
                                                {/* Half Star Implementation */}
                                                <div className="relative w-3.5 h-3.5">
                                                    <Star className="absolute inset-0 w-3.5 h-3.5 text-gray-300" fill="currentColor" strokeWidth={1} />
                                                    <div className="absolute inset-0 overflow-hidden w-[50%]">
                                                        <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" strokeWidth={1} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* Premium Services Badges (Right Side) */}
                            <div className="flex items-center space-x-6 pb-4 pr-6">

                                {/* Havalimanı Transfer */}
                                <div className="flex items-center space-x-2">
                                    <Plane className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Havalimanı Transfer</span>
                                </div>

                                {/* Hotel Transfer */}
                                <div className="flex items-center space-x-2">
                                    <Building2 className="w-4 h-4 text-indigo-500" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Hotel Transfer</span>
                                </div>

                                {/* Şehir Turu */}
                                <div className="flex items-center space-x-2">
                                    <Compass className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Şehir Turu</span>
                                </div>

                                {/* Makam Aracı */}
                                <div className="flex items-center space-x-2">
                                    <Crown className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Makam Aracı</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Reservation Form */}
                        <div className="bg-transparent md:bg-white rounded-2xl md:rounded-tl-none md:shadow-xl md:p-8 md:border md:border-black relative z-0">

                            {/* Mobile Tab Menu */}
                            <div className="md:hidden">
                                <ServiceTypeSelector activeType={serviceType} onChange={setServiceType} />
                            </div>

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
                                                className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-xl hover:bg-[#D32F2F] hover:border-[#D32F2F] hover:scale-110 transition-all rotate-0 md:rotate-90 disabled:opacity-40 disabled:cursor-not-allowed group"
                                            >
                                                <svg className="w-5 h-5 text-black group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                disabled={isSearching}
                                                className="w-full h-full bg-[#D0142D] hover:bg-[#b01126] disabled:bg-gray-400 text-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 transition-colors"
                                            >
                                                {isSearching ? (
                                                    <div className="w-6 h-6 mb-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                )}
                                                <span className="text-xs font-bold">{isSearching ? 'Aranıyor...' : 'Ara'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TOURS SECTION */}
            <section className="pt-8 pb-8 md:pt-12 md:pb-12 bg-gray-50">
                <div className="container-custom px-4">
                    <div className="flex flex-col space-y-8">
                        {/* Section Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="h-px w-8 bg-[#D0142D]"></span>
                                    <span className="text-[#D0142D] font-bold text-sm tracking-widest uppercase">
                                        EŞSİZ DENEYİMLER
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                    Özel <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D0142D] to-red-600">İstanbul</span> Turları
                                </h2>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <p className="text-gray-500 text-lg leading-relaxed">
                                        Şehrin tarihi güzelliklerini ve gizli kalmış hazinelerini VIP ayrıcalığı ve lüks araçlarımızla keşfetmeye hazır olun.
                                    </p>
                                    
                                    {/* Navigation Buttons */}
                                    <div className="flex space-x-3 flex-shrink-0">
                                        <button
                                            onClick={scrollPrev}
                                            className="w-12 h-12 rounded-2xl bg-black shadow-lg shadow-black/20 flex items-center justify-center text-white hover:bg-gray-800 transition-all duration-300 group"
                                        >
                                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button
                                            onClick={scrollNext}
                                            className="w-12 h-12 rounded-2xl bg-[#D0142D] shadow-lg shadow-[#D0142D]/30 flex items-center justify-center text-white hover:bg-[#b01126] transition-all duration-300 group"
                                        >
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* AI Summary Badge (Right Side) */}
                            <div className="hidden lg:flex items-start space-x-6 bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] max-w-xl">
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl flex-shrink-0 border border-blue-100/50 shadow-sm mt-1">
                                    <Sparkles className="w-8 h-8 text-indigo-500" />
                                </div>
                                <div className="pt-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Yapay Zeka Özeti</h3>
                                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase">Beta</span>
                                    </div>
                                    <p className="text-base text-gray-500 leading-relaxed">
                                        "Kullanıcılar genellikle <b className="text-gray-700">şoförlerin profesyonelliğini</b>, <b className="text-gray-700">araçların VIP lüksünü</b> ve <b className="text-gray-700">zamanlamadaki kusursuzluğu</b> öne çıkarıyor."
                                    </p>
                                    <div className="flex items-center space-x-3 mt-5">
                                        <div className="flex -space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 text-amber-400" fill="currentColor" strokeWidth={1} />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400 font-semibold tracking-wide">Google & Tripadvisor</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="w-full">
                            <div
                                ref={scrollContainerRef}
                                className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                            >
                                {tours.map((tour) => (
                                    <Link
                                        key={tour.id}
                                        href={`/turlar/${tour.slug}`}
                                        className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex-shrink-0 flex flex-col h-full border border-gray-100"
                                    >
                                        <div className="h-[200px] overflow-hidden rounded-t-2xl relative">
                                            <img src={tour.image} alt={tour.shortTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            {tour.badge && (
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                                    {tour.badge}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 space-y-4 flex flex-col flex-grow">
                                            <h3 className="text-gray-900 font-semibold leading-snug min-h-[48px] line-clamp-2">
                                                {tour.title}
                                            </h3>
                                            <div className="w-10 h-1 bg-gray-200">
                                                <div className="w-5 h-full bg-red-500"></div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 mt-auto">
                                                <span className="text-2xl font-bold text-gray-900">{tour.prices.adult.try.toLocaleString('tr-TR')}₺</span>
                                                <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPULAR LOCATIONS SECTION */}
            <section className="pt-10 pb-16 md:pt-12 md:pb-24 bg-white">
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
                        {isLoadingRoutes ? (
                            // Loading state
                            <div className="col-span-2 text-center py-12">
                                <div className="w-12 h-12 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-500">Popüler rotalar yükleniyor...</p>
                            </div>
                        ) : fixedRoutes.length === 0 ? (
                            // No routes found
                            <div className="col-span-2 text-center py-12">
                                <p className="text-gray-500">Henüz popüler rota bilgisi bulunmuyor.</p>
                            </div>
                        ) : (
                            // Display dynamic routes from backend
                            fixedRoutes.slice(0, 8).map((route, index) => {
                                // Get the minimum price across all vehicle types
                                const minPrice = route.prices && Object.keys(route.prices).length > 0
                                    ? Math.min(...Object.values(route.prices).map((p: any) => p))
                                    : 0;

                                // Convert from TRY to EUR using real-time rates
                                const priceEUR = Math.round(minPrice * exchangeRates.EUR);

                                return (
                                    <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <span className="text-gray-900 font-semibold">{route.origin}</span>
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                <span className="text-gray-900 font-semibold">{route.destination}</span>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-2xl font-bold text-gray-900">{priceEUR} €</div>
                                                <div className="text-xs text-gray-500">den başlayan</div>
                                            </div>
                                            <svg className="w-6 h-6 text-[#D32F2F] ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                );
                            })
                        )}
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
        </main>
    );
}
