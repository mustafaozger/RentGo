import React, { useState } from "react";
import "./CartPage.css";

// Örnek kategori listesi (icon, name)
const categoryList = [
  { id: 1, name: "Kategori 1", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
  { id: 2, name: "Kategori 2", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
  { id: 3, name: "Kategori 3", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
  { id: 4, name: "Kategori 4", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
];

const initialCartList = [
  {
    id: 1,
    title: "Rental Product 1 - Uzun açıklama yapılabilir",
    image: "https://cdn.dsmcdn.com/ty1658/prod/QC/20250403/23/b436f65a-8535-3fb2-baec-efd21bd19faf/1_org_zoom.jpg",
    duration: 1,
    durationType: "week",  
    weekPrice: 100,       
    monthPrice: 350        
  },
  {
    id: 2,
    title: "Rental Product 2",
    image: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg",
    duration: 1,
    durationType: "week",
    weekPrice: 150,
    monthPrice: 450
  },
];

function CartPage() {
  const [cartList, setCartList] = useState(initialCartList);

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
      <header className="cart-header">
        <div className="logo">LOGO</div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="profile-icon">
          <img src="https://via.placeholder.com/30" alt="Profile" />
        </div>
      </header>

      <section className="category-section">
        {categoryList.map((cat) => (
          <div key={cat.id} className="category-item">
            <img src={cat.icon} alt={cat.name} className="category-icon" />
            <span>{cat.name}</span>
          </div>
        ))}
      </section>

      <section className="cart-list-section">
        {cartList.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-left">
              <img
                src={item.image}
                alt={item.title}
                className="cart-item-image"
              />
            </div>
            <div className="item-middle">
              <h3>{item.title}</h3>
            </div>
            <div className="item-right">
            <div className="remove-container">
                <button className="remove-button" onClick={() => handleRemove(item.id)}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png"
                    alt="Sil"
                  />
                </button>
              </div>
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
                    Week
                  </button>
                  <button
                    onClick={() => handleRentalTypeChange(item.id, "month")}
                    className={item.durationType === "month" ? "active" : ""}
                  >
                    Mounth
                  </button>
                </div>
                <div className="price-info">
                  <span>${getItemTotal(item)}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </section>

      <section className="summary-section">
        <div className="summary-content">
          <div className="summary-items">
            <h2>Order Summary</h2>
            {cartList.map((item) => (
              <div key={item.id} className="order-summary-item">
                <div className="order-summary-title">{item.title}</div>
                <div className="order-summary-info">
                  <span>
                    {item.duration} {item.durationType === "week" ? "Hafta" : "Ay"}
                  </span>
                  <span className="order-summary-price">
                    ${getItemTotal(item)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-footer">
            <div className="total-price">Total: ${totalPrice}</div>
            <div className="order-button-container">
              <button className="order-button">Confirm Cart</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
