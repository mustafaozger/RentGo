import React from 'react';
import './AdminSummary.css';

const AdminSummary = ({ totalRentals, totalProfit }) => {
  return (
    <div className="admin-summary">
      <div className="summary-card">
        <h3>Total Number Of Rentals</h3>
        <p className="summary-value">{totalRentals}</p>
      </div>
      <div className="summary-card">
        <h3>Total Profit</h3>
        <p className="summary-value">${totalProfit.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminSummary;