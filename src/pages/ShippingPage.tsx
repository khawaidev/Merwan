import React from 'react';

export const ShippingPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Shipping & <span className="text-gradient">Delivery</span></h1>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        lineHeight: '1.7',
        color: 'var(--text-secondary)'
      }}>
        <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Digital Goods Delivery</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Merwan provides digital top-up services for Mobile Legends: Bang Bang. No physical products are shipped or delivered.
        </p>

        <h2 style={{ color: 'var(--text-primary)' }}>Delivery Timeframe</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Upon successful payment verification, the purchased diamonds are instantly and automatically credited to the provided MLBB User ID and Zone ID. Typical delivery time is under 1-2 minutes.
        </p>

        <h2 style={{ color: 'var(--text-primary)' }}>Delays</h2>
        <p>
          In rare cases of server congestion or payment gateway delays, delivery may take up to 15-30 minutes. If you do not receive your items after this period, please refer to our Refund Policy and contact support.
        </p>
      </div>
    </div>
  );
};
