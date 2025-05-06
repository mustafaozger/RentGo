import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminTabs.css';

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState('main');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'products') {
      navigate('/admin-products');
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
    </div>
  );
};

export default AdminTabs;