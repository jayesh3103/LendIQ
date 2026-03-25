export interface Loan {
    amount: number;
    interestRate: number;
    term: number; // in months
}

export interface Currency {
    code: string; // e.g., 'INR'
    symbol: string; // e.g., '₹'
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}