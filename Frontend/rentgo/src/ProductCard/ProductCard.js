import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleRentClick = (e) => {
    e.stopPropagation(); 
    navigate(`/product/${product.id}`, { state: { product } });
  };

  if (!product) { 
    return null;
  }

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img
          src={
            product.image || 
            product.productImageList?.[0]?.imageUrl || 
            'https://via.placeholder.com/150' 
          }
          alt={product.name || 'Product Image'}
        />
      </div>
      <div className="product-details">
        <h3>{product.name || 'Unnamed Product'}</h3>
        <p className="description">{product.description || 'No description available.'}</p>
        <p className="price">{(product.price || product.pricePerMonth) ? `${product.price || product.pricePerMonth} TL` : 'Price not available'}</p>
        <button className="rent-button" onClick={handleRentClick}>
          Hemen Kirala
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
