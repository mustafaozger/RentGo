import React from 'react';
import './CartPage.css';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const navigate = useNavigate();
  const { cartList, increment, decrement, changeType, removeItem } = useCart();

  const getItemTotal = item =>
    item.durationType === 'week'
      ? item.duration * item.weekPrice
      : item.duration * item.monthPrice;

  const totalPrice = cartList.reduce((acc, item) => acc + getItemTotal(item), 0);

  return (
    <div className="cart-container">
      <Navbar />
      <CategoriesBar />
      <section className="cart-list-section">
        {cartList.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-left">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="price-info-left">₺{getItemTotal(item)}</div>
            </div>
            <div className="item-middle">
              <h3>{item.title}</h3>
              <div className="rental-controls">
                <div className="duration-control">
                  <button onClick={() => decrement(item.id)}>-</button>
                  <span>{item.duration}</span>
                  <button onClick={() => increment(item.id)}>+</button>
                </div>
                <div className="rental-type-toggle">
                  <button onClick={() => changeType(item.id, 'week')} className={item.durationType==='week' ? 'active':''}>Hafta</button>
                  <button onClick={() => changeType(item.id, 'month')} className={item.durationType==='month' ? 'active':''}>Ay</button>
                </div>
              </div>
            </div>
            <div className="item-right">
              <button className="remove-button" onClick={() => removeItem(item.id)}>🗑</button>
            </div>
          </div>
        ))}
      </section>
      <section className="summary-section">
        <div className="summary-content">
          <h2>Toplam: ₺{totalPrice}</h2>
          <button className="order-button" onClick={() => navigate('/order-completion')}>Siparişi Onayla</button>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
