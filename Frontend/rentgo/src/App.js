import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Authentication/LoginPage";
import RegisterPage from "./Authentication//RegisterPage";
import ForgotPassword from './Authentication/ForgotPassword';
import CartPage from "./Cart/CartPage";
import LandingPage from './LandingPage/LandingPage';
import OrderCompletionPage from "./OrderComplation/OrderCompletionPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-completion" element={<OrderCompletionPage />} />
      </Routes>
    </Router> 
  );
};

export default App;
