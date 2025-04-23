import React, { useState, useEffect } from "react";
import "./CartPage.css";
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import { useNavigate, useLocation } from "react-router-dom";

function CartPage() {
  const location = useLocation();
  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    if (location.state?.rentalProduct) {
      // Ürün zaten sepette var mı kontrol et
      const productExists = cartList.some(item => item.id === location.state.rentalProduct.id);

      // Eğer ürün sepette yoksa, ekleyelim
      if (!productExists) {
        setCartList((prev) => [...prev, location.state.rentalProduct]);
      }
    }
  }, [location.state, cartList]); // cartList'i de bağımlılıklara ekledik

  const navigate = useNavigate();

  const handleIncrement = (id) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, duration: item.duration + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.duration > 1
          ? { ...item, duration: item.duration - 1 }
          : item
      )
    );
  };

  const handleRentalTypeChange = (id, newType) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, durationType: newType } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartList((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const getItemTotal = (item) => {
    return item.durationType === "week"
      ? item.duration * item.weekPrice
      : item.duration * item.monthPrice;
  };

  const totalPrice = cartList.reduce(
    (acc, item) => acc + getItemTotal(item),
    0
  );

  return (
    <div className="cart-container">
      <Navbar />
      <CategoriesBar />

      <section className="cart-list-section">
        {cartList.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-left">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="price-info-left">₺{getItemTotal(item)}</div>
            </div>

            <div className="item-middle">
              <h3>{item.title}</h3>

              <div className="rental-controls">
                <div className="duration-control">
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                  <span>{item.duration}</span>
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                </div>
                <div className="rental-type-toggle">
                  <button
                    onClick={() => handleRentalTypeChange(item.id, "week")}
                    className={item.durationType === "week" ? "active" : ""}
                  >
                    Hafta
                  </button>
                  <button
                    onClick={() => handleRentalTypeChange(item.id, "month")}
                    className={item.durationType === "month" ? "active" : ""}
                  >
                    Ay
                  </button>
                </div>
              </div>
            </div>

            <div className="item-right">
              <button className="remove-button" onClick={() => handleRemove(item.id)}>🗑</button>
            </div>
          </div>
        ))}
      </section>

      <section className="summary-section">
        <div className="summary-content">
          <h2>Toplam: ₺{totalPrice}</h2>
          <button className="order-button" onClick={() => navigate("/order-completion")}>
            Siparişi Onayla
          </button>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
