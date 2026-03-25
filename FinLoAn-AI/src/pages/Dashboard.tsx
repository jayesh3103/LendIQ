import React from 'react';
import { LoanCalculator } from '../components/LoanCalculator';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container" style={{ backgroundColor: '#E6E6FA', padding: '20px' }}>
            <h1 style={{ color: '#6A5ACD' }}>Welcome to LendIQ Dashboard</h1>
            <LoanCalculator />
        </div>
    );
};

export default Dashboard;