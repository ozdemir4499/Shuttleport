'use client';

import Link from 'next/link';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <img 
                                    src="/logo_transparent.png" 
                                    alt="Lion Icon" 
                                    className="w-full h-full object-contain scale-110"
                                />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Aramıza Katılın</h2>
                        <p className="text-sm text-gray-500 font-medium">RidePortX ayrıcalıklarından yararlanmak için hemen hesap oluşturun.</p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            
                            {/* Name & Surname Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 block">Ad</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f] focus:bg-white transition-all sm:text-sm font-medium"
                                            placeholder="Adınız"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 block">Soyad</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f] focus:bg-white transition-all sm:text-sm font-medium"
                                            placeholder="Soyadınız"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 block">E-posta</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f] focus:bg-white transition-all sm:text-sm font-medium"
                                        placeholder="ornek@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 block">Telefon</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f] focus:bg-white transition-all sm:text-sm font-medium"
                                        placeholder="+90 (555) 000 00 00"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 block">Şifre</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a192f] focus:bg-white transition-all sm:text-sm font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-start pt-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#0a192f] focus:ring-[#0a192f] border-gray-300 rounded cursor-pointer"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-600 cursor-pointer">
                                        <a href="#" className="text-[#0a192f] hover:underline">Kullanım Koşulları</a> ve <a href="#" className="text-[#0a192f] hover:underline">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0a192f] hover:bg-[#B58A32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a192f] transition-all mt-6 group"
                            >
                                Üye Ol
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 text-center text-sm">
                            <span className="text-gray-500 font-medium">Zaten üye misiniz? </span>
                            <Link href="#" className="font-bold text-gray-900 hover:text-[#0a192f] transition-colors">
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
