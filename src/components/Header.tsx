import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user, signInWithGoogle, isLoading } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(20, 20, 20, 0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
      padding: '1rem 1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            WebkitMaskImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><path d=\'M12 0C12 0 12 10.5 24 12C24 12 13.5 12 12 24C12 24 12 13.5 0 12C0 12 10.5 12 12 0Z\'/></svg>")',
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><path d=\'M12 0C12 0 12 10.5 24 12C24 12 13.5 12 12 24C12 24 12 13.5 0 12C0 12 10.5 12 12 0Z\'/></svg>")',
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            background: 'linear-gradient(135deg, var(--accent-02) 0%, var(--brand) 50%, var(--accent-03) 100%)',
            backgroundSize: '200% 200%',
            animation: 'gleam-bg 3s ease infinite',
            filter: 'drop-shadow(0 0 8px var(--brand))'
          }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            color: 'var(--text-primary)',
            letterSpacing: '1px'
          }}>
            Mer<span className="text-gradient">wan</span> 
          </span>
        </Link>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/contact" className="hidden-mobile" style={{ color: 'var(--text-muted)' }}>Contact</Link>
          {!isLoading && (
            user ? (
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '2px solid var(--brand)',
                padding: '2px',
                transition: 'transform var(--transition-fast)'
              }}>
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                )}
              </Link>
            ) : (
              <button onClick={signInWithGoogle} className="auth-btn" style={{
                backgroundColor: 'var(--brand)',
                color: '#000',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}>
                Login
              </button>
            )
          )}
        </nav>
      </div>
    </header>
  );
};
