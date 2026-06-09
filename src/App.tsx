import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { StorePage } from './pages/StorePage';
import { PaymentPage } from './pages/PaymentPage';
import { StatusPage } from './pages/StatusPage';
import { ContactPage } from './pages/ContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<StorePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="hidden-desktop" style={{
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border)',
          padding: '2rem 1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem'
        }}>
          <Link to="/contact" style={{ 
            color: 'var(--brand)', 
            fontWeight: 600,
            fontFamily: 'var(--font-heading)'
          }}>
            Contact Support
          </Link>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
