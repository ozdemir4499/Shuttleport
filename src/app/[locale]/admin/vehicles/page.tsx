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
  image_path?: string | null;
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const initialFormState = {
    vehicle_type: '',
    name_en: '',
    name_tr: '',
    capacity_min: 1,
    capacity_max: 4,
    baggage_capacity: 4,
    active: true
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('https://turizm.bedirkaraabali.com/api/admin/vehicles', {
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

  const openAddModal = () => {
    setEditingId(null);
    setImageFile(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setImageFile(null);
    setFormData({
      vehicle_type: vehicle.vehicle_type,
      name_en: vehicle.name_en,
      name_tr: vehicle.name_tr,
      capacity_min: 1,
      capacity_max: vehicle.capacity_max,
      baggage_capacity: vehicle.baggage_capacity,
      active: vehicle.active
    });
    setIsModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingId 
        ? `https://turizm.bedirkaraabali.com/api/admin/vehicles/${editingId}`
        : 'https://turizm.bedirkaraabali.com/api/admin/vehicles';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
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
        const data = await res.json();
        
        // Handle image upload if a file was selected
        if (imageFile) {
          const vehicleId = editingId || data.id;
          const formDataObj = new FormData();
          formDataObj.append('file', imageFile);
          
          try {
            await fetch(`https://turizm.bedirkaraabali.com/api/admin/vehicles/${vehicleId}/image`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formDataObj
            });
          } catch (imgError) {
            console.error("Image upload failed", imgError);
          }
        }
        
        setIsModalOpen(false);
        fetchVehicles();
        setFormData(initialFormState);
        setEditingId(null);
        setImageFile(null);
      } else {
        alert("Araç kaydedilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("Ağ hatası.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu aracı silmek istediğinize emin misiniz?")) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://turizm.bedirkaraabali.com/api/admin/vehicles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        fetchVehicles();
      } else {
        alert("Araç silinirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://turizm.bedirkaraabali.com/api/admin/vehicles/${id}/status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        fetchVehicles();
      } else {
        alert("Durum güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error toggling vehicle status:", error);
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Araç Filosu</h2>
          <p className="text-sm text-gray-500 mt-1">Sistemdeki araç tiplerini, adetlerini ve kapasitelerini yönetin</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium">
          + Yeni Araç Tipi Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className={`bg-white rounded-lg shadow-md overflow-hidden border ${vehicle.active ? 'border-gray-100' : 'border-red-200 opacity-80'}`}>
            <div className="h-40 bg-gray-200 flex items-center justify-center relative overflow-hidden">
              {vehicle.image_path ? (
                <img src={`https://turizm.bedirkaraabali.com${vehicle.image_path}`} alt={vehicle.name_tr} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 font-medium">Görsel Yok</span>
              )}
              <div className="absolute top-3 right-3 flex space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                  vehicle.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 space-x-2">
                <button 
                  onClick={() => handleToggleStatus(vehicle.id)} 
                  className={`flex-1 py-1.5 rounded text-xs font-semibold transition ${vehicle.active ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  {vehicle.active ? 'Pasife Al' : 'Aktif Et'}
                </button>
                <button 
                  onClick={() => openEditModal(vehicle)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded text-xs font-semibold transition"
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded text-xs font-semibold transition"
                >
                  Sil
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

      {/* Araç Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Araç Tipini Düzenle' : 'Yeni Araç Tipi Ekle'}</h3>
            <form onSubmit={handleSaveVehicle} className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700">Yolcu</label>
                  <input type="number" required min="1" value={formData.capacity_max} onChange={e => setFormData({...formData, capacity_max: e.target.value ? parseInt(e.target.value) : 0})} className="mt-1 w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bagaj</label>
                  <input type="number" required min="0" value={formData.baggage_capacity} onChange={e => setFormData({...formData, baggage_capacity: e.target.value ? parseInt(e.target.value) : 0})} className="mt-1 w-full p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Araç Görseli</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setImageFile(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)} 
                  className="w-full p-2 border rounded text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 font-medium">İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">{editingId ? 'Güncelle' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
