import { useState } from 'react';
import type { UserVerification } from '../types';

export const useVerification = () => {
  const [verification, setVerification] = useState<UserVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyUser = async (userId: string, serverId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Point to backend API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, serverId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVerification({
          userId,
          serverId,
          username: data.username,
          verified: true
        });
      } else {
        setError(data.error || 'Failed to verify user. Please check your ID.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { verification, isLoading, error, verifyUser };
};
