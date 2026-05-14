'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, X, Plane, Building2, MapPinned } from 'lucide-react';

interface Location {
    lat: number;
    lng: number;
    address: string;
    name?: string;
}

interface LocationAutocompleteProps {
    type: 'origin' | 'destination';
    label: string;
    placeholder: string;
    value: Location | null;
    onChange: (location: Location | null) => void;
    isActive: boolean;
    onActivate: () => void;
    onDeactivate: () => void;
    dropdownPortalRef?: React.RefObject<HTMLDivElement | null>;
    dropdownPosition?: 'bottom' | 'right';
}

// İkon seçici - konum tipine göre
const getLocationIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('havalimanı') || lowerName.includes('airport') || lowerName.includes('hava')) {
        return <Plane className="w-4 h-4" />;
    }
    if (lowerName.includes('otel') || lowerName.includes('hotel')) {
        return <Building2 className="w-4 h-4" />;
    }
    return <MapPinned className="w-4 h-4" />;
};

export function LocationAutocomplete({
    type,
    label,
    placeholder,
    value,
    onChange,
    isActive,
    onActivate,
    onDeactivate,
    dropdownPortalRef,
    dropdownPosition = 'bottom',
}: LocationAutocompleteProps) {
    interface SearchResult { place_id?: string; description?: string; structured_formatting?: { main_text: string; secondary_text: string }; lat: number; lng: number; address: string; name: string; [key: string]: unknown; }
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const accentColor = type === 'origin' ? '#82C91E' : '#228BE6';

    // Focus input when activated
    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
            // Eğer değer varsa onu input'a yaz
            if (value?.name) {
                setSearchQuery(value.name);
            }
        }
    }, [isActive, value]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is inside the main container
            if (containerRef.current && containerRef.current.contains(target)) {
                return;
            }

            // Check if click is inside the dropdown portal container
            if (dropdownPortalRef?.current && dropdownPortalRef.current.contains(target)) {
                return;
            }

            // Click is outside both containers, close the dropdown
            onDeactivate();
            setSearchResults([]);
        };

        if (isActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActive, onDeactivate, dropdownPortalRef]);

    // Backend üzerinden arama
    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);

        if (query.length < 1) {
            setSearchResults([]);
            return;
        }

        // Debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search-places`, {
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
            } finally {
                setIsLoading(false);
            }
        }, 300);
    }, []);

    // Sonuç seçme
    const handleSelectResult = useCallback((result: SearchResult) => {
        const location: Location = {
            lat: result.lat,
            lng: result.lng,
            address: result.address,
            name: result.name
        };

        onChange(location);
        setSearchQuery(result.name);
        setSearchResults([]);
        onDeactivate();
    }, [onChange, onDeactivate]);

    // Seçimi temizle
    const handleClear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setSearchQuery('');
        setSearchResults([]);
    }, [onChange]);

    // ESC tuşu ile kapat
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onDeactivate();
            setSearchResults([]);
        }
    }, [onDeactivate]);

    return (
        <div ref={containerRef} className="relative">
            {/* Ana Buton/Input Alanı */}
            <div
                onClick={() => !isActive && onActivate()}
                className={`
                    bg-white rounded-xl shadow-md border relative h-[80px] md:h-[100px] flex items-center
                    transition-all duration-200 cursor-pointer
                    ${isActive
                        ? `border-2 shadow-lg ring-4`
                        : 'border-gray-100 hover:shadow-lg'
                    }
                `}
                style={{
                    borderColor: isActive ? accentColor : undefined,
                    // @ts-ignore
                    '--tw-ring-color': isActive ? `${accentColor}20` : undefined,
                }}
            >
                {/* İkon */}
                <div className="absolute left-4 z-10">
                    <div
                        className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-colors`}
                        style={{
                            borderColor: accentColor,
                            backgroundColor: isActive ? accentColor : 'white',
                        }}
                    >
                        <MapPin
                            className="w-5 h-5 transition-colors"
                            style={{ color: isActive ? 'white' : accentColor }}
                        />
                    </div>
                </div>

                {/* İçerik Alanı - Floating Label */}
                <div className="w-full h-full pl-[70px] pr-12 flex flex-col justify-center relative">
                    {/* Floating Label - Her zaman üstte */}
                    <label className="text-[11px] font-bold text-black uppercase mb-0.5">
                        {label}
                    </label>

                    {/* Input veya Değer Gösterimi */}
                    {isActive ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder=""
                            className="w-full text-[16px] md:text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
                            autoComplete="off"
                        />
                    ) : value ? (
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                                {value.name}
                            </span>
                            <span className="text-[11px] text-gray-400 truncate">{value.address}</span>
                        </div>
                    ) : (
                        <span className="text-sm text-gray-400">
                            {placeholder}
                        </span>
                    )}
                </div>

                {/* Temizle/Kapat Butonu */}
                {(isActive || value) && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Dropdown Sonuçlar - Portal veya Inline */}
            {isActive && (searchResults.length > 0 || isLoading) && (
                dropdownPortalRef?.current ? (
                    // Portal: Render dropdown inside parent container
                    require('react-dom').createPortal(
                        <div className={`absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto ${
                            dropdownPosition === 'right' 
                                ? 'left-full top-0 ml-4 w-80' 
                                : 'left-0 right-0 top-full mt-2'
                        }`}>
                            {isLoading ? (
                                <div className="px-4 py-6 text-center text-gray-500">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0a192f] rounded-full animate-spin"></div>
                                        <span>Aranıyor...</span>
                                    </div>
                                </div>
                            ) : (
                                searchResults.map((result, index) => (
                                    <button
                                        key={result.place_id || index}
                                        onClick={() => handleSelectResult(result)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-50 last:border-0 transition-colors"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                                        >
                                            {getLocationIcon(result.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900 truncate">
                                                {result.name}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate">
                                                {result.address}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>,
                        dropdownPortalRef.current
                    )
                ) : (
                    // Inline: Render dropdown inside component
                    <div className={`absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto ${
                        dropdownPosition === 'right' 
                            ? 'left-full top-0 ml-4 w-80' 
                            : 'left-0 right-0 top-full mt-2'
                    }`}>
                        {isLoading ? (
                            <div className="px-4 py-6 text-center text-gray-500">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0a192f] rounded-full animate-spin"></div>
                                    <span>Aranıyor...</span>
                                </div>
                            </div>
                        ) : (
                            searchResults.map((result, index) => (
                                <button
                                    key={result.place_id || index}
                                    onClick={() => handleSelectResult(result)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-50 last:border-0 transition-colors"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                                    >
                                        {getLocationIcon(result.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">
                                            {result.name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {result.address}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )
            )}

            {/* Arama ipucu */}
            {isActive && searchQuery.length === 0 && searchResults.length === 0 && !isLoading && (
                dropdownPortalRef?.current ? (
                    require('react-dom').createPortal(
                        <div className={`absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 ${
                            dropdownPosition === 'right' 
                                ? 'left-full top-0 ml-4 w-80' 
                                : 'left-0 right-0 top-full mt-2'
                        }`}>
                            <div className="text-sm text-gray-500 text-center">
                                Adres, havalimanı, otel veya hastane arayın...
                            </div>
                        </div>,
                        dropdownPortalRef.current
                    )
                ) : (
                    <div className={`absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 ${
                        dropdownPosition === 'right' 
                            ? 'left-full top-0 ml-4 w-80' 
                            : 'left-0 right-0 top-full mt-2'
                    }`}>
                        <div className="text-sm text-gray-500 text-center">
                            Adres, havalimanı, otel veya hastane arayın...
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
