'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, X, Send } from 'lucide-react';

export default function FloatingErrorReport() {
    const t = useTranslations('ErrorReport');
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [formData, setFormData] = useState({
        message: ''
    });

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
        setFormData({ message: '' });

        // Auto close or reset after 3 seconds
        setTimeout(() => {
            setSubmitSuccess(false);
            setIsOpen(false);
        }, 3000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Modal / Form */}
            {isOpen && (
                <div className="mb-4 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-[#0a192f] p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h3 className="font-bold text-sm">{t('title')}</h3>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-5">
                        {submitSuccess ? (
                            <div className="py-8 text-center flex flex-col items-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-green-700 text-sm font-medium">{t('success')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <p className="text-xs text-gray-500 mb-4">{t('desc')}</p>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">{t('message')}</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0a192f] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#0a192f] hover:bg-[#B58A32] text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>{t('sending')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>{t('submit')}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                aria-label={t('button')}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <AlertCircle className="w-7 h-7" />
                )}
            </button>
        </div>
    );
}
