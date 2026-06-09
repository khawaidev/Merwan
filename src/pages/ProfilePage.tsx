import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  pack_title: string;
  pack_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export const ProfilePage: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) navigate('/');
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Auto-heal stale 'processing' orders (> 30s old → mark complete)
      const now = Date.now();
      const processedData = await Promise.all((data || []).map(async (order) => {
        if (order.status === 'processing') {
          const elapsedSecs = (now - new Date(order.created_at).getTime()) / 1000;
          if (elapsedSecs > 30) {
            await supabase.from('orders').update({ status: 'complete' }).eq('id', order.id);
            return { ...order, status: 'complete' };
          }
        }
        return order;
      }));

      setOrders(processedData);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'complete':        return '#22c55e'; // green
      case 'failed':          return '#ef4444'; // red
      case 'canceled':        return '#f59e0b'; // yellow/amber
      case 'waiting_for_payment': return '#f59e0b';
      case 'processing':      return 'var(--brand)';
      default:                return 'var(--text-secondary)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'complete':             return 'Success';
      case 'waiting_for_payment':  return 'Waiting for Payment';
      case 'processing':           return 'Pending';
      case 'canceled':             return 'Cancelled';
      case 'failed':               return 'Failed';
      default:                     return status;
    }
  };

  const activeOrders  = orders.filter(o => o.status === 'waiting_for_payment' || o.status === 'processing');
  const pastOrders    = orders.filter(o => o.status !== 'waiting_for_payment' && o.status !== 'processing');

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' +
    new Date(str).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const shortId = (id: string) => id.slice(0, 8).toUpperCase();

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '4rem' }}>

      {/* ── Profile Header ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
        gap: '2rem', marginBottom: '3rem',
        backgroundColor: 'var(--bg-card)', padding: '2rem',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 min-content' }}>
          <div style={{ position: 'relative' }}>
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile"
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--brand)', padding: '3px', backgroundColor: 'var(--bg-primary)' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '3px solid var(--brand)' }}>👤</div>
            )}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', backgroundColor: 'var(--brand)', borderRadius: '50%', border: '3px solid var(--bg-card)' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{user.user_metadata?.full_name || 'User'}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.95rem', wordBreak: 'break-all' }}>{user.email}</p>
          </div>
        </div>

        <button onClick={handleSignOut} style={{
          padding: '0.75rem 1.5rem', backgroundColor: 'transparent',
          border: '1px solid var(--border)', color: 'var(--text-primary)',
          borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600,
          transition: 'all var(--transition-fast)'
        }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(255,77,79,0.1)'; e.currentTarget.style.color = '#ff4d4f'; e.currentTarget.style.borderColor = '#ff4d4f'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          Sign Out
        </button>
      </div>

      {/* ── Section title ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>My Orders</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{orders.length} total</span>
      </div>

      {/* ── Active / Pending Orders ── */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--brand)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Tracking</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeOrders.map(order => (
              <div key={order.id} style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: `1px solid ${order.status === 'processing' ? 'var(--brand)' : '#f59e0b'}`,
                boxShadow: order.status === 'processing' ? '0 0 16px rgba(0,253,4,0.1)' : 'none'
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{order.pack_title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                      Order #{shortId(order.id)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: 'var(--brand)', fontSize: '1.2rem', fontWeight: 700 }}>₹{order.amount}</div>
                    <span style={{
                      color: getStatusColor(order.status),
                      backgroundColor: `${getStatusColor(order.status)}18`,
                      border: `1px solid ${getStatusColor(order.status)}50`,
                      padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      whiteSpace: 'nowrap'
                    }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>{formatDate(order.created_at)}</div>

                {/* Processing: Track Order button */}
                {order.status === 'processing' && (
                  <button
                    onClick={() => navigate('/status', { state: { supabaseOrderId: order.id, trackMode: true } })}
                    style={{
                      padding: '0.6rem 1.25rem',
                      backgroundColor: 'var(--brand)', color: '#000',
                      border: 'none', borderRadius: 'var(--radius-md)',
                      fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'var(--font-heading)', fontSize: '0.9rem',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    Track Order →
                  </button>
                )}

                {/* Waiting for payment */}
                {order.status === 'waiting_for_payment' && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Payment not completed. You can safely ignore this if you cancelled.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Past Orders ── */}
      {loadingOrders ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '30px', height: '30px', border: '3px solid var(--border)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🛒</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your purchase history will appear here once you make a recharge.</p>
        </div>
      ) : pastOrders.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pastOrders.map(order => (
              <div key={order.id} style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
                border: '1px solid var(--border)',
                display: 'flex', flexWrap: 'wrap',
                justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
              }}>
                {/* Left */}
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{order.pack_title}</span>
                    <span style={{
                      color: getStatusColor(order.status),
                      backgroundColor: `${getStatusColor(order.status)}18`,
                      border: `1px solid ${getStatusColor(order.status)}50`,
                      padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)',
                      fontSize: '0.68rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    #{shortId(order.id)}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                    {formatDate(order.created_at)}
                  </div>
                </div>

                {/* Right */}
                <div style={{ color: 'var(--brand)', fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>
                  ₹{order.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
