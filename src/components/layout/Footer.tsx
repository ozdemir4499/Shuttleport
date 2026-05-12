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
                                { name: 'Taşıyıcı Olun', href: '/tasiyici' },
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
                        <Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik ve Güvenlik</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="/yolcu-tasima" className="hover:text-white transition-colors">Yolcu Taşıma Sözleşmesi</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="/satin-alma" className="hover:text-white transition-colors">Satın Alma Sözleşmesi</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="/kullanim" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
                        <span className="hidden md:inline text-gray-800">|</span>
                        <Link href="/veri-koruma" className="hover:text-white transition-colors">Veri Koruma</Link>
                    </div>
                </div>

                {/* BOTTOM BAND - Exact match to reference site */}
                <div className="pt-6 mt-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-6">

                        {/* Sol: Sosyal Medya İkonları + Copyright */}
                        <div className="flex flex-col items-center lg:items-start gap-2.5">
                            <div className="flex items-center gap-4">
                                {/* Instagram */}
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                </a>
                                {/* Facebook */}
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                {/* WhatsApp */}
                                <a href="https://api.whatsapp.com/send?phone=+905324178963&text=Merhaba%20%F0%9F%91%8B" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </a>
                                {/* TripAdvisor */}
                                <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 004.04 10.43 5.976 5.976 0 004.075-1.6L12 19.705l1.922-2.09a5.976 5.976 0 004.075 1.598 5.997 5.997 0 004.04-10.43L24 6.648h-4.35a13.573 13.573 0 00-7.644-2.353zM12 6.76c1.874 0 3.727.56 5.297 1.59h.18A4.078 4.078 0 0121.53 12.4a4.078 4.078 0 01-4.054 4.05 4.078 4.078 0 01-3.89-2.857L12 9.95l-1.585 3.643a4.078 4.078 0 01-3.89 2.857A4.078 4.078 0 012.47 12.4a4.078 4.078 0 014.053-4.05h.18A11.058 11.058 0 0112 6.76z"/>
                                    </svg>
                                </a>
                            </div>
                            <p className="text-[11px] text-gray-500">
                                Copyright &copy; {new Date().getFullYear()} RidePortX markasıdır.
                            </p>
                        </div>

                        {/* Orta: Ödeme Yöntemleri - Referans birebir */}
                        <div className="flex items-center gap-6 flex-wrap justify-center">
                            {/* 256 BIT ENCRYPTION */}
                            <div className="flex items-center gap-1.5">
                                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                                </svg>
                                <div className="text-[10px] font-bold text-gray-300 leading-[1.1]">
                                    <div>256 BIT</div>
                                    <div className="text-[8px] text-gray-500 font-normal">ENCRYPTION</div>
                                </div>
                            </div>

                            {/* PayPal */}
                            <span className="text-[18px] font-black italic tracking-tight">
                                <span className="text-[#009cde]">Pay</span><span className="text-[#003087]">Pal</span>
                            </span>

                            {/* MasterCard */}
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full bg-[#eb001b]"></div>
                                    <div className="w-5 h-5 rounded-full bg-[#f79e1b] -ml-2"></div>
                                </div>
                                <span className="text-[7px] font-semibold text-gray-400 tracking-wide">MasterCard</span>
                            </div>

                            {/* Maestro */}
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full bg-[#0099df]"></div>
                                    <div className="w-5 h-5 rounded-full bg-[#eb001b] -ml-2"></div>
                                </div>
                                <span className="text-[7px] font-semibold text-gray-400 tracking-wide">Maestro</span>
                            </div>

                            {/* VISA */}
                            <span className="text-[22px] font-black text-[#1a1f71] italic tracking-tight" style={{fontFamily: 'Arial, sans-serif'}}>VISA</span>

                            {/* VISA Electron */}
                            <div className="border border-gray-500 rounded px-1.5 py-0.5">
                                <span className="text-[13px] font-black text-[#1a1f71] italic tracking-tight" style={{fontFamily: 'Arial, sans-serif'}}>VISA</span>
                            </div>

                            {/* AMEX */}
                            <div className="flex flex-col items-center">
                                <div className="bg-[#006fcf] rounded px-2 py-1">
                                    <div className="text-[8px] font-bold text-white leading-[1.1] tracking-wider">AMERICAN</div>
                                    <div className="text-[8px] font-bold text-white leading-[1.1] tracking-wider">EXPRESS</div>
                                </div>
                            </div>

                            {/* Troy */}
                            <span className="text-[18px] font-bold text-[#00a651] tracking-tight" style={{fontFamily: 'Arial, sans-serif'}}>troy</span>
                        </div>

                        {/* Sağ: TÜRSAB Rozeti */}
                        <div className="flex-shrink-0">
                            <div className="bg-white rounded-xl px-5 py-3 flex items-center gap-3 shadow-md">
                                <div className="text-center">
                                    <div className="text-[13px] font-black text-red-600 leading-tight tracking-wide">TÜRSAB</div>
                                    <div className="text-[8px] text-gray-500 font-semibold leading-tight">DİJİTAL DOĞRULAMA</div>
                                    <div className="text-[8px] text-gray-500 font-semibold leading-tight">SİSTEMİ</div>
                                </div>
                                <div className="border-l border-gray-300 pl-3">
                                    <div className="text-[8px] text-gray-400 leading-tight">Belge No</div>
                                    <div className="text-[14px] font-bold text-gray-800 leading-tight">0000</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </footer>
    );
}
