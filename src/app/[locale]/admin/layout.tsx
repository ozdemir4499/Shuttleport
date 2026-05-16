"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname.endsWith('/admin/login') || pathname.includes('/admin/login')) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setLoading(false);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050A1F] flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-indigo-200 tracking-widest animate-pulse">SİSTEM YÜKLENİYOR...</p>
    </div>
  );

  if (pathname.endsWith('/admin/login') || pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Rezervasyonlar', path: '/admin/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Rota Yönetimi', path: '/admin/routes', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { name: 'Fiyat & Kurallar', path: '/admin/pricing-rules', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Araç Filosu', path: '/admin/vehicles', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { name: 'Sürücüler', path: '/admin/drivers', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' },
    { name: 'Ek Hizmetler', path: '/admin/extra-services', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { name: 'Turlar (Detaylı)', path: '/admin/tours', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Bloglar', path: '/admin/blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { name: 'SEO Bot', path: '/admin/seo', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7' },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans">
      {/* Sidebar - Premium Navy & Gold */}
      <aside className="w-72 bg-gradient-to-b from-[#0a192f] to-[#071222] text-gray-300 flex flex-col relative shadow-[10px_0_30px_rgba(0,0,0,0.15)] border-r border-[#1a3050] z-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#B58A32] rounded-full mix-blend-screen filter blur-[80px] opacity-[0.07]"></div>
          <div className="absolute bottom-20 -right-12 w-32 h-32 bg-[#B58A32] rounded-full mix-blend-screen filter blur-[60px] opacity-[0.04]"></div>
        </div>
        
        <div className="p-6 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-gray-200 shadow-lg">
              <img 
                src="/logo_transparent.png" 
                alt="RidePortX" 
                className="w-9 h-9 object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#B58A32] leading-tight uppercase">RidePortX</span>
              <span className="text-lg font-black text-white leading-none tracking-tight mt-0.5">Admin Panel</span>
              <span className="text-[8px] uppercase tracking-widest text-gray-500 font-medium mt-1">Yönetim Merkezi</span>
            </div>
          </div>
        </div>

        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#B58A32]/20 to-transparent" />

        <nav className="flex-1 px-4 py-6 space-y-1 relative z-10 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');

            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white bg-[#B58A32]/15 border border-[#B58A32]/25 shadow-[0_0_20px_rgba(181,138,50,0.1)]' 
                    : 'hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#B58A32] rounded-r-full"></div>}
                <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#B58A32]' : 'text-gray-500 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2" : "1.5"} d={item.icon} />
                </svg>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 relative z-10 mt-auto">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md mb-2 relative">
            <Link href="/admin/settings" className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group">
              <svg className="w-4 h-4 text-gray-500 group-hover:text-[#B58A32] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B58A32] to-[#8B6914] flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">AD</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Admin Personel</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse"></span> Çevrimiçi</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 border border-white/[0.06] text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sistemden Çık
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#B58A32]/[0.03] to-[#F4F7FE] -z-10"></div>

        {/* Dynamic Content Scroll Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 py-6 relative z-0 mt-4">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(181, 138, 50, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(181, 138, 50, 0.4); }
      `}} />
    </div>
  );
}
