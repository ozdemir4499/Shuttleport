/**
 * Custom hook for Google Maps integration
 */

'use client';

import { useState, useEffect } from 'react';
import { mapsService } from '../services/maps-service';

export function useGoogleMaps() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGoogleMaps = async () => {
            try {
                // Check if already loaded
                if (window.google && window.google.maps) {
                    setIsLoaded(true);
                    return;
                }

                // Get API key from backend
                const apiKey = await mapsService.getApiKey();

                // Load Google Maps script
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    setIsLoaded(true);
                };

                script.onerror = () => {
                    setError('Failed to load Google Maps');
                };

                document.head.appendChild(script);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to initialize Google Maps');
            }
        };

        loadGoogleMaps();
    }, []);

    return { isLoaded, error };
}
