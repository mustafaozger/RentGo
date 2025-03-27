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
      toast.error("Enter a valid phone number (Ex: 555-555-555-5555)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    toast.success("Registration successful!");
    console.log("Registration Information:", formData);
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="register-box">
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Your name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Surname</label>
            <input
              type="text"
              name="lastName"
              placeholder="Your Surname"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Telephone Number</label>
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
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your Password (min 8 digit)"
              value={formData.password}
              onChange={handleInputChange}
              minLength="8"
              required
            />
          </div>
          <div className="input-group">
            <label>Password (Again)</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter password again"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Sign Up
          </button>
        </form>
        <div className="separator">
          <span>or</span>
        </div>
        <button
          className="register-button secondary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;