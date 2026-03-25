import axios from 'axios';

const API_BASE_URL = 'https://api.lendiq.com';

export const fetchLoanData = async (amount: number, term: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/loans`, {
            params: {
                amount,
                term,
                currency: 'INR'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching loan data');
    }
};

export const fetchInterestRates = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/interest-rates`, {
            params: {
                currency: 'INR'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching interest rates');
    }
};