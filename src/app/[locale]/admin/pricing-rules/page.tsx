"use client";
import React, { useEffect, useState } from 'react';
import RuleModal from './RuleModal';

type PricingRule = {
  id: number;
  name: string;
  rule_type: string;
  multiplier: number;
  start_time: string | null;
  end_time: string | null;
  days_of_week: number[] | null;
  active: boolean;
};

export default function PricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:8000/api/admin/rules', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRules(data);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (rule: PricingRule) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:8000/api/admin/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...rule, active: !rule.active })
      });
      if (res.ok) {
        fetchRules();
      }
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const deleteRule = async (id: number) => {
    if (!confirm("Bu kuralı silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:8000/api/admin/rules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRules();
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const handleSaveRule = async (ruleData: Record<string, unknown>) => {
    try {
      const token = localStorage.getItem('adminToken');
      const method = editingRule ? 'PUT' : 'POST';
      const url = editingRule 
        ? `http://localhost:8000/api/admin/rules/${editingRule.id}` 
        : `http://localhost:8000/api/admin/rules`;
        
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ruleData)
      });
      if (res.ok) {
        fetchRules();
      } else {
        const errText = await res.text();
        alert("Kaydetme hatası: " + errText);
        throw new Error(errText);
      }
    } catch (error: unknown) {
      console.error("Error creating rule:", error);
      alert("Ağ hatası: " + (error as Error).message);
      throw error;
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Fiyatlandırma & Kural Motoru</h2>
        <button 
          onClick={() => {
            setEditingRule(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium"
        >
          + Yeni Kural Ekle
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kural Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çarpan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saat Aralığı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rule.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rule.rule_type === 'surge' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {rule.rule_type === 'surge' ? 'Zam (Surge)' : 'İndirim'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {rule.multiplier}x 
                  <span className="text-xs text-gray-500 ml-1">
                    ({rule.multiplier > 1 ? '+' : ''}{Math.round((rule.multiplier - 1) * 100)}%)
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rule.start_time || '00:00'} - {rule.end_time || '23:59'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => toggleActive(rule)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                    rule.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                    {rule.active ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => { setEditingRule(rule); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
                  <button onClick={() => deleteRule(rule.id)} className="text-red-600 hover:text-red-900">Sil</button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Henüz tanımlı kural yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RuleModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingRule(null); }} 
        onSave={handleSaveRule}
        initialData={editingRule}
      />
    </div>
  );
}
