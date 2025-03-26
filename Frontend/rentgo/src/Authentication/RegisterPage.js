import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Telefon numarası için otomatik formatlama (555-555-5555)
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "");
      const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validatePhone = (phone) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      toast.error("Geçerli bir telefon numarası girin (Örn: 555-555-5555)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }

    toast.success("Kayıt başarılı!");
    console.log("Kayıt Bilgileri:", formData);
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="register-box">
        <h1>Üye Ol</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Ad</label>
            <input
              type="text"
              name="firstName"
              placeholder="Adınız"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Soyad</label>
            <input
              type="text"
              name="lastName"
              placeholder="Soyadınız"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Telefon Numarası</label>
            <input
              type="tel"
              name="phone"
              placeholder="555-555-5555"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength="12"
              required
            />
          </div>
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
          <div className="input-group">
            <label>Şifre</label>
            <input
              type="password"
              name="password"
              placeholder="Şifreniz (min 8 karakter)"
              value={formData.password}
              onChange={handleInputChange}
              minLength="8"
              required
            />
          </div>
          <div className="input-group">
            <label>Şifre (Tekrar)</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Şifrenizi tekrar girin"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Kayıt Ol
          </button>
        </form>
        <div className="separator">
          <span>veya</span>
        </div>
        <button
          className="register-button secondary"
          onClick={() => navigate("/login")}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;