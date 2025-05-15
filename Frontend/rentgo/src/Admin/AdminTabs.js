import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminTabs.css';

const AdminTabs = ({ activeTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    if (tab === 'products') {
      navigate('/admin-products');
    } else if (tab === 'settings') {
      navigate('/admin-settings');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="admin-tabs">
      <button
        className={`admin-tab ${activeTab === 'main' ? 'active' : ''}`}
        onClick={() => handleTabChange('main')}
      >
        Main Page
      </button>
      <button
        className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
        onClick={() => handleTabChange('products')}
      >
        See All Products
      </button>
      <button
        className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => handleTabChange('settings')}
      >
        Admin Settings
      </button>
    </div>
  );
};

export default AdminTabs;
