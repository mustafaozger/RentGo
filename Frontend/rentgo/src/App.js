import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
import SearchResultsPage from './SearchResultsPage/SearchResultsPage';
import MyAccountPage from './MyAccountPage/MyAccountPage';
import OrderSuccessPage from './OrderSuccessPage/OrderSuccessPage';
import MyOrdersPage from './MyOrdersPage/MyOrdersPage';
import AdminSettings from './Admin/AdminSettings';
import AboutPage from './Pages/static/AboutPage';
import ContactPage from './Pages/static/ContactPage';
import PrivacyPolicyPage from './Pages/static/PrivacyPolicyPage';
import TermsOfUsePage from './Pages/static/TermsOfUsePage';
import HowItWorksPage from './Pages/static/HowItWorksPage';
import Layout from './Layout/Layout'; 



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
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/account" element={<MyAccountPage />} />
          <Route path="/admin" element={<AdminMainPage />} />
          <Route path="/admin-products" element={<AdminProductsPage />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-completion" element={<OrderCompletionPage />} />
          <Route path="/all-products" element={<AllProductsPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
          <Route path="/terms-of-use" element={<Layout><TermsOfUsePage /></Layout>} />
          <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
        </Routes>
            <ToastContainer position="bottom-left" autoClose={3000} />
      </Router>
    </CartProvider>
  );
};

export default App;
