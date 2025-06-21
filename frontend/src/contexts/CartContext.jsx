import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setCart(null);
        return;
      }
      
      setIsLoading(true);
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        setCart(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenTimestamp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please login first');
      }

      setIsLoading(true);
      await api.post('/cart', { productId, quantity });
      await fetchCart(); // Refresh cart after adding item
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setIsLoading(true);
      await api.delete(`/cart/${itemId}`);
      await fetchCart(); // Refresh cart after removing item
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        return await removeFromCart(itemId);
      }

      setIsLoading(true);
      await api.put(`/cart/${itemId}`, { quantity });
      await fetchCart(); // Refresh cart after updating item quantity
      return { success: true };
    } catch (error) {
      console.error('Error updating cart item quantity', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const checkout = async (checkoutData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/order/checkout', checkoutData);
      
      // Clear cart after successful checkout
      setCart(null);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error during checkout', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      isLoading,
      fetchCart, 
      addToCart, 
      removeFromCart, 
      updateCartItemQuantity, 
      checkout,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};