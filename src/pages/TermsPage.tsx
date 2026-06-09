import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Terms & <span className="text-gradient">Conditions</span></h1>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        lineHeight: '1.7',
        color: 'var(--text-secondary)'
      }}>
        <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          By accessing and using Merwan, you accept and agree to be bound by the terms and provision of this agreement. 
        </p>

        <h2 style={{ color: 'var(--text-primary)' }}>2. User Responsibility</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          It is your responsibility to provide the correct MLBB User ID and Zone ID. Merwan is not liable for diamonds sent to the wrong account due to user input error.
        </p>

        <h2 style={{ color: 'var(--text-primary)' }}>3. Service Availability</h2>
        <p>
          While we strive for 24/7 uptime, services may occasionally be interrupted for maintenance or due to circumstances beyond our control.
        </p>
      </div>
    </div>
  );
};
