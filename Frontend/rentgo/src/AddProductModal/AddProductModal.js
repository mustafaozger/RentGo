import React, { useState } from "react";
import "./AddProductModal.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProductModal = ({ show, onClose, onProductAdded = () => {} }) => {
  const categories = {
    "A1E4DCD5-9FDA-4C9B-915F-32C4E9A1B8C3": "Personal Care",
    "B2F5E1C6-2ACE-4D35-9E4C-9F1D2A3E4B5C": "Hobbies & Games",
    "C3D6F2B7-7BBC-4B0A-8F5D-A2B3C4D5E6F7": "Smart Home",
    "D4E7C3A8-3ABC-4EF5-9B6D-B3C2A1F4E5D6": "Baby & Kids",
    "E5F8D4B9-1DEF-4C65-9E4C-9F1D2A6B7C8D9": "Phones",
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerWeek: "",
    pricePerMonth: "",
    categoryId: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://localhost:9001/api/v1/Product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        throw new Error(data || "Failed to add product");
      }

      const newProduct = await response.json();
      onProductAdded(newProduct);
      onClose();
      window.location.href = "/admin-products";
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="image-upload-button"
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
            <span className="image-upload-icon">📁</span>
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
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </button>
          <button
            onClick={() => {
              setForm({
                name: "",
                description: "",
                pricePerWeek: "",
                pricePerMonth: "",
                categoryId: "",
                imageUrl: "",
              });
              setError("");
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
