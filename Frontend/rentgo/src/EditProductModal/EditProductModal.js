import React, { useState, useEffect } from "react";
import "./EditProductModal.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProductModal = ({ product, onClose, onSave, onDelete }) => {
  const categories = {
    "A1E4DCD5-9FDA-4C9B-915F-32C4E9A1B8C3": "Personal Care",
    "B2F5E1C6-2ACE-4D35-9E4C-9F1D2A3E4B5C": "Hobbies & Games",
    "C3D6F2B7-7BBC-4B0A-8F5D-A2B3C4D5E6F7": "Smart Home",
    "D4E7C3A8-3ABC-4EF5-9B6D-B3C2A1F4E5D6": "Baby & Kids",
    "E5F8D4B9-1DEF-4C65-9C7E-C4D5A6B7C8D9": "Phones",
  };

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    pricePerWeek: "",
    pricePerMonth: "",
    categoryId: "",
    imageUrl: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name || "",
        description: product.description || "",
        pricePerWeek: product.pricePerWeek || "",
        pricePerMonth: product.pricePerMonth || "",
        categoryId: product.categoryId || "",
        imageUrl: product.productImageList?.[0]?.imageUrl || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://localhost:9001/api/v1/Product/${form.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update product");
      }

      const updatedProductId = await response.json();
      onSave(updatedProductId);
      window.location.href = "/admin-products";
      onClose();
    } catch (error) {
      toast.error(`Error updating product: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:9001/api/v1/Product/${form.id}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete product");
      }

      onDelete(form.id);
      window.location.href = "/admin-products";
      onClose();
    } catch (error) {
      toast.error(`Error deleting product: ${error.message}`);
    }
  };

  if (!product) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h3>Edit Product</h3>
        <label>
          Name:
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Price Per Week:
          <input
            name="pricePerWeek"
            type="number"
            value={form.pricePerWeek}
            onChange={handleChange}
          />
        </label>
        <label>
          Price Per Month:
          <input
            name="pricePerMonth"
            type="number"
            value={form.pricePerMonth}
            onChange={handleChange}
          />
        </label>
        <label>
          Category:
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {Object.entries(categories).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        Product Image:
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => {
              setUploading(true);
              const dialog = window.uploadcare.openDialog(null, {
                publicKey: "9073bbb7c148291b8cfe",
                imagesOnly: true,
                tabs: "file url",
              });

              dialog.done((filePromise) => {
                filePromise.done((fileInfo) => {
                  console.log("Yüklenen görsel URL:", fileInfo.cdnUrl);
                  setForm((prevForm) => ({
                    ...prevForm,
                    imageUrl: fileInfo.cdnUrl,
                  }));
                  setUploading(false);
                });
                filePromise.fail(() => {
                  setUploading(false);
                });
              });
            }}
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : form.imageUrl
              ? "Change Image"
              : "Select Image"}
          </button>
          {form.imageUrl && !uploading && (
            <span style={{ color: "green", fontWeight: "bold" }}>
              Image Uploaded
            </span>
          )}
        </div>

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            style={{ width: "100px", marginTop: "10px" }}
          />
        )}

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
