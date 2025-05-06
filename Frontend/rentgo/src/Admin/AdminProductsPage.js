import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminTabs from '../components/AdminTabs';
import './AdminProductsPage.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // apiler gelene kadar
    const mockProducts = [
      {
        id: '1',
        name: 'MacBook Pro 16"',
        category: 'Laptop',
        pricePerWeek: 300,
        pricePerMonth: 1000,
        isAvailable: true
      },
      {
        id: '2',
        name: 'Canon EOS R5',
        category: 'Camera',
        pricePerWeek: 200,
        pricePerMonth: 700,
        isAvailable: false
      },
      {
        id: '3',
        name: 'DJI Mavic 3',
        category: 'Drone',
        pricePerWeek: 250,
        pricePerMonth: 850,
        isAvailable: true
      },
      {
        id: '4',
        name: 'Sony A7 IV',
        category: 'Camera',
        pricePerWeek: 220,
        pricePerMonth: 750,
        isAvailable: true
      },
      {
        id: '5',
        name: 'iPad Pro 12.9"',
        category: 'Tablet',
        pricePerWeek: 150,
        pricePerMonth: 500,
        isAvailable: true
      }
    ];

    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading products...</div>;
  }

  return (
    <div className="admin-main-container">
      <AdminNavbar />
      <div className="admin-content">
        <AdminTabs activeTab="products" />
        <div className="products-list">
          <h2>All Products</h2>
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (Week)</th>
                <th>Price (Month)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.pricePerWeek}</td>
                  <td>${product.pricePerMonth}</td>
                  <td>
                    <span className={`status-badge ${product.isAvailable ? 'available' : 'rented'}`}>
                      {product.isAvailable ? 'Available' : 'Rented'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;