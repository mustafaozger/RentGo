import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminTabs from './AdminTabs';
import AdminSummary from './AdminSummary';
import AdminRentalsList from './AdminRentalsList';
import './AdminMainPage.css';

const AdminMainPage = () => {
  const [totalRentals, setTotalRentals] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apilere gelene kadar
    const mockData = {
      totalRentals: 128,
      totalProfit: 45230,
      recentRentals: [
        {
          id: '1',
          productName: 'MacBook Pro 16"',
          userEmail: 'user1@example.com',
          price: 1200,
          startDate: '2023-05-15',
          endDate: '2023-06-15'
        },
        {
          id: '2',
          productName: 'Canon EOS R5',
          userEmail: 'user2@example.com',
          price: 800,
          startDate: '2023-05-18',
          endDate: '2023-05-25'
        },
        {
          id: '3',
          productName: 'DJI Mavic 3',
          userEmail: 'user3@example.com',
          price: 950,
          startDate: '2023-05-20',
          endDate: '2023-05-27'
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