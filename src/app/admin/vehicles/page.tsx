"use client";
import React, { useEffect, useState } from 'react';

type Vehicle = {
  id: number;
  vehicle_type: string;
  name_en: string;
  name_tr: string;
  capacity_max: number;
  baggage_capacity: number;
  active: boolean;
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:8000/api/admin/vehicles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Araç Filosu</h2>
          <p className="text-sm text-gray-500 mt-1">Sistemdeki araç tiplerini, yolcu ve bagaj kapasitelerini yönetin</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium">
          + Yeni Araç Tipi Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="h-40 bg-gray-200 flex items-center justify-center relative">
              <span className="text-gray-400 font-medium">Görsel Yok</span>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                  vehicle.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {vehicle.active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900">{vehicle.name_en}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">{vehicle.name_tr} ({vehicle.vehicle_type})</p>
              
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                <div className="text-center">
                  <span className="block text-xs text-gray-500 uppercase font-semibold">Yolcu</span>
                  <span className="text-lg font-bold text-gray-800">{vehicle.capacity_max}</span>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <span className="block text-xs text-gray-500 uppercase font-semibold">Bagaj</span>
                  <span className="text-lg font-bold text-gray-800">{vehicle.baggage_capacity}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
                  Düzenle
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
                  Fiyat Ayarları
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {vehicles.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Sistemde tanımlı araç bulunamadı.
        </div>
      )}
    </div>
  );
}
