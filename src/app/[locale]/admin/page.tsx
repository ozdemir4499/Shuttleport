"use client";
import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_vehicles: 0,
    total_routes: 0,
    active_rules: 0,
    total_bookings: 0,
    pending_bookings: 0,
    total_revenue: 0.0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('http://localhost:8000/api/admin/dashboard-stats', {
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Bekleyen Rezervasyon</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.pending_bookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Rezervasyon</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_bookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Ciro (Onaylananlar)</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.total_revenue} ₺</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Aktif Araç</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_vehicles}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Tanımlı Sabit Rota</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_routes}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Aktif Fiyat Kuralı</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active_rules}</p>
          <span className="text-green-500 text-xs font-semibold">Surge & Happy Hour</span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sisteme Genel Bakış</h2>
        <p className="text-gray-600">
          Bu modern yönetim paneli üzerinden araç filonuzu, noktadan noktaya sabit rotalarınızı ve 
          zaman/yoğunluk bazlı dinamik fiyatlandırma kurallarınızı (Pricing Engine) yönetebilirsiniz.
        </p>
      </div>
    </div>
  );
}
