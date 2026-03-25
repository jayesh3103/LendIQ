import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1>LendIQ</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/loan-calculator">Loan Calculator</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;