import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../store/productSlice";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../store/cartSlice";
import "./productdetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const { selected: product, loading } = useSelector((s) => s.product);
  const [quantity, setQuantity] = useState(1);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAdd = async () => {
    if (quantity < 1) return;

    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, qty: quantity })).unwrap();
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate("/cart");
      }, 1500);
    } catch (err) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading || !product) {
    return (
      <div className="product-details-container">
        <header className="header">
          <div className="header-left">
            <h1 className="header-title">Shop</h1>
            <p className="header-subtitle">Discover amazing products</p>
          </div>
          <div className="header-right">
            <div ref={dropdownRef} className="profile-wrapper">
              <button
                className="profile-icon"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-label="User menu"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
              </button>
              {showProfileDropdown && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => navigate("/profile")}>Profile</button>
                  <button className="dropdown-item" onClick={() => navigate("/cart")}>Cart</button>
                  <button className="dropdown-item" onClick={() => navigate("/orders")}>Orders</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {showSuccessMessage && (
        <div className="toast toast-success">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
          </svg>
          <span>Added to cart! Redirecting...</span>
        </div>
      )}

      {showErrorMessage && (
        <div className="toast toast-error">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
          </svg>
          <span>Failed to Add Cart...</span>
          <button
            className="toast-close"
            onClick={() => setShowErrorMessage(false)}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
          </button>
        </div>
      )}

      <header className="header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate("/home")}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
            Back
          </button>
        </div>

        <div className="header-right">
          <div ref={dropdownRef} className="profile-wrapper">
            <button
              className="profile-icon"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="User menu"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </button>

            {showProfileDropdown && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileDropdown(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/cart");
                    setShowProfileDropdown(false);
                  }}
                >
                  Cart
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/orders");
                    setShowProfileDropdown(false);
                  }}
                >
                  Orders
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content details-layout">
        <div className="product-details-wrapper">
          <div className="product-image-section">
            <div className="product-image-container">
              {product.image ? (
                <img
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `https://shop-easy-pro-api-product.onrender.com/${product.image.startsWith("/") ? product.image.slice(1) : product.image}`
                  }
                  alt={product.name}
                  className="product-image-large"
                />
              ) : (
                <div className="no-image-large">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
                  </svg>
                  <p>No Image Available</p>
                </div>
              )}
            </div>
          </div>

          <div className="product-details-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  ))}
                </div>
                <span className="rating-text">(4.5/5)</span>
              </div>
            </div>

            <p className="product-description-text">{product.description}</p>

            <div className="price-section">
              <div className="price-display">
                <span className="current-price">₹{product.price}</span>
                <span className="original-price">₹{Math.round(product.price * 1.2)}</span>
                <span className="discount">-17%</span>
              </div>
            </div>

            <div className="stock-status">
              {product.stock > 0 ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="stock-icon available">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                  </svg>
                  <span className="stock-text available">In Stock ({product.stock} items)</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="stock-icon unavailable">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                  <span className="stock-text unavailable">Out of Stock</span>
                </>
              )}
            </div>

            {product.stock > 0 && (
              <div className="quantity-section">
                <label className="quantity-label">Quantity</label>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13H5v-2h14v2z"></path>
                    </svg>
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button
                className={`btn-add-to-cart ${isAdding ? "loading" : ""} ${!product.stock > 0 ? "disabled" : ""}`}
                onClick={handleAdd}
                disabled={isAdding || !product.stock > 0}
              >
                {isAdding ? (
                  <>
                    <span className="spinner-small"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            <div className="product-info-section">
              <h3 className="info-title">Product Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Product ID</span>
                  <span className="info-value">#{product.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Stock Available</span>
                  <span className="info-value">{product.stock} units</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Category</span>
                  <span className="info-value">{product.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Warranty</span>
                  <span className="info-value">1 Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
