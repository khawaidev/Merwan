import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  pack_title: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

const STATUS_MESSAGES = [
  "Creating customer order...",
  "Validating order ID...",
  "Awaiting admin fulfillment..."
];

export const ProfilePage: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Auto-heal 'processing' orders that have exceeded the 15-second simulation window
      const now = new Date().getTime();
      let modified = false;
      
      const processedData = await Promise.all((data || []).map(async (order) => {
        if (order.status === 'processing') {
          const createdAt = new Date(order.created_at).getTime();
          const elapsedSecs = (now - createdAt) / 1000;
          if (elapsedSecs > 15) {
            // Update db
            await supabase.from('orders').update({ status: 'complete' }).eq('id', order.id);
            order.status = 'complete';
            modified = true;
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
      case 'complete': return 'var(--success)';
      case 'failed': return 'var(--error)';
      case 'canceled': return 'var(--warning)';
      case 'waiting_for_payment': return 'var(--warning)';
      case 'processing': return 'var(--brand)';
      default: return 'var(--text-secondary)';
    }
  };

  const activeOrders = orders.filter(o => o.status === 'waiting_for_payment' || o.status === 'processing');
  const pastOrders = orders.filter(o => o.status !== 'waiting_for_payment' && o.status !== 'processing');

  // Helper for live tracking step
  const getProcessingStep = (createdAtStr: string) => {
    const elapsedSecs = (new Date().getTime() - new Date(createdAtStr).getTime()) / 1000;
    if (elapsedSecs < 5) return 0;
    if (elapsedSecs < 10) return 1;
    if (elapsedSecs < 15) return 2;
    return 2;
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      
      {/* Profile Header */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '2rem',
        marginBottom: '3rem',
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 min-content' }}>
          <div style={{ position: 'relative' }}>
            {user.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--brand)', padding: '3px', backgroundColor: 'var(--bg-primary)' }} 
              />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '3px solid var(--brand)' }}>
                👤
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '20px', height: '20px', backgroundColor: 'var(--brand)', borderRadius: '50%', border: '3px solid var(--bg-card)' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{user.user_metadata?.full_name || 'User'}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.95rem', wordBreak: 'break-all' }}>{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all var(--transition-fast)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 77, 79, 0.1)';
            e.currentTarget.style.color = '#ff4d4f';
            e.currentTarget.style.borderColor = '#ff4d4f';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>My Orders</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{orders.length} orders total</span>
      </div>
      
      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--brand)' }}>Active Tracking</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeOrders.map(order => (
              <div key={order.id} style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.5rem',
                border: `1px solid ${order.status === 'processing' ? 'var(--brand)' : 'var(--warning)'}`,
                boxShadow: order.status === 'processing' ? '0 0 15px rgba(0, 253, 4, 0.1)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>{order.pack_title}</h3>
                  <div style={{ fontWeight: 'bold', color: getStatusColor(order.status) }}>
                    {order.status === 'waiting_for_payment' ? 'Waiting for Payment' : 'Processing'}
                  </div>
                </div>
                
                {order.status === 'processing' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '3px solid var(--border)',
                      borderTopColor: 'var(--brand)',
                      borderRadius: '50%',
                      animation: 'spin 1.5s linear infinite'
                    }} />
                    <div style={{ fontWeight: 600 }}>
                      {STATUS_MESSAGES[getProcessingStep(order.created_at)]}
                    </div>
                  </div>
                )}
                
                {order.status === 'waiting_for_payment' && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                    Payment has not been completed yet. If you canceled it, you can safely ignore this.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Section */}
      
      {loadingOrders ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '30px', height: '30px', border: '3px solid var(--border)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          Loading your history...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🛒</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your purchase history will appear here once you make a recharge.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pastOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No completed orders found.</p>
          ) : (
            pastOrders.map((order) => (
              <div key={order.id} style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.5rem',
              border: '1px solid var(--border)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              
              <div style={{ flex: '1 1 250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{order.pack_title}</h3>
                  <span style={{ 
                    color: getStatusColor(order.status),
                    fontWeight: 600,
                    backgroundColor: `${getStatusColor(order.status)}15`,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '1px',
                    border: `1px solid ${getStatusColor(order.status)}40`
                  }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right', display: 'none' }} className="hidden-mobile">
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Method</div>
                  <div style={{ fontSize: '0.95rem' }}>{order.payment_method}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--brand)', fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    ₹{order.amount}
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      )}
    </div>
  );
};
