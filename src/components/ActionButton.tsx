import React from 'react';
import type { UserVerification } from '../types';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

interface ActionButtonProps {
  verification: UserVerification | null;
  selectedPackId: string | null;
  price: number;
  onPurchase: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  verification, 
  selectedPackId, 
  price, 
  onPurchase 
}) => {
  const { user, signInWithGoogle, isLoading } = useAuth();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current && verification?.verified && selectedPackId) {
      gsap.fromTo(buttonRef.current, 
        { scale: 0.9, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [verification?.verified, selectedPackId]);

  if (!verification?.verified) {
    // The verify button is part of the form, so we might just show a message here
    // or keep it empty until verified
    return null;
  }

  const isDisabled = !selectedPackId;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '0.75rem 1.5rem',
      backgroundColor: 'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        {!user && !isLoading ? (
          <button
            onClick={signInWithGoogle}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--brand)',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1px',
              border: '1px solid var(--brand)',
              cursor: 'pointer',
              transition: 'var(--transition-normal)',
            }}
          >
            Login to Purchase
          </button>
        ) : (
          <button
            ref={buttonRef}
            onClick={onPurchase}
            disabled={isDisabled}
            style={{
              backgroundColor: 'transparent',
              color: isDisabled ? 'var(--text-muted)' : 'var(--brand)',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1px',
              border: `1px solid ${isDisabled ? 'var(--border)' : 'var(--brand)'}`,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transition: 'var(--transition-normal)',
              opacity: isDisabled ? 0.5 : 1,
            }}
            onMouseOver={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 253, 4, 0.08)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isDisabled ? 'Select a Pack' : `PURCHASE ₹${price}`}
          </button>
        )}
      </div>
    </div>
  );
};
