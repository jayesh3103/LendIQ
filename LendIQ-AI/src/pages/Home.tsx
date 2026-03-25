import React from 'react';
import { LoanCalculator } from '../components/LoanCalculator';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-container" style={{ backgroundColor: '#E6E6FA', padding: '20px', borderRadius: '8px' }}>
            <h1 style={{ color: '#6A5ACD' }}>Welcome to LendIQ</h1>
            <p style={{ color: '#483D8B' }}>Your intelligent loan management assistant.</p>
            <LoanCalculator />
        </div>
    );
};

export default Home;