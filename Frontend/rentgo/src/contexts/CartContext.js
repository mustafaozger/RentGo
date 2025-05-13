import React, { createContext, useContext, useEffect, useState } from 'react';
import CartService from '../CartService/CartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartList, setCartList] = useState([]);

  const fetchCart = async () => {
    try {
      const data = await CartService.getCart();
      setCartList(data.items);
    } catch (error) {
      console.error('Cart fetch error:', error);
    }
  };

  const addItem = async (product, durationType, duration, totalPrice) => {
    try {
      await CartService.addToCart(product, durationType, duration, totalPrice);
      await fetchCart();
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await CartService.removeFromCart(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  };

  const updateItem = async (cartItemId, newRentalPeriodType, newRentalDuration) => {
    try {
      await CartService.updateCartItem(cartItemId, newRentalPeriodType, newRentalDuration);
      await fetchCart();
    } catch (error) {
      console.error('Update cart item error:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartList, fetchCart, addItem, removeItem, updateItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
