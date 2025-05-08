import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

const LoginPage = ({ setIsLoggedIn }) => { 
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:9001/api/Account/authenticate",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      toast.success("Successfully logged in!", {
        position: "top-center",
        autoClose: 1500,
      });

      localStorage.setItem("token", response.data.jwToken);
      localStorage.setItem("customerId", response.data.id);
      localStorage.setItem("userRoles", JSON.stringify(response.data.roles));
      
      setIsLoggedIn(true);

      setTimeout(() => {
        if (response.data.roles.includes("Admin")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);

    } catch (error) {
      toast.error("Login failed. Please check your credentials.", {
        position: "top-center",
      });
      console.error("Login error:", error);
    }
  };

  
  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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
          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
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
            <span
              className="forgot-password"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </span>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="separator">
          <span>or</span>
        </div>
        <div className="alternative-buttons">
          <button
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;