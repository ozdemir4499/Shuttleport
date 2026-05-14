'use client';

import { useState, useEffect } from 'react';
import { Clock, Map, Minus, Plus, Calendar, Check, Star, Heart, ChevronLeft, ChevronRight as ChevronRightIcon, ArrowUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';
import React, { forwardRef } from 'react';

const CustomDateInput = forwardRef<HTMLDivElement, any>(({ onClick, selectedDate }, ref) => {
    const formattedDate = selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: trLocale }).toUpperCase() : '';
    const formattedDay = selectedDate ? format(selectedDate, 'EEEE', { locale: trLocale }).toUpperCase() : '';

    return (
        <div 
            onClick={onClick} 
            ref={ref}
            className="bg-white border border-gray-200 rounded-lg p-3.5 flex items-center gap-3.5 mb-6 cursor-pointer hover:border-gray-300 transition-colors"
        >
            <Calendar className="w-6 h-6 text-black flex-shrink-0" />
            <div className="flex flex-col">
                <span className="text-gray-400 text-xs">Tarih</span>
                {selectedDate ? (
                    <>
                        <span className="font-bold text-gray-900 text-sm leading-tight mt-0.5">{formattedDate}</span>
                        <span className="text-gray-500 text-xs mt-0.5">{formattedDay}</span>
                    </>
                ) : (
                    <span className="font-bold text-gray-900 text-sm mt-0.5">Tarih Seçin</span>
                )}
            </div>
        </div>
    );
});
CustomDateInput.displayName = 'CustomDateInput';

