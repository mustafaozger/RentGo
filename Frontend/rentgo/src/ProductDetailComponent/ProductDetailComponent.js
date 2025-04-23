import React from 'react';
import './ProductDetailComponent.css';

const ProductDetailComponent = ({ product }) => {
  return (
    <div className="product-detail-container">
      <div className="product-header">
        <h1>{product.name}</h1>
        <p className="product-description">{product.description}</p>
      </div>

      <div className="product-content">
        <div className="product-images">
          {product.productImageList?.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`Ürün ${index + 1}`} 
              className="product-image"
            />
          ))}
        </div>

        <div className="rental-section">
          <div className="price-info">
            <span className="price">{product.pricePerMonth} TL /1 ay</span>
            <span className="delivery">Tahmini teslim 28 Nisan</span>
          </div>

          <div className="rental-options">
            <label>Kiralama Süresi Seç</label>
            <select className="rental-period">
              <option value="1">1 Ay</option>
              <option value="2">2 Ay</option>
              <option value="3">3 Ay</option>
            </select>
          </div>

          <button className="rent-button">Kirala</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
