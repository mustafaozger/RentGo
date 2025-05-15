import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminTabs from './AdminTabs';
import AdminSummary from './AdminSummary';
import AdminRentalsList from './AdminRentalsList';
import './AdminMainPage.css';

import s5 from '../assets/slides/12.jpg';
import s6 from '../assets/slides/13.jpeg';
import s7 from '../assets/slides/13.webp';

const API_BASE_URL = 'https://localhost:9001/api/v1'; 
const productImagesFallback = [s5, s6, s7]; 

const AdminMainPage = () => {
  const [totalRentals, setTotalRentals] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

      try {
        const response = await fetch(`${API_BASE_URL}/Order/get-all-orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        setTotalRentals(data.length);

        let calculatedTotalProfit = 0;
        data.forEach(order => {
          if (order.rentalProducts && order.rentalProducts.length > 0) {
            order.rentalProducts.forEach(product => {
              calculatedTotalProfit += product.totalPrice || 0;
            });
          }
        });
        setTotalProfit(calculatedTotalProfit);

      const formattedRentals = data.map((order, index) => {
  const firstProduct = order.rentalProducts && order.rentalProducts.length > 0 ? order.rentalProducts[0] : {};

  let productImage = productImagesFallback[index % productImagesFallback.length];
  if (firstProduct.productImageList && firstProduct.productImageList.length > 0 && firstProduct.productImageList[0].imageUrl) {
    productImage = firstProduct.productImageList[0].imageUrl;
  }

  return {
    id: order.orderId,
    productName: firstProduct.productName || 'N/A Product',
    productDescription: firstProduct.description || 'No description available',
    productImage: productImage,
    userEmail: order.customer?.email || `customer${index + 1}@example.com`,
    userName: order.customer?.userName || `aliözalpay2`,
    userrealName: order.customer?.name || `Ali Özalpay`,
    reciverName: order.rentInfo?.reciverName || order.customer?.name || `Customer ${index + 1}`,
    receiverPhone: order.rentInfo?.reciverPhone || `+90 555 ${100 + index} ${20 + index} ${30 + index}`,
    reciverAddress: order.rentInfo?.reciverAddress || `Mock Address ${index + 1}, City`,
    price: firstProduct.totalPrice !== undefined ? firstProduct.totalPrice : (order.totalCost || 0),
    startDate: firstProduct.startRentTime || order.orderDate,
    endDate: firstProduct.endRentTime || new Date(new Date(order.orderDate).setDate(new Date(order.orderDate).getDate() + (firstProduct.rentalDuration || 7))).toISOString(),
    rentalPeriodType: firstProduct.rentalPeriodType || 'Unknown',
    status: order.orderStatus ? order.orderStatus.toLowerCase() : 'pending',
    paymentMethod: 'Credit Card',
    deliveryType: order.deliveryType || 'standard',
    rawOrder: order, 
  };
});
        setRecentRentals(formattedRentals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error">Error loading data: {error}. Please try refreshing the page.</div>;
  }

  return (
    <div className="admin-main-container">
      <AdminNavbar />
      <div className="admin-content">
        <AdminTabs activeTab="main" />
        <AdminSummary totalRentals={totalRentals} totalProfit={totalProfit} />
        <AdminRentalsList rentals={recentRentals} />
      </div>
    </div>
  );
};

export default AdminMainPage;