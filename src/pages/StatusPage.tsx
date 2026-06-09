import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const STEPS = [
  { label: 'Payment Confirmed', subtext: 'Your payment was verified successfully.' },
  { label: 'Creating customer order...', subtext: 'Registering your order in our system.' },
  { label: 'Validating order ID...', subtext: 'Verifying your Game User ID and Zone ID.' },
  { label: 'Awaiting admin fulfillment...', subtext: 'Admin is processing your purchase on the store.' },
  { label: 'Purchased Successfully!', subtext: 'Package should arrive in about 1 minute. 🎉' },
];

export const StatusPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // "track mode" — navigated here from Profile page with only supabaseOrderId
  const trackMode = !!state?.trackMode;

  useEffect(() => {
    if (!state?.orderId && !trackMode) {
      navigate('/');
      return;
    }

    if (trackMode && state?.supabaseOrderId) {
      // Fetch current status from Supabase and just display it
      const fetchStatus = async () => {
        const { data } = await supabase
          .from('orders')
          .select('status, created_at')
          .eq('id', state.supabaseOrderId)
          .single();

        if (!data) { setError('Order not found.'); return; }

        if (data.status === 'complete') {
          setCurrentStep(STEPS.length - 1);
          setIsComplete(true);
          return;
        }

        // Compute step from elapsed time (same logic as before)
        const elapsedSecs = (Date.now() - new Date(data.created_at).getTime()) / 1000;
        if (elapsedSecs < 5) setCurrentStep(1);
        else if (elapsedSecs < 10) setCurrentStep(2);
        else setCurrentStep(3);

        // Animate forward from that step
        let step = Math.min(
          elapsedSecs < 5 ? 1 : elapsedSecs < 10 ? 2 : 3,
          STEPS.length - 2
        );
        setCurrentStep(step);
        intervalRef.current = setInterval(async () => {
          step++;
          if (step < STEPS.length - 1) {
            setCurrentStep(step);
          } else {
            clearInterval(intervalRef.current!);
            await supabase.from('orders').update({ status: 'complete' }).eq('id', state.supabaseOrderId);
            setCurrentStep(STEPS.length - 1);
            setIsComplete(true);
          }
        }, 5000);
      };
      fetchStatus();
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }

    // Fresh payment mode
    const triggerRecharge = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/api/recharge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: state.orderId,
            paymentId: state.paymentId,
            userId: state.verification?.userId,
            serverId: state.verification?.serverId,
            packId: state.pack?.gamegemsId
          })
        });
        const data = await response.json();
        if (!data.success) { setError('Failed to initiate recharge. Contact support.'); return; }

        let step = 0;
        intervalRef.current = setInterval(async () => {
          step++;
          if (step < STEPS.length - 1) {
            setCurrentStep(step);
          } else {
            clearInterval(intervalRef.current!);
            if (state.supabaseOrderId) {
              await supabase.from('orders').update({ status: 'complete' }).eq('id', state.supabaseOrderId);
            }
            setCurrentStep(STEPS.length - 1);
            setIsComplete(true);
          }
        }, 5000);
      } catch (err) {
        setError('Network error. Please contact support.');
      }
    };

    triggerRecharge();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '6rem', maxWidth: '600px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#ff4d4f', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--bg-secondary)', color: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer' }}>Return to Store</button>
            <Link to="/contact" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--brand)', color: '#000', borderRadius: 'var(--radius-md)', fontWeight: 700, textDecoration: 'none' }}>Contact Support</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '600px' }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {isComplete ? (
            <>
              <div style={{
                width: '80px', height: '80px',
                backgroundColor: 'rgba(0, 253, 4, 0.15)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '2.5rem',
                border: '2px solid var(--brand)',
                boxShadow: '0 0 25px rgba(0, 253, 4, 0.3)'
              }}>✓</div>
              <h2 style={{ color: 'var(--brand)', fontFamily: 'var(--font-heading)' }}>Order Complete! 🎉</h2>
            </>
          ) : (
            <>
              <div style={{
                width: '56px', height: '56px',
                border: '4px solid var(--border)', borderTopColor: 'var(--brand)',
                borderRadius: '50%', animation: 'spin 1.5s linear infinite',
                margin: '0 auto 1rem auto',
                boxShadow: '0 0 15px rgba(0, 253, 4, 0.2)'
              }} />
              <h2 style={{ fontFamily: 'var(--font-heading)' }}>Processing Order</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Please keep this page open…</p>
            </>
          )}
        </div>

        {/* Vertical Steps */}
        <div style={{ position: 'relative' }}>
          {STEPS.map((step, idx) => {
            const done = idx <= currentStep;
            const active = idx === currentStep && !isComplete;
            const isFinal = idx === STEPS.length - 1;

            return (
              <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: idx < STEPS.length - 1 ? '0' : '0' }}>
                {/* Left: dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '32px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: done
                      ? (isFinal ? 'var(--brand)' : 'rgba(0,253,4,0.15)')
                      : 'var(--bg-secondary)',
                    border: done
                      ? '2px solid var(--brand)'
                      : active ? '2px solid var(--brand)' : '2px solid var(--border)',
                    transition: 'all 0.4s ease',
                    boxShadow: active ? '0 0 12px rgba(0,253,4,0.4)' : 'none',
                    fontSize: '0.85rem',
                    color: done ? 'var(--brand)' : 'var(--text-muted)',
                    fontWeight: 700,
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {done ? (active && !isFinal ? (
                      <div style={{ width: '14px', height: '14px', border: '2px solid var(--border)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : '✓') : idx + 1}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{
                      width: '2px',
                      flex: '1',
                      minHeight: '32px',
                      backgroundColor: done ? 'var(--brand)' : 'var(--border)',
                      transition: 'background-color 0.4s ease',
                      margin: '4px 0',
                    }} />
                  )}
                </div>

                {/* Right: content */}
                <div style={{ paddingBottom: idx < STEPS.length - 1 ? '1.5rem' : '0', paddingTop: '4px' }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: done ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'color 0.4s ease',
                  }}>
                    {step.label}
                  </div>
                  {done && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                      {step.subtext}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isComplete && (
            <button onClick={() => navigate('/')} style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--brand)', color: '#000',
              borderRadius: 'var(--radius-md)', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-heading)'
            }}>
              Back to Store
            </button>
          )}
          <Link to="/contact" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};
