import React, { useState } from "react";
import "./CartPage.css";

// Örnek kategori listesi (icon, name)
const categoryList = [
  { id: 1, name: "Kategori 1", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
  { id: 2, name: "Kategori 2", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
  { id: 3, name: "Kategori 3", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
  { id: 4, name: "Kategori 4", icon: "https://cdn.dsmcdn.com/ty1633/prod/QC/20250207/09/811b2d0f-0d18-3376-8871-9aa7e39d975f/1_org_zoom.jpg" },
];

// Örnek sepet listesi (kiralanacak ürünler)
// Her ürün için varsayılan olarak duration (kiralama süresi) 1 ve durationType "week" seçili
const initialCartList = [
  {
    id: 1,
    title: "Rental Product 1 - Uzun açıklama yapılabilir",
    image: "https://cdn.dsmcdn.com/ty1658/prod/QC/20250403/23/b436f65a-8535-3fb2-baec-efd21bd19faf/1_org_zoom.jpg",
    duration: 1,
    durationType: "week",  // "week" veya "month"
    weekPrice: 100,        // Haftalık fiyat
    monthPrice: 350        // Aylık fiyat
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

  // Kiralama süresini arttırma
  const handleIncrement = (id) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, duration: item.duration + 1 } : item
      )
    );
  };

  // Kiralama süresini azaltma (minimum 1 olacak şekilde)
  const handleDecrement = (id) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.duration > 1
          ? { ...item, duration: item.duration - 1 }
          : item
      )
    );
  };

  // Kiralama tipini değiştirme (week/month)
  const handleRentalTypeChange = (id, newType) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, durationType: newType } : item
      )
    );
  };

  // Ürünü sepetten kaldırma
  const handleRemove = (id) => {
    setCartList((prevCart) => prevCart.filter(item => item.id !== id));
  };

  // Her ürünün toplam ücretini hesaplama: haftalık ise duration * weekPrice, aylık ise duration * monthPrice
  const getItemTotal = (item) => {
    return item.durationType === "week"
      ? item.duration * item.weekPrice
      : item.duration * item.monthPrice;
  };

  // Genel toplam ücreti hesaplama
  const totalPrice = cartList.reduce(
    (acc, item) => acc + getItemTotal(item),
    0
  );

  return (
    <div className="cart-container">
      {/* 1) Header Bölümü */}
      <header className="cart-header">
        <div className="logo">LOGO</div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="profile-icon">
          <img src="https://via.placeholder.com/30" alt="Profile" />
        </div>
      </header>

      {/* 2) Kategori Listesi Bölümü */}
      <section className="category-section">
        {categoryList.map((cat) => (
          <div key={cat.id} className="category-item">
            <img src={cat.icon} alt={cat.name} className="category-icon" />
            <span>{cat.name}</span>
          </div>
        ))}
      </section>

      {/* 3) Sepet Ürün Listesi Bölümü */}
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
                    Hafta
                  </button>
                  <button
                    onClick={() => handleRentalTypeChange(item.id, "month")}
                    className={item.durationType === "month" ? "active" : ""}
                  >
                    Ay
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

      {/* 4) Sipariş Özeti Bölümü (Modern & Sabit Alt Bölüm) */}
      <section className="summary-section">
        <div className="summary-content">
          <div className="summary-items">
            <h2>Sipariş Özeti</h2>
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
            <div className="total-price">Toplam: ${totalPrice}</div>
            <div className="order-button-container">
              <button className="order-button">Sepeti Onayla</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
