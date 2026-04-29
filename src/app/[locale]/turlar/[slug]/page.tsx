'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
    ChevronRight,
    Clock,
    MapPin,
    Heart,
    Check,
    X,
    Star,
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { getTourBySlug, Tour } from '@/data/tours';

export default function TurDetayPage() {
    const params = useParams();
    const slug = params.slug as string;
    const tour = getTourBySlug(slug);

    const [selectedCurrency, setSelectedCurrency] = useState<'try' | 'eur' | 'usd' | 'gbp'>('try');
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);
    const [babyCount, setBabyCount] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(1);

    if (!tour) {
        notFound();
    }

    const currencySymbols = { try: '₺', eur: '€', usd: '$', gbp: '£' };

    const calculateTotal = () => {
        const adultPrice = tour.prices.adult[selectedCurrency] * adultCount;
        const childPrice = tour.prices.child[selectedCurrency] * childCount;
        const babyPrice = tour.prices.baby[selectedCurrency] * babyCount;
        return adultPrice + childPrice + babyPrice;
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('tr-TR');
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === tour.gallery.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? tour.gallery.length - 1 : prev - 1
        );
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* STEPPER */}
            <div className="bg-white border-b border-gray-100 py-6">
                <div className="container-custom px-4">
                    <div className="flex items-center justify-center space-x-4 md:space-x-12">
                        {/* Step 1 */}
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 1 ? 'bg-[#D32F2F] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                1
                            </div>
                            <span className={`hidden md:block text-sm font-medium ${activeStep >= 1 ? 'text-[#D32F2F]' : 'text-gray-500'}`}>
                                Tur Seçimi
                            </span>
                        </div>
                        <div className="w-12 md:w-24 h-0.5 bg-gray-200">
                            <div className={`h-full transition-all ${activeStep >= 2 ? 'bg-[#D32F2F] w-full' : 'w-0'}`}></div>
                        </div>
                        {/* Step 2 */}
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 2 ? 'bg-[#D32F2F] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                2
                            </div>
                            <span className={`hidden md:block text-sm font-medium ${activeStep >= 2 ? 'text-[#D32F2F]' : 'text-gray-500'}`}>
                                Katılımcı Bilgileri & Ödeme
                            </span>
                        </div>
                        <div className="w-12 md:w-24 h-0.5 bg-gray-200">
                            <div className={`h-full transition-all ${activeStep >= 3 ? 'bg-[#D32F2F] w-full' : 'w-0'}`}></div>
                        </div>
                        {/* Step 3 */}
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep >= 3 ? 'bg-[#D32F2F] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                3
                            </div>
                            <span className={`hidden md:block text-sm font-medium ${activeStep >= 3 ? 'text-[#D32F2F]' : 'text-gray-500'}`}>
                                Tur Detayları
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOUR HEADER */}
            <section className="bg-white border-b border-gray-100 py-6">
                <div className="container-custom px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#D32F2F] mb-4">
                        {tour.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-5 h-5 text-[#D32F2F]" />
                            <div>
                                <div className="text-sm text-gray-500">Tur Başlangıç Saati</div>
                                <div className="font-bold">{tour.startTime}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-5 h-5 text-[#D32F2F]" />
                            <div>
                                <div className="text-sm text-gray-500">Tur Bitiş Saati</div>
                                <div className="font-bold">{tour.endTime}</div>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-[#D32F2F]" />
                            <span className="font-bold text-[#D32F2F]">{tour.location}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-8 md:py-12">
                <div className="container-custom px-4">
                    {/* Mobile Layout: Image First, Then Booking Card */}
                    <div className="lg:hidden space-y-6">
                        {/* Image Gallery - Mobile */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            <div className="relative h-[280px]">
                                <img
                                    src={tour.gallery[currentImageIndex]}
                                    alt={tour.title}
                                    className="w-full h-full object-cover"
                                />
                                {tour.badge && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-black shadow-lg">
                                        {tour.badge}
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                >
                                    <ChevronRightIcon className="w-6 h-6 text-gray-800" />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 p-4 bg-white overflow-x-auto">
                                {tour.gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[#D32F2F]' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Booking Card - Mobile */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                Katılımcıları ve Tarihi Seçin
                            </h3>

                            {/* Participant Selection */}
                            <div className="space-y-4 mb-6">
                                {/* Adult */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <div className="font-bold text-gray-900">Yetişkin</div>
                                        <div className="text-xs text-gray-500">13 yaş ve üzeri</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-bold">{adultCount}</span>
                                        <button
                                            onClick={() => setAdultCount(adultCount + 1)}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <span className="font-bold text-[#D32F2F]">
                                            {currencySymbols[selectedCurrency]}{formatPrice(tour.prices.adult[selectedCurrency] * adultCount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Child */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <div className="font-bold text-gray-900">Çocuk</div>
                                        <div className="text-xs text-gray-500">4-9 yaş arası</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setChildCount(Math.max(0, childCount - 1))}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-bold">{childCount}</span>
                                        <button
                                            onClick={() => setChildCount(childCount + 1)}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <span className="font-bold">
                                            {currencySymbols[selectedCurrency]}{formatPrice(tour.prices.child[selectedCurrency] * childCount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Baby */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <div className="font-bold text-gray-900">Bebek</div>
                                        <div className="text-xs text-gray-500">4 yaş öncesi</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setBabyCount(Math.max(0, babyCount - 1))}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-bold">{babyCount}</span>
                                        <button
                                            onClick={() => setBabyCount(babyCount + 1)}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <span className="font-bold">
                                            {currencySymbols[selectedCurrency]}0
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Currency Selection */}
                            <div className="flex items-center space-x-2 mb-6">
                                {(['try', 'eur', 'usd', 'gbp'] as const).map((currency) => (
                                    <button
                                        key={currency}
                                        onClick={() => setSelectedCurrency(currency)}
                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-bold transition-all ${selectedCurrency === currency
                                            ? 'bg-green-50 border-green-500 text-green-600'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                            }`}
                                    >
                                        {currencySymbols[currency]}
                                    </button>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between py-4 border-t border-gray-200 mb-6">
                                <span className="font-bold text-gray-900">Toplam Tutar</span>
                                <span className="text-2xl font-black text-green-600">
                                    {currencySymbols[selectedCurrency]}{formatPrice(calculateTotal())}
                                </span>
                            </div>

                            {/* Book Button */}
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wide">
                                Rezervasyon Yap
                            </button>
                        </div>

                        {/* Tour Details - Mobile */}
                        <div className="space-y-6">
                            {/* Overview */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Heart className="w-6 h-6 text-[#D32F2F]" />
                                    <h3 className="text-xl font-bold text-gray-900">Genel Bakış</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {tour.overview}
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    {tour.detailedDescription}
                                </p>
                            </div>

                            {/* Program */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-6 h-6 flex flex-col justify-center space-y-0.5">
                                        <div className="w-full h-1 bg-[#D32F2F] rounded"></div>
                                        <div className="w-full h-1 bg-[#D32F2F] rounded"></div>
                                        <div className="w-full h-1 bg-[#D32F2F] rounded"></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Tur Programı</h3>
                                </div>

                                <div className="space-y-6">
                                    {tour.program.map((section, idx) => (
                                        <div key={idx}>
                                            <h4 className="font-bold text-[#D32F2F] mb-3">{section.title}</h4>
                                            <ul className="space-y-2">
                                                {section.items.map((item, i) => (
                                                    <li key={i} className="flex items-start space-x-3 text-gray-600">
                                                        <span className="text-gray-400">—</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Included */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Check className="w-6 h-6 text-green-500" />
                                    <h3 className="text-xl font-bold text-gray-900">Dahil Olanlar</h3>
                                </div>
                                <ul className="space-y-2">
                                    {tour.included.map((item, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <Plus className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Excluded */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <X className="w-6 h-6 text-red-500" />
                                    <h3 className="text-xl font-bold text-gray-900">Hariç Olanlar</h3>
                                </div>
                                <ul className="space-y-2">
                                    {tour.excluded.map((item, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <Minus className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Important Notes */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Star className="w-6 h-6 text-yellow-500" />
                                    <h3 className="text-xl font-bold text-gray-900">Önemli Notlar</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {tour.importantNotes.join(' ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout: Side by Side */}
                    <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT - BOOKING CARD */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">
                                    Katılımcıları ve Tarihi Seçin
                                </h3>

                                {/* Participant Selection */}
                                <div className="space-y-4 mb-6">
                                    {/* Adult */}
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <div className="font-bold text-gray-900">Yetişkin</div>
                                            <div className="text-xs text-gray-500">13 yaş ve üzeri</div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold">{adultCount}</span>
                                            <button
                                                onClick={() => setAdultCount(adultCount + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <span className="font-bold text-[#D32F2F]">
                                                {currencySymbols[selectedCurrency]}{formatPrice(tour.prices.adult[selectedCurrency] * adultCount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Child */}
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <div className="font-bold text-gray-900">Çocuk</div>
                                            <div className="text-xs text-gray-500">4-9 yaş arası</div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setChildCount(Math.max(0, childCount - 1))}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold">{childCount}</span>
                                            <button
                                                onClick={() => setChildCount(childCount + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <span className="font-bold">
                                                {currencySymbols[selectedCurrency]}{formatPrice(tour.prices.child[selectedCurrency] * childCount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Baby */}
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <div className="font-bold text-gray-900">Bebek</div>
                                            <div className="text-xs text-gray-500">4 yaş öncesi</div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setBabyCount(Math.max(0, babyCount - 1))}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold">{babyCount}</span>
                                            <button
                                                onClick={() => setBabyCount(babyCount + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#D32F2F] hover:text-[#D32F2F] transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <span className="font-bold">
                                                {currencySymbols[selectedCurrency]}0
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Currency Selection */}
                                <div className="flex items-center space-x-2 mb-6">
                                    {(['try', 'eur', 'usd', 'gbp'] as const).map((currency) => (
                                        <button
                                            key={currency}
                                            onClick={() => setSelectedCurrency(currency)}
                                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-bold transition-all ${selectedCurrency === currency
                                                ? 'bg-green-50 border-green-500 text-green-600'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                }`}
                                        >
                                            {currencySymbols[currency]}
                                        </button>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between py-4 border-t border-gray-200 mb-6">
                                    <span className="font-bold text-gray-900">Toplam Tutar</span>
                                    <span className="text-2xl font-black text-green-600">
                                        {currencySymbols[selectedCurrency]}{formatPrice(calculateTotal())}
                                    </span>
                                </div>

                                {/* Book Button */}
                                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wide">
                                    Rezervasyon Yap
                                </button>
                            </div>
                        </div>

                        {/* RIGHT - TOUR DETAILS */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Image Gallery */}
                            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                <div className="relative h-[300px] md:h-[450px]">
                                    <img
                                        src={tour.gallery[currentImageIndex]}
                                        alt={tour.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {tour.badge && (
                                        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-black shadow-lg">
                                            {tour.badge}
                                        </div>
                                    )}

                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                    >
                                        <ChevronRightIcon className="w-6 h-6 text-gray-800" />
                                    </button>
                                </div>

                                {/* Thumbnails */}
                                <div className="flex gap-2 p-4 bg-white overflow-x-auto">
                                    {tour.gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[#D32F2F]' : 'border-transparent'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Overview */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Heart className="w-6 h-6 text-[#D32F2F]" />
                                    <h3 className="text-xl font-bold text-gray-900">Genel Bakış</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {tour.overview}
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    {tour.detailedDescription}
                                </p>
                            </div>

                            {/* Program */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-6 h-6 flex flex-col justify-center space-y-0.5">
                                        <div className="w-full h-1 bg-[#D32F2F] rounded"></div>
                                        <div className="w-full h-1 bg-[#D32F2F] rounded"></div>
                                        <div className="w-full h-1 bg-[#D32F2F] rounded"></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Tur Programı</h3>
                                </div>

                                <div className="space-y-6">
                                    {tour.program.map((section, idx) => (
                                        <div key={idx}>
                                            <h4 className="font-bold text-[#D32F2F] mb-3">{section.title}</h4>
                                            <ul className="space-y-2">
                                                {section.items.map((item, i) => (
                                                    <li key={i} className="flex items-start space-x-3 text-gray-600">
                                                        <span className="text-gray-400">—</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Included */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Check className="w-6 h-6 text-green-500" />
                                    <h3 className="text-xl font-bold text-gray-900">Dahil Olanlar</h3>
                                </div>
                                <ul className="space-y-2">
                                    {tour.included.map((item, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <Plus className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Excluded */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <X className="w-6 h-6 text-red-500" />
                                    <h3 className="text-xl font-bold text-gray-900">Hariç Olanlar</h3>
                                </div>
                                <ul className="space-y-2">
                                    {tour.excluded.map((item, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <Minus className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Important Notes */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Star className="w-6 h-6 text-yellow-500" />
                                    <h3 className="text-xl font-bold text-gray-900">Önemli Notlar</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {tour.importantNotes.join(' ')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
