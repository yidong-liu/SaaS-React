// This file contains utility functions for formatting data.

export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};