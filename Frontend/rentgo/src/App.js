import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Authentication/LoginPage";
import RegisterPage from "./Authentication//RegisterPage";
import ForgotPassword from './Authentication/ForgotPassword';
import CartPage from "./Cart/CartPage";
import OrderCompletionPage from "./OrderComplation/OrderCompletionPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-completion" element={<OrderCompletionPage />} />
        <Route path="/" element={<LoginPage />} />  
      </Routes>
    </Router> 
  );
};

export default App;
