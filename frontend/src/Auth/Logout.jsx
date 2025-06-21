import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const Logout = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const performLogout = () => {
      try {
        // Clear all authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenTimestamp');
        
        // Clear cart data
        clearCart();
        
        // Optional: Call logout API endpoint if you have one
        // api.post('/auth/logout').catch(err => console.error('Logout API error:', err));
        
        // Redirect to login page
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Error during logout:', error);
        // Even if there's an error, still redirect to login
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [navigate, clearCart]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;