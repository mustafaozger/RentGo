import React, { useState } from 'react';
import './AdminRentalsList.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRentalsList = ({ rentals }) => {
  const [selectedRental, setSelectedRental] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
    setTimeout(() => {
    window.location.reload();
  }, 100); 
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const orderId = selectedRental.id; 
    const version = 1;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`https://localhost:9001/api/v${version}/Order/change-order-status-of-order-id:${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(newStatus)
      });

      if (response.ok) {
        toast.success("Status updated successfully!");
        setSelectedRental(prev => ({ ...prev, status: newStatus }));
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("An error occurred while updating status.");
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
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
                <strong>User:</strong> {rental.userName}
              </div>
              <div className="rental-detail">
                <strong>Period:</strong> {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
              </div>
              <div className="rental-detail">
                <strong>Price:</strong> {rental.price} TL
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

      <div className="status-section">
        <strong>Status:</strong>
        <select 
          value={selectedRental.status} 
          onChange={handleStatusChange}
          disabled={updatingStatus}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="modal-grid">
        
        <div className="modal-section">
          <h3>Product Information</h3>
          <img 
            src={selectedRental.productImage} 
            alt={selectedRental.productName}
            className="modal-product-image"
          />
          <p><strong>Name:</strong> {selectedRental.productName}</p>
          <p><strong>Description:</strong> {selectedRental.productDescription}</p>
          <p><strong>Rental Period Type:</strong> {selectedRental.rentalPeriodType}</p>
        </div>

        <div className="modal-section">
          <h3>User Information</h3>
          <p><strong>Name:</strong> {selectedRental.userrealName}</p>
          <p><strong>User Email:</strong> {selectedRental.userEmail}</p>
          <p><strong>Username:</strong> {selectedRental.userName}</p>

          <h3>Receiver Information</h3>
          <p><strong>Name:</strong> {selectedRental.reciverName}</p>
          <p><strong>Phone:</strong> {selectedRental.receiverPhone}</p>
          <p><strong>Address:</strong> {selectedRental.reciverAddress}</p>

          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> ${selectedRental.id}</p>
          <p><strong>Start Date:</strong> {formatDate(selectedRental.startDate)}</p>
          <p><strong>End Date:</strong> {formatDate(selectedRental.endDate)}</p>
          <p><strong>Total Price:</strong> ${selectedRental.price}</p>
            <span className={`status-badge ${selectedRental.status}`}>
                  {selectedRental.status}
                </span>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminRentalsList;
