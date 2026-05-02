'use client';

import { X, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister?: () => void;
}

type ViewState = 'login' | 'forgot_password';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [view, setView] = useState<ViewState>('login');
    
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            // Reset view to login when opened
            setView('login');
            setShowPassword(false);
        } else {
            const timer = setTimeout(() => {
                if (document.querySelectorAll('.auth-modal-overlay').length === 0) {
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }
            }, 10);
            return () => clearTimeout(timer);
        }
        return () => {
            const timer = setTimeout(() => {
                if (document.querySelectorAll('.auth-modal-overlay').length === 0) {
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }
            }, 10);
            return () => clearTimeout(timer);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="auth-modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50/50 rounded-xl flex items-center justify-center border border-amber-100">
                            <img src="/logo_icon.png" className="w-8 h-8 object-contain" alt="Asitane" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 tracking-wide">
                                {view === 'login' ? 'GİRİŞ YAP' : 'ŞİFREMİ UNUTTUM'}
                            </h2>
                            <p className="text-[13px] text-gray-500 font-medium mt-1">
                                {view === 'login' 
                                    ? 'Hesabınıza giriş yaparak rezervasyonlarınızı yönetin.' 
                                    : 'Hesabınıza bağlı e-posta adresinizi girin, sıfırlama bağlantısı gönderelim.'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <form className="space-y-4" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                        
                        <div>
                            <input 
                                type="email" 
                                placeholder="E-POSTA ADRESİNİZ" 
                                autoComplete="off"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-white"
                                required
                            />
                        </div>

                        {view === 'login' && (
                            <>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="PAROLA" 
                                        autoComplete="new-password"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-white"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button 
                                        type="button" 
                                        onClick={() => setView('forgot_password')}
                                        className="text-[13px] font-bold text-gray-500 hover:text-[#0a192f] transition-colors"
                                    >
                                        Şifremi Unuttum
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="pt-2">
                            <button 
                                type="submit"
                                className="w-full bg-[#0a192f] hover:bg-[#B58A32] text-white font-bold text-[15px] py-4 rounded-xl transition-colors shadow-sm"
                            >
                                {view === 'login' ? 'GİRİŞ YAP' : 'SIFIRLAMA LİNKİ GÖNDER'}
                            </button>
                        </div>

                        <div className="text-center !mt-3 pb-2">
                            {view === 'login' ? (
                                <button 
                                    type="button" 
                                    onClick={onSwitchToRegister}
                                    className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    Hesabınız yok mu? Üye Olun
                                </button>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={() => setView('login')}
                                    className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-full"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Giriş Ekranına Dön
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
