'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Truck, DollarSign, BarChart3, CheckCircle2, Send, Phone, Mail, ArrowRight, Shield, Clock, Users } from 'lucide-react';

export default function TasiyiciPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        vehicleType: '',
        vehicleCount: '',
        experience: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-[#0a192f] via-[#112a52] to-[#0a192f] overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#B58A32] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[150px]"></div>
                </div>

                <div className="container-custom px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
                            <Truck className="w-4 h-4 text-[#B58A32]" />
                            <span className="text-sm text-white/80">Taşıyıcı İş Ortaklığı</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            İş kabul etmeye <span className="text-[#B58A32]">başlayın.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                            Aracınızı veya şirketinizi kaydettirin ve sonrasında sistemde olan yolculukları kabul ederek para kazanmaya başlayın. <strong className="text-white">Komisyon yok, sistem ödemesi yok, kesinti yok.</strong>
                        </p>
                        <a href="#basvuru-formu" className="inline-flex items-center gap-2 bg-[#B58A32] hover:bg-[#a07a2a] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#B58A32]/20 hover:shadow-[#B58A32]/40">
                            Hemen Başvur
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container-custom px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl md:text-3xl font-black text-[#0a192f] mb-4">Neden RidePortX ile Çalışmalısınız?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Taşıyıcı iş ortaklarımıza sunduğumuz avantajlar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <DollarSign className="w-7 h-7" />,
                                title: 'Net Fiyat, Sıfır Kesinti',
                                description: 'Sistemde gördüğünüz fiyat, doğrudan kazancınızdır. Komisyon veya sistem ücreti yoktur. 2 iş günü içinde ödemeniz yapılır.',
                                color: '#B58A32',
                            },
                            {
                                icon: <BarChart3 className="w-7 h-7" />,
                                title: 'Şeffaf Muhasebe',
                                description: 'Aldığınız işlerin tutarlarını, tahsilatları, firma ödemelerini ve cari bakiyenizi anlık olarak takip edebileceğiniz panel.',
                                color: '#228BE6',
                            },
                            {
                                icon: <Truck className="w-7 h-7" />,
                                title: 'İstediğiniz Kadar İş',
                                description: 'Sisteme girdiğinizde görünen tüm transferleri seçebilir, kabul edebilir veya reddedebilirsiniz. Tamamen esnek çalışma imkanı.',
                                color: '#40C057',
                            },
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#0a192f] mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-custom px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl md:text-3xl font-black text-[#0a192f] mb-4">Nasıl Çalışır?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">4 adımda taşıyıcı iş ortağımız olun</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Formu Doldurun', desc: 'Bilgilerinizi ve araç detaylarınızı girin', icon: <Send className="w-5 h-5" /> },
                            { step: '02', title: 'Onay Alın', desc: 'Ekibimiz başvurunuzu inceleyip onaylasın', icon: <CheckCircle2 className="w-5 h-5" /> },
                            { step: '03', title: 'İş Seçin', desc: 'Panelden uygun transferleri kabul edin', icon: <Users className="w-5 h-5" /> },
                            { step: '04', title: 'Kazanın', desc: 'Transferi tamamlayın, ödemenizi alın', icon: <DollarSign className="w-5 h-5" /> },
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-[#0a192f] hover:text-white transition-all duration-300 group h-full">
                                    <div className="text-3xl font-black text-[#B58A32] mb-3 group-hover:text-[#B58A32]">{item.step}</div>
                                    <div className="w-10 h-10 rounded-full bg-[#0a192f] group-hover:bg-white/20 flex items-center justify-center mx-auto mb-4 text-white">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-[#0a192f] group-hover:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-500 group-hover:text-gray-300">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-12 bg-[#0a192f]">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '500+', label: 'Aktif Taşıyıcı' },
                            { value: '50K+', label: 'Tamamlanan Transfer' },
                            { value: '4.8/5', label: 'Ortalama Puan' },
                            { value: '2 Gün', label: 'Ödeme Süresi' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-2xl md:text-3xl font-black text-[#B58A32]">{stat.value}</div>
                                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section id="basvuru-formu" className="py-16 md:py-24 bg-gray-50">
                <div className="container-custom px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-black text-[#0a192f] mb-4">Başvuru Formu</h2>
                            <p className="text-gray-500">Formu doldurduğunuzda ilgili birimimiz en kısa sürede size geri dönüş sağlayacaktır.</p>
                        </div>

                        {isSubmitted ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0a192f] mb-3">Başvurunuz Alındı!</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    En kısa sürede ekibimiz sizinle iletişime geçecektir. Teşekkür ederiz.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Ad Soyad */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Soyad *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900"
                                            placeholder="Adınız Soyadınız"
                                        />
                                    </div>

                                    {/* Telefon */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900"
                                            placeholder="+90 (5__) ___ __ __"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">E-Posta *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>

                                    {/* Şehir */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Şehir *</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 bg-white"
                                        >
                                            <option value="">Şehir Seçin</option>
                                            <option value="istanbul">İstanbul</option>
                                            <option value="ankara">Ankara</option>
                                            <option value="izmir">İzmir</option>
                                            <option value="antalya">Antalya</option>
                                            <option value="mugla">Muğla</option>
                                            <option value="bursa">Bursa</option>
                                            <option value="diger">Diğer</option>
                                        </select>
                                    </div>

                                    {/* Araç Tipi */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Araç Tipi *</label>
                                        <select
                                            name="vehicleType"
                                            value={formData.vehicleType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 bg-white"
                                        >
                                            <option value="">Araç Tipi Seçin</option>
                                            <option value="sedan">Sedan (1-3 Yolcu)</option>
                                            <option value="vip-sedan">VIP Sedan</option>
                                            <option value="minivan">Minivan (4-6 Yolcu)</option>
                                            <option value="vip-minivan">VIP Minivan</option>
                                            <option value="sprinter">Sprinter (7-14 Yolcu)</option>
                                            <option value="midibus">Midibüs (15-25 Yolcu)</option>
                                            <option value="otobus">Otobüs (26+ Yolcu)</option>
                                        </select>
                                    </div>

                                    {/* Araç Sayısı */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Araç Sayısı</label>
                                        <input
                                            type="number"
                                            name="vehicleCount"
                                            value={formData.vehicleCount}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900"
                                            placeholder="1"
                                        />
                                    </div>
                                </div>

                                {/* Deneyim */}
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deneyim</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 bg-white"
                                    >
                                        <option value="">Transfer deneyiminiz var mı?</option>
                                        <option value="yok">Hayır, yeni başlıyorum</option>
                                        <option value="1-3">1-3 yıl</option>
                                        <option value="3-5">3-5 yıl</option>
                                        <option value="5+">5+ yıl</option>
                                    </select>
                                </div>

                                {/* Mesaj */}
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ek Not</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 resize-none"
                                        placeholder="Eklemek istediğiniz bilgiler..."
                                    ></textarea>
                                </div>

                                {/* Onay Metni */}
                                <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                                    Bu formu doldurarak, RidePortX{' '}
                                    <a href="/kullanim" className="text-[#B58A32] hover:underline">Kullanım Koşulları</a>&apos;nı kabul eder ve{' '}
                                    <a href="/gizlilik" className="text-[#B58A32] hover:underline">Gizlilik Politikası</a>&apos;nı okuduğunuzu onaylarsınız.
                                </p>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-8 bg-[#0a192f] hover:bg-[#112a52] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Başvuruyu Gönder
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Contact Info */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
                            <a href="https://wa.me/905324178963" target="_blank" className="flex items-center gap-2 text-gray-500 hover:text-[#25D366] transition-colors">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-medium">+90 (532) 417 89 63</span>
                            </a>
                            <a href="mailto:info@rideportx.com" className="flex items-center gap-2 text-gray-500 hover:text-[#B58A32] transition-colors">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">info@rideportx.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
