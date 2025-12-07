import React, { useEffect, useRef, useState } from "react";
import { productApi } from "../../api/productApi";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/AdminProductEdit.css";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const dropdownRef = useRef();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: null,
  });

  const [existingImage, setExistingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  useEffect(() => {
    function clickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAdminDropdown(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

 useEffect(() => {
  (async () => {
    try {
      const res = await productApi.get(id);
      const data = res.data;

      setForm({
        name: data.name,
        price: data.price,
        stock: data.stock,
        category: data.category,
        description: data.description,
        image: null,
      });

      const fullImageUrl = data.image
        ? `http://127.0.0.1:8001${data.image}`
        : null;

      setExistingImage(fullImageUrl);
      setImagePreview(fullImageUrl);

    } catch {
      alert("Product not found");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  })();
}, [id, navigate]);


  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Invalid price";
    if (!form.stock || Number(form.stock) < 0) newErrors.stock = "Stock cannot be negative";
    if (!form.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

 const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, image: "Only JPEG, PNG, WebP, and GIF images are allowed" });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, image: "Image size must be less than 5MB" });
      return;
    }

    setForm({ ...form, image: file });

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result);
    };
    reader.readAsDataURL(file);

    if (errors.image) {
      setErrors({ ...errors, image: "" });
    }
  };

  const handleImageRemove = () => {
    setForm({ ...form, image: null });
    setImagePreview(existingImage || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitLoading(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      await productApi.update(id, formData);

      setSuccessMessage("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch {
      setErrors({ submit: "Failed to update product" });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading product...</p>;

  return (
    <div className="admin-edit-container">
      {/* HEADER */}
      <header className="header">
        <h1 className="header-title">Edit Product</h1>
        <div ref={dropdownRef} className="profile-wrapper">
          <button
            className="profile-icon"
            onClick={() => setShowAdminDropdown(!showAdminDropdown)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>

          {showAdminDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => navigate("/profile")}>Profile</button>
              <button className="dropdown-item" onClick={() => navigate("/admin/products")}>Products</button>
              <button className="dropdown-item" onClick={() => navigate("/admin/users")}>Users</button>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="form-card">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <form className="product-form" onSubmit={submit}>
            {/* IMAGE UPLOAD */}
            <div className="form-group">
              <label className="form-label">Product Image</label>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden-input"
                accept="image/*"
                onChange={handleImageSelect}
              />

              {!imagePreview ? (
                 <label
    className="image-upload-area"
    onClick={() => fileInputRef.current.click()}
  >
    <p>Click to upload image</p>
  </label>
              ) : (
                <div className="image-preview-container">
                  <img src={imagePreview} className="image-preview" alt="preview" />
                  <div className="image-actions">
                    <button
                      type="button"
                      className="btn-change-image"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={handleImageRemove}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TEXT FIELDS */}
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                name="name"
                className={`form-input ${errors.name ? "error" : ""}`}
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

             <div className="form-group">
              <label className="form-label">Product Category</label>
              <input
                name="category"
                className={`form-input ${errors.category ? "error" : ""}`}
                value={form.category}
                onChange={handleChange}
              />
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  name="price"
                  type="number"
                  className={`form-input ${errors.price ? "error" : ""}`}
                  value={form.price}
                  onChange={handleChange}
                />
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Stock</label>
                <input
                  name="stock"
                  type="number"
                  className={`form-input ${errors.stock ? "error" : ""}`}
                  value={form.stock}
                  onChange={handleChange}
                />
                {errors.stock && <span className="field-error">{errors.stock}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className={`form-textarea ${errors.description ? "error" : ""}`}
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className="field-error">{errors.description}</span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/admin/products")}
                disabled={submitLoading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-submit"
                disabled={submitLoading}
              >
                {submitLoading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
