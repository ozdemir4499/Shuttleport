'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import { tours } from '@/data/tours';

type CurrencyType = 'try' | 'eur' | 'usd' | 'gbp';

export default function TurlarPage() {
    const [selectedCurrencies, setSelectedCurrencies] = useState<Record<string, CurrencyType>>({});
    const [dynamicTours, setDynamicTours] = useState<any[]>(tours);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours`);
                const data = await response.json();
                if (data && data.length > 0) {
                    const mappedTours = data.map((t: any) => ({
                        id: t.id,
                        slug: t.slug,
                        title: t.title_tr,
                        shortTitle: t.title_tr,
                        image: t.image_url ? `${process.env.NEXT_PUBLIC_API_URL}/static/${t.image_url}` : 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
                        badge: t.badge_tr,
                        duration: 'Belirtilmedi',
                        groupSize: 'Belirtilmedi',
                        date: 'Her Gün',
                        prices: { adult: { try: t.price, eur: t.price / 35, usd: t.price / 32, gbp: t.price / 40 } },
                        oldPrices: { adult: { try: t.price * 1.2, eur: (t.price * 1.2) / 35, usd: (t.price * 1.2) / 32, gbp: (t.price * 1.2) / 40 } }
                    }));
                    setDynamicTours(mappedTours);
                }
            } catch (error) {
                console.error('Failed to fetch tours:', error);
            }
        };
        fetchTours();
    }, []);

    const currencySymbols: Record<CurrencyType, string> = { try: '₺', eur: '€', usd: '$', gbp: '£' };

    const formatPrice = (price: number) => {
        return price.toLocaleString('tr-TR');
    };

    return (
        <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
            {/* Ortak Header */}
            <Header />

            {/* BREADCRUMB */}
            <div className="hidden md:block bg-white border-b border-gray-100">
                <div className="container-custom px-4 py-2 md:py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg md:text-2xl font-bold text-gray-900">Tur Gezisi</h1>
                        <nav className="flex items-center text-xs md:text-sm text-gray-500">
                            <Link href="/" className="hover:text-[#0a192f] transition-colors">Anasayfa</Link>
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-1 md:mx-2" />
                            <span className="text-[#0a192f] font-medium">Tur Gezisi</span>
                        </nav>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <section className="pt-2 pb-6 md:py-16">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-12 gap-4 lg:gap-12">

                        {/* LEFT SIDE - Intro Text */}
                        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                            <div className="lg:sticky lg:top-32">
                                <h2 className="text-xl md:text-4xl font-bold text-gray-900 leading-snug mb-2 md:mb-6">
                                    Eşsiz Bir Tur Deneyimine Ne Dersiniz?
                                </h2>
                                <p className="text-[#0a192f] text-[13px] md:text-base leading-relaxed mb-4 md:mb-8">
                                    Özenle seçilmiş büyüleyici rotalar ve kişiye özel kusursuz detaylarla donatılmış turlarımızda, ömür boyu unutamayacağınız anılar biriktirmeye hazır olun.
                                </p>

                                {/* Filter Options */}
                                <div className="hidden md:block space-y-4 mb-8">
                                    <h3 className="font-bold text-gray-900">Kategoriler</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="px-4 py-2 bg-[#0a192f] text-white rounded-lg text-sm font-bold">Tümü</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#0a192f] hover:text-[#0a192f] transition-colors">VIP</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#0a192f] hover:text-[#0a192f] transition-colors">Günübirlik</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#0a192f] hover:text-[#0a192f] transition-colors">Kültür</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#0a192f] hover:text-[#0a192f] transition-colors">Deniz</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - Tour Cards Grid */}
                        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {dynamicTours.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-[160px] md:h-[200px] overflow-hidden">
                                            <img
                                                src={tour.image}
                                                alt={tour.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {tour.badge && (
                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-lg text-xs md:text-sm font-black shadow-lg">
                                                    {tour.badge}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 md:p-6">
                                            <h3 className="text-gray-900 text-[15px] md:text-base font-bold leading-snug mb-3 md:mb-4 min-h-[44px] md:min-h-[56px] line-clamp-2">
                                                {tour.title}
                                            </h3>

                                            {/* Tour Info */}
                                            <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 text-[12px] md:text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{tour.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{tour.groupSize}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{tour.date}</span>
                                                </div>
                                            </div>

                                            {/* Prices */}
                                            <div className="flex items-center gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 custom-scrollbar">
                                                {(['try', 'eur', 'usd', 'gbp'] as CurrencyType[]).map((curr) => {
                                                    const cardCurrency = selectedCurrencies[tour.id] || 'try';
                                                    const isSelected = cardCurrency === curr;
                                                    // @ts-ignore
                                                    const adultPrice = tour.prices.adult[curr];
                                                    // @ts-ignore
                                                    const oldAdultPrice = tour.oldPrices.adult[curr];
                                                    
                                                    return (
                                                        <button 
                                                            key={curr}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedCurrencies(prev => ({ ...prev, [tour.id]: curr }));
                                                            }}
                                                            className={`flex-shrink-0 border rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-center transition-colors cursor-pointer ${
                                                                isSelected 
                                                                ? 'bg-green-50 border-green-200' 
                                                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <div className={`font-bold text-[13px] md:text-sm ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                                                                {formatPrice(adultPrice)}{currencySymbols[curr]}
                                                            </div>
                                                            <div className="text-gray-400 text-[10px] md:text-xs line-through">
                                                                {formatPrice(oldAdultPrice)}{currencySymbols[curr]}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* CTA Button */}
                                            <Link
                                                href={`/turlar/${tour.id}`}
                                                className="flex items-center justify-center gap-2 w-full bg-[#0a192f] hover:bg-[#B58A32] text-white font-bold py-2 md:py-3 px-6 rounded-xl transition-all group/btn"
                                            >
                                                <span>Tur Detayları</span>
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            <div className="text-center mt-12">
                                <button className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#0a192f] text-gray-900 hover:text-[#0a192f] font-bold py-4 px-8 rounded-xl transition-all">
                                    <span>Daha Fazla Tur Göster</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
