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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_type: '',
    name_en: '',
    name_tr: '',
    capacity_min: 1,
    capacity_max: 4,
    baggage_capacity: 4,
    active: true
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:8000/api/admin/vehicles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
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

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:8000/api/admin/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        setIsModalOpen(false);
        fetchVehicles();
        setFormData({
          vehicle_type: '', name_en: '', name_tr: '', capacity_min: 1, capacity_max: 4, baggage_capacity: 4, active: true
        });
      } else {
        alert("Araç eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error creating vehicle:", error);
      alert("Ağ hatası.");
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
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium">
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
              <h3 className="text-lg font-bold text-gray-900">{vehicle.name_tr}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">{vehicle.name_en} ({vehicle.vehicle_type})</p>
              
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
            </div>
          </div>
        ))}
      </div>
      
      {vehicles.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Sistemde tanımlı araç bulunamadı.
        </div>
      )}

      {/* Yeni Araç Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Yeni Araç Tipi Ekle</h3>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Araç Kodu (Örn: vito, sedan)</label>
                <input type="text" required value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})} className="mt-1 w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">İsim (TR)</label>
                  <input type="text" required value={formData.name_tr} onChange={e => setFormData({...formData, name_tr: e.target.value})} className="mt-1 w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">İsim (EN)</label>
                  <input type="text" required value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="mt-1 w-full p-2 border rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Yolcu Kapasitesi</label>
                  <input type="number" required min="1" value={formData.capacity_max} onChange={e => setFormData({...formData, capacity_max: e.target.value ? parseInt(e.target.value) : 0})} className="mt-1 w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bagaj Kapasitesi</label>
                  <input type="number" required min="0" value={formData.baggage_capacity} onChange={e => setFormData({...formData, baggage_capacity: e.target.value ? parseInt(e.target.value) : 0})} className="mt-1 w-full p-2 border rounded" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
