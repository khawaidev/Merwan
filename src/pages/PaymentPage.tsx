import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DiamondPack, UserVerification } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as { verification: UserVerification, pack: DiamondPack } | null;
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const updateOrderStatus = async (supabaseOrderId: string, status: string) => {
    try {
      await supabase.from('orders')
        .update({ status })
        .eq('id', supabaseOrderId);
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  useEffect(() => {
    if (!state?.verification || !state?.pack) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { verification, pack } = state;

  const handleCreateOrder = async () => {
    setIsProcessing(true);
    try {
      if (!user) return;
      
      // 1. Create order in Supabase with 'waiting_for_payment' status
      const { data: supabaseOrder, error: dbErr } = await supabase.from('orders').insert({
        user_id: user.id,
        pack_id: pack.gamegemsId,
        pack_title: pack.title,
        amount: pack.price,
        payment_method: 'UPI/Card',
        status: 'waiting_for_payment'
      }).select().single();

      if (dbErr || !supabaseOrder) {
        alert('Failed to initialize order tracking');
        setIsProcessing(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: verification.userId,
          serverId: verification.serverId,
          packId: pack.gamegemsId,
          amount: pack.price
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Redirect to status page which will handle Razorpay checkout
        // For UPI intent flow, we can use the checkout script
        const options = {
          key: data.keyId,
          amount: Math.round(pack.price * 100), // in paise
          currency: 'INR',
          name: 'Merwan',
          description: `Recharge: ${pack.title}`,
          image: `${window.location.origin}/star.svg`,
          order_id: data.razorpayOrderId,
          handler: async function(response: any) {
            // Payment success!
            await updateOrderStatus(supabaseOrder.id, 'processing');
            
            // Save account
            try {
              if (user && state) {
                await supabase.from('saved_accounts').upsert({
                  user_id: user.id,
                  game_user_id: state.verification.userId,
                  game_server_id: state.verification.serverId,
                  game_username: state.verification.username,
                  last_used_at: new Date().toISOString()
                }, { onConflict: 'user_id,game_user_id,game_server_id' });
              }
            } catch (err) {
              console.error('Failed to save account:', err);
            }

            navigate('/status', { 
              state: { 
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                pack,
                verification,
                supabaseOrderId: supabaseOrder.id
              } 
            });
          },
          prefill: {
            name: verification.username,
          },
          theme: {
            color: '#00fd04'
          },
          modal: {
            ondismiss: function() {
              updateOrderStatus(supabaseOrder.id, 'canceled');
            }
          }
        };
        
        if (!(window as any).Razorpay) {
          alert('Razorpay SDK failed to load. Please check your internet connection.');
          return;
        }
        
        const rzp = new (window as any).Razorpay(options);
        
        // Handle payment failure event
        rzp.on('payment.failed', async function (response: any){
          console.error("Payment Failed", response.error);
          await updateOrderStatus(supabaseOrder.id, 'failed');
          alert('Payment Failed: ' + response.error.description);
        });
        
        rzp.open();
      } else {
        alert('Failed to create order');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Order <span className="text-gradient">Summary</span></h1>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Account</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>{verification.username}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: {verification.userId} ({verification.serverId})</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <img src={pack.imageUrl} alt={pack.title} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{pack.title}</div>
            <div style={{ color: 'var(--brand)', fontSize: '1.2rem', fontWeight: 700, marginTop: '0.5rem' }}>₹{pack.price}</div>
          </div>
        </div>
        
        <button
          onClick={handleCreateOrder}
          disabled={isProcessing}
          style={{
            width: '100%',
            backgroundColor: 'var(--brand)',
            color: '#000',
            fontWeight: 700,
            fontSize: '1.2rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.7 : 1
          }}
        >
          {isProcessing ? 'Processing...' : 'Pay with UPI / Card'}
        </button>
      </div>
    </div>
  );
};
