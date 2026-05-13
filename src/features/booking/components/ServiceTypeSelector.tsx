import React from 'react';
import { Car, Clock, MapPin } from 'lucide-react';

export type ServiceType = 'transfer' | 'hourly' | 'tour';

interface ServiceTypeSelectorProps {
    activeType: ServiceType;
    onChange: (type: ServiceType) => void;
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
    activeType,
    onChange,
}) => {
    return (
        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 md:gap-8 mt-1 mb-1 md:mt-0 md:mb-0 border-b border-gray-100 pb-2">
            <button
                onClick={() => onChange('transfer')}
                className={`flex items-center space-x-2 pb-2 text-sm md:text-base font-bold transition-all duration-200 border-b-2 ${activeType === 'transfer'
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                    }`}
            >
                <Car className="w-5 h-5" />
                <span>Transfer</span>
            </button>

            <button
                onClick={() => onChange('hourly')}
                className={`flex items-center space-x-2 pb-2 text-sm md:text-base font-bold transition-all duration-200 border-b-2 ${activeType === 'hourly'
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                    }`}
            >
                <Clock className="w-5 h-5" />
                <span>Saatlik Kirala</span>
            </button>

            <button
                onClick={() => onChange('tour')}
                className={`flex items-center space-x-2 pb-2 text-sm md:text-base font-bold transition-all duration-200 border-b-2 ${activeType === 'tour'
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                    }`}
            >
                <MapPin className="w-5 h-5" />
                <span>Turlar</span>
            </button>
        </div>
    );
};
