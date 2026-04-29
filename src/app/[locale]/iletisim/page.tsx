'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Phone,
    Mail,
    MapPin,
    Send,
    ChevronRight
} from 'lucide-react';
import Header from '@/components/layout/Header';

export default function IletisimPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            message: ''
        });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Ortak Header */}
            <Header />

            {/* BREADCRUMB */}
            <div className="bg-white border-b border-gray-100">
                <div className="container-custom px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">İletişim</h1>
                        <nav className="flex items-center text-sm text-gray-500">
                            <Link href="/" className="hover:text-[#D32F2F] transition-colors">Anasayfa</Link>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="text-[#D32F2F] font-medium">İletişim</span>
                        </nav>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <section className="py-12 md:py-16">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* LEFT SIDE - CONTACT FORM */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Bizimle İletişime Geçin
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Hızlı bir rota oluşturmanızın en kısa yolundasınız birlikte oluşturacağımız rotaların
                                tadını çıkarmaya hazırlanın. Ayrıca size daha kaliteli hizmet verebilmemiz için tüm
                                görüş ve önerilerinizi aşağıdaki bilgiler ve form ile bizimle iletişime geçebilirsiniz.
                            </p>

                            {/* Success Message */}
                            {submitSuccess && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</span>
                                </div>
                            )}

                            {/* Contact Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all peer"
                                            placeholder=" "
                                        />
                                        <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#D32F2F] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                                            ADINIZ <span className="text-[#D32F2F]">*</span>
                                        </label>
                                    </div>

                                    {/* Last Name */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all peer"
                                            placeholder=" "
                                        />
                                        <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#D32F2F] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                                            SOYADINIZ <span className="text-[#D32F2F]">*</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all peer"
                                            placeholder=" "
                                        />
                                        <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#D32F2F] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                                            TELEFON NUMARASI <span className="text-[#D32F2F]">*</span>
                                        </label>
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all peer"
                                            placeholder=" "
                                        />
                                        <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#D32F2F] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                                            E-POSTA ADRESİNİZ <span className="text-[#D32F2F]">*</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="relative">
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all resize-none peer"
                                        placeholder=" "
                                    />
                                    <label className="absolute left-5 top-4 text-gray-400 text-sm transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#D32F2F] peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                                        MESAJINIZ <span className="text-[#D32F2F]">*</span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-gray-400 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Gönderiliyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            <span>Mesaj Gönder</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT SIDE - AIRPORT IMAGE & INFO */}
                        <div className="space-y-6">
                            {/* Main Airport Image with Branding */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000"
                                    alt="Istanbul Airport Terminal"
                                    className="w-full h-[400px] object-cover"
                                />

                                {/* Overlay with branding */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 text-[#D32F2F]">
                                                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                                    <path d="M20 2L4 12V28L20 38L36 28V12L20 2Z" fill="currentColor" />
                                                    <path d="M20 8L28 18L20 14L12 18L20 8Z" fill="white" />
                                                    <circle cx="20" cy="20" r="4" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-[8px] font-bold tracking-widest text-gray-600">LUXE</div>
                                                <div className="text-sm font-black text-gray-900">TRANSFER</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Number Overlay */}
                                    <div className="absolute bottom-6 right-6 bg-[#D32F2F] text-white px-6 py-3 rounded-xl flex items-center space-x-3">
                                        <Phone className="w-5 h-5" />
                                        <span className="font-bold">+90 (532) 417 8963</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Images */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                                    <img
                                        src="https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=400"
                                        alt="Airport Terminal"
                                        className="w-full h-24 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                                    <img
                                        src="https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=400"
                                        alt="Transfer Vehicle"
                                        className="w-full h-24 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                                    <img
                                        src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=400"
                                        alt="VIP Service"
                                        className="w-full h-24 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>

                            {/* Contact Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">Telefon</h4>
                                    <p className="text-sm text-gray-600">+90 (532) 417 89 63</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">E-Posta</h4>
                                    <p className="text-sm text-gray-600 break-all">info@luxetransfer.com</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">Adres</h4>
                                    <p className="text-sm text-gray-600">Maslak, Şişli / İstanbul</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAP SECTION */}
            <section className="py-12 bg-white">
                <div className="container-custom px-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bizi Ziyaret Edin</h3>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.123456789!2d29.0213!3d41.1089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMaslak!5e0!3m2!1str!2str!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Luxe Transfer Konum"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
