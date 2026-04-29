'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/layout/Header';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "Rezervasyonumu nasıl iptal edebilirim?",
        answer: "Rezervasyonunuzu iptal etmek için web sitemizden giriş yaparak 'Rezervasyonlarım' bölümünden ilgili rezervasyonu seçip iptal edebilirsiniz. Ayrıca WhatsApp üzerinden +90 532 417 89 63 numaramızdan veya info@luxetransfer.com e-posta adresimizden de iptal işlemlerinizi gerçekleştirebilirsiniz."
    },
    {
        question: "Havalimanı transfer rezervasyonu nasıl yapılır?",
        answer: "Havalimanı transfer rezervasyonunuzu web sitemizden kolayca yapabilirsiniz. Ana sayfada yer alan rezervasyon formunda nereden ve nereye gideceğinizi, tarih ve saat bilgilerinizi girdikten sonra size uygun araç seçeneklerini görebilir ve rezervasyonunuzu tamamlayabilirsiniz. Alternatif olarak WhatsApp hattımızdan da rezervasyon yapabilirsiniz."
    },
    {
        question: "Transfer rezervasyonu yaparken hangi bilgileri paylaşmalıyım?",
        answer: "Transfer rezervasyonu için şu bilgilere ihtiyacımız var: Kalkış ve varış noktaları, transfer tarihi ve saati, yolcu sayısı, uçuş bilgileriniz (havalimanı transferi için), iletişim bilgileriniz (telefon ve e-posta). Özel talepleriniz varsa (bebek koltuğu, bagaj sayısı vb.) bunları da belirtebilirsiniz."
    },
    {
        question: "Uçağım rötar yaparsa transferim iptal olur mu?",
        answer: "Hayır, uçağınız rötar yaparsa transferiniz iptal olmaz. Sürücümüz uçuş takip sistemi ile uçuşunuzu anlık olarak takip eder ve yeni iniş saatinize göre havalimanında sizi bekler. Rötar durumunda ek ücret talep edilmez."
    },
    {
        question: "Transfer aracı beni ne kadar süre bekler?",
        answer: "Havalimanı transferlerinde, uçağınızın inişinden itibaren 60 dakika ücretsiz bekleme süresi sunuyoruz. Bu süre içinde bagajınızı alıp buluşma noktasına rahatlıkla gelebilirsiniz. Şehir içi transferlerde ise belirlenen saatte 15 dakika ücretsiz bekleme süresi mevcuttur."
    },
    {
        question: "Havalimanı buluşma noktasında şoförü nasıl bulacağım?",
        answer: "İstanbul Havalimanı'nda sürücümüz, gelen yolcu katında bulunan karşılama noktasında sizin adınızı yazan tabelayla sizi bekleyecektir. Sabiha Gökçen Havalimanı'nda ise yine gelen yolcu katı çıkışında karşılama noktasında tabelayla bekleyecektir. Rezervasyon sonrası size gönderilen SMS'te sürücünüzün telefon numarası da yer alacaktır."
    },
    {
        question: "Havalimanı transfer aracını havalimanında nasıl bulacağım?",
        answer: "Havalimanına vardığınızda, bagaj teslim alanından çıktıktan sonra karşılama (meeting point) bölümüne gidin. Sürücümüz sizin adınızı yazan bir tabelayla orada olacaktır. Ayrıca rezervasyon onayınızda sürücünüzün iletişim bilgileri de yer alacaktır, gerektiğinde direkt iletişime geçebilirsiniz."
    },
    {
        question: "Havalimanı dışında adresimden veya farklı bir rezervasyonda araç ile nasıl buluşurum?",
        answer: "Şehir içi transferlerde sürücümüz belirlenen saatte adresinizin önünde olacaktır. Rezervasyon öncesinde size gönderilen SMS'te sürücünüzün plaka ve telefon bilgileri yer alır. Sürücünüz de size ulaşarak konumunu bildirecektir. Otel transferlerinde ise sürücümüz otel lobisinde sizi bekleyecektir."
    },
    {
        question: "Transfer araçlarında çocuklar için çocuk koltuğu var mı?",
        answer: "Evet, talep etmeniz halinde ücretsiz olarak bebek ve çocuk koltuğu sağlıyoruz. Rezervasyon yaparken 'Özel Talepler' bölümünden çocuğunuzun yaşını ve kilosunu belirterek koltuğu talep edebilirsiniz. Güvenlik standartlarına uygun, temiz ve bakımlı koltuklar kullanıyoruz."
    },
    {
        question: "Kredi kartı ile ödeme yapabilir miyim?",
        answer: "Evet, tüm kredi kartları ve banka kartları ile güvenli ödeme yapabilirsiniz. Ayrıca nakit ödeme seçeneği de mevcuttur. Online ödemeleriniz 3D Secure güvenlik sistemi ile korunmaktadır. Kurumsal müşterilerimiz için fatura ve havale seçenekleri de bulunmaktadır."
    },
    {
        question: "Rezervasyonumun onaylandığını nasıl anlarım?",
        answer: "Rezervasyonunuz tamamlandıktan sonra size e-posta ve SMS ile onay mesajı gönderilir. Bu mesajda rezervasyon detaylarınız, araç bilgileri, sürücü iletişim bilgileri ve rezervasyon numaranız yer alır. Ayrıca 'Rezervasyonlarım' sayfasından da rezervasyonunuzun durumunu kontrol edebilirsiniz."
    },
    {
        question: "Havalimanı dışında adresimden veya farklı bir rezervasyonda araç ile nasıl buluşurum?",
        answer: "Adres transferlerinde sürücümüz belirlenen saatte tam adresinizin önünde olacaktır. Transfer saatinden önce size SMS ile sürücünüzün adı, telefonu ve araç plakası bilgisi gönderilir. Sürücünüz de size ulaşarak konumunu bildirir. Otel, AVM gibi noktalarda ise ana giriş kapısında bekleyecektir."
    }
];

