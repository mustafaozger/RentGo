import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminTabs from './AdminTabs';
import EditProductModal from '../EditProductModal/EditProductModal';
import AddProductModal from '../AddProductModal/AddProductModal';
import './AdminProductsPage.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://localhost:9001/api/v1/Product?PageNumber=1&PageSize=20');
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleSave = async (updatedProduct) => {
    try {
      const response = await fetch(`https://localhost:9001/api/v1/Product/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (response.ok) {
        fetchProducts(); 
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setSelectedProduct(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await fetch(`https://localhost:9001/api/v1/Product/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      fetchProducts();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleAdd = async (newProduct) => {
    try {
      const response = await fetch('https://localhost:9001/api/v1/Product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        fetchProducts();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Product add failed:', error);
    }
  };

  if (loading) return <div className="admin-loading">Loading products...</div>;

  return (
    <div className="admin-main-container">
      <AdminNavbar />
      <div className="admin-content">
        <AdminTabs activeTab="products" />

        <div className="admin-header">
          <h2>All Products</h2>
          <div className="action-buttons">
            <button className="add-btn" onClick={() => setShowAddModal(true)}>Add Product</button>
          </div>
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category ID</th>
              <th>Price (Week)</th>
              <th>Price (Month)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={selectedProduct?.id === product.id ? 'selected-row' : ''}
              >
                <td>{product.name}</td>
                <td>{product.categoryId}</td>
                <td>${product.pricePerWeek}</td>
                <td>${product.pricePerMonth}</td>
                <td>
                  <span className={`status-badge ${product.isRent ? 'rented' : 'available'}`}>
                    {product.isRent ? 'Rented' : 'Available'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleSave}
        />

        <AddProductModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default AdminProductsPage;
