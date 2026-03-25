import { useState, useEffect } from 'react';

const useCurrency = () => {
    const [currency, setCurrency] = useState('INR');
    const [exchangeRate, setExchangeRate] = useState(1);

    useEffect(() => {
        // Fetch exchange rate data if needed
        const fetchExchangeRate = async () => {
            // Example API call to get exchange rates
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
            const data = await response.json();
            setExchangeRate(data.rates);
        };

        fetchExchangeRate();
    }, []);

    const convertCurrency = (amount, targetCurrency) => {
        if (exchangeRate[targetCurrency]) {
            return (amount * exchangeRate[targetCurrency]).toFixed(2);
        }
        return amount.toFixed(2);
    };

    return {
        currency,
        exchangeRate,
        convertCurrency,
        setCurrency,
    };
};

export default useCurrency;