export default function SSSPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#D32F2F] via-[#C62828] to-[#B71C1C] text-white py-16 md:py-24 overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Geometric Patterns */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Floating Icons */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-[10%] animate-float">
                        <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                    </div>
                    <div className="absolute top-40 right-[15%] animate-float" style={{ animationDelay: '1s' }}>
                        <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                    </div>
                    <div className="absolute bottom-20 left-[20%] animate-float" style={{ animationDelay: '2s' }}>
                        <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                            <path d="M2 17L12 22L22 17" />
                        </svg>
                    </div>
                </div>

                <div className="container-custom px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-bounce-slow">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 animate-fade-in-up">
                            Sıkça Sorulan Sorular
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Transfer hizmetlerimiz hakkında merak ettikleriniz
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black mb-1">12+</div>
                                <div className="text-sm text-white/80">Soru & Cevap</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black mb-1">24/7</div>
                                <div className="text-sm text-white/80">Destek</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black mb-1">100%</div>
                                <div className="text-sm text-white/80">Memnuniyet</div>
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
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes fade-in-up {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 3s ease-in-out infinite;
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.8s ease-out forwards;
                    }
                `}</style>
            </section>

            {/* FAQ Section */}
            <section className="py-12 md:py-16">
                <div className="container-custom px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-4">
                            {faqData.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                                    >
                                        <span className="font-bold text-gray-900 pr-4 flex items-start">
                                            <span className="text-[#D32F2F] mr-3 text-xl">
                                                {openIndex === index ? '−' : '+'}
                                            </span>
                                            {faq.question}
                                        </span>
                                        {openIndex === index ? (
                                            <ChevronUp className="w-5 h-5 text-[#D32F2F] flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>

                                    {openIndex === index && (
                                        <div className="px-6 pb-6 pt-0">
                                            <div className="pl-8 text-gray-600 leading-relaxed border-l-2 border-[#D32F2F]/20">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Contact CTA */}
                        <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-center border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Sorunuza cevap bulamadınız mı?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="https://wa.me/905324178963"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all"
                                >
                                    WhatsApp ile İletişime Geç
                                </a>
                                <a
                                    href="/iletisim"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-xl transition-all"
                                >
                                    İletişim Formu
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
