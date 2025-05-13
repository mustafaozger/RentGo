import React, { useState, useEffect } from 'react';
import './EditProductModal.css';

const EditProductModal = ({ product, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    pricePerWeek: '',
    pricePerMonth: '',
    categoryId: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        pricePerWeek: product.pricePerWeek || '',
        pricePerMonth: product.pricePerMonth || '',
        categoryId: product.categoryId || '',
        imageUrl: product.productImageList?.[0]?.imageUrl || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://localhost:9001/api/v1/Product/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: form.id,
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
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update product');
      }

      const updatedProductId = await response.json();
      onSave(updatedProductId); // Ürün ID'si döndüğü için
      onClose();
    } catch (error) {
      alert(`Error updating product: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://localhost:9001/api/v1/Product/${form.id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete product');
      }

      onDelete(form.id); // Silme işleminden sonra ana sayfada ürünü kaldır
      onClose();
    } catch (error) {
      alert(`Error deleting product: ${error.message}`);
    }
  };

  if (!product) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3>Edit Product</h3>
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
          <button onClick={handleSubmit}>Save</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
