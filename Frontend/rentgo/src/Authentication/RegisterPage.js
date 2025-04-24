import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmationLink, setConfirmationLink] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      toast.error("Enter a valid phone number (Ex: 555-555-5555)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:9001/api/Account/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userName: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "/",
          },
        }
      );

      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      const message = response.data;
      const linkMatch = message.match(/https?:\/\/[^\s"]+/);
      if (linkMatch) {
        setConfirmationLink(linkMatch[0]);
      }

      setTimeout(() => {
        navigate("/login");
      }, 4000);

    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Registration failed. Please try again.";

      toast.error(errorMessage, {
        position: "top-center",
      });

      console.error("Register error:", error);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      
      {confirmationLink && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <h2>Confirmation</h2>
            <p>Please click the link below to confirm your email:</p>
            <a
              href={confirmationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {confirmationLink}
            </a>
          </div>
        </div>
      )}

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
              placeholder="Your surname"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              value={formData.username}
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
              placeholder="Your password (min 8 digits)"
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
