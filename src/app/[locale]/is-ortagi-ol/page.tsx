'use client';

import { useState } from 'react';
import {
    Building2,
    Users,
    TrendingUp,
    Shield,
    Clock,
    Award,
    CheckCircle,
    ArrowRight,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import Header from '@/components/layout/Header';

export default function IsOrtagiOlPage() {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic here
    };

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Gelir Artışı',
            description: 'Kurumsal müşterilerimizle düzenli iş akışı sağlayarak gelirinizi artırın.'
        },
        {
            icon: Users,
            title: 'Geniş Müşteri Ağı',
            description: 'Binlerce aktif kullanıcımız ve kurumsal müşterilerimizle tanışın.'
        },
        {
            icon: Shield,
            title: 'Güvenli Ödeme',
            description: 'Tüm ödemeleriniz zamanında ve güvenli şekilde hesabınıza aktarılır.'
        },
        {
            icon: Clock,
            title: 'Esnek Çalışma',
            description: 'Kendi programınızı oluşturun, istediğiniz zaman çalışın.'
        },
        {
            icon: Award,
            title: 'Profesyonel Destek',
            description: '7/24 teknik ve operasyonel destek ekibimiz yanınızda.'
        },
        {
            icon: Building2,
            title: 'Kurumsal İmaj',
            description: 'Prestijli markamızla birlikte çalışarak kurumsal imajınızı güçlendirin.'
        }
    ];

    const features = [
        'Anlık rezervasyon bildirimleri',
        'Detaylı raporlama ve analiz araçları',
        'Müşteri değerlendirme sistemi',
        'Otomatik rota optimizasyonu',
        'Dijital fatura ve ödeme takibi',
        'Özel indirim ve kampanya fırsatları'
    ];

    const companyName = process.env.NEXT_PUBLIC_SITE_NAME || 'Asitane Travel';
    const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+905324178963';
    const contactPhoneDisplay = process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || '+90 532 417 89 63';
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@asitanetravel.com';
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905324178963';

    return (
        <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0a192f] via-[#C62828] to-[#B58A32] text-white py-20 md:py-28 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>

                <div className="container-custom px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Building2 className="w-5 h-5" />
                                <span className="text-sm font-bold">Kurumsal Ortaklık Programı</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                                İş Ortağımız Olun,<br />
                                <span className="text-white/90">Birlikte Büyüyelim</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                                Transfer sektöründe lider konumumuzla birlikte çalışın.
                                Güçlü altyapımız, geniş müşteri ağımız ve profesyonel
                                ekibimizle kazancınızı artırın.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#basvuru-formu"
                                    className="inline-flex items-center gap-2 bg-white text-[#0a192f] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all group"
                                >
                                    Hemen Başvur
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
                                >
                                    <Phone className="w-5 h-5" />
                                    Bizi Arayın
                                </a>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-200 to-gray-300 aspect-video flex items-center justify-center">
                                <Building2 className="w-32 h-32 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="text-gray-50"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="text-gray-50"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="text-gray-50"></path>
                    </svg>
                </div>

                <style jsx>{`
                    @keyframes fade-in-up {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 1s ease-out forwards;
                    }
                `}</style>
            </section>

            {/* Benefits Section */}
            <section className="py-16 md:py-24">
                <div className="container-custom px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Neden {companyName}?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            İş ortaklarımıza sunduğumuz benzersiz avantajlar ve fırsatlar
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-[#0a192f] to-[#B58A32] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <benefit.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                                Tüm İhtiyaçlarınız<br />Tek Platformda
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Gelişmiş teknoloji altyapımız sayesinde işlerinizi kolayca
                                yönetin. Rezervasyonlardan ödemelere, raporlamadan müşteri
                                ilişkilerine kadar her şey parmaklarınızın ucunda.
                            </p>

                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-blue-100 to-blue-200 aspect-video flex items-center justify-center">
                                <TrendingUp className="w-32 h-32 text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form Section */}
            <section id="basvuru-formu" className="py-16 md:py-24 bg-gray-50">
                <div className="container-custom px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                Başvuru Formu
                            </h2>
                            <p className="text-lg text-gray-600">
                                Formu doldurun, en kısa sürede sizinle iletişime geçelim
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Şirket Adı *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
                                            placeholder="Şirket adınızı girin"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Yetkili Kişi *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.contactPerson}
                                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
                                            placeholder="Adınız ve soyadınız"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Telefon *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
                                            placeholder="+90 5XX XXX XX XX"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            E-posta *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Mesajınız
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Bize kendinizden ve işletmenizden bahsedin..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#0a192f] to-[#B58A32] text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                                >
                                    Başvuruyu Gönder
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <p className="text-sm text-gray-500 text-center">
                                    Başvurunuz en geç 24 saat içinde değerlendirilecektir.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="container-custom px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">
                            Hemen İletişime Geçin
                        </h2>
                        <p className="text-lg text-gray-300">
                            Sorularınız için 7/24 yanınızdayız
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <a
                            href={`tel:${contactPhone}`}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all group"
                        >
                            <Phone className="w-12 h-12 mx-auto mb-4 text-[#0a192f] group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold mb-2">Telefon</h3>
                            <p className="text-gray-300">{contactPhoneDisplay}</p>
                        </a>

                        <a
                            href={`mailto:${contactEmail}`}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all group"
                        >
                            <Mail className="w-12 h-12 mx-auto mb-4 text-[#0a192f] group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold mb-2">E-posta</h3>
                            <p className="text-gray-300">{contactEmail}</p>
                        </a>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                            <MapPin className="w-12 h-12 mx-auto mb-4 text-[#0a192f]" />
                            <h3 className="font-bold mb-2">Adres</h3>
                            <p className="text-gray-300">İstanbul, Türkiye</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
