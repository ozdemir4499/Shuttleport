/**
 * Utility functions for price formatting
 */

export function formatPrice(amount: number, currency: string = 'TRY'): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
    }).format(amount);
}
