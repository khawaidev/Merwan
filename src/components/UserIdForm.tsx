import React, { useState, useEffect } from 'react';
import type { UserVerification } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface UserIdFormProps {
  onVerify: (userId: string, serverId: string) => Promise<void>;
  verification: UserVerification | null;
  isLoading: boolean;
  error: string | null;
}

export const UserIdForm: React.FC<UserIdFormProps> = ({ onVerify, verification, isLoading, error }) => {
  const { user } = useAuth();
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [showRecents, setShowRecents] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(false);

  useEffect(() => {
    if (showRecents && user) {
      fetchSavedAccounts();
    }
  }, [showRecents, user]);

  const fetchSavedAccounts = async () => {
    setLoadingRecents(true);
    try {
      const { data, error } = await supabase
        .from('saved_accounts')
        .select('*')
        .order('last_used_at', { ascending: false });
      
      if (!error && data) {
        setSavedAccounts(data);
      }
    } catch (err) {
      console.error('Error fetching recents:', err);
    } finally {
      setLoadingRecents(false);
    }
  };

  const handleSelectRecent = (account: any) => {
    setUserId(account.game_user_id);
    setServerId(account.game_server_id);
    setShowRecents(false);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setUserId(val);
  };

  const handleServerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    setServerId(val);
  };

  const isFormValid = userId.length === 10 && serverId.length === 5;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onVerify(userId, serverId);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      border: '1px solid var(--border)',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '28px', 
            height: '28px', 
            backgroundColor: 'var(--brand)', 
            color: '#000', 
            borderRadius: '50%',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)'
          }}>1</span>
          Account Details
        </h3>
        
        {user && (
          <button 
            onClick={() => setShowRecents(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Recents
          </button>
        )}
      </div>
      
      <form onSubmit={handleVerify} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>User ID</label>
          <input 
            type="text" 
            placeholder="e.g. 1084315822"
            value={userId}
            onChange={handleUserIdChange}
            maxLength={10}
            disabled={!user || isLoading || verification?.verified}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            required
          />
        </div>
        
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Zone ID</label>
          <input 
            type="text" 
            placeholder="e.g. 13347"
            value={serverId}
            onChange={handleServerIdChange}
            maxLength={5}
            disabled={!user || isLoading || verification?.verified}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            required
          />
        </div>
        
        {(!user) ? (
          <div style={{ flex: '1 1 100%', marginTop: '0.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
              Please Login / Register to verify an account.
            </p>
          </div>
        ) : (!verification?.verified) && (
          <div style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}>
            <button 
              type="submit"
              disabled={isLoading || !isFormValid}
              style={{
                backgroundColor: isLoading ? 'var(--bg-secondary)' : 'var(--brand)',
                color: isLoading ? 'var(--text-muted)' : '#000',
                fontWeight: 700,
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: !isFormValid ? 0.5 : 1,
                cursor: (!isFormValid || isLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid var(--border)', 
                    borderTopColor: 'var(--brand)', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }} />
                  Checking...
                </>
              ) : 'Verify User'}
            </button>
          </div>
        )}
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: '#ff4d4f', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {verification?.verified && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(0, 253, 4, 0.1)', 
          border: '1px solid var(--brand)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: 'var(--brand)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000'
          }}>
            ✓
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified User</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--brand)' }}>
              {verification.username}
            </div>
          </div>
        </div>
      )}

      {/* Recents Modal */}
      {showRecents && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Recent Accounts</h3>
              <button onClick={() => setShowRecents(false)} style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>&times;</button>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto' }}>
              {loadingRecents ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
              ) : savedAccounts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No saved accounts yet. Completing a recharge will save the account here!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {savedAccounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => handleSelectRecent(acc)}
                      style={{
                        textAlign: 'left',
                        padding: '1rem',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand)', fontSize: '1.1rem' }}>
                        {acc.game_username}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        ID: {acc.game_user_id} ({acc.game_server_id})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
