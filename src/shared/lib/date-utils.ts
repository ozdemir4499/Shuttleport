/**
 * Utility functions for date and time formatting
 */

export function formatDate(date: Date, locale: string = 'tr-TR'): string {
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export function formatTime(time: string): string {
    return time;
}

export function formatDateTime(date: Date, locale: string = 'tr-TR'): string {
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}
