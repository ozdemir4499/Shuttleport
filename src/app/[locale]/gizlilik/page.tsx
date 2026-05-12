import React from 'react';
import Header from '@/components/layout/Header';

export default function GizlilikPage() {
    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-16 pt-28 text-slate-800">
                <h1 className="text-3xl font-bold mb-8">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>
                <div className="prose lg:prose-xl">
                    <p>Son güncellenme tarihi: 29 Nisan 2026</p>
                    <h2>1. Veri Sorumlusu</h2>
                    <p>Kişisel verileriniz, veri sorumlusu sıfatıyla RidePortX tarafından KVKK (6698 sayılı kanun) ve GDPR uyumlu olarak işlenmektedir.</p>
                    <h2>2. Hangi Verileri Topluyoruz?</h2>
                    <p>Transfer süreçlerini yönetebilmek için: Ad, Soyad, Telefon, E-posta, Uçuş numarası ve Konum bilgilerinizi topluyoruz.</p>
                    <h2>3. Veri Silme Talebi</h2>
                    <p>Sistemimizde kayıtlı olan tüm verilerinizin &quot;Unutulma Hakkı&quot; kapsamında silinmesini talep etmek için <strong>info@rideportx.com</strong> adresine e-posta gönderebilirsiniz. Talebiniz 48 saat içinde işleme alınacaktır.</p>
                </div>
            </div>
        </>
    );
}
