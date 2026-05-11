"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Tour {
  id: number;
  title_tr: string;
  title_en: string;
  description_tr: string | null;
  description_en: string | null;
  badge_tr: string | null;
  badge_en: string | null;
  price: number;
  image_url: string | null;
  slug: string | null;
  active: boolean;
  start_time: string | null;
  end_time: string | null;
  overview_tr: string | null;
  overview_en: string | null;
  gallery: string[] | null;
  program_tr: string | null;
  program_en: string | null;
  included_tr: string | null;
  included_en: string | null;
  excluded_tr: string | null;
  excluded_en: string | null;
  notes_tr: string | null;
  notes_en: string | null;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    description_tr: '',
    description_en: '',
    badge_tr: '',
    badge_en: '',
    price: 0,
    active: true,
    start_time: '09:00',
    end_time: '17:00',
    overview_tr: '',
    overview_en: '',
    program_tr: '',
    program_en: '',
    included_tr: '',
    included_en: '',
    excluded_tr: '',
    excluded_en: '',
    notes_tr: '',
    notes_en: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/all`);
      if (res.ok) {
        const data = await res.json();
        setTours(data);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTour 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/tours/${editingTour.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/tours`;
      
      const payload = {
        title_tr: formData.title_tr,
        title_en: formData.title_en,
        description_tr: formData.description_tr || null,
        description_en: formData.description_en || null,
        badge_tr: formData.badge_tr || null,
        badge_en: formData.badge_en || null,
        price: Number(formData.price),
        active: formData.active,
        start_time: formData.start_time,
        end_time: formData.end_time,
        overview_tr: formData.overview_tr || null,
        overview_en: formData.overview_en || null,
        program_tr: formData.program_tr || null,
        program_en: formData.program_en || null,
        included_tr: formData.included_tr || null,
        included_en: formData.included_en || null,
        excluded_tr: formData.excluded_tr || null,
        excluded_en: formData.excluded_en || null,
        notes_tr: formData.notes_tr || null,
        notes_en: formData.notes_en || null,
        image_url: editingTour?.image_url || null,
        gallery: editingTour?.gallery || []
      };

      const res = await fetch(url, {
        method: editingTour ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingTour(null);
        fetchTours();
      } else {
        const err = await res.json();
        alert("Hata: " + JSON.stringify(err));
      }
    } catch (error) {
      console.error('Error saving tour:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu turu silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchTours();
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const handleMainFileUpload = async (tourId: number, file: File) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/upload-image`, {
        method: 'POST',
        body: formDataUpload
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        
        const tourToUpdate = tours.find(t => t.id === tourId);
        if (tourToUpdate) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${tourId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...tourToUpdate, image_url: data.image_url })
            });
        }
        
        fetchTours();
        const updatedTours = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/all`)).json();
        const updated = updatedTours.find((t: Tour) => t.id === tourId);
        if (updated) setEditingTour(updated);
      }
    } catch (err) {
      console.error(err);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const handleGalleryUpload = async (tourId: number, file: File) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/upload-image`, {
        method: 'POST',
        body: formDataUpload
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        
        const tourToUpdate = tours.find(t => t.id === tourId);
        if (tourToUpdate) {
            const currentGallery = tourToUpdate.gallery || [];
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${tourId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...tourToUpdate, gallery: [...currentGallery, data.image_url] })
            });
        }
        
        fetchTours();
        const updatedTours = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/all`)).json();
        const updated = updatedTours.find((t: Tour) => t.id === tourId);
        if (updated) setEditingTour(updated);
      }
    } catch (err) {
      console.error(err);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const removeGalleryImage = async (tourId: number, imageUrl: string) => {
    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;
    try {
        const tourToUpdate = tours.find(t => t.id === tourId);
        if (tourToUpdate) {
            const currentGallery = tourToUpdate.gallery || [];
            const newGallery = currentGallery.filter(img => img !== imageUrl);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${tourId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...tourToUpdate, gallery: newGallery })
            });
            fetchTours();
            const updatedTours = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/all`)).json();
            const updated = updatedTours.find((t: Tour) => t.id === tourId);
            if (updated) setEditingTour(updated);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingTour(null);
    setFormData({
      title_tr: '',
      title_en: '',
      description_tr: '',
      description_en: '',
      badge_tr: '',
      badge_en: '',
      price: 0,
      active: true,
      start_time: '09:00',
      end_time: '17:00',
      overview_tr: '',
      overview_en: '',
      program_tr: '',
      program_en: '',
      included_tr: '',
      included_en: '',
      excluded_tr: '',
      excluded_en: '',
      notes_tr: '',
      notes_en: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      title_tr: tour.title_tr,
      title_en: tour.title_en,
      description_tr: tour.description_tr || '',
      description_en: tour.description_en || '',
      badge_tr: tour.badge_tr || '',
      badge_en: tour.badge_en || '',
      price: tour.price,
      active: tour.active,
      start_time: tour.start_time || '09:00',
      end_time: tour.end_time || '17:00',
      overview_tr: tour.overview_tr || '',
      overview_en: tour.overview_en || '',
      program_tr: tour.program_tr || '',
      program_en: tour.program_en || '',
      included_tr: tour.included_tr || '',
      included_en: tour.included_en || '',
      excluded_tr: tour.excluded_tr || '',
      excluded_en: tour.excluded_en || '',
      notes_tr: tour.notes_tr || '',
      notes_en: tour.notes_en || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tur Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki turları ve detaylarını buradan yönetebilirsiniz.</p>
        </div>
        <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Yeni Tur Ekle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Tur Adı</th>
              <th className="px-6 py-4">Fiyat</th>
              <th className="px-6 py-4">Saatler</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold overflow-hidden">
                      {tour.image_url ? (
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/static/${tour.image_url}`} alt="Tour" className="w-full h-full object-cover" />
                      ) : (
                        tour.title_tr.charAt(0)
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-slate-900">{tour.title_tr}</div>
                      <div className="text-xs text-slate-500">ID: {tour.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{tour.price} ₺</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tour.start_time} - {tour.end_time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tour.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {tour.active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEditModal(tour)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg mr-2">Düzenle</button>
                  <button onClick={() => handleDelete(tour.id)} className="text-rose-600 hover:text-rose-900 bg-rose-50 px-3 py-1.5 rounded-lg">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">{editingTour ? 'Turu Düzenle' : 'Yeni Tur Ekle'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Başlık (TR) *</label>
                  <input type="text" required value={formData.title_tr} onChange={(e) => setFormData({...formData, title_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Başlık (EN) *</label>
                  <input type="text" required value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fiyat (₺) *</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>
                <div className="col-span-1 flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç Saati</label>
                        <input type="time" required value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bitiş Saati</label>
                        <input type="time" required value={formData.end_time} onChange={(e) => setFormData({...formData, end_time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                    </div>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Bilgilendirme / Banner Yazısı (TR)</label>
                  <textarea value={formData.overview_tr} onChange={(e) => setFormData({...formData, overview_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={2}></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Bilgilendirme / Banner Yazısı (EN)</label>
                  <textarea value={formData.overview_en} onChange={(e) => setFormData({...formData, overview_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={2}></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Detaylı Açıklama (TR)</label>
                  <textarea value={formData.description_tr} onChange={(e) => setFormData({...formData, description_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4}></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Detaylı Açıklama (EN)</label>
                  <textarea value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4}></textarea>
                </div>
                
                <div className="col-span-2 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2">Tur İçerikleri</h3>
                  <p className="text-xs text-slate-500 mb-4">Her bir öğeyi yeni bir satıra yazın.</p>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tur Programı (TR)</label>
                  <textarea value={formData.program_tr} onChange={(e) => setFormData({...formData, program_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={5} placeholder="Örn:&#10;Otel Transferi&#10;Ayasofya..."></textarea>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tur Programı (EN)</label>
                  <textarea value={formData.program_en} onChange={(e) => setFormData({...formData, program_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={5}></textarea>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dahil Olanlar (TR)</label>
                  <textarea value={formData.included_tr} onChange={(e) => setFormData({...formData, included_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4} placeholder="Örn:&#10;Profesyonel Şoför&#10;Su ikramı"></textarea>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dahil Olanlar (EN)</label>
                  <textarea value={formData.included_en} onChange={(e) => setFormData({...formData, included_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4}></textarea>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hariç Olanlar (TR)</label>
                  <textarea value={formData.excluded_tr} onChange={(e) => setFormData({...formData, excluded_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4} placeholder="Örn:&#10;Müze girişleri&#10;Kişisel harcamalar"></textarea>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hariç Olanlar (EN)</label>
                  <textarea value={formData.excluded_en} onChange={(e) => setFormData({...formData, excluded_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4}></textarea>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Önemli Notlar (TR)</label>
                  <textarea value={formData.notes_tr} onChange={(e) => setFormData({...formData, notes_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4} placeholder="Örn:&#10;Uygun kıyafet giyilmelidir..."></textarea>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Önemli Notlar (EN)</label>
                  <textarea value={formData.notes_en} onChange={(e) => setFormData({...formData, notes_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={4}></textarea>
                </div>
              </div>

              {editingTour && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Görseller ve Galeri</h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Ana Fotoğraf (Kapak)</label>
                    <div className="flex gap-4 items-end">
                      {editingTour.image_url && (
                        <div className="w-40 h-24 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                          <img src={`${process.env.NEXT_PUBLIC_API_URL}/static/${editingTour.image_url}`} alt="Main" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="cursor-pointer text-sm bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium">
                        Kapak Fotoğrafı Yükle
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleMainFileUpload(editingTour.id, e.target.files[0])
                        }} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Galeri Fotoğrafları (Sınırsız eklenebilir)</label>
                    <div className="flex flex-wrap gap-4 items-end">
                      {editingTour.gallery && editingTour.gallery.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm border border-slate-200 group">
                          <img src={`${process.env.NEXT_PUBLIC_API_URL}/static/${img}`} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => removeGalleryImage(editingTour.id, img)} className="text-white hover:text-red-400 bg-black/50 rounded-full p-1">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <label className="w-24 h-24 border-2 border-dashed border-indigo-200 rounded-lg flex flex-col items-center justify-center text-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors">
                        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        <span className="text-xs font-medium">Ekle</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleGalleryUpload(editingTour.id, e.target.files[0])
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">İptal</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-200">{editingTour ? 'Değişiklikleri Kaydet' : 'Turu Oluştur'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
