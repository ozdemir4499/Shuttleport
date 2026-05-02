'use client';

import Link from 'next/link';
import { ChevronRight, Shield, Clock, Car, Users, Award, Target, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function HakkimizdaPage() {
    return (
        <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
            {/* Ortak Header */}
            <Header />

            {/* BREADCRUMB */}
            <div className="bg-white border-b border-gray-100">
                <div className="container-custom px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Hakkımızda</h1>
                        <nav className="flex items-center text-sm text-gray-500">
                            <Link href="/" className="hover:text-[#0a192f] transition-colors">Anasayfa</Link>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="text-[#0a192f] font-medium">Hakkımızda</span>
                        </nav>
                    </div>
                </div>
            </div>

            {/* HERO SECTION */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-[#0a192f]"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="container-custom px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            Premium Transfer<br />
                            <span className="text-[#0a192f]">Deneyimi</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                            2015 yılından bu yana binlerce müşterimize güvenli, konforlu ve lüks transfer hizmetleri sunuyoruz.
                            Profesyonel ekibimiz ve modern araç filomuzla her yolculuğunuzu özel kılıyoruz.
                        </p>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-12 bg-white -mt-16 relative z-20">
                <div className="container-custom px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-[#0a192f] mb-2">9+</div>
                                <div className="text-gray-600 font-medium">Yıllık Deneyim</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-[#0a192f] mb-2">50K+</div>
                                <div className="text-gray-600 font-medium">Mutlu Müşteri</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-[#0a192f] mb-2">120+</div>
                                <div className="text-gray-600 font-medium">Profesyonel Şoför</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-[#0a192f] mb-2">85+</div>
                                <div className="text-gray-600 font-medium">Modern Araç</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT CONTENT */}
            <section className="py-16 md:py-24">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Image */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000"
                                    alt="Asitane Travel Araç"
                                    className="w-full h-[400px] md:h-[500px] object-cover"
                                />
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#0a192f] to-[#B58A32] rounded-full flex items-center justify-center">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-gray-900">4.9/5</div>
                                        <div className="text-gray-600">Müşteri Memnuniyeti</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div className="space-y-6">
                            <div className="inline-block bg-red-100 text-[#0a192f] px-4 py-2 rounded-full text-sm font-bold">
                                Biz Kimiz?
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Türkiye'nin Lider VIP Transfer Şirketi
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Asitane Travel olarak, 2015 yılından bu yana havalimanı transferi, şehir içi VIP ulaşım
                                ve kurumsal transfer hizmetlerinde sektörün öncü markası olarak hizmet vermekteyiz.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Müşteri memnuniyetini her şeyin üstünde tutan anlayışımız, profesyonel ve deneyimli
                                şoför kadromuz, son model araç filomuz ile her yolculuğunuzu konforlu ve güvenli
                                bir deneyime dönüştürüyoruz.
                            </p>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">Güvenli Seyahat</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">7/24 Hizmet</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Car className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">Lüks Araçlar</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">Uzman Ekip</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES SECTION */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container-custom px-4">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-red-100 text-[#0a192f] px-4 py-2 rounded-full text-sm font-bold mb-4">
                            Değerlerimiz
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Bizim İçin Önemli Olan
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#0a192f] to-[#B58A32] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Target className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Misyonumuz</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Müşterilerimize en yüksek kalitede, güvenli ve konforlu transfer hizmetleri sunarak
                                seyahat deneyimlerini unutulmaz kılmak.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#0a192f] to-[#B58A32] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Award className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Vizyonumuz</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Türkiye'nin ve bölgenin en güvenilir, yenilikçi ve tercih edilen premium transfer
                                markası olmak.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#0a192f] to-[#B58A32] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Heart className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Değerlerimiz</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Güvenilirlik, müşteri odaklılık, profesyonellik ve sürekli gelişim ilkeleriyle
                                hareket ediyoruz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-[#0a192f]">
                <div className="container-custom px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h3 className="text-3xl md:text-4xl font-bold mb-6">
                            Hemen Rezervasyon Yapın
                        </h3>
                        <p className="text-lg text-gray-300 mb-8">
                            Premium transfer deneyimi için hemen bizimle iletişime geçin.
                            Size özel çözümler sunalım.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all"
                            >
                                Rezervasyon Yap
                            </Link>
                            <Link
                                href="/iletisim"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-gray-900 transition-all"
                            >
                                Bize Ulaşın
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
