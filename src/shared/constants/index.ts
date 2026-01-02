/**
 * Application-wide constants
 */

export const APP_NAME = 'Shuttleport';
export const APP_VERSION = '0.1.0';

// API endpoints
export const API_ENDPOINTS = {
    MAPS_KEY: '/api/maps-key',
    CALCULATE_DISTANCE: '/api/calculate-distance',
    SEARCH_PLACES: '/api/search-places',
} as const;

// Routes
export const ROUTES = {
    HOME: '/',
    VEHICLES: '/vehicles',
    CHECKOUT: '/checkout',
    CONFIRMATION: '/confirmation',
} as const;

// Default values
export const DEFAULTS = {
    MAP_CENTER: { lat: 41.0082, lng: 28.9784 }, // Istanbul
    MAP_ZOOM: 10,
    CURRENCY: 'TRY',
    LANGUAGE: 'tr',
} as const;
