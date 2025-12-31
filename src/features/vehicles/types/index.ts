/**
 * Vehicle feature types
 */

export interface Vehicle {
    id: string;
    name: string;
    capacity: number;
    pricePerKm: number;
    image: string;
    description: string;
    features: string[];
}

export interface VehicleSelection {
    vehicle: Vehicle;
    quantity: number;
}
