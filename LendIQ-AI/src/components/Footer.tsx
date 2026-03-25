import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} LendIQ. All rights reserved.</p>
                <p>Powered by AI technology for smarter financial decisions.</p>
            </div>
        </footer>
    );
};

export default Footer;