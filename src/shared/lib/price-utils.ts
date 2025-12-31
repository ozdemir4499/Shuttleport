/**
 * Utility functions for price calculations
 */

import type { Vehicle } from '@/features/vehicles/types';

export function calculateVehiclePrice(
    vehicle: Vehicle,
    distanceKm: number,
    quantity: number = 1
): number {
    return vehicle.pricePerKm * distanceKm * quantity;
}

export function formatPrice(amount: number, currency: string = 'TRY'): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
    }).format(amount);
}
