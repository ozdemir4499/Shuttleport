// Tur verileri - Tüm turların detaylı bilgileri
export interface Tour {
    id: number;
    slug: string;
    title: string;
    shortTitle: string;
    image: string;
    gallery: string[];
    badge: string | null;
    prices: {
        adult: { try: number; eur: number; usd: number; gbp: number };
        child: { try: number; eur: number; usd: number; gbp: number };
        baby: { try: number; eur: number; usd: number; gbp: number };
    };
    oldPrices: {
        adult: { try: number; eur: number; usd: number; gbp: number };
    };
    duration: string;
    durationHours: number;
    groupSize: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    overview: string;
    detailedDescription: string;
    program: {
        title: string;
        items: string[];
    }[];
    included: string[];
    excluded: string[];
    importantNotes: string[];
    category: string;
}

export const tours: Tour[] = [
    {
        id: 1,
        slug: 'istanbul-vip-8-saat',
        title: 'İstanbul VIP Şehir Turu - 8 Saat',
        shortTitle: 'VIP 8 Saatlik İstanbul Turu',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
        gallery: [
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
            'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800',
            'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800',
            'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?q=80&w=800',
            'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=800',
        ],
        badge: 'VIP',
        prices: {
            adult: { try: 8500, eur: 250, usd: 290, gbp: 215 },
            child: { try: 4250, eur: 125, usd: 145, gbp: 108 },
            baby: { try: 0, eur: 0, usd: 0, gbp: 0 },
        },
        oldPrices: {
            adult: { try: 10200, eur: 300, usd: 348, gbp: 258 },
        },
        duration: '8 Saat',
        durationHours: 8,
        groupSize: '1-6 Kişi',
        date: 'Her Gün',
        startTime: '09:00',
        endTime: '17:00',
        location: 'İstanbul',
        overview: 'Özel VIP aracınızla İstanbul\'un en önemli tarihi ve turistik noktalarını keşfedin. Profesyonel rehberimiz eşliğinde Sultanahmet, Ayasofya, Topkapı Sarayı, Kapalıçarşı ve Boğaz kıyılarını gezeceksiniz.',
        detailedDescription: 'Bu 8 saatlik VIP tur, İstanbul\'un zengin tarihini ve kültürünü keşfetmek isteyenler için mükemmel bir fırsat sunar. Lüks Mercedes Vito veya benzeri VIP aracımızla otel alımı yaparak güne başlıyoruz. Deneyimli rehberimiz eşliğinde önce Sultanahmet Meydanı\'na gidiyoruz, burada Mavi Cami\'nin muhteşem iç mekanını geziyoruz. Ardından Bizans İmparatorluğu\'nun en önemli yapısı Ayasofya\'yı ziyaret ediyoruz.',
        program: [
            {
                title: 'Sabah Programı',
                items: [
                    '09:00 - Otel alımı',
                    '09:30 - Sultanahmet Meydanı',
                    '10:00 - Mavi Cami (Sultan Ahmet Camii)',
                    '11:00 - Ayasofya Müzesi',
                    '12:30 - Topkapı Sarayı',
                ]
            },
            {
                title: 'Öğle Programı',
                items: [
                    '13:30 - Öğle yemeği molası (Sultanahmet)',
                    '14:30 - Kapalıçarşı gezisi',
                    '15:30 - Mısır Çarşısı',
                ]
            },
            {
                title: 'Akşam Programı',
                items: [
                    '16:00 - Boğaz kıyısı turu',
                    '16:30 - Ortaköy Camii & Boğaz Köprüsü manzarası',
                    '17:00 - Otele dönüş',
                ]
            }
        ],
        included: [
            'Otel\'den alma ve klimalı VIP araçla transfer',
            'Profesyonel Türkçe/İngilizce rehber',
            'Tüm müze giriş ücretleri',
            'Öğle yemeği (içecek hariç)',
            'Şişe su',
        ],
        excluded: [
            'Bahşişler',
            'Kişisel harcamalar',
            'Ekstra içecekler',
            'Öğle yemeğinde içecek',
        ],
        importantNotes: [
            'Tur her gün düzenlenmektedir',
            'Cuma günleri Mavi Cami öğle namazı sebebiyle 14:30\'a kadar kapalıdır',
            'Rahat yürüyüş ayakkabısı önerilir',
            'Cami ziyaretlerinde uygun kıyafet gereklidir',
        ],
        category: 'VIP',
    },
    {
        id: 2,
        slug: 'istanbul-vip-12-saat',
        title: 'İstanbul VIP Premium Şehir Turu - 12 Saat',
        shortTitle: 'VIP 12 Saatlik Premium İstanbul Turu',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800',
        gallery: [
            'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800',
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
            'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=800',
            'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?q=80&w=800',
            'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800',
            'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800',
        ],
        badge: 'Premium',
        prices: {
            adult: { try: 12500, eur: 370, usd: 430, gbp: 320 },
            child: { try: 6250, eur: 185, usd: 215, gbp: 160 },
            baby: { try: 0, eur: 0, usd: 0, gbp: 0 },
        },
        oldPrices: {
            adult: { try: 15000, eur: 444, usd: 516, gbp: 384 },
        },
        duration: '12 Saat',
        durationHours: 12,
        groupSize: '1-6 Kişi',
        date: 'Her Gün',
        startTime: '08:00',
        endTime: '20:00',
        location: 'İstanbul',
        overview: 'En kapsamlı İstanbul deneyimi! 12 saatlik premium VIP turumuzla tarihi yarımadadan modern İstanbul\'a, Avrupa yakasından Asya yakasına tüm şehri keşfedin. Öğle ve akşam yemeği dahil.',
        detailedDescription: 'Bu 12 saatlik premium VIP tur ile İstanbul\'u en ince ayrıntısına kadar keşfedin. Lüks Mercedes S-Class veya Mercedes V-Class aracımızla gününüze başlayın. Sabah tarihi yarımadanın ikonik mekanlarını gezdikten sonra, öğle yemeğinizi Boğaz manzaralı bir restoranda alacaksınız. Ardından Asya yakasına geçerek Çamlıca Tepesi\'nden panoramik manzaranın tadını çıkaracaksınız. Akşam saatlerinde ise Kadıköy sokaklarını keşfedip, gün batımını Kız Kulesi manzarası eşliğinde izleyeceksiniz.',
        program: [
            {
                title: 'Sabah Programı',
                items: [
                    '08:00 - Otel alımı (VIP Mercedes)',
                    '08:30 - Sultanahmet Meydanı',
                    '09:00 - Mavi Cami (Sultan Ahmet Camii)',
                    '10:00 - Ayasofya Camii',
                    '11:30 - Topkapı Sarayı ve Harem Dairesi',
                ]
            },
            {
                title: 'Öğle Programı',
                items: [
                    '13:00 - Boğaz manzaralı restoranda öğle yemeği',
                    '14:30 - Kapalıçarşı ve Mısır Çarşısı',
                    '15:30 - Süleymaniye Camii',
                    '16:00 - Boğaz köprüsünden Asya yakasına geçiş',
                ]
            },
            {
                title: 'Akşam Programı',
                items: [
                    '16:30 - Çamlıca Tepesi panoramik manzara',
                    '17:30 - Kadıköy sokaklarında yürüyüş',
                    '18:30 - Moda Sahili & Kız Kulesi manzarası',
                    '19:00 - Akşam yemeği (Kadıköy)',
                    '20:00 - Otele dönüş',
                ]
            }
        ],
        included: [
            'Otel\'den alma ve VIP Mercedes araçla transfer',
            'Profesyonel lisanslı rehber (Türkçe/İngilizce/Almanca)',
            'Tüm müze ve saray giriş ücretleri',
            'Boğaz manzaralı öğle yemeği',
            'Kadıköy\'de akşam yemeği',
            'Şişe su ve atıştırmalıklar',
            'Fotoğraf çekimi hizmeti',
        ],
        excluded: [
            'Bahşişler',
            'Alkollü içecekler',
            'Kişisel harcamalar',
            'Ekstra aktiviteler',
        ],
        importantNotes: [
            'Tur her gün düzenlenmektedir',
            'Premium araç seçenekleri: Mercedes S-Class veya V-Class',
            'Rahat yürüyüş ayakkabısı şiddetle önerilir',
            'Cami ziyaretlerinde omuzları ve dizleri örten kıyafet gereklidir',
            'Asya yakasına geçiş köprü ile yapılmaktadır',
        ],
        category: 'VIP',
    },
    {
        id: 3,
        slug: 'bogaz-gece-turu',
        title: 'Boğaz\'da Romantik Gece Turu - Akşam Yemeği Dahil',
        shortTitle: 'Boğaz Gece Turu',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800',
        gallery: [
            'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800',
            'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=800',
            'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800',
            'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?q=80&w=800',
        ],
        badge: 'Popüler',
        prices: {
            adult: { try: 7500, eur: 220, usd: 255, gbp: 190 },
            child: { try: 3750, eur: 110, usd: 128, gbp: 95 },
            baby: { try: 0, eur: 0, usd: 0, gbp: 0 },
        },
        oldPrices: {
            adult: { try: 9000, eur: 264, usd: 306, gbp: 228 },
        },
        duration: '4 Saat',
        durationHours: 4,
        groupSize: '2-30 Kişi',
        date: 'Her Gün',
        startTime: '19:00',
        endTime: '23:00',
        location: 'İstanbul',
        overview: 'İstanbul Boğazı\'nın büyüleyici gece manzarası eşliğinde özel bir tekne turu. Alkollü veya alkolsüz içecek seçenekleri ile birlikte 4 çeşit akşam yemeği dahildir.',
        detailedDescription: 'Boğaz\'ın ışıltılı gece manzarası eşliğinde unutulmaz bir deneyim yaşayın. Özel teknemizle Eminönü\'nden hareket ederek, Boğaz\'ın her iki yakasındaki sarayları, yalıları ve tarihi yapıları gezeceğiz. Rumeli Hisarı, Anadolu Hisarı, Ortaköy Camii, Dolmabahçe Sarayı ve Kız Kulesi\'ni ışıl ışıl gece manzarasıyla göreceksiniz.',
        program: [
            {
                title: 'Program',
                items: [
                    '19:00 - Otel alımı',
                    '19:30 - Eminönü iskelesinde buluşma',
                    '20:00 - Tekne hareket & hoş geldin kokteyli',
                    '20:30 - Boğaz turu başlangıcı',
                    '21:00 - Akşam yemeği servisi',
                    '22:00 - Boğaz köprüleri altından geçiş',
                    '22:30 - Kız Kulesi manzarası',
                    '23:00 - İskeleye dönüş & otele transfer',
                ]
            }
        ],
        included: [
            'Otel alımı ve bırakma transferi',
            '4 çeşit akşam yemeği',
            'Limitsiz yerli içecekler (alkollü veya alkolsuz)',
            'Canlı müzik eşliği',
            'Tekne personeli hizmeti',
        ],
        excluded: [
            'İthal alkollü içecekler',
            'Bahşişler',
            'Kişisel harcamalar',
        ],
        importantNotes: [
            'Tur hava koşullarına bağlıdır',
            'Sıcak giyinmeniz önerilir',
            'Tekne sabit olmadığı için deniz tutması yaşayanlar dikkat etmelidir',
        ],
        category: 'Deniz',
    },
    {
        id: 4,
        slug: 'princes-adalari-turu',
        title: 'Prens Adaları Günübirlik Tur - Büyükada & Heybeliada',
        shortTitle: 'Prens Adaları Turu',
        image: 'https://images.unsplash.com/photo-1568781269748-89644f299266?q=80&w=800',
        gallery: [
            'https://images.unsplash.com/photo-1568781269748-89644f299266?q=80&w=800',
            'https://images.unsplash.com/photo-1597220869819-b2bb09dd4a79?q=80&w=800',
            'https://images.unsplash.com/photo-1590608579360-ea6f8a7d8f6d?q=80&w=800',
            'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=800',
        ],
        badge: 'Günübirlik',
        prices: {
            adult: { try: 4500, eur: 130, usd: 150, gbp: 115 },
            child: { try: 2250, eur: 65, usd: 75, gbp: 58 },
            baby: { try: 0, eur: 0, usd: 0, gbp: 0 },
        },
        oldPrices: {
            adult: { try: 5400, eur: 156, usd: 180, gbp: 138 },
        },
        duration: '8 Saat',
        durationHours: 8,
        groupSize: '10-40 Kişi',
        date: 'Mart-Kasım',
        startTime: '09:00',
        endTime: '17:00',
        location: 'İstanbul',
        overview: 'Marmara Denizi\'nin incileri Prens Adaları\'nı keşfedin. Elektrikli araç turları, deniz havası ve nostaljik atmosferle dolu bir gün geçirin.',
        detailedDescription: 'İstanbul\'un stresinden uzaklaşarak Prens Adaları\'nın huzurlu atmosferinde bir gün geçirin. Büyükada ve Heybeliada\'yı ziyaret edeceğimiz bu turda, adaların tarihi evlerini, kiliselerini ve muhteşem doğasını keşfedeceksiniz. Elektrikli fayton turu ile adayı gezecek, yerel lezzetlerin tadına bakacaksınız.',
        program: [
            {
                title: 'Program',
                items: [
                    '09:00 - Kabataş iskelesinde buluşma',
                    '09:30 - Feribot ile adalara hareket',
                    '10:30 - Heybeliada varış & serbest zaman',
                    '12:00 - Büyükada\'ya geçiş',
                    '12:30 - Elektrikli fayton turu',
                    '13:30 - Öğle yemeği (Büyükada)',
                    '15:00 - Aya Yorgi Kilisesi ziyareti',
                    '16:00 - Serbest zaman & alışveriş',
                    '16:30 - İstanbul\'a dönüş feribotu',
                    '17:30 - Kabataş varış',
                ]
            }
        ],
        included: [
            'Gidiş-dönüş feribot bileti',
            'Profesyonel rehber',
            'Elektrikli fayton turu (Büyükada)',
            'Öğle yemeği',
        ],
        excluded: [
            'Kişisel harcamalar',
            'Ekstra yiyecek ve içecekler',
            'Bahşişler',
        ],
        importantNotes: [
            'Tur Mart-Kasım ayları arasında düzenlenmektedir',
            'Rahat yürüyüş ayakkabısı önerilir',
            'Güneş kremi ve şapka getirilmesi tavsiye edilir',
            'Feribot saatleri değişkenlik gösterebilir',
        ],
        category: 'Günübirlik',
    },
    {
        id: 5,
        slug: 'kapadokya-turu',
        title: 'Kapadokya 2 Gün 1 Gece Turu - Balon Turu Dahil',
        shortTitle: 'Kapadokya Balon Turu',
        image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800',
        gallery: [
            'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800',
            'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?q=80&w=800',
            'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=800',
            'https://images.unsplash.com/photo-1673279223330-81731bb8ae7f?q=80&w=800',
        ],
        badge: 'En Çok Satan',
        prices: {
            adult: { try: 18500, eur: 545, usd: 630, gbp: 470 },
            child: { try: 12000, eur: 355, usd: 410, gbp: 305 },
            baby: { try: 0, eur: 0, usd: 0, gbp: 0 },
        },
        oldPrices: {
            adult: { try: 22200, eur: 654, usd: 756, gbp: 564 },
        },
        duration: '2 Gün',
        durationHours: 48,
        groupSize: '4-15 Kişi',
        date: 'Cumartesi-Pazar',
        startTime: '06:00',
        endTime: '21:00',
        location: 'Kapadokya',
        overview: 'UNESCO Dünya Mirası Kapadokya\'yı 2 gün 1 gece konaklama ve sıcak hava balonu deneyimi ile keşfedin. Peri bacaları, yeraltı şehirleri ve eşsiz manzaralar sizi bekliyor.',
        detailedDescription: 'Dünyaca ünlü Kapadokya\'yı en kapsamlı şekilde deneyimleyin. Sabahın erken saatlerinde sıcak hava balonu ile gökyüzüne yükselecek, güneşin doğuşunu peri bacaları arasında izleyeceksiniz. Göreme Açık Hava Müzesi, Derinkuyu Yeraltı Şehri, Uçhisar Kalesi ve daha birçok tarihi mekanı ziyaret edeceksiniz.',
        program: [
            {
                title: '1. Gün',
                items: [
                    '06:00 - İstanbul Havalimanı\'ndan uçuş',
                    '07:30 - Kayseri/Nevşehir varış & transfer',
                    '09:00 - Göreme Açık Hava Müzesi',
                    '11:00 - Uçhisar Kalesi',
                    '12:30 - Öğle yemeği (yerel mutfak)',
                    '14:00 - Derinkuyu Yeraltı Şehri',
                    '16:00 - Ihlara Vadisi yürüyüşü',
                    '18:00 - Otel check-in & dinlenme',
                    '20:00 - Akşam yemeği & Türk Gecesi',
                ]
            },
            {
                title: '2. Gün',
                items: [
                    '05:00 - Sabah erkenden balon turu için alım',
                    '05:30 - Sıcak hava balonu uçuşu (1 saat)',
                    '07:30 - Şampanyalı kutlama & sertifika',
                    '09:00 - Kahvaltı (otel)',
                    '10:30 - Paşabağları & Keşişler Vadisi',
                    '12:00 - Avanos çömlek yapımı atölyesi',
                    '13:30 - Öğle yemeği',
                    '15:00 - Güvercinlik Vadisi & Aşk Vadisi',
                    '17:00 - Havalimanı transferi',
                    '19:00 - İstanbul\'a uçuş',
                    '21:00 - İstanbul varış',
                ]
            }
        ],
        included: [
            'İstanbul-Kapadokya uçak bileti (gidiş-dönüş)',
            '4 yıldızlı otelde 1 gece konaklama (kahvaltı dahil)',
            'Sıcak hava balonu turu',
            'Tüm transferler',
            'Profesyonel rehber',
            'Müze giriş ücretleri',
            '2 öğle + 1 akşam yemeği',
            'Türk Gecesi eğlencesi',
        ],
        excluded: [
            'Kişisel harcamalar',
            'Ekstra içecekler',
            'Bahşişler',
            'Seyahat sigortası',
        ],
        importantNotes: [
            'Balon turu hava koşullarına bağlıdır',
            'Balon iptal durumunda alternatif aktivite sunulur',
            'Rahat yürüyüş ayakkabısı şarttır',
            'Sabah erken kalkış gerektirir',
        ],
        category: 'Kültür',
    },
    {
        id: 6,
        slug: 'bogaz-yilbasi-turu',
        title: 'Havai Fişekler Eşliğinde Boğaz\'da Yılbaşı Kutlaması - Sınırsız Alkollü İçecek',
        shortTitle: 'Yılbaşı Boğaz Turu',
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800',
        gallery: [
            'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800',
            'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800',
            'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?q=80&w=800',
            'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=800',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
        ],
        badge: 'HELLO 2026',
        prices: {
            adult: { try: 10076, eur: 297, usd: 344, gbp: 256 },
            child: { try: 5038, eur: 149, usd: 172, gbp: 128 },
            baby: { try: 0, eur: 0, usd: 0, gbp: 0 },
        },
        oldPrices: {
            adult: { try: 12094, eur: 356, usd: 413, gbp: 307 },
        },
        duration: '6 Saat',
        durationHours: 6,
        groupSize: '50-200 Kişi',
        date: '31 Aralık 2025',
        startTime: '21:30',
        endTime: '02:00',
        location: 'İstanbul',
        overview: 'Tur, İstanbul Boğaz\'ında lüks bir yılbaşı gecesi sunuyor. Avrupa ve Asya\'yı iki kıtayı ayıran Boğaz\'ın panoramik manzarası eşliğinde dans ederken leziz gurme yemeklerin tadını çıkarın. Yeni yıla girerken havai fişek gösterilerinin keyfini çıkarabilir ve harika fotoğraflar çektirebilirsiniz.',
        detailedDescription: 'Başka hiçbir İstanbul deneyimi bu eşsiz romantik ambiyans kombinasyonuyla eşleşemez. Taze yiyecekleri eşsiz İstanbul manzaraları ve renklilimi kontrol eğlenceyle birleştirerek İstanbul\'un önde gelen Boğaz Akşam Yemeği Turunu yaratıyoruz. Akşam yemeğinden sonra profesyonel OJ\'in sunduğu eğlenceli müziğin ve geleneksel şov programlarının keyfini çıkarabilir veya sadece bir içki eşliğinde rahatayıp manzaranın keyfini çıkarabilirsiniz.',
        program: [
            {
                title: 'Gece Programı',
                items: [
                    '21:30 - Otel alımı başlangıcı',
                    '22:00 - Eminönü iskelesinde buluşma',
                    '22:30 - Tekneye biniş & hoş geldin kokteyli',
                    '23:00 - Akşam yemeği servisi başlangıcı',
                    '23:30 - Canlı müzik & dans başlangıcı',
                    '00:00 - Yılbaşı geri sayımı & havai fişek gösterisi',
                    '00:30 - Semazen gösterisi',
                    '01:00 - DJ performansı & dans',
                    '02:00 - İskeleye dönüş & otele transfer',
                ]
            }
        ],
        included: [
            'Otel\'den alma ve klimalı tur otobüsleri tarafından araçla bırakma',
            'Akşam yemeği menüsü',
            'Limitsiz yerli içecekler (alkollü veya alkolsüz)',
            'Canlı müzik & DJ performansı',
            'Semazen gösterisi',
            'Türk Çingene Dansı, Kafkas Halk Dansları',
            'Oryantal Dansçı Grup Gösterisi',
            'Geleneksel Karışık Halk Dansları',
            'Havai fişek gösterisi izleme',
        ],
        excluded: [
            'Bahşişler',
            'İthal içecekler',
            'Kişisel Harcamalar',
        ],
        importantNotes: [
            'Otel\'den alış ve bırakış şehir merkezi otelleri için geçerlidir (Fatih, Beyoğlu, Şişli, Beşiktaş otelleri)',
            'İthal alkoller dahil değildir',
            'Şık giyim kodu önerilir',
            'Tur sadece 31 Aralık tarihinde düzenlenmektedir',
        ],
        category: 'Yılbaşı',
    },
];

export function getTourBySlug(slug: string): Tour | undefined {
    return tours.find(tour => tour.slug === slug);
}

export function getTourById(id: number): Tour | undefined {
    return tours.find(tour => tour.id === id);
}
