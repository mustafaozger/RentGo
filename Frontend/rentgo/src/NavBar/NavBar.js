import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/rentgo-logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="rentgo logo" className="logo" />
      </div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Kiralamak istediğin ürünü ara..." 
          className="search-input"
        />
        <button className="search-button">
          <i className="fas fa-search"></i> 
        </button>
      </div>
      <div className="auth-buttons">
        <Link to="/login" className="auth-button">Giriş Yap</Link>
        <Link to="/register" className="auth-button">Kayıt Ol</Link>
      </div>
    </nav>
  );
};

export default Navbar;