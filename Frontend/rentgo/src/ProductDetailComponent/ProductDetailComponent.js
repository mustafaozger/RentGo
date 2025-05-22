import React, { useState } from 'react';
import './ProductDetailComponent.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import AuthUtils from '../authUtils/authUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetailComponent = ({ product }) => {
  const [rentalType, setRentalType] = useState('month');
  const [duration, setDuration] = useState(1);
  const navigate = useNavigate();
  const { addItem } = useCart();

  if (!product) return <div>Product is loading...</div>;

  const price = rentalType === 'week'
    ? product.pricePerWeek * duration
    : product.pricePerMonth * duration;

  const handleRental = async () => {
     if (!AuthUtils.isLoggedIn()) {
    toast.warn("Please Log in,for adding product to your basket.");
    return;
  }


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
          </div>
          <div className="rental-type-select">
            <label>Duration Type:</label>
            <select value={rentalType} onChange={e => setRentalType(e.target.value)}>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="duration-select">
            <label>Duration:</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
              {[1, 2, 3, 4].map(d => (
                <option key={d} value={d}>{d} {rentalType === 'week' ? 'Week' : 'Month'}</option>
              ))}
            </select>
          </div>
          <button className="rent-button" onClick={handleRental}>Rent Now</button>
        </div>
      </div>
    <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ProductDetailComponent;
