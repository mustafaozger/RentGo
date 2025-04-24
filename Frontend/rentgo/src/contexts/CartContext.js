import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartList, setCartList] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartList));
  }, [cartList]);

  const addItem = (product) => {
    setCartList(prev => prev.some(item => item.id === product.id) ? prev : [...prev, { ...product }]);
  };

  const increment = (id) => {
    setCartList(prev => prev.map(item =>
      item.id === id ? { ...item, duration: item.duration + 1 } : item
    ));
  };

  const decrement = (id) => {
    setCartList(prev => prev.map(item =>
      item.id === id && item.duration > 1
        ? { ...item, duration: item.duration - 1 }
        : item
    ));
  };

  const changeType = (id, newType) => {
    setCartList(prev => prev.map(item =>
      item.id === id ? { ...item, durationType: newType } : item
    ));
  };

  const removeItem = (id) => {
    setCartList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartList, addItem, increment, decrement, changeType, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);