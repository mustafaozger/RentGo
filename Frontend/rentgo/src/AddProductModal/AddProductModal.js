import React, { useState } from 'react';
import './AddProductModal.css';

const AddProductModal = ({ show, onClose, onProductAdded = () => {} }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerWeek: '',
    pricePerMonth: '',
    categoryId: '',
    imageUrl: '', 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://localhost:9001/api/v1/Product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          pricePerWeek: Number(form.pricePerWeek),
          pricePerMonth: Number(form.pricePerMonth),
          categoryId: form.categoryId,
          productImageList: [
            {
              imageUrl: form.imageUrl,
            },
          ],
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'Failed to add product');
      }

      const newProduct = await response.json();
      onProductAdded(newProduct);  // varsayılan boş fonksiyon olsa da çağrılır
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3>Add New Product</h3>
        {error && <p className="error-text">{error}</p>}
        <label>Name:
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>Description:
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <label>Price Per Week:
          <input name="pricePerWeek" type="number" value={form.pricePerWeek} onChange={handleChange} />
        </label>
        <label>Price Per Month:
          <input name="pricePerMonth" type="number" value={form.pricePerMonth} onChange={handleChange} />
        </label>
        <label>Category ID:
          <input name="categoryId" value={form.categoryId} onChange={handleChange} />
        </label>
        <label>Image URL:
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </label>
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Add'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
