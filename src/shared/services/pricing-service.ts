// Pricing Service - API calls for vehicle pricing
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;

export interface PricingRequest {
    origin_lat: number;
    origin_lng: number;
    origin_name: string;
    destination_lat: number;
    destination_lng: number;
    destination_name: string;
    distance_km: number;
    duration_minutes: number;
    passenger_count: number;
    is_round_trip: boolean;
    is_airport_transfer: boolean;
}

export interface VehiclePricing {
    vehicle_type: string;
    vehicle_name: string;
    vehicle_name_tr: string;
    capacity: number;
    base_price: number;
    distance_price: number;
    airport_fee: number;
    subtotal: number;
    round_trip_discount: number;
    final_price: number;
    currency: string;
    price_breakdown: {
        base_fare: number;
        distance_charge: number;
        airport_fee: number;
        subtotal: number;
        discount: number;
        minimum_applied: number;
        final: number;
    };
}

export interface PricingResponse {
    route_info: {
        origin: string;
        destination: string;
        distance_km: number;
        duration_minutes: number;
        is_round_trip: boolean;
        is_airport_transfer: boolean;
        is_fixed_route: boolean;
    };
    vehicles: VehiclePricing[];
}

export interface VehicleInfo {
    type: string;
    name: string;
    name_tr: string;
    capacity: number;
    luggage_capacity: number;
    image_url: string;
    features: string[];
    base_fare: number;
    per_km_rate: number;
    airport_fee: number;
}

class PricingService {
    /**
     * Calculate pricing for a route
     */
    async calculatePricing(request: PricingRequest): Promise<PricingResponse> {
        const response = await fetch(`${API_URL}/api/pricing/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`Pricing calculation failed: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Get all available vehicles
     */
    async getVehicles(): Promise<VehicleInfo[]> {
        const response = await fetch(`${API_URL}/api/pricing/vehicles`);

        if (!response.ok) {
            throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Get fixed routes
     */
    async getFixedRoutes(): Promise<unknown> {
        const response = await fetch(`${API_URL}/api/pricing/fixed-routes`);

        if (!response.ok) {
            throw new Error(`Failed to fetch fixed routes: ${response.statusText}`);
        }

        return response.json();
    }
}

export const pricingService = new PricingService();
