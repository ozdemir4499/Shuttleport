/**
 * Custom hook for distance calculation
 */

'use client';

import { useState } from 'react';
import { mapsService } from '../services/maps-service';
import type { Location, DistanceCalculation } from '../types';

export function useDistanceCalculation() {
    const [distance, setDistance] = useState<DistanceCalculation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateDistance = async (origin: Location, destination: Location) => {
        setLoading(true);
        setError(null);

        try {
            const result = await mapsService.calculateDistance(origin, destination);
            setDistance(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to calculate distance';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setDistance(null);
        setError(null);
    };

    return {
        distance,
        loading,
        error,
        calculateDistance,
        reset,
    };
}
