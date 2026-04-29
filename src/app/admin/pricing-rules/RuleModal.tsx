import React, { useState } from 'react';

type PricingRuleSchema = {
  name: string;
  rule_type: string;
  multiplier: number;
  start_time: string | null;
  end_time: string | null;
  days_of_week: number[] | null;
  active: boolean;
};

type RuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: PricingRuleSchema) => Promise<void>;
};

export default function RuleModal({ isOpen, onClose, onSave }: RuleModalProps) {
  const [formData, setFormData] = useState<PricingRuleSchema>({
    name: '',
    rule_type: 'surge',
    multiplier: 1.2,
    start_time: '00:00',
    end_time: '06:00',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    active: true,
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      console.error(error);
      alert("Kural kaydedilemedi. Lütfen alanları kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    const currentDays = formData.days_of_week || [];
    let newDays;
    if (currentDays.includes(dayIndex)) {
      newDays = currentDays.filter(d => d !== dayIndex);
    } else {
      newDays = [...currentDays, dayIndex].sort();
    }
    setFormData({ ...formData, days_of_week: newDays });
  };

  const daysMap = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Yeni Fiyatlandırma Kuralı</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kural Adı</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Örn: Hafta Sonu Zamı"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tip</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.rule_type}
                onChange={e => setFormData({...formData, rule_type: e.target.value})}
              >
                <option value="surge">Zam (Surge)</option>
                <option value="discount">İndirim (Happy Hour)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Çarpan (Örn: 1.20)</label>
              <input 
                type="number" 
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.multiplier}
                onChange={e => setFormData({...formData, multiplier: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Başlangıç Saati</label>
              <input 
                type="time" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.start_time || ''}
                onChange={e => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bitiş Saati</label>
              <input 
                type="time" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={formData.end_time || ''}
                onChange={e => setFormData({...formData, end_time: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Uygulanacak Günler</label>
            <div className="flex flex-wrap gap-2">
              {daysMap.map((day, index) => {
                const isSelected = formData.days_of_week?.includes(index);
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleDayToggle(index)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      isSelected 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
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
              disabled={loading}
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
