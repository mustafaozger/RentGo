import React, { useState } from 'react';
import './AdminRentalsList.css';

const AdminRentalsList = ({ rentals }) => {
  const [selectedRental, setSelectedRental] = useState(null);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleShowDetails = (rental) => {
    setSelectedRental(rental);
  };

  const handleCloseDetails = () => {
    setSelectedRental(null);
  };

  return (
    <div className="admin-rentals">
      <h2>Recent Rentals</h2>
      <div className="rentals-list">
        {rentals.map((rental) => (
          <div key={rental.id} className="rental-item">
            <div className="rental-header">
              <img 
                src={rental.productImage} 
                alt={rental.productName} 
                className="rental-product-image"
              />
              <div className="rental-basic-info">
                <h3>{rental.productName}</h3>
                <span className={`status-badge ${rental.status}`}>
                  {rental.status}
                </span>
              </div>
            </div>
            
            <div className="rental-details-grid">
              <div className="rental-detail">
                <strong>User:</strong> {rental.userEmail}
              </div>
              <div className="rental-detail">
                <strong>Period:</strong> {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
              </div>
              <div className="rental-detail">
                <strong>Price:</strong> ${rental.price}
              </div>
            </div>
            
            <button 
              className="details-button"
              onClick={() => handleShowDetails(rental)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedRental && (
        <div className="rental-modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseDetails}>
              &times;
            </button>
            
            <h2>Rental Details</h2>
            <div className="modal-grid">
              <div className="modal-section">
                <h3>Product Information</h3>
                <img 
                  src={selectedRental.productImage} 
                  alt={selectedRental.productName}
                  className="modal-product-image"
                />
                <p><strong>Name:</strong> {selectedRental.productName}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${selectedRental.status}`}>
                    {selectedRental.status}
                  </span>
                </p>
              </div>
              
              <div className="modal-section">
                <h3>Rental Period</h3>
                <p><strong>Start:</strong> {formatDate(selectedRental.startDate)}</p>
                <p><strong>End:</strong> {formatDate(selectedRental.endDate)}</p>
                <p><strong>Total Price:</strong> ${selectedRental.price}</p>
              </div>
              
              <div className="modal-section">
                <h3>User Information</h3>
                <p><strong>Email:</strong> {selectedRental.userEmail}</p>
                <p><strong>Phone:</strong> {selectedRental.userPhone}</p>
                <p><strong>Address:</strong> {selectedRental.userAddress}</p>
              </div>
              
              <div className="modal-section">
                <h3>Payment & Delivery</h3>
                <p><strong>Payment Method:</strong> {selectedRental.paymentMethod}</p>
                <p><strong>Delivery Type:</strong> 
                  <span className={`delivery-badge ${selectedRental.deliveryType}`}>
                    {selectedRental.deliveryType}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRentalsList;