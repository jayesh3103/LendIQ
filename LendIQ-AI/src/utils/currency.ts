export const formatCurrency = (amount: number): string => {
    return `₹${amount.toFixed(2)}`;
};

export const convertCurrency = (amount: number, conversionRate: number): number => {
    return amount * conversionRate;
};