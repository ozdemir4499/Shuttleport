'use client';

import { useEffect, useRef } from 'react';

interface InlinePassengerSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    value: number;
    onChange: (value: number) => void;
}

export function InlinePassengerSelector({
    isOpen,
    onClose,
    value,
    onChange
}: InlinePassengerSelectorProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Scroll active item into view
    useEffect(() => {
        if (isOpen && listRef.current) {
            const activeItem = listRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'center' });
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const passengers = Array.from({ length: 13 }, (_, i) => i + 1); // 1 to 13 passengers

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            style={{ minWidth: '120px' }}
        >
            <div
                ref={listRef}
                className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-1"
            >
                {passengers.map((count) => (
                    <button
                        key={count}
                        data-active={value === count}
                        onClick={() => {
                            onChange(count);
                            onClose();
                        }}
                        className={`
                            w-full px-4 py-2.5 text-left text-sm font-bold transition-colors flex items-center justify-between group
                            ${value === count
                                ? 'bg-red-50 text-[#D32F2F]'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#D32F2F]'
                            }
                        `}
                    >
                        <span>{count} Kişi</span>
                        {value === count && (
                            <div className="w-2 h-2 rounded-full bg-[#D32F2F]"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
