import React, { useState } from 'react';
import './ProductDetailComponent.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductDetailComponent = ({ product }) => {
  const [rentalType, setRentalType] = useState('month');
  const [duration, setDuration] = useState(1);
  const navigate = useNavigate();
  const { addItem } = useCart();

  if (!product) return <div>Ürün bilgisi yükleniyor...</div>;

  const price = rentalType === 'week'
    ? product.pricePerWeek * duration
    : product.pricePerMonth * duration;

  const handleRental = async () => {
    const rentalPeriodType = rentalType === 'week' ? 'Week' : 'Month';
    await addItem(product, rentalPeriodType, duration, price);
    navigate('/cart');
  };

  return (
    <div className="product-detail-container">
      <div className="product-images">
        {product.productImageList?.map((img, idx) => (
          <img key={idx} src={img.imageUrl} alt={`Ürün ${idx + 1}`} className="product-image" />
        ))}
      </div>
      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <div className="rental-options">
          <div className="price-info">
            <span className="price-text">{price} TL</span>
            <span className="delivery">Tahmini teslim 28 Nisan</span>
          </div>
          <div className="rental-type-select">
            <label>Süre Tipi:</label>
            <select value={rentalType} onChange={e => setRentalType(e.target.value)}>
              <option value="week">Haftalık</option>
              <option value="month">Aylık</option>
            </select>
          </div>
          <div className="duration-select">
            <label>Süre:</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
              {[1, 2, 3, 4].map(d => (
                <option key={d} value={d}>{d} {rentalType === 'week' ? 'Hafta' : 'Ay'}</option>
              ))}
            </select>
          </div>
          <button className="rent-button" onClick={handleRental}>Kirala</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
