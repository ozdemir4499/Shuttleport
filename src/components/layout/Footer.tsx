import Link from 'next/link';
import { Phone, Mail, MapPin, ChevronRight, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-10 md:pt-16 pb-8">
            <div className="container-custom px-4">

                {/* TOP CONTACT INFO - 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-800">
                    {/* Phone */}
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-lg mb-1">+90 (532) 417 89 63</div>
                            <div className="text-sm text-gray-400">Whatsapp & Telefon</div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-lg mb-1">info@rideportx.com</div>
                            <div className="text-sm text-gray-400">E-Posta</div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-lg mb-1">Maslak, Şişli</div>
                            <div className="text-sm text-gray-400 leading-relaxed">
                                Eski Büyükdere Cad. No:48 Kat:3
                            </div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE LINKS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-gray-800">

                    {/* Kurumsal Column */}
                    <div className="md:col-span-3">
                        <h3 className="text-lg font-bold mb-6 text-white">Kurumsal</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Turlar', href: '/turlar' },
                                { name: 'Hakkımızda', href: '/hakkimizda' },
                                { name: 'Hizmetlerimiz', href: '#' },
                                { name: 'İşveren Olun', href: '#' },
                                { name: 'Taşıyıcı Olun', href: '#' },
                                { name: 'Buluşma Noktaları', href: '#' },
                                { name: 'Araçlarımız', href: '#' },
                                { name: 'İletişim', href: '/iletisim' },
                                { name: 'S.S.S', href: '#' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group">
                                        <ChevronRight className="w-4 h-4 mr-2 text-gray-600 group-hover:text-white transition-colors" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Keşfet Columns (Spans wider area) */}
                    <div className="md:col-span-9">
                        <h3 className="text-lg font-bold mb-6 text-white">Keşfet</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {[
                                'İstanbul Havalimanı Transfer', 'Sabiha Gökçen Havalimanı Transfer', 
                                'İstanbul Havalimanı Taksi', 'Sabiha Gökçen Havalimanı Taksi',
                                'Sultanahmet Transfer', 'Taksim Transfer', 
                                'Kadıköy Transfer', 'Beşiktaş Transfer', 
                                'Şişli Transfer', 'Galataport Transfer',
                                'İstanbul Otel Transferleri', 'İstanbul Şehir Turu'
                            ].map((item) => (
                                <div key={item}>
                                    <Link href="#" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group">
                                        <ChevronRight className="w-4 h-4 mr-2 text-gray-600 group-hover:text-white transition-colors" />
                                        {item}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM COPYRIGHT */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <div className="mb-4 md:mb-0">
                        &copy; 2024 RidePortX. Tüm hakları saklıdır.
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Gizlilik ve Güvenlik</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="#" className="hover:text-white transition-colors">Yolcu Taşıma Sözleşmesi</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="#" className="hover:text-white transition-colors">Satın Alma Sözleşmesi</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="#" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="#" className="hover:text-white transition-colors">Veri Koruma</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
}
