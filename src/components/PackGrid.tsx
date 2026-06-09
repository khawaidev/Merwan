import React from 'react';
import type { DiamondPack } from '../types';

interface PackGridProps {
  packs: DiamondPack[];
  selectedPackId: string | null;
  onSelectPack: (packId: string) => void;
  verified: boolean;
}

export const PackGrid: React.FC<PackGridProps> = ({ packs, selectedPackId, onSelectPack, verified }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    }}>
      {packs.map((pack) => {
        const isSelected = selectedPackId === pack.id;
        
        return (
          <div 
            key={pack.id}
            onClick={() => verified && onSelectPack(pack.id)}
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${isSelected ? 'var(--brand)' : 'var(--border)'}`,
              padding: '1rem',
              cursor: verified ? 'pointer' : 'not-allowed',
              opacity: verified ? 1 : 0.6,
              transition: 'var(--transition-normal)',
              boxShadow: isSelected ? '0 0 15px rgba(0, 253, 4, 0.3)' : 'none',
              transform: isSelected ? 'translateY(-2px)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              if (verified && !isSelected) {
                e.currentTarget.style.borderColor = 'var(--text-muted)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (verified && !isSelected) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            {pack.promoTag && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                backgroundColor: 'var(--accent-03)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 0 10px var(--accent-03)',
                zIndex: 2
              }}>
                {pack.promoTag}
              </div>
            )}
            
            <img 
              src={pack.imageUrl} 
              alt={pack.title}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'contain',
                marginBottom: '1rem',
                filter: isSelected ? 'drop-shadow(0 0 8px rgba(0, 253, 4, 0.5))' : 'none',
              }}
            />
            
            <h4 style={{ 
              fontSize: '0.9rem', 
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: isSelected ? 'var(--brand)' : 'var(--text-primary)',
              minHeight: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {pack.title}
            </h4>
            
            <div style={{
              width: '100%',
              backgroundColor: isSelected ? 'rgba(0, 253, 4, 0.1)' : 'var(--bg-secondary)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              color: isSelected ? 'var(--brand)' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '1.1rem',
              marginTop: 'auto'
            }}>
              ₹{pack.price}
            </div>
          </div>
        );
      })}
    </div>
  );
};
