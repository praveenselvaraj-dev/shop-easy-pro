import React, { useState, useRef, useEffect } from "react";
import { productApi } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import "../../styles/adminproductadd.css";

function AdminProductAddInner() {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category:"",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!form.stock || parseInt(form.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (!form.category.trim()) {
      newErrors.category = "Product category is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!form.image) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleRemoveImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
    setImageUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category)
      formData.append("description", form.description);
      if (form.image) {
        formData.append("image", form.image);
      }

      await productApi.create(formData);
      setSuccessMessage("Product added successfully!");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      setErrors({ submit: "Failed to add product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-add-container">
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">Add New Product</h1>
        </div>

        <div className="header-right">
          <div ref={dropdownRef} className="profile-wrapper">
            <button
              className="profile-icon"
              onClick={() => setShowAdminDropdown(!showAdminDropdown)}
              aria-label="Admin menu"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </button>

            {showAdminDropdown && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setShowAdminDropdown(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/admin/products");
                    setShowAdminDropdown(false);
                  }}
                >
                  Products
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setShowAdminDropdown(false);
                  }}
                >
                  Dashboard
                </button>
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
        </div>
      </header>

      <main className="main-content">
        <div className="form-wrapper">
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="section-title">Product Information</h2>
              <p className="section-subtitle">Fill in the details for your new product</p>
            </div>

            <div className="form-card">
              {successMessage && (
                <div className="success-message">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                  </svg>
                  {successMessage}
                </div>
              )}

              {errors.submit && (
                <div className="error-message">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                  </svg>
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="hidden-input"
                  />
                  {!imagePreview ? (
                    <label htmlFor="image" className="image-upload-area">
                      <div className="image-upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                      <p className="image-upload-text">Click to upload product image</p>
                      <p className="image-upload-hint">JPEG, PNG, WebP or GIF (max. 5MB)</p>
                    </label>
                  ) : (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Product preview" className="image-preview" />
                      <div className="image-actions">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-change-image"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"></path>
                            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                          </svg>
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="btn-remove-image"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"></path>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.image && <span className="field-error">{errors.image}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                 <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Product Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Enter category name"
                    value={form.category}
                    onChange={handleChange}
                    className={`form-input ${errors.category ? 'error' : ''}`}
                  />
                  {errors.name && <span className="field-error">{errors.category}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="price">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      className={`form-input ${errors.price ? 'error' : ''}`}
                    />
                    {errors.price && <span className="field-error">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      placeholder="0"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      className={`form-input ${errors.stock ? 'error' : ''}`}
                    />
                    {errors.stock && <span className="field-error">{errors.stock}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    value={form.description}
                    onChange={handleChange}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                  ></textarea>
                  {errors.description && <span className="field-error">{errors.description}</span>}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => navigate("/admin/products")}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-small"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                        </svg>
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="info-card">
              <div className="info-header">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                </svg>
                <h3 className="info-title">Tips for better products</h3>
              </div>
              <ul className="info-list">
                <li>Use clear, descriptive product names</li>
                <li>Write detailed descriptions to help customers</li>
                <li>Set competitive prices</li>
                <li>Keep track of accurate stock quantities</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function AdminProductAdd() {
  return <AdminProductAddInner />;
}
