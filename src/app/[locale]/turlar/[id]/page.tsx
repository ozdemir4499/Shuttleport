'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Clock, Map, Minus, Plus, Calendar, Check, X, Star, Heart, MapPin, ChevronLeft, ChevronRight as ChevronRightIcon, ArrowUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import React, { forwardRef } from 'react';
import { tours } from '@/data/tours';

const CustomDateInput = forwardRef<HTMLDivElement, any>(({ value, onClick, selectedDate }, ref) => {
    const formattedDate = selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: tr }).toUpperCase() : '';
    const formattedDay = selectedDate ? format(selectedDate, 'EEEE', { locale: tr }).toUpperCase() : '';

    return (
        <div 
            onClick={onClick} 
            ref={ref}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-2 cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-colors"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                <Calendar className="w-5 h-5 text-gray-700 flex-shrink-0" />
            </div>
            <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tarih</span>
                {selectedDate ? (
                    <>
                        <span className="font-bold text-gray-900 text-sm leading-tight mt-0.5">{formattedDate}</span>
                        <span className="text-gray-500 text-[11px] font-medium mt-0.5">{formattedDay}</span>
                    </>
                ) : (
                    <span className="font-bold text-gray-900 text-sm mt-0.5">Tarih Seçin</span>
                )}
            </div>
        </div>
    );
});
CustomDateInput.displayName = 'CustomDateInput';

interface TourData {
    id: number;
    title_tr: string;
    description_tr: string | null;
    price: number;
    image_url: string | null;
    badge_tr: string | null;
    slug: string | null;
    start_time: string | null;
    end_time: string | null;
    overview_tr: string | null;
    overview_en: string | null;
    gallery: string[] | null;
    program_tr: string | null;
    program_en: string | null;
    included_tr: string | null;
    included_en: string | null;
    excluded_tr: string | null;
    excluded_en: string | null;
    notes_tr: string | null;
    notes_en: string | null;
}

