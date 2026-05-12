import React from 'react';
import Header from '@/components/layout/Header';

export default function VeriKorumaPage() {
    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-16 pt-28 text-slate-800">
                <h1 className="text-3xl font-bold mb-8">Veri Koruma ve KVKK Politikası</h1>
                <div className="prose lg:prose-xl">
                    <p>Son güncellenme tarihi: 13 Mayıs 2026</p>

                    <h2>1. Veri Sorumlusu</h2>
                    <p><strong>RidePortX</strong>, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemektedir.</p>

                    <h2>2. İşlenen Kişisel Veriler</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Veri Kategorisi</th>
                                <th>Örnekler</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Kimlik Bilgileri</td>
                                <td>Ad, Soyad</td>
                            </tr>
                            <tr>
                                <td>İletişim Bilgileri</td>
                                <td>Telefon, E-posta</td>
                            </tr>
                            <tr>
                                <td>Lokasyon Bilgileri</td>
                                <td>Alış/bırakış adresleri</td>
                            </tr>
                            <tr>
                                <td>Uçuş Bilgileri</td>
                                <td>Uçuş numarası, havalimanı</td>
                            </tr>
                            <tr>
                                <td>Finansal Bilgiler</td>
                                <td>Ödeme yöntemi tercihi (kart bilgileri saklanmaz)</td>
                            </tr>
                            <tr>
                                <td>Çerez Verileri</td>
                                <td>Oturum, tercihler, analitik (onaya tabi)</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>3. Verilerin İşlenme Amaçları</h2>
                    <ul>
                        <li>Transfer hizmetinin sağlanması ve rezervasyon yönetimi</li>
                        <li>Sürücü ataması ve rota planlaması</li>
                        <li>Fatura ve ödeme işlemleri</li>
                        <li>Müşteri destek hizmetleri</li>
                        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                        <li>Hizmet kalitesinin iyileştirilmesi (anonim analitik)</li>
                    </ul>

                    <h2>4. Verilerin Aktarılması</h2>
                    <p>Kişisel verileriniz, yalnızca hizmetin ifası için gerekli olduğu durumlarda şu taraflarla paylaşılabilir:</p>
                    <ul>
                        <li><strong>Sürücüler:</strong> Ad, telefon ve transfer detayları</li>
                        <li><strong>Ödeme altyapısı:</strong> Ödeme işlemi için banka/ödeme kuruluşu</li>
                        <li><strong>Yasal zorunluluk:</strong> Yetkili kamu kurum ve kuruluşları</li>
                    </ul>
                    <p>Verileriniz yurt dışına aktarılmaz. Analitik hizmetler (Google Analytics) için Google Consent Mode v2 kullanılmakta olup, çerez onayınız alınmadan veri toplanmaz.</p>

                    <h2>5. Veri Saklama Süreleri</h2>
                    <ul>
                        <li>Rezervasyon verileri: Hizmet tarihinden itibaren <strong>5 yıl</strong> (yasal yükümlülük)</li>
                        <li>İletişim verileri: Hesap aktif olduğu sürece</li>
                        <li>Çerez verileri: Maksimum <strong>13 ay</strong></li>
                    </ul>

                    <h2>6. Veri Sahibinin Hakları (KVKK Madde 11)</h2>
                    <p>Kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
                    <ul>
                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                        <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
                        <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme</li>
                        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                        <li>KVKK Madde 7 kapsamında silinmesini veya yok edilmesini isteme</li>
                        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                        <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
                    </ul>

                    <h2>7. Başvuru Yöntemi</h2>
                    <p>Yukarıdaki haklarınızı kullanmak için <strong>info@rideportx.com</strong> adresine kimliğinizi doğrulayan bilgilerle birlikte başvurabilirsiniz. Başvurularınız <strong>30 gün</strong> içinde ücretsiz olarak sonuçlandırılır.</p>

                    <h2>8. Çerez Politikası</h2>
                    <p>Sitemizde Google Consent Mode v2 entegrasyonu kullanılmaktadır. Zorunlu çerezler dışındaki tüm çerezler (analitik, pazarlama) ancak açık onayınızla aktif hale gelir. Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz.</p>

                    <h2>9. Güncelleme</h2>
                    <p>Bu politika, yasal değişiklikler veya hizmet güncellemeleri doğrultusunda revize edilebilir. Güncel versiyona her zaman bu sayfadan erişebilirsiniz.</p>
                </div>
            </div>
        </>
    );
}
