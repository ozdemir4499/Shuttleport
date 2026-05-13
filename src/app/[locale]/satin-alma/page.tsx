import React from 'react';
import Header from '@/components/layout/Header';

export default function SatinAlmaPage() {
    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-16 pt-28 text-slate-800">
                <h1 className="text-3xl font-bold mb-8">Satın Alma Sözleşmesi</h1>
                <div className="prose lg:prose-xl">
                    <p>Son güncellenme tarihi: 13 Mayıs 2026</p>

                    <h2>1. Taraflar</h2>
                    <p><strong>SATICI:</strong> RidePortX — info@rideportx.com</p>
                    <p><strong>ALICI:</strong> Platform üzerinden hizmet satın alan gerçek veya tüzel kişi.</p>

                    <h2>2. Sözleşmenin Konusu</h2>
                    <p>İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler. Alıcı, RidePortX platformu üzerinden satın aldığı transfer, tur ve ek hizmetlerin temel nitelikleri, satış fiyatı ve ödeme koşulları hakkında bilgilendirildiğini kabul eder.</p>

                    <h2>3. Hizmet Bilgileri</h2>
                    <p>Satın alınan hizmetin türü, tarihi, güzergahı, araç tipi ve fiyatı rezervasyon onay ekranında ve e-posta ile Alıcı&apos;ya bildirilir. Hizmet bedeli, seçilen ödeme yöntemine göre (kredi kartı veya nakit) tahsil edilir.</p>

                    <h2>4. Fiyat ve Ödeme</h2>
                    <ul>
                        <li>Tüm fiyatlar KDV dahil olarak gösterilir.</li>
                        <li>Kredi kartı ile ödeme seçeneğinde %4 kart işlem ücreti uygulanabilir.</li>
                        <li>Ödeme, rezervasyon anında veya araç içinde nakit olarak yapılabilir.</li>
                        <li>Döviz bazlı fiyatlandırmalarda, işlem anındaki kur geçerlidir.</li>
                    </ul>

                    <h2>5. Cayma Hakkı</h2>
                    <p>Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi (g) bendi uyarınca, belirli bir tarihte yapılması gereken hizmetlerde cayma hakkı kullanılamaz. Ancak RidePortX, müşteri memnuniyeti kapsamında transfer saatinden <strong>12 saat</strong> öncesine kadar yapılan iptallerde tam iade sağlar.</p>

                    <h2>6. Teslimat (Hizmetin İfası)</h2>
                    <p>Hizmet, rezervasyonda belirtilen tarih ve saatte, belirtilen adres veya buluşma noktasında ifa edilir. Havalimanı transferlerinde sürücü, gelen yolcu katında isim tabelası ile karşılama yapar.</p>

                    <h2>7. Garanti ve İade</h2>
                    <ul>
                        <li>Hizmetin hiç verilememesi durumunda tam iade yapılır.</li>
                        <li>Hizmetin eksik veya hatalı verilmesi durumunda kısmi iade veya telafi hizmeti sunulur.</li>
                        <li>İade talepleri <strong>info@rideportx.com</strong> adresine yapılmalıdır.</li>
                        <li>İade işlemleri, talebin onaylanmasından itibaren <strong>10 iş günü</strong> içinde gerçekleştirilir.</li>
                    </ul>

                    <h2>8. Uyuşmazlık</h2>
                    <p>İşbu sözleşmeden doğan uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Yıllık parasal sınırlar için T.C. Ticaret Bakanlığı&apos;nın güncel tebliğleri esas alınır.</p>

                    <h2>9. Yürürlük</h2>
                    <p>Alıcı, rezervasyonu tamamladığında işbu sözleşmeyi okuduğunu ve kabul ettiğini beyan eder. Sözleşme, ödemenin yapılması ile yürürlüğe girer.</p>
                </div>
            </div>
        </>
    );
}
