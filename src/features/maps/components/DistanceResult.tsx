'use client';

import { MapPin, Clock, Route } from 'lucide-react';

interface DistanceResultProps {
    isVisible: boolean;
    distanceKm: number;
    distanceText: string;
    durationMinutes: number;
    durationText: string;
    originAddress: string;
    destinationAddress: string;
    onClose: () => void;
}

export default function DistanceResult({
    isVisible,
    distanceKm,
    distanceText,
    durationMinutes,
    durationText,
    originAddress,
    destinationAddress,
    onClose
}: DistanceResultProps) {
    if (!isVisible) return null;

    return (
        <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200 animate-in slide-in-from-top-2">
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Route className="w-5 h-5 text-green-600" />
                    Rota Bilgileri
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                    ×
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Mesafe */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Mesafe</div>
                    <div className="text-2xl font-bold text-gray-900">{distanceKm} km</div>
                    <div className="text-sm text-gray-500">{distanceText}</div>
                </div>

                {/* Süre */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">Tahmini Süre</div>
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        {durationMinutes} dk
                    </div>
                    <div className="text-sm text-gray-500">{durationText}</div>
                </div>
            </div>

            {/* Adresler */}
            <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-3 h-3 text-white" />
                    </div>
                    <div>
                        <span className="text-gray-500">Nereden:</span>
                        <span className="text-gray-900 font-medium ml-1">{originAddress}</span>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-3 h-3 text-white" />
                    </div>
                    <div>
                        <span className="text-gray-500">Nereye:</span>
                        <span className="text-gray-900 font-medium ml-1">{destinationAddress}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
