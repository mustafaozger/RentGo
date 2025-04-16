import React from 'react';
import './NavBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">rentgo</div>
      <div className="search-bar">
        <input type="text" placeholder="Search for products to rent" />
        <button>Search</button>
      </div>
      <div className="auth-buttons">
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;