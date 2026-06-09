import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { UserIdForm } from '../components/UserIdForm';
import { PackGrid } from '../components/PackGrid';
import { ActionButton } from '../components/ActionButton';
import { PACKS } from '../data/packs';
import { useVerification } from '../hooks/useVerification';

export const StorePage: React.FC = () => {
  const navigate = useNavigate();
  const { verification, isLoading, error, verifyUser } = useVerification();
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  const selectedPack = PACKS.find(p => p.id === selectedPackId);

  const handlePurchase = () => {
    if (verification && selectedPack) {
      // Pass data to payment page
      navigate('/payment', { 
        state: { 
          verification, 
          pack: selectedPack 
        } 
      });
    }
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      <HeroBanner />
      
      <div className="container" style={{ maxWidth: '800px' }}>
        <UserIdForm 
          onVerify={verifyUser} 
          verification={verification} 
          isLoading={isLoading}
          error={error}
        />
        
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          opacity: verification?.verified ? 1 : 0.6,
          transition: 'opacity var(--transition-normal)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '28px', 
              height: '28px', 
              backgroundColor: verification?.verified ? 'var(--brand)' : 'var(--bg-secondary)', 
              color: verification?.verified ? '#000' : 'var(--text-muted)', 
              borderRadius: '50%',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)'
            }}>2</span>
            Select Pack
          </h3>
          
          {!verification?.verified && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>
              Please verify your User ID first to select a pack.
            </p>
          )}
          
          <PackGrid 
            packs={PACKS} 
            selectedPackId={selectedPackId} 
            onSelectPack={setSelectedPackId} 
            verified={!!verification?.verified}
          />
        </div>
      </div>
      
      <ActionButton 
        verification={verification}
        selectedPackId={selectedPackId}
        price={selectedPack?.price || 0}
        onPurchase={handlePurchase}
      />
    </div>
  );
};
