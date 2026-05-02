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
