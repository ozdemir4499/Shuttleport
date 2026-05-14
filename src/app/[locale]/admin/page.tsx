"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total_vehicles: 0,
    total_routes: 0,
    active_rules: 0,
    total_bookings: 0,
    pending_bookings: 0,
    total_revenue: 0.0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi Günler';
    return 'İyi Akşamlar';
  };

  const statCards = [
    {
      title: 'Bekleyen Rezervasyon',
      value: stats.pending_bookings,
      suffix: '',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      urgent: true,
    },
    {
      title: 'Toplam Rezervasyon',
      value: stats.total_bookings,
      suffix: '',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-indigo-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Toplam Ciro',
      value: stats.total_revenue.toLocaleString('tr-TR'),
      suffix: ' ₺',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-green-500',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Aktif Araç',
      value: stats.total_vehicles,
      suffix: '',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      gradient: 'from-violet-500 to-purple-500',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      title: 'Sabit Rota',
      value: stats.total_routes,
      suffix: '',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0-8.25a1.5 1.5 0 110 3m0-3a1.5 1.5 0 100 3m0 0v8.25m3-12V15m0-8.25a1.5 1.5 0 110 3m0-3a1.5 1.5 0 100 3m0 0v8.25m3-12V15m0-8.25a1.5 1.5 0 110 3m0-3a1.5 1.5 0 100 3m0 0v8.25" />
        </svg>
      ),
      gradient: 'from-cyan-500 to-teal-500',
      bgLight: 'bg-cyan-50',
      textColor: 'text-cyan-600',
    },
    {
      title: 'Fiyat Kuralı',
      value: stats.active_rules,
      suffix: '',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-yellow-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
      badge: 'Surge & Happy Hour',
    },
  ];

  const quickActions = [
    { label: 'Rezervasyonlar', href: '/tr/admin/bookings', icon: '📋', color: 'from-blue-500 to-blue-600' },
    { label: 'Rota Yönetimi', href: '/tr/admin/routes', icon: '🗺️', color: 'from-cyan-500 to-cyan-600' },
    { label: 'Fiyat & Kurallar', href: '/tr/admin/pricing', icon: '💰', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Araç Filosu', href: '/tr/admin/vehicles', icon: '🚐', color: 'from-violet-500 to-violet-600' },
    { label: 'Sürücüler', href: '/tr/admin/drivers', icon: '👤', color: 'from-orange-500 to-orange-600' },
    { label: 'Ek Hizmetler', href: '/tr/admin/extras', icon: '⭐', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{greeting()}, Admin 👋</h1>
            <p className="text-slate-400 text-sm">
              RidePortX Yönetim Paneli • {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-3xl font-bold text-white font-mono tracking-wider">
              {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Sistem Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`relative group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 ${card.urgent && stats.pending_bookings > 0 ? 'ring-2 ring-orange-200 ring-offset-2' : ''}`}
          >
            {/* Urgent pulse */}
            {card.urgent && stats.pending_bookings > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
              </span>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className={`${card.bgLight} ${card.textColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div className={`bg-gradient-to-r ${card.gradient} w-12 h-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
              <p className={`text-3xl font-bold ${card.textColor} tracking-tight`}>
                {card.value}{card.suffix}
              </p>
              {card.badge && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />
                  </svg>
                  {card.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-200">{action.icon}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Sistem Durumu
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">API Sunucusu</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Çevrimiçi
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Veritabanı</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Bağlı
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Ödeme Sistemi</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Aktif
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Son Güncelleme</span>
              <span className="text-xs font-medium text-gray-600">
                {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              Araç filonuzu, rotalarınızı ve dinamik fiyatlandırma kurallarınızı bu panelden yönetin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
