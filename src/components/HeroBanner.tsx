import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const HeroBanner: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (titleRef.current) {
      // Simple text reveal animation
      const chars = titleRef.current.innerText.split('');
      titleRef.current.innerText = '';
      
      chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.display = 'inline-block';
        titleRef.current?.appendChild(span);
        
        gsap.to(span, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.05,
          ease: 'power3.out'
        });
      });
    }
  }, []);

  return (
    <section className="hero-section">
      {/* Soft fade downwards to match bg-primary */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(20,20,20,0.3) 0%, rgba(20,20,20,0.8) 70%, var(--bg-primary) 100%)',
        zIndex: 0
      }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h1 
          ref={titleRef}
          style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--text-primary)'
          }}
        >
          Recharge <span className="text-gradient">| Diamonds</span>
        </h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          fontFamily: 'var(--font-body)'
        }}>
          Instant MLBB top-up. Enter your ID, select a pack, and rule the battlefield.
        </p>
      </div>
    </section>
  );
};
