'use client';

import Link from 'next/link';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0a192f] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B58A32] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* 404 Icon & Number */}
        <div className="relative inline-block mb-8 group">
          <div className="absolute inset-0 bg-[#B58A32]/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-500" />
          <div className="relative bg-white w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl flex items-center justify-center border-4 border-[#0a192f] mx-auto">
            <span className="text-5xl md:text-7xl font-black text-[#0a192f] tracking-tighter">
              4<span className="text-[#B58A32]">0</span>4
            </span>
            <Compass className="absolute -bottom-4 -right-4 w-12 h-12 md:w-16 md:h-16 text-[#B58A32] drop-shadow-lg animate-[spin_10s_linear_infinite]" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-5xl font-black text-[#0a192f] mb-4 tracking-tight">
          Rota Bulunamadı
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-6">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. Lütfen bağlantıyı kontrol edin veya ana sayfaya dönün.
          <br className="hidden md:block" />
          <span className="text-sm mt-2 block opacity-75">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#0a192f] border-2 border-gray-200 hover:border-[#0a192f] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön / Go Back
          </button>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-[#0a192f] hover:bg-[#112a52] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl shadow-[#0a192f]/20"
          >
            <Home className="w-5 h-5" />
            Ana Sayfa / Home
          </Link>
        </div>
      </div>
    </div>
  );
}
