import React, { useEffect, useState } from "react";
import "./CartPage.css";
import Navbar from "../NavBar/NavBar";
import CategoriesBar from "../CategoriesBar/CategoriesBar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { cartList, removeItem, updateItem } = useCart();
  const totalPrice = cartList.reduce((acc, item) => acc + item.totalPrice, 0);

  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    cartList.forEach((item) => {
      if (!productDetails[item.productId]) {
        fetch(`https://localhost:9001/api/v1/Product/${item.productId}`)
          .then((res) => res.json())
          .then((data) => {
            setProductDetails((prev) => ({ ...prev, [item.productId]: data }));
          })
          .catch((err) => console.error("Ürün detayı alınamadı:", err));
      }
    });
  }, [cartList]);

  return (
    <div className="cart-container">
      <Navbar />
      <CategoriesBar />
      <section className="cart-list-section">
        {cartList.length === 0 ? (
          <p>Your basket is empty.</p>
        ) : (
          cartList.map((item) => {
            const product = productDetails[item.productId];
            return (
              <div key={item.cartItemId} className="cart-item">
                <div className="item-left">
                  {product && product.productImageList.length > 0 ? (
                    <img
                      src={product.productImageList[0].imageUrl}
                      alt={product.name}
                      className="cart-item-image"
                      onLoad={(e) => e.target.classList.remove("loading")}
                      onError={(e) =>
                        (e.target.src = `https://via.placeholder.com/150?text=${item.productId}`)
                      }
                      loading="lazy"
                    />
                  ) : (
                    <div className="image-loading-spinner"></div>
                  )}
                </div>
                
                
                
             
              
                <div className="item-middle">
                  <h3>
                    {product ? (
                      product.name
                    ) : (
                      <div className="name-loading-placeholder"></div>
                    )}
                  </h3>
                  <div className="price-info-left">₺{item.totalPrice}</div>
                </div>      

                <div className="rental-controls-all">
                <div className="rental-controls">

                    <div className="rental-type-toggle">
                      <button
                        onClick={() =>
                          updateItem(
                            item.cartItemId,
                            "Week",
                            item.rentalDuration
                          )
                        }
                        className={
                          item.rentalPeriodType === "Week" ? "active" : ""
                        }
                      >
                        Week
                      </button>
                      <button
                        onClick={() =>
                          updateItem(
                            item.cartItemId,
                            "Month",
                            item.rentalDuration
                          )
                        }
                        className={
                          item.rentalPeriodType === "Month" ? "active" : ""
                        }
                      >
                        Month
                      </button>
                    </div>
                       <div className="duration-control">
                      <button
                        onClick={() =>
                          updateItem(
                            item.cartItemId,
                            item.rentalPeriodType,
                            item.rentalDuration - 1
                          )
                        }
                        disabled={item.rentalDuration <= 1}
                      >
                        -
                      </button>
                      <span>{item.rentalDuration}</span>
                      <button
                        onClick={() =>
                          updateItem(
                            item.cartItemId,
                            item.rentalPeriodType,
                            item.rentalDuration + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                </div>    

              </div>
                <div className="item-right">
                  <button
                    className="remove-button"
                    onClick={() => removeItem(item.cartItemId)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
      <section className="summary-section">
        <div className="summary-content">
          <h2>Total Price: ₺{totalPrice}</h2>
          <button
            className="order-button"
            onClick={() => navigate("/order-completion")}
            disabled={cartList.length === 0}
          >
            Confirm Rent
          </button>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
