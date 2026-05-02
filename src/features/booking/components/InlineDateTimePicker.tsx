'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InlineDateTimePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDateTime: (date: Date) => void;
    initialDate?: Date;
    position?: 'left' | 'right';
}

export function InlineDateTimePicker({
    isOpen,
    onClose,
    onSelectDateTime,
    initialDate,
    position = 'left'
}: InlineDateTimePickerProps) {
    const [step, setStep] = useState<'date' | 'time'>('date');
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(initialDate || new Date());
    const timeListRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const monthNames = [
        'OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN',
        'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'
    ];

    const dayNamesShort = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];

    // Reset to date step when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('date');
        }
    }, [isOpen]);

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

    // Scroll to current time when time view opens
    useEffect(() => {
        if (step === 'time' && timeListRef.current) {
            const currentHour = selectedDate.getHours();
            const currentMinute = selectedDate.getMinutes();
            const timeSlotIndex = currentHour * 4 + Math.floor(currentMinute / 15);
            const scrollPosition = timeSlotIndex * 44;
            timeListRef.current.scrollTop = scrollPosition;
        }
    }, [step, selectedDate]);

    // Get calendar days including previous and next month
    const getCalendarDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const prevMonthLastDay = new Date(year, month, 0);
        const daysInPrevMonth = prevMonthLastDay.getDate();

        const days: Array<{ day: number; isCurrentMonth: boolean; date: Date }> = [];

        // Add previous month days
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(year, month - 1, day)
            });
        }

        // Add current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        // Add next month days to complete the grid
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    // Generate time slots (15-minute intervals)
    const generateTimeSlots = () => {
        const slots: { hour: number; minute: number; display: string }[] = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                slots.push({
                    hour: h,
                    minute: m,
                    display: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                });
            }
        }
        return slots;
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) {
            setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
        }

        const newDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            selectedDate.getHours(),
            selectedDate.getMinutes()
        );
        setSelectedDate(newDate);

        // Auto-transition to time selection
        setTimeout(() => {
            setStep('time');
        }, 150);
    };

    const handleTimeClick = (hour: number, minute: number) => {
        const finalDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hour,
            minute
        );
        setSelectedDate(finalDateTime);
        onSelectDateTime(finalDateTime);
        onClose();
    };

    const isDateInPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    const isDateSelected = (date: Date) => {
        return (
            selectedDate.getDate() === date.getDate() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getFullYear() === date.getFullYear()
        );
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
        );
    };

    const isTimeSelected = (hour: number, minute: number) => {
        return selectedDate.getHours() === hour && selectedDate.getMinutes() === minute;
    };

    if (!isOpen) return null;

    const calendarDays = getCalendarDays(currentMonth);
    const timeSlots = generateTimeSlots();

    return (
        <div
            ref={dropdownRef}
            className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 ${position === 'right' ? 'right-0' : 'left-0'
                }`}
            style={{ width: '320px' }}
        >
            {/* Date Selection Step */}
            {step === 'date' && (
                <div className="p-4">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handlePreviousMonth}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="text-sm font-bold text-gray-900">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </div>
                        <button
                            onClick={handleNextMonth}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNamesShort.map((day) => (
                            <div
                                key={day}
                                className="text-center text-[10px] font-semibold text-gray-500 py-1"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((dayInfo, index) => {
                            const isPast = isDateInPast(dayInfo.date);
                            const isSelected = isDateSelected(dayInfo.date);
                            const isTodayDate = isToday(dayInfo.date);

                            return (
                                <button
                                    key={`${dayInfo.date.getTime()}-${index}`}
                                    onClick={() => !isPast && handleDateClick(dayInfo.date, dayInfo.isCurrentMonth)}
                                    disabled={isPast}
                                    className={`
                                        aspect-square rounded-lg text-xs font-medium transition-all flex items-center justify-center
                                        ${!dayInfo.isCurrentMonth ? 'text-gray-300' : ''}
                                        ${isPast
                                            ? 'text-gray-200 cursor-not-allowed'
                                            : 'hover:bg-gray-100 cursor-pointer'
                                        }
                                        ${isSelected
                                            ? 'bg-[#0a192f] text-white hover:bg-[#0a192f]'
                                            : isTodayDate && dayInfo.isCurrentMonth
                                                ? 'bg-blue-50 text-blue-600 font-bold'
                                                : dayInfo.isCurrentMonth ? 'text-gray-700' : ''
                                        }
                                    `}
                                >
                                    {dayInfo.day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Time Selection Step */}
            {step === 'time' && (
                <div className="h-[280px] overflow-hidden">
                    <div
                        ref={timeListRef}
                        className="h-full overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                    >
                        {timeSlots.map((slot) => {
                            const isSelected = isTimeSelected(slot.hour, slot.minute);
                            return (
                                <button
                                    key={`${slot.hour}-${slot.minute}`}
                                    onClick={() => handleTimeClick(slot.hour, slot.minute)}
                                    className={`
                                        w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all text-left
                                        ${isSelected
                                            ? 'bg-[#0a192f] text-white'
                                            : 'bg-white hover:bg-gray-100 text-gray-700'
                                        }
                                    `}
                                >
                                    {slot.display}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
