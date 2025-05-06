import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import LoginPage from './Authentication/LoginPage';
import RegisterPage from './Authentication/RegisterPage';
import ForgotPassword from './Authentication/ForgotPassword';
import CartPage from './Cart/CartPage';
import LandingPage from './LandingPage/LandingPage';
import OrderCompletionPage from './OrderComplation/OrderCompletionPage';
import AllProductsPage from './AllProductsPage/AllProductsPage';
import ProductDetailPage from './ProductDetailPage/ProductDetailPage';
import AdminMainPage from './Admin/AdminMainPage';
import AdminProductsPage from './Admin/AdminProductsPage';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));


  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminMainPage />} />
          <Route path="/admin-products" element={<AdminProductsPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-completion" element={<OrderCompletionPage />} />
          <Route path="/all-products" element={<AllProductsPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
