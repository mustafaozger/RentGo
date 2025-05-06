import React from 'react';
import './AdminSummary.css';

const AdminSummary = ({ totalRentals, totalProfit }) => {
  return (
    <div className="admin-summary">
      <div className="summary-card">
        <h3>Total Number Of Rentals</h3>
        <p className="summary-value-1">{totalRentals}</p>
      </div>
      <div className="summary-card">
        <h3>Total Earned</h3>
        <p className="summary-value-2">{totalProfit.toLocaleString()} TL</p>
      </div>
    </div>
  );
};

export default AdminSummary;