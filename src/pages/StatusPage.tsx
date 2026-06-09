import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const STATUS_MESSAGES = [
  "Verifying payment...",
  "Making purchase order...",
  "Awaiting admin approval...",
  "Processing diamond delivery...",
  "Finalizing your recharge..."
];

export const StatusPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;
  
  const [statusIdx, setStatusIdx] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/');
      return;
    }

    // Trigger recharge automation on mount
    const triggerRecharge = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        // 1. Send request to start recharge
        const response = await fetch(`${API_URL}/api/recharge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: state.orderId,
            paymentId: state.paymentId,
            userId: state.verification.userId,
            serverId: state.verification.serverId,
            packId: state.pack.gamegemsId
          })
        });
        
        const data = await response.json();
        
        if (!data.success) {
          setError('Failed to initiate recharge. Contact support.');
          return;
        }

        // 2. Poll for status
        const interval = setInterval(async () => {
          try {
            const statusRes = await fetch(`${API_URL}/api/recharge-status/${state.orderId}`);
            const statusData = await statusRes.json();
            
            if (statusData.status === 'complete') {
              clearInterval(interval);
              setIsComplete(true);
            } else if (statusData.status === 'failed') {
              clearInterval(interval);
              setError('Recharge failed. Please contact support with your order ID.');
            } else {
              // Update carousel index based on backend step or just loop
              setStatusIdx(prev => (prev + 1) % STATUS_MESSAGES.length);
            }
          } catch (e) {
            console.error(e);
          }
        }, 3000);
        
        return () => clearInterval(interval);
        
      } catch (err) {
        console.error(err);
        setError('Network error.');
      }
    };

    triggerRecharge();
  }, [state, navigate]);

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ color: '#ff4d4f', marginBottom: '1rem' }}>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '2rem', padding: '1rem 2rem', backgroundColor: 'var(--bg-secondary)', color: 'white', borderRadius: 'var(--radius-md)' }}>Return to Store</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '6rem', maxWidth: '600px' }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '4rem 2rem',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {isComplete ? (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(0, 253, 4, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
              color: 'var(--brand)',
              fontSize: '2.5rem',
              border: '2px solid var(--brand)',
              boxShadow: '0 0 20px rgba(0, 253, 4, 0.4)'
            }}>
              ✓
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand)', marginBottom: '1rem' }}>Order Made! 🎉</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Your purchase should arrive shortly (1-5 mins).
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                padding: '1rem 2rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                border: '1px solid var(--border)',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-muted)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              Back to Store
            </button>
          </>
        ) : (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              border: '4px solid var(--border)',
              borderTopColor: 'var(--brand)',
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite',
              marginBottom: '2rem',
              boxShadow: '0 0 15px rgba(0, 253, 4, 0.2)'
            }} />
            
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, height: '30px' }}>
              {STATUS_MESSAGES[statusIdx]}
            </h3>
            
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>
              Please don't close this page...
            </p>
          </>
        )}
        
      </div>
    </div>
  );
};
