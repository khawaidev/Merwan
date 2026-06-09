import React from 'react';
import { Link } from 'react-router-dom';

export const RefundPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Refund & <span className="text-gradient">Cancellation</span></h1>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        lineHeight: '1.7',
        color: 'var(--text-secondary)'
      }}>
        <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Refund Policy</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Due to the digital nature of the products (in-game diamonds), all sales are generally considered final. However, we understand that technical issues can occur.
        </p>

        <h2 style={{ color: 'var(--text-primary)' }}>Failed Recharges</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          If your payment is successfully deducted from your bank account, but the recharge has not gone through to your MLBB account within the expected timeframe, you are eligible for support and a potential refund.
        </p>
        
        <div style={{
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderLeft: '4px solid var(--warning)',
          padding: '1.5rem',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ color: 'var(--warning)', margin: '0 0 0.5rem 0' }}>How to Claim a Refund:</h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Ensure at least 15 minutes have passed since the payment.</li>
            <li style={{ marginBottom: '0.5rem' }}>Take clear screenshots of your payment receipt (showing the transaction ID).</li>
            <li style={{ marginBottom: '0.5rem' }}>Send the screenshots, your Order ID, Game ID, and Zone ID to our WhatsApp support.</li>
            <li>If our team verifies that the payment was received but the diamonds were not credited, we will issue a full refund back to your original payment method.</li>
          </ol>
        </div>

        <p style={{ marginTop: '2rem' }}>
          <Link to="/contact" style={{ 
            color: 'var(--brand)', 
            fontWeight: 600, 
            textDecoration: 'underline' 
          }}>
            Contact Support Here
          </Link>
        </p>
      </div>
    </div>
  );
};
