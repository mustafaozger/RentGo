import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import Footer from '../Footer/Footer';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], searchTerm = '' } = location.state || {};

  if (!location.state) {
    navigate('/');
    return null;
  }
  return (
    <div className="all-page">
      <Navbar />
      <CategoriesBar />
      <div className="search-results-container"> 
        <h2>Associated products: {searchTerm} </h2>
        {results.length > 0 ? (
          <div className="results-grid">
            {results.map((product) => (
              <ProductCard key={product.id || `product-${product.name}`} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>We haven't found any results for {searchTerm}. As Rentgo, we are constantly updating our stock. Try again later.</p>
          </div>
        )}
      </div> 
      <Footer />
    </div> 
  );
};

export default SearchResultsPage;