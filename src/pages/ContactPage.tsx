import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)'
        }}>
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Have an issue with your recharge? We're here to help 24/7.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* WhatsApp Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'var(--transition-normal)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(0, 253, 4, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            border: '1px solid var(--brand)',
            boxShadow: '0 0 15px rgba(0, 253, 4, 0.2)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--brand)" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>WhatsApp</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Fastest response for urgent payment and recharge issues.
          </p>
          <a href="https://wa.me/918119888979" target="_blank" rel="noopener noreferrer" style={{
            color: '#000',
            backgroundColor: 'var(--brand)',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            +91 8119888979
          </a>
        </div>

        {/* Email Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'var(--transition-normal)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(236, 253, 1, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            border: '1px solid var(--accent-02)',
            boxShadow: '0 0 15px rgba(236, 253, 1, 0.2)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-02)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Email</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            For business inquiries and non-urgent support requests.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="mailto:khawaimedia@gmail.com" style={{
              color: 'var(--accent-02)',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              khawaimedia@gmail.com
            </a>
            <a href="mailto:khawidev@gmail.com" style={{
              color: 'var(--accent-02)',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              khawidev@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
