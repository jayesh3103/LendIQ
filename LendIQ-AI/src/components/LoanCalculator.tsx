import React, { useState } from 'react';
import { calculateLoan } from '../utils/currency';
import './LoanCalculator.css';

const LoanCalculator: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [interestRate, setInterestRate] = useState<number>(0);
    const [term, setTerm] = useState<number>(0);
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

    const handleCalculate = () => {
        const payment = calculateLoan(amount, interestRate, term);
        setMonthlyPayment(payment);
    };

    return (
        <div className="loan-calculator" style={{ backgroundColor: '#E6E6FA', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ color: '#6A5ACD' }}>Loan Calculator</h2>
            <div>
                <label>
                    Loan Amount (INR):
                    <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                </label>
            </div>
            <div>
                <label>
                    Interest Rate (%):
                    <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
                </label>
            </div>
            <div>
                <label>
                    Term (years):
                    <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} />
                </label>
            </div>
            <button onClick={handleCalculate} style={{ backgroundColor: '#6A5ACD', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>
                Calculate
            </button>
            {monthlyPayment !== null && (
                <div style={{ marginTop: '20px', color: '#6A5ACD' }}>
                    Monthly Payment: {monthlyPayment.toFixed(2)} INR
                </div>
            )}
        </div>
    );
};

export default LoanCalculator;