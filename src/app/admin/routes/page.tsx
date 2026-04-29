"use client";
import React, { useEffect, useState } from 'react';
import RouteModal from './RouteModal';

type FixedRoute = {
  id: number;
  origin: string;
  destination: string;
  vehicle_id: number;
  vehicle_name: string;
  price: number;
  discount_percent: number;
  active: boolean;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<FixedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:8000/api/admin/routes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoutes(data);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (id: number) => {
    if (!confirm("Bu rotayı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:8000/api/admin/routes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRoutes();
      } else {
        alert("Silme işlemi başarısız.");
      }
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("Ağ hatası.");
    }
  };

  const handleSaveRoute = async (routeData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:8000/api/admin/routes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routeData)
      });
      if (res.ok) {
        fetchRoutes();
      } else {
        const errText = await res.text();
        alert("Kaydetme hatası: " + errText);
        throw new Error(errText);
      }
    } catch (error: any) {
      console.error("Error creating route:", error);
      alert("Ağ hatası: " + error.message);
      throw error;
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sabit Rota Yönetimi</h2>
          <p className="text-sm text-gray-500 mt-1">Havalimanı - Otel gibi noktadan noktaya sabit fiyatlı rotalar</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium"
        >
          + Yeni Rota Ekle
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kalkış</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Varış</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Araç Tipi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabit Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İndirim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{route.origin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{route.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.vehicle_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{route.price} ₺</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.discount_percent > 0 ? (
                    <span className="text-green-600 font-semibold">%{route.discount_percent}</span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    route.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {route.active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => deleteRoute(route.id)} className="text-red-600 hover:text-red-900">Sil</button>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Henüz tanımlı sabit rota yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RouteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoute}
      />
    </div>
  );
}
