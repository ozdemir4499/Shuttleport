import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Aktif Araç</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Tanımlı Sabit Rota</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">128</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Aktif Fiyat Kuralı</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
          <span className="text-green-500 text-xs font-semibold">Surge & Happy Hour</span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sisteme Genel Bakış</h2>
        <p className="text-gray-600">
          Bu modern yönetim paneli üzerinden araç filonuzu, noktadan noktaya sabit rotalarınızı ve 
          zaman/yoğunluk bazlı dinamik fiyatlandırma kurallarınızı (Pricing Engine) yönetebilirsiniz.
        </p>
      </div>
    </div>
  );
}
