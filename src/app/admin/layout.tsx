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

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Yükleniyor...</div>;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Shuttleport Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/bookings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 font-medium text-blue-300">
            Rezervasyonlar
          </Link>
          <Link href="/admin/routes" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Rota Yönetimi
          </Link>
          <Link href="/admin/pricing-rules" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Fiyat & Kurallar (Surge)
          </Link>
          <Link href="/admin/vehicles" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Araç Filosu
          </Link>
          <div className="border-t border-gray-700 my-4"></div>
          <button onClick={handleLogout} className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-red-600 text-red-400 hover:text-white">
            Çıkış Yap
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-800">Yönetim Paneli</h1>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
