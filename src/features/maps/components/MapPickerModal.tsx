'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, MapPin, Search, Navigation, Loader2 } from 'lucide-react';

interface Location {
    lat: number;
    lng: number;
    address: string;
    name?: string;
}

interface MapPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: Location) => void;
    title: string;
    initialLocation?: { lat: number; lng: number };
}

declare global {
    interface Window {
        google: unknown;
        initMap: () => void;
    }
    // var google: any;
}

// Default location outside component to prevent recreation
const DEFAULT_LOCATION = { lat: 41.0082, lng: 28.9784 };

export function MapPickerModal({
    isOpen,
    onClose,
    onSelectLocation,
    title,
    initialLocation
}: MapPickerModalProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mapInitializedRef = useRef(false);
    const [map, setMap] = useState<any | null>(null);
    const [marker, setMarker] = useState<any | null>(null);
    interface SearchResult { place_id?: string; description?: string; lat?: number; lng?: number; formatted_address?: string; name?: string; address?: string; [key: string]: unknown; }
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    // Memoize the location to prevent infinite loops
    const location = useMemo(() => {
        return initialLocation || DEFAULT_LOCATION;
    }, [initialLocation?.lat, initialLocation?.lng]);

    // Google Maps script yükleme
    useEffect(() => {
        if (!isOpen) return;

        const loadGoogleMaps = async () => {
            if (typeof window !== 'undefined' && window.google?.maps) {
                setIsMapLoaded(true);
                return;
            }

            // Check if script already exists
            const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => setIsMapLoaded(true));
                if (window.google?.maps) {
                    setIsMapLoaded(true);
                }
                return;
            }

            try {
                // Fetch API Key from backend
                const response = await fetch('http://localhost:8000/api/maps-key');
                if (!response.ok) throw new Error('API key fetch failed');
                const data = await response.json();
                const apiKey = data.api_key;

                if (!apiKey) {
                    setMapError('Google Maps API key bulunamadı');
                    return;
                }

                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=tr&loading=async&callback=initMap`;
                script.async = true;
                script.defer = true;

                window.initMap = () => {
                    setIsMapLoaded(true);
                };

                script.onerror = () => {
                    setMapError('Google Maps yüklenemedi. API ayarlarını kontrol edin.');
                };

                document.head.appendChild(script);
            } catch (err) {
                console.error('Error loading maps:', err);
                setMapError('Harita servisine bağlanılamadı.');
            }
        };

        loadGoogleMaps();
    }, [isOpen]);

    // Koordinatlardan adres al - Harita useEffect'ten önce tanımlandı
    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        if (!window.google?.maps) return;

        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
                { location: { lat, lng } },
                (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        setSelectedLocation({
                            lat,
                            lng,
                            address: results[0].formatted_address,
                            name: results[0].formatted_address.split(',')[0]
                        });
                    }
                }
            );
        } catch (error) {
            console.error('Geocode hatası:', error);
        }
    }, []);

    // Haritayı başlat
    useEffect(() => {
        if (!isOpen || !isMapLoaded || !mapRef.current || !window.google?.maps) return;

        // Prevent re-initialization if already initialized
        if (mapInitializedRef.current && map) return;

        try {
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: location,
                zoom: 12,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
            });

            const markerInstance = new window.google.maps.Marker({
                position: location,
                map: mapInstance,
                draggable: true,
                animation: window.google.maps.Animation.DROP,
            });

            // Marker sürükleme
            markerInstance.addListener('dragend', () => {
                const position = markerInstance.getPosition();
                if (position) {
                    reverseGeocode(position.lat(), position.lng());
                }
            });

            // Haritaya tıklama
            mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    markerInstance.setPosition(e.latLng);
                    reverseGeocode(e.latLng.lat(), e.latLng.lng());
                }
            });

            setMap(mapInstance);
            setMarker(markerInstance);
            setMapError(null);
            mapInitializedRef.current = true;

        } catch (error) {
            console.error('Harita oluşturma hatası:', error);
            setMapError('Harita yüklenirken hata oluştu');
        }
    }, [isOpen, isMapLoaded, location, map, reverseGeocode]);

    // Backend üzerinden arama
    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/search-places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.places || []);
            }
        } catch (error) {
            console.error('Arama hatası:', error);
            // Fallback: Google Places Autocomplete
            if (window.google?.maps?.places) {
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions(
                    {
                        input: query,
                        componentRestrictions: { country: 'tr' }
                    },
                    (predictions, status) => {
                        if (status === 'OK' && predictions) {
                            setSearchResults(predictions.map(p => ({
                                place_id: p.place_id,
                                name: p.structured_formatting?.main_text || p.description,
                                address: p.structured_formatting?.secondary_text || '',
                            })));
                        }
                    }
                );
            }
        }
    }, []);

    // Arama sonucu seçme
    const handleSelectSearchResult = useCallback((result: SearchResult) => {
        if (result.lat && result.lng) {
            // Backend'den gelen sonuç
            const location = {
                lat: result.lat as number,
                lng: result.lng as number,
                address: (result.address as string) || (result.formatted_address as string) || '',
                name: result.name as string
            };

            if (map && marker) {
                map.setCenter({ lat: result.lat, lng: result.lng });
                map.setZoom(15);
                marker.setPosition({ lat: result.lat, lng: result.lng });
            }

            setSelectedLocation(location);
            setSearchResults([]);
            setSearchQuery(result.name || '');
        } else if (result.place_id && window.google?.maps?.places && map) {
            // Google Places sonucu
            const placesService = new window.google.maps.places.PlacesService(map);
            placesService.getDetails(
                { placeId: result.place_id, fields: ['geometry', 'formatted_address', 'name'] },
                (place, status) => {
                    if (status === 'OK' && place?.geometry?.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();

                        if (marker) {
                            map.setCenter({ lat, lng });
                            map.setZoom(15);
                            marker.setPosition({ lat, lng });
                        }

                        setSelectedLocation({
                            lat,
                            lng,
                            address: place.formatted_address || '',
                            name: place.name
                        });
                        setSearchResults([]);
                        setSearchQuery(place.name || '');
                    }
                }
            );
        }
    }, [map, marker]);

    // Mevcut konumu al
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Tarayıcınız konum özelliğini desteklemiyor');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (map && marker) {
                    map.setCenter({ lat: latitude, lng: longitude });
                    map.setZoom(15);
                    marker.setPosition({ lat: latitude, lng: longitude });
                    reverseGeocode(latitude, longitude);
                }
                setIsLoading(false);
            },
            (error) => {
                alert('Konum alınamadı: ' + error.message);
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [map, marker, reverseGeocode]);

    // Konum seç
    const handleConfirmLocation = () => {
        if (selectedLocation) {
            onSelectLocation(selectedLocation);
            onClose();
        }
    };

    // Modal kapatıldığında temizle
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            setSelectedLocation(null);
            setMap(null);
            setMarker(null);
            mapInitializedRef.current = false;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 relative z-50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Adres, havalimanı, otel ara..."
                            className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 outline-none transition-all text-gray-900"
                        />
                        <button
                            onClick={getCurrentLocation}
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#D32F2F] hover:bg-[#b01126] flex items-center justify-center transition-colors disabled:opacity-50"
                            style={{ left: 'auto', right: '8px' }}
                            title="Konumumu bul"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                            ) : (
                                <Navigation className="w-4 h-4 text-white" />
                            )}
                        </button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto z-20">
                            {searchResults.map((result, index) => (
                                <button
                                    key={result.place_id || index}
                                    onClick={() => handleSelectSearchResult(result)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-50 last:border-0"
                                >
                                    <MapPin className="w-5 h-5 text-[#D32F2F] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {result.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {result.address}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Map */}
                <div className="flex-1 relative min-h-[400px]">
                    {mapError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-8">
                            <div className="text-red-500 mb-4">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-gray-700 text-center font-medium mb-2">{mapError}</p>
                            <p className="text-gray-500 text-sm text-center max-w-md">
                                Lütfen Google Cloud Console'dan Maps JavaScript API ve Places API'nin etkin olduğundan emin olun.
                            </p>
                        </div>
                    ) : !isMapLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-12 h-12 animate-spin text-[#D32F2F] mb-4" />
                                <p className="text-gray-600">Harita yükleniyor...</p>
                            </div>
                        </div>
                    ) : null}
                    <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
                </div>

                {/* Selected Location & Confirm */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    {selectedLocation ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-[#D32F2F] rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-gray-900 truncate">
                                        {selectedLocation.name}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        {selectedLocation.address}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmLocation}
                                className="ml-4 px-6 py-3 bg-[#D32F2F] hover:bg-[#b01126] text-white font-bold rounded-xl transition-colors flex-shrink-0"
                            >
                                Bu Konumu Seç
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            Haritadan bir konum seçin veya yukarıdan arama yapın
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
