import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminTabs from './AdminTabs';
import AdminSummary from './AdminSummary';
import AdminRentalsList from './AdminRentalsList';
import './AdminMainPage.css';

import s5 from '../assets/slides/12.jpg';
import s6 from '../assets/slides/13.jpeg';
import s7 from '../assets/slides/13.webp';

const AdminMainPage = () => {
  const [totalRentals, setTotalRentals] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apilere gelene kadar
    const mockData = {
      totalRentals: 3,
      totalProfit: 800,
      recentRentals: [
        {
          id: '1',
          productName: 'MacBook Pro 16"',
          productImage: s5,
          userEmail: 'user1@example.com',
          userPhone: '+90 555 123 4567',
          userAddress: '123 Main St, Istanbul, Turkey',
          price: 1200,
          startDate: '2023-05-15T10:00:00',
          endDate: '2023-06-15T18:00:00',
          status: 'active',
          paymentMethod: 'Credit Card',
          deliveryType: 'express'
        },
        {
          id: '2',
          productName: 'Canon EOS R5',
          productImage: s6,
          userEmail: 'user2@example.com',
          userPhone: '+90 555 234 5678',
          userAddress: '456 Oak Ave, Ankara, Turkey',
          price: 800,
          startDate: '2023-05-18T14:30:00',
          endDate: '2023-05-25T12:00:00',
          status: 'completed',
          paymentMethod: 'PayPal',
          deliveryType: 'standard'
        },
        {
          id: '3',
          productName: 'DJI Mavic 3',
          productImage: s7,
          userEmail: 'user3@example.com', 
          userPhone: '+90 555 345 6789',
          userAddress: '789 Pine Rd, Izmir, Turkey',
          price: 950,
          startDate: '2023-05-20T09:15:00',
          endDate: '2023-05-27T17:45:00',
          status: 'cancelled',
          paymentMethod: 'Bank Transfer',
          deliveryType: 'express'
        }
      ]
    };
  
    const timer = setTimeout(() => {
      setTotalRentals(mockData.totalRentals);
      setTotalProfit(mockData.totalProfit);
      setRecentRentals(mockData.recentRentals);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
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