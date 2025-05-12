import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/rentgo-logo.png';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { searchService } from '../SearchService/SearchService';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const results = await searchService.searchProducts(searchTerm);
      setSearchResults(results);
      setShowResults(true);
      navigate('/search-results', { state: { results, searchTerm } });
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="rentgo logo" className="logo" />
        </Link>
      </div>

      <form className="search-container" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search for the product you want to rent..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          <FaSearch /> 
        </button>
      </form>

      <div className="auth-buttons">
        <Link to="/cart" className="cart-button">
          <FaShoppingCart />
        </Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="auth-button">Log In</Link>
            <Link to="/register" className="auth-button">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="auth-button logout-button">
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;