export default function TourDetailClient({ tour }: { tour: any }) {
    const [selectedCurrency, setSelectedCurrency] = useState<'try' | 'eur' | 'usd' | 'gbp'>('try');
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);
    const [babyCount, setBabyCount] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showScroll, setShowScroll] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const handleScroll = () => setShowScroll(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currencySymbols = { try: '₺', eur: '€', usd: '$', gbp: '£' };

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
    
    let galleryImages = [mainImageUrl];
    if (tour.gallery && tour.gallery.length > 0) {
        galleryImages = [mainImageUrl, ...tour.gallery.map((img: string) => `${process.env.NEXT_PUBLIC_API_URL}/static/${img}`)];
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => prev === galleryImages.length - 1 ? 0 : prev + 1);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => prev === 0 ? galleryImages.length - 1 : prev - 1);
    };

    return (
        <>
            <div className="bg-white py-8 border-b border-gray-100">
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
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">Tur Detayları</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                    {tour.title_tr}
                </h1>

                <div className="bg-[#FFF5F5] rounded-lg p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex items-start gap-4 min-w-[250px]">
                        <Clock className="w-6 h-6 text-red-400 mt-1" />
                        <div>
                            <div className="flex justify-between gap-8 mb-1">
                                <span className="text-sm text-gray-600">Tur Başlangıç Saati</span>
                                <span className="font-bold text-gray-900">{tour.start_time || '09:00'}</span>
                            </div>
                            <div className="flex justify-between gap-8">
                                <span className="text-sm text-gray-600">Tur Bitiş Saati</span>
                                <span className="font-bold text-gray-900">{tour.end_time || '17:00'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden md:block w-[1px] h-12 bg-red-200"></div>

                    <div className="flex items-start gap-4">
                        <Map className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {tour.overview_tr || tour.description_tr || "İstanbul'un tarihi ve kültürel zenginliklerini keşfetmeye hazır olun!"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-[#f8f9fa] rounded-xl p-6 border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                Katılımcıları ve Tarihi Seçin
                            </h3>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">Yetişkin</div>
                                        <div className="text-xs text-gray-500">13 yaş ve üzeri</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setAdultCount(Math.max(1, adultCount - 1))} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-red-400 hover:border-red-400">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-4 text-center font-medium text-sm">{adultCount}</span>
                                            <button onClick={() => setAdultCount(adultCount + 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-green-500 hover:border-green-500">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="w-[70px] text-right font-bold text-gray-900">
                                            {currencySymbols[selectedCurrency]}{formatPrice(prices.adult[selectedCurrency] * adultCount)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">Çocuk</div>
                                        <div className="text-xs text-gray-500">4-9 yaş arası</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setChildCount(Math.max(0, childCount - 1))} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-red-400 hover:border-red-400">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-4 text-center font-medium text-sm">{childCount}</span>
                                            <button onClick={() => setChildCount(childCount + 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-green-500 hover:border-green-500">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="w-[70px] text-right font-bold text-gray-900">
                                            {currencySymbols[selectedCurrency]}{formatPrice(prices.child[selectedCurrency] * childCount)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">Bebek</div>
                                        <div className="text-xs text-gray-500">4 yaş öncesi</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setBabyCount(Math.max(0, babyCount - 1))} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-red-400 hover:border-red-400">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-4 text-center font-medium text-sm">{babyCount}</span>
                                            <button onClick={() => setBabyCount(babyCount + 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-green-500 hover:border-green-500">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="w-[70px] text-right font-bold text-gray-900">
                                            {currencySymbols[selectedCurrency]}0
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-8">
                                {(['try', 'eur', 'usd', 'gbp'] as const).map((curr) => (
                                    <button
                                        key={curr}
                                        onClick={() => setSelectedCurrency(curr)}
                                        className={`flex-1 py-2.5 rounded border text-sm font-bold transition-all relative ${
                                            selectedCurrency === curr 
                                            ? 'border-green-500 text-green-600 bg-white shadow-sm' 
                                            : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        {selectedCurrency === curr && (
                                            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                        {currencySymbols[curr]}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center py-4 border-t border-b border-gray-200 mb-6">
                                <span className="font-bold text-gray-800 text-sm">Toplam Tutar</span>
                                <span className="text-2xl font-bold text-green-500">
                                    {currencySymbols[selectedCurrency]}{formatPrice(calculateTotal())}
                                </span>
                            </div>

                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                minDate={new Date()}
                                locale={trLocale}
                                popperPlacement="top-start"
                                shouldCloseOnSelect={true}
                                customInput={<CustomDateInput selectedDate={selectedDate} />}
                                required
                            />

                            <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 rounded-lg uppercase tracking-wide text-sm transition-colors shadow-md">
                                REZERVASYON YAP
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
                            <img 
                                src={galleryImages[currentImageIndex]} 
                                alt={tour.title_tr} 
                                className="w-full h-full object-cover"
                            />
                            
                            {galleryImages.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-colors border border-white/20">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-colors border border-white/20">
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2 md:gap-4">
                                {galleryImages.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`rounded-lg overflow-hidden aspect-[4/3] border-2 transition-all ${currentImageIndex === idx ? 'border-gray-800' : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                <div className="mt-24 space-y-16 border-t border-gray-100 pt-16 mb-32">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                        <div className="w-full md:w-1/4 flex items-center gap-4">
                            <Heart className="w-6 h-6 text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900">Genel Bakış</h3>
                        </div>
                        <div className="w-full md:w-3/4">
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                {tour.description_tr || tour.overview_tr || 'Admin panelinden bu tur için "Detaylı Açıklama" eklendiğinde burada görünecektir.'}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-8 md:gap-12">
                        <div className="w-full md:w-1/4 flex items-center gap-4">
                            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                                <div className="w-full h-0.5 bg-red-500 rounded"></div>
                                <div className="w-full h-0.5 bg-red-500 rounded"></div>
                                <div className="w-full h-0.5 bg-red-500 rounded"></div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Tur Programı</h3>
                        </div>
                        <div className="w-full md:w-3/4 space-y-4 text-sm text-gray-600">
                            {(tour.program_tr || 'Aşağıda detayları yazılı olan tur programını tamamlamak için araç ve şoför sağlıyoruz.').split('\n').map((line: string, idx: number) => {
                                if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                                    return (
                                        <div key={idx} className="flex items-start gap-3 ml-4">
                                            <div className="w-1.5 h-1.5 rounded-full border border-gray-400 mt-1.5 flex-shrink-0"></div>
                                            <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s*/, '').replace(/\((.*?)\)/g, '<span class="text-gray-400">($1)</span>') }} />
                                        </div>
                                    );
                                } else if (line.trim() !== '') {
                                    return <p key={idx} className="leading-relaxed whitespace-pre-line">{line}</p>;
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-8 md:gap-12">
                        <div className="w-full md:w-1/4 flex items-center gap-4">
                            <Check className="w-6 h-6 text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900">Dahil Olanlar</h3>
                        </div>
                        <div className="w-full md:w-3/4 space-y-3 text-sm text-gray-600">
                            {(tour.included_tr || 'Vito veya VW marka konforlu araç\nProfesyonel şoför hizmeti\nAraçtaki kişi sayısı kadar ücretsiz su ikramı').split('\n').filter((l: string) => l.trim()).map((line: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <Plus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="leading-relaxed">{line.replace(/^[-*+]\s*/, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-8 md:gap-12">
                        <div className="w-full md:w-1/4 flex items-center gap-4">
                            <Minus className="w-6 h-6 text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900">Hariç Olanlar</h3>
                        </div>
                        <div className="w-full md:w-3/4 space-y-3 text-sm text-gray-600">
                            {(tour.excluded_tr || 'Lisanslı tur rehberi (isteğe bağlı, ek ücretli)\nMüze ve ören yeri giriş ücretleri\nTüm yemek, içecek ve kişisel harcamalar').split('\n').filter((l: string) => l.trim()).map((line: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <Minus className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span className="leading-relaxed">{line.replace(/^[-*+]\s*/, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row gap-8 md:gap-12">
                        <div className="w-full md:w-1/4 flex items-center gap-4">
                            <Star className="w-6 h-6 text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900">Önemli Notlar</h3>
                        </div>
                        <div className="w-full md:w-3/4 space-y-3 text-sm text-gray-600">
                            {(tour.notes_tr || 'Tur, 8 saatlik şoför ve araç hizmeti içermektedir.\nUygun kıyafetlerle dini mekanlar ziyaret edilmelidir.\nEkstra süre talep edilmesi durumunda ek ücret uygulanır.').split('\n').filter((l: string) => l.trim()).map((line: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">!</span>
                                    <span className="leading-relaxed">{line.replace(/^[-*+!]\s*/, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            
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

            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed right-6 bg-[#dc2626] text-white p-3 rounded-xl shadow-lg hover:bg-[#b91c1c] transition-all duration-300 z-50 hover:-translate-y-1 ${showScroll ? 'bottom-24 opacity-100 translate-y-0' : '-bottom-20 opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </>
    );
}
