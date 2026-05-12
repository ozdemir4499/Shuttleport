import React from 'react';
import Header from '@/components/layout/Header';

export default function YolcuTasimaPage() {
    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-16 pt-28 text-slate-800">
                <h1 className="text-3xl font-bold mb-8">Yolcu Taşıma Sözleşmesi</h1>
                <div className="prose lg:prose-xl">
                    <p>Son güncellenme tarihi: 13 Mayıs 2026</p>

                    <h2>1. Taraflar</h2>
                    <p>Bu sözleşme, <strong>RidePortX</strong> (bundan sonra &quot;Taşıyıcı&quot; olarak anılacaktır) ile platform üzerinden transfer hizmeti satın alan yolcu (bundan sonra &quot;Yolcu&quot; olarak anılacaktır) arasında akdedilmiştir.</p>

                    <h2>2. Sözleşmenin Konusu</h2>
                    <p>İşbu sözleşme, Yolcu&apos;nun RidePortX platformu üzerinden rezervasyon yaptığı havalimanı transferi, şehir içi/şehirler arası VIP transfer ve saatlik araç kiralama hizmetlerinin koşullarını düzenler.</p>

                    <h2>3. Taşıyıcının Yükümlülükleri</h2>
                    <ul>
                        <li>Yolcuyu belirlenen noktadan alarak varış noktasına güvenli şekilde ulaştırmak</li>
                        <li>Aracın temiz, bakımlı ve sigortalı olmasını sağlamak</li>
                        <li>Profesyonel ve ehliyet sahibi sürücü tahsis etmek</li>
                        <li>Belirtilen araç tipini veya eşdeğerini sağlamak</li>
                        <li>Uçuş takibi yaparak gecikmeli uçuşlarda bekleme süresi tanımak</li>
                    </ul>

                    <h2>4. Yolcunun Yükümlülükleri</h2>
                    <ul>
                        <li>Doğru iletişim bilgileri ve uçuş numarası vermek</li>
                        <li>Belirlenen buluşma noktasında zamanında hazır olmak</li>
                        <li>Araç kapasitesine uygun bagaj ve yolcu sayısına uymak</li>
                        <li>Araç içerisinde sigara içmemek ve araca zarar vermemek</li>
                        <li>Yasadışı madde bulundurmamak</li>
                    </ul>

                    <h2>5. Bekleme Süreleri</h2>
                    <p>Havalimanı karşılamalarında, uçak inişinden itibaren <strong>60 dakika</strong> ücretsiz bekleme süresi tanınır. Otel/adres alımlarında ise <strong>15 dakika</strong> ücretsiz bekleme süresi geçerlidir. Bu sürelerin aşılması halinde dakika başına ek ücret yansıtılabilir.</p>

                    <h2>6. İptal ve Değişiklik</h2>
                    <p>Transfer saatinden <strong>12 saat</strong> öncesine kadar yapılan iptallerde tam iade yapılır. 12 saatten az kalan iptallerde iade yapılamaz. Tarih/saat değişikliği talepleri en az 6 saat öncesinden bildirilmelidir.</p>

                    <h2>7. Sorumluluk Sınırları</h2>
                    <p>Taşıyıcı, mücbir sebepler (doğal afet, savaş, terör, pandemi, devlet müdahalesi) nedeniyle hizmetin verilememesinden sorumlu değildir. Trafik koşullarından kaynaklanan gecikmeler için en iyi çabayı gösterir ancak kesin varış süresi taahhüt etmez.</p>

                    <h2>8. Kişisel Veri Koruması</h2>
                    <p>Yolcunun kişisel verileri, 6698 sayılı KVKK kapsamında korunur. Detaylar için <strong>Gizlilik Politikası</strong> ve <strong>Veri Koruma</strong> sayfalarımızı inceleyiniz.</p>

                    <h2>9. Uyuşmazlık Çözümü</h2>
                    <p>İşbu sözleşmeden doğan uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.</p>

                    <h2>10. İletişim</h2>
                    <p>Sözleşmeye ilişkin sorularınız için <strong>info@rideportx.com</strong> adresinden bize ulaşabilirsiniz.</p>
                </div>
            </div>
        </>
    );
}
