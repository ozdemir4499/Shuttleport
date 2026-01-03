'use client';

import Link from 'next/link';
import { ChevronRight, ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import { tours } from '@/data/tours';

export default function TurlarPage() {
    const currencySymbols = { try: '₺', eur: '€', usd: '$', gbp: '£' };

    const formatPrice = (price: number) => {
        return price.toLocaleString('tr-TR');
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Ortak Header */}
            <Header />

            {/* BREADCRUMB */}
            <div className="bg-white border-b border-gray-100">
                <div className="container-custom px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Tur Gezisi</h1>
                        <nav className="flex items-center text-sm text-gray-500">
                            <Link href="/" className="hover:text-[#D32F2F] transition-colors">Anasayfa</Link>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="text-[#D32F2F] font-medium">Tur Gezisi</span>
                        </nav>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <section className="py-12 md:py-16">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-12 gap-8 lg:gap-12">

                        {/* LEFT SIDE - Intro Text */}
                        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                            <div className="lg:sticky lg:top-32">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                                    Harika bir tur gezisine ne dersiniz?
                                </h2>
                                <p className="text-[#D32F2F] leading-relaxed mb-8">
                                    Eşsiz rotalar ve kişiye özel maceralarla dolu turlarımızla unutulmaz anılar yaratmaya hazır olun!
                                </p>

                                {/* Filter Options */}
                                <div className="space-y-4 mb-8">
                                    <h3 className="font-bold text-gray-900">Kategoriler</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="px-4 py-2 bg-[#D32F2F] text-white rounded-lg text-sm font-bold">Tümü</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">VIP</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">Günübirlik</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">Kültür</button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors">Deniz</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - Tour Cards Grid */}
                        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tours.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-[200px] overflow-hidden">
                                            <img
                                                src={tour.image}
                                                alt={tour.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {tour.badge && (
                                                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-black shadow-lg">
                                                    {tour.badge}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-gray-900 font-bold leading-snug mb-4 min-h-[56px] line-clamp-2">
                                                {tour.title}
                                            </h3>

                                            {/* Tour Info */}
                                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
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
                                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                                                <div className="flex-shrink-0 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                                                    <div className="text-green-600 font-bold text-sm">{formatPrice(tour.prices.adult.try)}₺</div>
                                                    <div className="text-gray-400 text-xs line-through">{formatPrice(tour.oldPrices.adult.try)}₺</div>
                                                </div>
                                                <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
                                                    <div className="text-gray-900 font-bold text-sm">{tour.prices.adult.eur}€</div>
                                                    <div className="text-gray-400 text-xs line-through">{tour.oldPrices.adult.eur}€</div>
                                                </div>
                                                <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
                                                    <div className="text-gray-900 font-bold text-sm">{tour.prices.adult.usd}$</div>
                                                    <div className="text-gray-400 text-xs line-through">{tour.oldPrices.adult.usd}$</div>
                                                </div>
                                                <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
                                                    <div className="text-gray-900 font-bold text-sm">{tour.prices.adult.gbp}£</div>
                                                    <div className="text-gray-400 text-xs line-through">{tour.oldPrices.adult.gbp}£</div>
                                                </div>
                                            </div>

                                            {/* CTA Button */}
                                            <Link
                                                href={`/turlar/${tour.slug}`}
                                                className="flex items-center justify-center gap-2 w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold py-3 px-6 rounded-xl transition-all group/btn"
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
                                <button className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#D32F2F] text-gray-900 hover:text-[#D32F2F] font-bold py-4 px-8 rounded-xl transition-all">
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
