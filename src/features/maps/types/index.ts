/**
 * Maps feature types
 */

export interface Location {
    lat: number;
    lng: number;
}

export interface Place {
    place_id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
}

export interface DistanceCalculation {
    distance_km: number;
    distance_text: string;
    duration_minutes: number;
    duration_text: string;
    origin_address: string;
    destination_address: string;
}

export interface MapPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: Location) => void;
    initialLocation?: Location;
    title?: string;
}
