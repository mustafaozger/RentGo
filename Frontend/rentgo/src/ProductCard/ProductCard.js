import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">{product.price} TL /hafta</p>
        <button className="rent-button">Hemen Kirala</button>
      </div>
    </div>
  );
};

export default ProductCard;