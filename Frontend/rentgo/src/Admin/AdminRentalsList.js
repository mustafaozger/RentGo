import React from 'react';
import './AdminRentalsList.css';

const AdminRentalsList = ({ rentals }) => {
  return (
    <div className="admin-rentals">
      <h2>Rentals</h2>
      <div className="rentals-list">
        {rentals.map((rental, index) => (
          <div key={index} className="rental-item">
            <div className="rental-detail">
              <strong>Product:</strong> {rental.productName}
            </div>
            <div className="rental-detail">
              <strong>User:</strong> {rental.userEmail}
            </div>
            <div className="rental-detail">
              <strong>Price:</strong> ${rental.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRentalsList;