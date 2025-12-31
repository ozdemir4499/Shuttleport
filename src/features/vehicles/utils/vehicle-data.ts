import { Vehicle, Location } from '@/types';

export const mockVehicles: Vehicle[] = [
    {
        id: '1',
        name: 'Mercedes E-Class',
        type: 'sedan',
        capacity: 3,
        luggage: 2,
        pricePerKm: 2.5,
        basePrice: 50,
        image: '/vehicles/sedan.jpg',
        features: ['Klima', 'Wi-Fi', 'Su', 'Profesyonel Şoför'],
    },
    {
        id: '2',
        name: 'Mercedes Vito',
        type: 'van',
        capacity: 6,
        luggage: 4,
        pricePerKm: 3.5,
        basePrice: 80,
        image: '/vehicles/van.jpg',
        features: ['Klima', 'Wi-Fi', 'Su', 'Geniş Bagaj', 'Profesyonel Şoför'],
    },
    {
        id: '3',
        name: 'Mercedes Sprinter',
        type: 'minibus',
        capacity: 12,
        luggage: 8,
        pricePerKm: 4.5,
        basePrice: 120,
        image: '/vehicles/minibus.jpg',
        features: ['Klima', 'Wi-Fi', 'Su', 'Ekstra Geniş Bagaj', 'Profesyonel Şoför', 'USB Şarj'],
    },
    {
        id: '4',
        name: 'BMW 5 Series',
        type: 'sedan',
        capacity: 3,
        luggage: 2,
        pricePerKm: 3.0,
        basePrice: 60,
        image: '/vehicles/sedan-premium.jpg',
        features: ['Premium İç Mekan', 'Klima', 'Wi-Fi', 'Su', 'Profesyonel Şoför'],
    },
];

export const mockLocations: Location[] = [
    {
        id: '1',
        name: 'İstanbul Havalimanı (IST)',
        type: 'airport',
        coordinates: { lat: 41.2753, lng: 28.7519 },
    },
    {
        id: '2',
        name: 'Sabiha Gökçen Havalimanı (SAW)',
        type: 'airport',
        coordinates: { lat: 40.8986, lng: 29.3092 },
    },
    {
        id: '3',
        name: 'Taksim',
        type: 'address',
        coordinates: { lat: 41.0370, lng: 28.9857 },
    },
    {
        id: '4',
        name: 'Sultanahmet',
        type: 'address',
        coordinates: { lat: 41.0082, lng: 28.9784 },
    },
    {
        id: '5',
        name: 'Beşiktaş',
        type: 'address',
        coordinates: { lat: 41.0422, lng: 29.0075 },
    },
];

export const calculateDistance = (from: Location, to: Location): number => {
    // Basit mesafe hesaplama (gerçek uygulamada Google Maps API kullanılabilir)
    if (!from.coordinates || !to.coordinates) return 0;

    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = (to.coordinates.lat - from.coordinates.lat) * Math.PI / 180;
    const dLon = (to.coordinates.lng - from.coordinates.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(from.coordinates.lat * Math.PI / 180) * Math.cos(to.coordinates.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

export const calculatePrice = (vehicle: Vehicle, distance: number): number => {
    return vehicle.basePrice + (vehicle.pricePerKm * distance);
};
