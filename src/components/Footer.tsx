import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '3rem 1rem',
      backgroundColor: 'var(--bg-primary)',
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', maxWidth: '800px' }}>
        <Link to="/about" className="footer-link">About Us</Link>
        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        <Link to="/terms" className="footer-link">Terms & Conditions</Link>
        <Link to="/refund" className="footer-link">Refund & Cancellation</Link>
        <Link to="/shipping" className="footer-link">Shipping & Delivery</Link>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Merwan. All rights reserved.
      </div>
    </footer>
  );
};
