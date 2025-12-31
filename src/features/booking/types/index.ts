/**
 * Booking feature types
 */

import type { Location } from '@/features/maps';
import type { VehicleSelection } from '@/features/vehicles/types';

export interface BookingDetails {
    origin: Location & { address: string };
    destination: Location & { address: string };
    date: Date;
    time: string;
    passengers: number;
    distance?: number;
    duration?: number;
}

export interface BookingFormData extends BookingDetails {
    vehicleSelection?: VehicleSelection;
}

export interface BookingState {
    bookingDetails: BookingDetails | null;
    vehicleSelection: VehicleSelection | null;
    totalPrice: number;
}
