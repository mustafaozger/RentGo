import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';
import logo from '../assets/rentgo-logo.png';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-logo-container">
        <Link to="/admin" className="admin-logo-link">
          <img src={logo} alt="Admin Panel Logo" className="admin-logo" />
          <span className="admin-title">Admin Panel</span>
        </Link>
      </div>

      <div className="admin-logout-container">
        <button onClick={handleLogout} className="admin-logout-button">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;