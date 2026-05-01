import React, { useState, useEffect, useRef } from 'react';
import { LocationAutocomplete } from '@/features/maps/components/LocationAutocomplete';

type FixedRouteSchema = {
  origin: string;
  destination: string;
  vehicle_id: number;
  price: number;
  discount_percent: number;
  active: boolean;
};

type Vehicle = {
  id: number;
  vehicle_type: string;
  name_en: string;
  name_tr: string;
};

type RouteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (route: FixedRouteSchema) => Promise<void>;
  initialData?: FixedRouteSchema | null;
};

export default function RouteModal({ isOpen, onClose, onSave, initialData }: RouteModalProps) {
  const [formData, setFormData] = useState<FixedRouteSchema>({
    origin: '',
    destination: '',
    vehicle_id: 0,
    price: 1500,
    discount_percent: 0,
    active: true,
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<'origin' | 'destination' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(initialData);
    } else if (isOpen) {
      setFormData({
        origin: '',
        destination: '',
        vehicle_id: 0,
        price: 1500,
        discount_percent: 0,
        active: true,
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('https://turizm.bedirkaraabali.com/api/admin/vehicles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
        if (data.length > 0 && formData.vehicle_id === 0) {
          setFormData(prev => ({ ...prev, vehicle_id: data[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: unknown) {
      console.error(error);
      alert("Rota kaydedilemedi. Lütfen tüm alanları kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-visible relative">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{initialData ? 'Rotayı Düzenle' : 'Yeni Rota Ekle'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative z-20">
              <LocationAutocomplete 
                type="origin"
                label="Kalkış Noktası"
                placeholder="Örn: Istanbul Airport"
                value={formData.origin ? { lat: 0, lng: 0, address: formData.origin, name: formData.origin } : null}
                onChange={(loc) => setFormData({...formData, origin: loc ? (loc.name || loc.address) : ''})}
                isActive={activeInput === 'origin'}
                onActivate={() => setActiveInput('origin')}
                onDeactivate={() => setActiveInput(null)}
                dropdownPosition="right"
              />
            </div>
            <div className="relative z-10">
              <LocationAutocomplete 
                type="destination"
                label="Varış Noktası"
                placeholder="Örn: Taksim"
                value={formData.destination ? { lat: 0, lng: 0, address: formData.destination, name: formData.destination } : null}
                onChange={(loc) => setFormData({...formData, destination: loc ? (loc.name || loc.address) : ''})}
                isActive={activeInput === 'destination'}
                onActivate={() => setActiveInput('destination')}
                onDeactivate={() => setActiveInput(null)}
                dropdownPosition="right"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Araç Tipi</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={formData.vehicle_id}
              onChange={e => setFormData({...formData, vehicle_id: parseInt(e.target.value)})}
              required
            >
              <option value="0" disabled>Araç Seçiniz</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name_en} ({v.vehicle_type})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sabit Fiyat (₺)</label>
              <input 
                type="number" 
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">İndirim Yüzdesi (%)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.discount_percent}
                onChange={e => setFormData({...formData, discount_percent: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={loading || formData.vehicle_id === 0}
              className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
