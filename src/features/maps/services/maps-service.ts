/**
 * Maps API service
 */

import { apiClient } from '@/shared/services/api-client';
import { API_ENDPOINTS } from '@/shared/constants';
import type { Location, Place, DistanceCalculation } from '../types';

export interface DistanceRequest {
    origin_lat: number;
    origin_lng: number;
    destination_lat: number;
    destination_lng: number;
}

export interface PlaceSearchRequest {
    query: string;
    location_lat?: number;
    location_lng?: number;
}

class MapsService {
    /**
     * Get Google Maps API key from backend
     */
    async getApiKey(): Promise<string> {
        const response = await apiClient.get<{ api_key: string }>(API_ENDPOINTS.MAPS_KEY);
        return response.api_key;
    }

    /**
     * Calculate distance between two locations
     */
    async calculateDistance(
        origin: Location,
        destination: Location
    ): Promise<DistanceCalculation> {
        const request: DistanceRequest = {
            origin_lat: origin.lat,
            origin_lng: origin.lng,
            destination_lat: destination.lat,
            destination_lng: destination.lng,
        };

        return apiClient.post<DistanceCalculation>(
            API_ENDPOINTS.CALCULATE_DISTANCE,
            request
        );
    }

    /**
     * Search for places
     */
    async searchPlaces(
        query: string,
        userLocation?: Location
    ): Promise<Place[]> {
        const request: PlaceSearchRequest = {
            query,
            location_lat: userLocation?.lat,
            location_lng: userLocation?.lng,
        };

        const response = await apiClient.post<{ places: Place[] }>(
            API_ENDPOINTS.SEARCH_PLACES,
            request
        );

        return response.places;
    }
}

// Singleton instance
export const mapsService = new MapsService();
