"use client";
import React, { useState, useEffect } from "react";

interface ExtraService {
  id: number;
  name_tr: string;
  name_en: string | null;
  price: number;
  currency: string;
  description_tr: string | null;
  description_en: string | null;
  is_default_selected: boolean;
  display_order: number;
  active: boolean;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ExtraServicesAdmin() {
  const [services, setServices] = useState<ExtraService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ExtraService | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name_tr: "",
    name_en: "",
    price: 0,
    currency: "TRY",
    description_tr: "",
    description_en: "",
    is_default_selected: false,
    display_order: 0,
    active: true,
  });

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API}/api/extra-services/admin/all`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      name_tr: "",
      name_en: "",
      price: 0,
      currency: "TRY",
      description_tr: "",
      description_en: "",
      is_default_selected: false,
      display_order: services.length + 1,
      active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (service: ExtraService) => {
    setEditingService(service);
    setForm({
      name_tr: service.name_tr,
      name_en: service.name_en || "",
      price: service.price,
      currency: service.currency,
      description_tr: service.description_tr || "",
      description_en: service.description_en || "",
      is_default_selected: service.is_default_selected,
      display_order: service.display_order,
      active: service.active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingService
        ? `${API}/api/extra-services/admin/${editingService.id}`
        : `${API}/api/extra-services/admin`;
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowModal(false);
        fetchServices();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`${API}/api/extra-services/admin/${id}`, { method: "DELETE" });
      fetchServices();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleActive = async (service: ExtraService) => {
    try {
      await fetch(`${API}/api/extra-services/admin/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !service.active }),
      });
      fetchServices();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ek Hizmetler</h1>
          <p className="text-sm text-gray-500 mt-1">
            Checkout sayfasında gösterilecek ek hizmetleri yönetin
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#0a192f] hover:bg-[#0a192f]/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Hizmet Ekle
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Sıra</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Hizmet Adı</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Fiyat</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Varsayılan</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Durum</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className={`hover:bg-gray-50/50 transition-colors ${!service.active ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-400">#{service.display_order}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{service.name_tr}</p>
                    {service.name_en && (
                      <p className="text-xs text-gray-400 mt-0.5">{service.name_en}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900">{service.price}₺</span>
                </td>
                <td className="px-6 py-4">
                  {service.is_default_selected ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Seçili
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(service)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      service.active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        service.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Henüz ek hizmet eklenmemiş</p>
            <p className="text-sm mt-1">Yukarıdaki butona tıklayarak yeni hizmet ekleyin</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingService ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Name TR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Adı (TR) *</label>
                <input
                  type="text"
                  value={form.name_tr}
                  onChange={(e) => setForm({ ...form, name_tr: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Karşılama Tabelası"
                />
              </div>
              {/* Name EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Adı (EN)</label>
                <input
                  type="text"
                  value={form.name_en}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Welcome Sign"
                />
              </div>
              {/* Price + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_default_selected}
                    onChange={(e) => setForm({ ...form, is_default_selected: e.target.checked })}
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Varsayılan seçili</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 text-green-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              </div>
            </div>
            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name_tr || !form.price}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0a192f] hover:bg-[#0a192f]/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Kaydediliyor..." : editingService ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
