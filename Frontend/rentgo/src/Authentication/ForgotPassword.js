import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Şifre sıfırlama linki ${email} adresine gönderildi!`, {
      position: "top-center",
      autoClose: 3000,
    });
    setTimeout(() => navigate("/login"), 3000); 
  };

  return (
    <div className="forgot-container">
      <ToastContainer />
      <div className="forgot-box">
        <h1>Şifremi Unuttum</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="isim@örnek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-button">
            Şifreyi Sıfırla
          </button>
        </form>
        <div className="separator"></div>
        <button 
          className="back-to-login" 
          onClick={() => navigate("/login")}
        >
          Giriş Sayfasına Dön
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;