"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Vehicle {
  id: number;
  name_en: string;
}

interface Driver {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  license_number: string | null;
  vehicle_id: number | null;
  vehicle_name: string | null;
  photo_path: string | null;
  permit_document_path: string | null;
  identity_document_path: string | null;
  notes: string | null;
  active: boolean;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    license_number: '',
    vehicle_id: '',
    notes: '',
    active: true
  });
  const router = useRouter();

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('https://turizm.bedirkaraabali.com/api/admin/drivers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('https://turizm.bedirkaraabali.com/api/admin/vehicles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingDriver 
        ? `https://turizm.bedirkaraabali.com/api/admin/drivers/${editingDriver.id}` 
        : 'https://turizm.bedirkaraabali.com/api/admin/drivers';
      
      const payload = {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email || null,
        license_number: formData.license_number || null,
        vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : null,
        notes: formData.notes || null,
        active: formData.active
      };

      const res = await fetch(url, {
        method: editingDriver ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      if (res.ok) {
        setIsModalOpen(false);
        setEditingDriver(null);
        fetchDrivers();
      } else {
        const err = await res.json();
        alert("Hata: " + JSON.stringify(err));
      }
    } catch (error) {
      console.error('Error saving driver:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu sürücüyü silmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://turizm.bedirkaraabali.com/api/admin/drivers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDrivers();
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  const handleFileUpload = async (driverId: number, docType: string, file: File) => {
    try {
      const token = localStorage.getItem('adminToken');
      const formDataUpload = new FormData();
      formDataUpload.append('doc_type', docType);
      formDataUpload.append('file', file);

      const res = await fetch(`https://turizm.bedirkaraabali.com/api/admin/drivers/${driverId}/document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (res.ok) {
        fetchDrivers();
        alert('Belge başarıyla yüklendi.');
        // Refresh the editing driver to show new documents
        const updatedDrivers = await (await fetch('https://turizm.bedirkaraabali.com/api/admin/drivers', {
           headers: { 'Authorization': `Bearer ${token}` }
        })).json();
        const updated = updatedDrivers.find((d: Driver) => d.id === driverId);
        if (updated) setEditingDriver(updated);
      } else {
        alert('Belge yükleme başarısız oldu.');
      }
    } catch (err) {
      console.error(err);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const openCreateModal = () => {
    setEditingDriver(null);
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      license_number: '',
      vehicle_id: '',
      notes: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      full_name: driver.full_name,
      phone: driver.phone,
      email: driver.email || '',
      license_number: driver.license_number || '',
      vehicle_id: driver.vehicle_id ? driver.vehicle_id.toString() : '',
      notes: driver.notes || '',
      active: driver.active
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sürücü Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki sürücüleri ve araç atamalarını buradan yönetebilirsiniz.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Yeni Sürücü Ekle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sürücü Adı</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">İletişim</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lisans / Araç</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-lg font-medium text-slate-600">Henüz sürücü bulunmuyor</p>
                    </div>
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden">
                          {driver.photo_path ? (
                            <img src={`https://turizm.bedirkaraabali.com${driver.photo_path}`} alt="Driver" className="w-full h-full object-cover" />
                          ) : (
                            driver.full_name.charAt(0)
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">{driver.full_name}</div>
                          <div className="text-xs text-slate-500">ID: {driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 font-medium">{driver.phone}</div>
                      <div className="text-xs text-slate-500">{driver.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{driver.license_number || '-'}</div>
                      <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mt-1">
                        {driver.vehicle_name || 'Araç Atanmadı'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        driver.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {driver.active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(driver)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(driver.id)}
                          className="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingDriver ? 'Sürücüyü Düzenle' : 'Yeni Sürücü Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefon *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+90 555 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ahmet@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ehliyet No</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Atanan Araç</label>
                  <select
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">-- Araç Seçin (Opsiyonel) --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name_en}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notlar / Açıklama</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Sürücü hakkında ek bilgiler..."
                    rows={2}
                  ></textarea>
                </div>
              </div>

              {editingDriver && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Sürücü Belgeleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Profil Resmi */}
                    <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Profil Fotoğrafı</p>
                      {editingDriver.photo_path && (
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                          <img src={`https://turizm.bedirkaraabali.com${editingDriver.photo_path}`} alt="Profil" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        {editingDriver.photo_path ? 'Değiştir' : 'Yükle'}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleFileUpload(editingDriver.id, 'photo', e.target.files[0])
                        }} />
                      </label>
                    </div>

                    {/* İzin Belgesi (SRC) */}
                    <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                      <p className="text-xs font-semibold text-slate-600 mb-2">İzin Belgesi / SRC</p>
                      {editingDriver.permit_document_path && (
                        <a href={`https://turizm.bedirkaraabali.com${editingDriver.permit_document_path}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 mb-2 hover:underline">Belgeyi Gör</a>
                      )}
                      <label className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        {editingDriver.permit_document_path ? 'Güncelle' : 'Yükle'}
                        <input type="file" className="hidden" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleFileUpload(editingDriver.id, 'permit', e.target.files[0])
                        }} />
                      </label>
                    </div>

                    {/* Kimlik / Ehliyet Kopyası */}
                    <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Kimlik / Ehliyet Kopyası</p>
                      {editingDriver.identity_document_path && (
                        <a href={`https://turizm.bedirkaraabali.com${editingDriver.identity_document_path}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 mb-2 hover:underline">Belgeyi Gör</a>
                      )}
                      <label className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        {editingDriver.identity_document_path ? 'Güncelle' : 'Yükle'}
                        <input type="file" className="hidden" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleFileUpload(editingDriver.id, 'identity', e.target.files[0])
                        }} />
                      </label>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">* Belge yüklediğinizde anında kaydedilir.</p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">
                  Sürücü Aktif (Transfer alabilir)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all"
                >
                  {editingDriver ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
