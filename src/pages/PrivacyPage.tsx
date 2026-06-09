import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Privacy <span className="text-gradient">Policy</span></h1>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        lineHeight: '1.7',
        color: 'var(--text-secondary)'
      }}>
        <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Information Collection</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          We collect minimal information required to process your top-up orders securely. This includes your Game ID, Zone ID, and basic profile information from your chosen login method (e.g., Google).
        </p>

        <h2 style={{ color: 'var(--text-primary)' }}>Data Security</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Your payment information is processed entirely by secure, certified third-party payment gateways (Razorpay). We do not store or have direct access to your credit card details or UPI PINs.
        </p>

        <h2 style={{ color: 'var(--text-primary)' }}>How We Use Data</h2>
        <p>
          We use your data solely for the purpose of fulfilling your MLBB diamond purchases, sending order status updates, and maintaining a history of your past successful transactions for your convenience.
        </p>
      </div>
    </div>
  );
};