export default function TurDetayPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [tour, setTour] = useState<TourData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState<'try' | 'eur' | 'usd' | 'gbp'>('try');
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);
    const [babyCount, setBabyCount] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(1);
    const [showScroll, setShowScroll] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const handleScroll = () => setShowScroll(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currencySymbols = { try: '₺', eur: '€', usd: '$', gbp: '£' };

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${id}`);
                if (!response.ok) {
                    const staticTour = tours.find(t => t.id.toString() === id);
                    if (staticTour) {
                        setTour({
                            id: staticTour.id,
                            title_tr: staticTour.title,
                            description_tr: staticTour.detailedDescription,
                            price: staticTour.prices.adult.try,
                            image_url: null,
                            badge_tr: staticTour.badge,
                            slug: staticTour.slug,
                            start_time: staticTour.startTime,
                            end_time: staticTour.endTime,
                            overview_tr: staticTour.overview,
                            overview_en: null,
                            gallery: staticTour.gallery,
                            program_tr: staticTour.program.map(p => p.items.join('\n')).join('\n'),
                            program_en: null,
                            included_tr: staticTour.included.join('\n'),
                            included_en: null,
                            excluded_tr: staticTour.excluded.join('\n'),
                            excluded_en: null,
                            notes_tr: staticTour.importantNotes.join('\n'),
                            notes_en: null
                        });
                        setLoading(false);
                        return;
                    }
                    throw new Error("Not found");
                }
                const data = await response.json();
                setTour(data);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white pt-24 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-[#0a192f] border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    if (error || !tour) {
        return (
            <main className="min-h-screen bg-white pt-24 flex justify-center items-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tur Bulunamadı</h1>
                <button onClick={() => router.push('/turlar')} className="text-[#0a192f] underline">Turlara Geri Dön</button>
            </main>
        );
    }

    // Default prices based on base price, assuming base price is for TRY adult
    const prices = {
        adult: { try: tour.price, eur: tour.price / 35, usd: tour.price / 32, gbp: tour.price / 40 },
        child: { try: tour.price * 0.5, eur: (tour.price * 0.5) / 35, usd: (tour.price * 0.5) / 32, gbp: (tour.price * 0.5) / 40 },
        baby: { try: 0, eur: 0, usd: 0, gbp: 0 }
    };

    const calculateTotal = () => {
        const adultPrice = prices.adult[selectedCurrency] * adultCount;
        const childPrice = prices.child[selectedCurrency] * childCount;
        const babyPrice = prices.baby[selectedCurrency] * babyCount;
        return adultPrice + childPrice + babyPrice;
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
    };

    const mainImageUrl = tour.image_url 
        ? `${process.env.NEXT_PUBLIC_API_URL}/static/${tour.image_url}` 
        : 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800';
    
    // Combine main image and gallery images
    let galleryImages = [mainImageUrl];
    if (tour.gallery && tour.gallery.length > 0) {
        galleryImages = [mainImageUrl, ...tour.gallery.map(img => `${process.env.NEXT_PUBLIC_API_URL}/static/${img}`)];
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => prev === galleryImages.length - 1 ? 0 : prev + 1);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => prev === 0 ? galleryImages.length - 1 : prev - 1);
    };

    return (
        <main className="min-h-screen bg-white pt-20">
            <Header />

            {/* STEPPER */}
            <div className="bg-white py-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-800 text-gray-900 bg-gray-50 flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-gray-100">1</div>
                            <span className="text-sm font-bold text-gray-900 hidden sm:block">Tur Seçimi</span>
                        </div>
                        <div className="w-12 sm:w-24 h-[1px] bg-gray-200"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 bg-white flex items-center justify-center font-medium text-sm">2</div>
                            <span className="text-sm font-medium text-gray-400 hidden sm:block">Katılımcı Bilgileri & Ödeme</span>
                        </div>
                        <div className="w-12 sm:w-24 h-[1px] bg-gray-100"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-100 text-gray-300 bg-white flex items-center justify-center font-medium text-sm">3</div>
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">Onay</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* TITLE */}
                <h1 className="text-3xl md:text-[42px] font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
                    {tour.title_tr}
                </h1>

                {/* INFO BANNER */}
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center gap-8 border border-gray-100">
                    <div className="flex items-start gap-5 min-w-[280px]">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                            <Clock className="w-6 h-6 text-[#e63946]" />
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between gap-8 mb-2">
                                <span className="text-sm font-medium text-gray-500">Başlangıç</span>
                                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-100">{tour.start_time || '09:00'}</span>
                            </div>
                            <div className="flex justify-between gap-8">
                                <span className="text-sm font-medium text-gray-500">Bitiş</span>
                                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-100">{tour.end_time || '17:00'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden md:block w-[1px] h-16 bg-gray-200"></div>

                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                            <Map className="w-6 h-6 text-[#0a192f]" />
                        </div>
                        <p className="text-base text-gray-600 leading-relaxed font-medium">
                            {tour.overview_tr || tour.description_tr || "İstanbul'un tarihi ve kültürel zenginliklerini VIP araçlarımızla keşfetmeye hazır olun!"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* LEFT - IMAGE GALLERY & DETAILS */}
                    <div className="flex-1 order-2 lg:order-1 space-y-12">
                        {/* Gallery */}
                        <div className="space-y-4">
                            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 shadow-sm group">
                                <img 
                                    src={galleryImages[currentImageIndex]} 
                                    alt={tour.title_tr} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                
                                {galleryImages.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-gray-900 hover:bg-white hover:text-black transition-all border border-white/50 shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-gray-900 hover:bg-white hover:text-black transition-all border border-white/50 shadow-lg opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                                            <ChevronRightIcon className="w-6 h-6" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {galleryImages.length > 1 && (
                                <div className="grid grid-cols-5 gap-3">
                                    {galleryImages.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`rounded-xl overflow-hidden aspect-[4/3] border-[3px] transition-all duration-300 ${currentImageIndex === idx ? 'border-[#0a192f] shadow-md' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* DETAILED SECTIONS */}
                        <div className="space-y-16 border-t border-gray-100 pt-12 mb-16">
                            
                            {/* Genel Bakış */}
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                                <div className="w-full md:w-1/4 flex items-center gap-4 text-[#e63946]">
                                    <Heart className="w-6 h-6" />
                                    <h3 className="text-xl font-bold text-gray-900">Genel Bakış</h3>
                                </div>
                                <div className="w-full md:w-3/4">
                                    <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                                        {tour.description_tr || tour.overview_tr || 'Admin panelinden bu tur için "Detaylı Açıklama" eklendiğinde burada görünecektir.'}
                                    </p>
                                </div>
                            </div>

                            {/* Tur Programı */}
                            <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-6 md:gap-12">
                                <div className="w-full md:w-1/4 flex items-center gap-4 text-[#0a192f]">
                                    <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                                        <div className="w-full h-[3px] bg-current rounded-full"></div>
                                        <div className="w-3/4 h-[3px] bg-current rounded-full"></div>
                                        <div className="w-full h-[3px] bg-current rounded-full"></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Tur Programı</h3>
                                </div>
                                <div className="w-full md:w-3/4 space-y-4 text-base text-gray-600">
                                    {(tour.program_tr || 'Aşağıda detayları yazılı olan tur programını tamamlamak için araç ve şoför sağlıyoruz.').split('\n').map((line, idx) => {
                                        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                                            return (
                                                <div key={idx} className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
                                                    <div className="w-2 h-2 rounded-full bg-[#e63946] mt-2 flex-shrink-0"></div>
                                                    <span className="leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s*/, '').replace(/\((.*?)\)/g, '<span class="text-gray-400 font-normal">($1)</span>') }} />
                                                </div>
                                            );
                                        } else if (line.trim() !== '') {
                                            return <p key={idx} className="leading-relaxed whitespace-pre-line">{line}</p>;
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>

                            {/* Dahil Olanlar */}
                            <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-6 md:gap-12">
                                <div className="w-full md:w-1/4 flex items-center gap-4 text-green-600">
                                    <Check className="w-6 h-6" />
                                    <h3 className="text-xl font-bold text-gray-900">Dahil Olanlar</h3>
                                </div>
                                <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    {(tour.included_tr || 'Vito veya VW marka konforlu araç\nProfesyonel şoför hizmeti\nAraçtaki kişi sayısı kadar ücretsiz su ikramı').split('\n').filter(l => l.trim()).map((line, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-green-50/50 p-3 rounded-lg border border-green-100">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="font-medium text-gray-700">{line.replace(/^[-*+]\s*/, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hariç Olanlar */}
                            <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-6 md:gap-12">
                                <div className="w-full md:w-1/4 flex items-center gap-4 text-gray-400">
                                    <Minus className="w-6 h-6" />
                                    <h3 className="text-xl font-bold text-gray-900">Hariç Olanlar</h3>
                                </div>
                                <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                                    {(tour.excluded_tr || 'Lisanslı tur rehberi (isteğe bağlı)\nMüze ve ören yeri giriş ücretleri\nTüm yemek, içecek ve kişisel harcamalar').split('\n').filter(l => l.trim()).map((line, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3">
                                            <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            <span className="line-through decoration-gray-300">{line.replace(/^[-*+]\s*/, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Önemli Notlar */}
                            <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-6 md:gap-12">
                                <div className="w-full md:w-1/4 flex items-center gap-4 text-amber-500">
                                    <Star className="w-6 h-6" />
                                    <h3 className="text-xl font-bold text-gray-900">Önemli Notlar</h3>
                                </div>
                                <div className="w-full md:w-3/4 space-y-4 text-base text-gray-600">
                                    {(tour.notes_tr || 'Tur, 8 saatlik şoför ve araç hizmeti içermektedir.\nUygun kıyafetlerle dini mekanlar ziyaret edilmelidir.\nEkstra süre talep edilmesi durumunda ek ücret uygulanır.').split('\n').filter(l => l.trim()).map((line, idx) => (
                                        <div key={idx} className="flex items-start gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-amber-600 font-black text-sm">!</span>
                                            </div>
                                            <span className="leading-relaxed font-medium text-gray-700">{line.replace(/^[-*+!]\s*/, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - BOOKING CARD */}
                    <div className="w-full lg:w-[400px] flex-shrink-0 order-1 lg:order-2">
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sticky top-28">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                                Katılımcıları ve Tarihi Seçin
                            </h3>

                            {/* Participants */}
                            <div className="space-y-4 mb-8">
                                {/* Adult */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Yetişkin</div>
                                        <div className="text-xs text-gray-500">13 yaş ve üzeri</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setAdultCount(Math.max(1, adultCount - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-colors shadow-sm">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-4 text-center font-bold text-base">{adultCount}</span>
                                            <button onClick={() => setAdultCount(adultCount + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-colors shadow-sm">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Child */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Çocuk</div>
                                        <div className="text-xs text-gray-500">4-9 yaş arası</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setChildCount(Math.max(0, childCount - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-colors shadow-sm">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-4 text-center font-bold text-base">{childCount}</span>
                                            <button onClick={() => setChildCount(childCount + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-colors shadow-sm">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Baby */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Bebek</div>
                                        <div className="text-xs text-gray-500">4 yaş öncesi</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setBabyCount(Math.max(0, babyCount - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-colors shadow-sm">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-4 text-center font-bold text-base">{babyCount}</span>
                                            <button onClick={() => setBabyCount(babyCount + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-colors shadow-sm">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Currency Selector */}
                            <div className="flex gap-2 mb-6">
                                {(['try', 'eur', 'usd', 'gbp'] as const).map((curr) => (
                                    <button
                                        key={curr}
                                        onClick={() => setSelectedCurrency(curr)}
                                        className={`flex-1 py-2.5 rounded-lg border text-sm font-bold transition-all relative ${
                                            selectedCurrency === curr 
                                            ? 'border-gray-900 text-white bg-gray-900 shadow-md' 
                                            : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {currencySymbols[curr]}
                                    </button>
                                ))}
                            </div>

                            {/* Date Picker */}
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                minDate={new Date()}
                                locale={tr}
                                popperPlacement="top-start"
                                shouldCloseOnSelect={true}
                                customInput={<CustomDateInput selectedDate={selectedDate} />}
                                required
                            />

                            {/* Total Area */}
                            <div className="flex justify-between items-end p-4 bg-green-50 rounded-xl border border-green-100 mb-6 mt-4">
                                <span className="font-bold text-gray-700 text-sm">Toplam Tutar</span>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-green-600 mr-1">{currencySymbols[selectedCurrency]}</span>
                                    <span className="text-3xl font-black text-green-600 tracking-tight">
                                        {formatPrice(calculateTotal())}
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => {
                                if (!selectedDate) {
                                    alert('Lütfen bir tarih seçiniz.');
                                    return;
                                }
                                const payload = {
                                    tourId: tour.id,
                                    tourName: tour.title_tr,
                                    date: format(selectedDate, 'dd MMMM yyyy', { locale: tr }),
                                    rawDate: selectedDate.toISOString(),
                                    adultCount,
                                    childCount,
                                    babyCount,
                                    passengers: adultCount + childCount + babyCount,
                                    totalPrice: calculateTotal(),
                                    currency: selectedCurrency,
                                    image_url: mainImageUrl
                                };
                                localStorage.setItem('pendingTourBooking', JSON.stringify(payload));
                                router.push(`/turlar/${tour.id}/checkout`);
                            }} className="w-full bg-[#0a192f] hover:bg-[#B58A32] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(10,25,47,0.39)] hover:shadow-[0_6px_20px_rgba(181,138,50,0.23)] hover:-translate-y-0.5">
                                REZERVASYON YAP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* WhatsApp Floating Button */}
            <a 
                href="https://wa.me/905418630498" 
                target="_blank" 
                rel="noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-[#128C7E] transition-all z-50 hover:-translate-y-1"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"></path>
                </svg>
                WhatsApp
            </a>

            {/* Scroll to Top Button */}
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed right-6 bg-[#dc2626] text-white p-3 rounded-xl shadow-lg hover:bg-[#b91c1c] transition-all duration-300 z-50 hover:-translate-y-1 ${showScroll ? 'bottom-24 opacity-100 translate-y-0' : '-bottom-20 opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </main>
    );
}
