import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthUtils from "../authUtils/authUtils";
import "./MyOrdersPage.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerId = AuthUtils.getUserId();
        const token = AuthUtils.getToken();

        if (!customerId || !token) {
          console.error("User not logged in.");
          return;
        }

        const response = await axios.get(
          `https://localhost:9001/api/v1/Order/get-orders-by-customer-id:${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        const responseData = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setOrders(responseData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  if (!orders.length) return <div className="no-orders">No orders found.</div>;

  return (
    <div className="my-orders-container">
      <h2 className="my-orders-title">My Orders</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="order-card">
          <div className="order-header">
            <span className="order-id">Order ID: #{order.orderId}</span>
            <span className="order-date">
              {new Date(order.orderDate).toLocaleString()}
            </span>
          </div>

          <div className={`order-status ${
            order.orderStatus === "Pending" ? "status-pending" :
            order.orderStatus === "Shipped" ? "status-shipped" :
            order.orderStatus === "Delivered" ? "status-delivered" :
            "status-cancelled"
          }`}>
            {order.orderStatus}
          </div>

          <p className="order-total"><strong>Total Cost:</strong> {order.totalCost} TL</p>

          {order.rentalProducts?.map((item) => (
            <div key={item.rentalItemId} className="order-item-card">
              <p><strong>Product:</strong> {item.productName}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Price Per {item.rentalPeriodType}:</strong> {item.pricePerWeek ?? item.pricePerMonth} TL</p>
              <p><strong>Rental Duration:</strong> {item.rentalDuration} {item.rentalPeriodType}(s)</p>
              <p><strong>Start:</strong> {new Date(item.startRentTime).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(item.endRentTime).toLocaleString()}</p>
              {item.productImageList?.[0]?.imageUrl && (
                <img
                  src={item.productImageList[0].imageUrl}
                  alt={item.productName}
                  className="product-image"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;
