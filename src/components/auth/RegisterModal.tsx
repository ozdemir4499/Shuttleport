'use client';

import { X, UserPlus, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const COUNTRIES = [
    { code: 'TR', name: 'Turkey (Türkiye)', dialCode: '+90' },
    { code: 'RU', name: 'Russia (Россия)', dialCode: '+7' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'DE', name: 'Germany (Deutschland)', dialCode: '+49' },
    { code: 'AF', name: 'Afghanistan (افغانستان)', dialCode: '+93' },
    { code: 'AL', name: 'Albania (Shqipëri)', dialCode: '+355' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'IT', name: 'Italy (Italia)', dialCode: '+39' },
];

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Phone Dropdown State
    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const phoneDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target as Node)) {
                setIsPhoneDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
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
                            <h2 className="text-lg font-black text-gray-900 tracking-wide">ÜYE OL</h2>
                            <p className="text-[13px] text-gray-500 font-medium mt-1">Üye olarak rezervasyonlarınızı daha hızlı gerçekleştirin.</p>
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
                    <form className="space-y-3" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                        
                        <div>
                            <input 
                                type="text" 
                                placeholder="ADINIZ" 
                                autoComplete="off"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-white"
                                required
                            />
                        </div>

                        <div>
                            <input 
                                type="text" 
                                placeholder="SOYADINIZ" 
                                autoComplete="off"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-white"
                                required
                            />
                        </div>

                        <div>
                            <input 
                                type="email" 
                                placeholder="E-POSTA ADRESİNİZ" 
                                autoComplete="off"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-white"
                                required
                            />
                        </div>

                        {/* Phone Number Input with Country Code Dropdown */}
                        <div 
                            ref={phoneDropdownRef}
                            className="relative border border-gray-200 rounded-xl px-4 py-2 bg-white transition-all focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400"
                        >
                            <label className="block text-[11px] font-bold text-gray-400 tracking-wide mb-0.5">TELEFON NUMARASI</label>
                            <div className="flex items-center gap-2 mt-1">
                                <button 
                                    type="button" 
                                    onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                                    className="flex items-center gap-1.5 hover:bg-gray-50 px-1 py-0.5 rounded transition-colors"
                                >
                                    <img 
                                        src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`} 
                                        className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" 
                                        alt={selectedCountry.code} 
                                    />
                                    <span className="font-bold text-gray-900 text-[15px]">{selectedCountry.dialCode}</span>
                                    <ChevronDown className="w-3 h-3 text-gray-600" />
                                </button>
                                
                                <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                                
                                <input 
                                    type="tel"
                                    className="flex-1 text-[15px] font-semibold text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 w-full"
                                    placeholder=""
                                    autoComplete="nope"
                                    required
                                />
                            </div>

                            {/* Dropdown Menu */}
                            {isPhoneDropdownOpen && (
                                <div className="absolute left-0 top-full mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-xl z-[100] custom-scrollbar py-2">
                                    {COUNTRIES.map(country => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCountry(country);
                                                setIsPhoneDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <img 
                                                src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} 
                                                className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" 
                                                alt={country.code} 
                                            />
                                            <span className="flex-1 text-[14px] text-gray-600 font-medium">{country.name}</span>
                                            <span className="text-[14px] text-gray-400 font-medium">{country.dialCode}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

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

                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="PAROLA TEKRAR" 
                                autoComplete="new-password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-white"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit"
                                className="w-full bg-[#0a192f] hover:bg-[#B58A32] text-white font-bold text-[15px] py-4 rounded-xl transition-colors shadow-sm"
                            >
                                KAYIT OL
                            </button>
                        </div>

                        <div className="text-center !mt-3 pb-2">
                            <button 
                                type="button" 
                                onClick={onSwitchToLogin}
                                className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Zaten üye misiniz? Giriş Yapın
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
