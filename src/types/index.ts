export interface Location {
    id: string;
    name: string;
    type: 'airport' | 'hotel' | 'address';
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface Vehicle {
    id: string;
    name: string;
    type: 'sedan' | 'suv' | 'van' | 'minibus' | 'bus';
    capacity: number;
    luggage: number;
    pricePerKm: number;
    basePrice: number;
    image: string;
    features: string[];
}

export interface TransferSearch {
    from: Location | null;
    to: Location | null;
    date: Date;
    time: string;
    passengers: number;
    returnDate?: Date;
    returnTime?: string;
    isRoundTrip: boolean;
}

export interface Reservation {
    id: string;
    transferSearch: TransferSearch;
    vehicle: Vehicle;
    totalPrice: number;
    distance: number;
    duration: number;
    passengerInfo: PassengerInfo;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
}

export interface PassengerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes?: string;
}
