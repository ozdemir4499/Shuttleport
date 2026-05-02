import React from 'react';

export default function KullanimPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
            <h1 className="text-3xl font-bold mb-8">Kullanım Koşulları ve Mesafeli Satış Sözleşmesi</h1>
            <div className="prose lg:prose-xl">
                <p>Son güncellenme tarihi: 29 Nisan 2026</p>
                <h2>1. Taraflar ve Kapsam</h2>
                <p>Bu sözleşme, Asitane Travel üzerinden VIP transfer ve araç kiralama hizmeti alan yolcular için geçerlidir.</p>
                <h2>2. İptal ve İade Koşulları</h2>
                <p>Transfer saatinden 12 saat öncesine kadar yapılan iptallerde %100 kesintisiz iade garantisi sunulmaktadır. 12 saatten daha az kalan iptallerde iade yapılamaz.</p>
                <h2>3. Bagaj ve Yolcu Sayısı</h2>
                <p>Seçilen aracın maksimum yolcu ve bagaj kapasitesine uyulması zorunludur. Aksi durumlarda şoför ek ücret talep etme veya sürüşü reddetme hakkına sahiptir.</p>
            </div>
        </div>
    );
}
