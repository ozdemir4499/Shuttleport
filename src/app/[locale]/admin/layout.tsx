"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
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

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Rezervasyonlar', path: '/admin/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Rota Yönetimi', path: '/admin/routes', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { name: 'Fiyat & Kurallar', path: '/admin/pricing-rules', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Araç Filosu', path: '/admin/vehicles', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans">
      {/* Sidebar - Premium Dark Glass */}
      <aside className="w-72 bg-[#0a0a0a] text-gray-300 flex flex-col relative shadow-[10px_0_30px_rgba(0,0,0,0.05)] border-r border-gray-800/80 z-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600 rounded-full mix-blend-screen filter blur-[80px] opacity-10"></div>
          <div className="absolute top-1/2 -right-12 w-32 h-32 bg-red-800 rounded-full mix-blend-screen filter blur-[60px] opacity-[0.05]"></div>
        </div>
        
        <div className="p-8 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center shrink-0">
                <img 
                    src="/red_lion_icon_transparent.png" 
                    alt="Lion Icon" 
                    className="w-full h-full object-contain scale-[1.2]"
                />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#D32F2F] leading-tight">İSTANBUL</span>
                <span className="text-xl font-black text-white leading-none tracking-tight mt-0.5">TRANSFER</span>
                <span className="text-[8px] uppercase tracking-widest text-gray-400 font-semibold mt-1">Command Center</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center gap-3 py-3.5 px-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white bg-red-600/10 border border-red-500/20 shadow-[0_0_15px_rgba(211,47,47,0.15)]' 
                    : 'hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-[#D32F2F] rounded-r-md"></div>}
                <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#D32F2F]' : 'text-gray-500 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2" : "1.5"} d={item.icon} />
                </svg>
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 relative z-10 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/80 border border-gray-700/50 backdrop-blur-md mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                <span className="text-white text-sm font-bold">AD</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Admin Personel</p>
                <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 block"></span> Çevrimiçi</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 text-sm font-medium">
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
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-red-50/50 to-[#F4F7FE] -z-10"></div>

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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(211, 47, 47, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(211, 47, 47, 0.4); }
      `}} />
    </div>
  );
}
