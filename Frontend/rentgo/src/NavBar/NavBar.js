import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/rentgo-logo.png';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="rentgo logo" className="logo" />
      </div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search for the product you want to rent..." 
          className="search-input"
        />
        <button className="search-button">
          <FaSearch /> 
        </button>
      </div>
      <div className="auth-buttons">
        <Link to="/cart" className="cart-button">
          <FaShoppingCart />
        </Link>
        <Link to="/login" className="auth-button">Log In</Link>
        <Link to="/register" className="auth-button">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;