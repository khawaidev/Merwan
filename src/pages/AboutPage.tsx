import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>About <span className="text-gradient">Us</span></h1>
      
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        lineHeight: '1.7',
        color: 'var(--text-secondary)'
      }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Welcome to Merwan, your ultimate destination for lightning-fast and secure Mobile Legends: Bang Bang diamond top-ups.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          We understand that time is of the essence when you're looking to upgrade your gameplay or grab that limited-time skin. That's why our automated systems are designed to deliver your diamonds instantly, right to your MLBB account.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          Our mission is to provide gamers with a seamless, trustworthy, and premium experience. From our intuitive interface to our 24/7 automated delivery, every aspect of Merwan is built with the player in mind.
        </p>
        <p>
          Thank you for choosing Merwan. See you in the Land of Dawn!
        </p>
      </div>
    </div>
  );
};
