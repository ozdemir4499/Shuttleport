'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Truck, DollarSign, BarChart3, CheckCircle2, Send, Phone, Mail, ArrowRight, Shield, Clock, Users } from 'lucide-react';

export default function TasiyiciPage() {
    const t = useTranslations('Carrier');
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
                            <span className="text-sm text-white/80">{t('title')}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            {t.rich('heroTitle', { span: (chunks) => <span className="text-[#B58A32]">{chunks}</span> })}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                            {t.rich('heroDesc', { strong: (chunks) => <strong className="text-white">{chunks}</strong> })}
                        </p>
                        <a href="#basvuru-formu" className="inline-flex items-center gap-2 bg-[#B58A32] hover:bg-[#a07a2a] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#B58A32]/20 hover:shadow-[#B58A32]/40">
                            {t('applyNow')}
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container-custom px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl md:text-3xl font-black text-[#0a192f] mb-4">{t('whyTitle')}</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">{t('whyDesc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <DollarSign className="w-7 h-7" />,
                                title: t('advantages.0.title'),
                                description: t('advantages.0.desc'),
                                color: '#B58A32',
                            },
                            {
                                icon: <BarChart3 className="w-7 h-7" />,
                                title: t('advantages.1.title'),
                                description: t('advantages.1.desc'),
                                color: '#228BE6',
                            },
                            {
                                icon: <Truck className="w-7 h-7" />,
                                title: t('advantages.2.title'),
                                description: t('advantages.2.desc'),
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
                        <h2 className="text-2xl md:text-3xl font-black text-[#0a192f] mb-4">{t('howTitle')}</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">{t('howDesc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: t('steps.0.step'), title: t('steps.0.title'), desc: t('steps.0.desc'), icon: <Send className="w-5 h-5" /> },
                            { step: t('steps.1.step'), title: t('steps.1.title'), desc: t('steps.1.desc'), icon: <CheckCircle2 className="w-5 h-5" /> },
                            { step: t('steps.2.step'), title: t('steps.2.title'), desc: t('steps.2.desc'), icon: <Users className="w-5 h-5" /> },
                            { step: t('steps.3.step'), title: t('steps.3.title'), desc: t('steps.3.desc'), icon: <DollarSign className="w-5 h-5" /> },
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
                            { value: t('stats.0.value'), label: t('stats.0.label') },
                            { value: t('stats.1.value'), label: t('stats.1.label') },
                            { value: t('stats.2.value'), label: t('stats.2.label') },
                            { value: t('stats.3.value'), label: t('stats.3.label') },
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
                            <h2 className="text-2xl md:text-3xl font-black text-[#0a192f] mb-4">{t('formTitle')}</h2>
                            <p className="text-gray-500">{t('formDesc')}</p>
                        </div>

                        {isSubmitted ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0a192f] mb-3">{t('form.successTitle')}</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {t('form.successDesc')}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Ad Soyad */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.fullName')}</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900"
                                            placeholder={t('form.namePlaceholder')}
                                        />
                                    </div>

                                    {/* Telefon */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.phone')}</label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.email')}</label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.city')}</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 bg-white"
                                        >
                                            <option value="">{t('form.citySelect')}</option>
                                            <option value="istanbul">{t('form.cities.istanbul')}</option>
                                            <option value="ankara">{t('form.cities.ankara')}</option>
                                            <option value="izmir">{t('form.cities.izmir')}</option>
                                            <option value="antalya">{t('form.cities.antalya')}</option>
                                            <option value="mugla">{t('form.cities.mugla')}</option>
                                            <option value="bursa">{t('form.cities.bursa')}</option>
                                            <option value="diger">{t('form.cities.diger')}</option>
                                        </select>
                                    </div>

                                    {/* Araç Tipi */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.vehicleType')}</label>
                                        <select
                                            name="vehicleType"
                                            value={formData.vehicleType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 bg-white"
                                        >
                                            <option value="">{t('form.vehicleSelect')}</option>
                                            <option value="sedan">{tf('sedanOption')}</option>
                                            <option value="vip-sedan">{tf('vipSedanOption')}</option>
                                            <option value="minivan">{tf('minivanOption')}</option>
                                            <option value="vip-minivan">{tf('vipMinivanOption')}</option>
                                            <option value="sprinter">{tf('sprinterOption')}</option>
                                            <option value="midibus">{tf('midibusOption')}</option>
                                            <option value="otobus">{tf('busOption')}</option>
                                        </select>
                                    </div>

                                    {/* Araç Sayısı */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.vehicleCount')}</label>
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.experience')}</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 bg-white"
                                    >
                                        <option value="">{t('form.expSelect')}</option>
                                        <option value="yok">{t('form.expNone')}</option>
                                        <option value="1-3">{t('form.exp1')}</option>
                                        <option value="3-5">{t('form.exp3')}</option>
                                        <option value="5+">{t('form.exp5')}</option>
                                    </select>
                                </div>

                                {/* Mesaj */}
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.message')}</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 outline-none transition-all text-gray-900 resize-none"
                                        placeholder={t('form.messagePlaceholder')}
                                    ></textarea>
                                </div>

                                {/* Onay Metni */}
                                <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                                    {t.rich('form.terms', { termsLink: (chunks) => <Link href="/kullanim" className="text-[#B58A32] hover:underline">{t('form.termsLabel')}</Link>, privacyLink: (chunks) => <Link href="/gizlilik" className="text-[#B58A32] hover:underline">{t('form.privacyLabel')}</Link> })}
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
                                            {t('form.sending')}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            {t('form.submit')}
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
