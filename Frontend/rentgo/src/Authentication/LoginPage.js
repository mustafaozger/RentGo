import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Giriş başarılı!", {
      position: "top-center", 
      autoClose: 2000, // 2 saniye sonra otomatik kapanıyo
    });
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <h1>Giriş yap</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="isim@örnek.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group password-group">
            <label>Şifre</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Şifreni gir"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                👁️
              </button>
            </div>
            <a href="#" className="forgot-password"
               onClick={(e) => {
                 e.preventDefault();
                  navigate("/forgot-password");
                }}
              > 
                Şifremi Unuttum
              </a>
          </div>
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>
        <div className="separator">
          <span>veya</span>
        </div>
        <button
          className="register-button"
          onClick={() => navigate("/register")}
        >
          Üye Ol
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
