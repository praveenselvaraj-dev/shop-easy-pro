import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCart, updateCartItem, removeCartItem } from "../store/cartSlice";
import { checkout } from "../store/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const { items, loading } = useSelector(s => s.cart);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

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

  const handleRemove = async (itemId) => {
    setRemovingId(itemId);
    try {
      await dispatch(removeCartItem(itemId));
    } finally {
      setRemovingId(null);
    }
  };

  const handleQuantityChange = async (item, newQuantity) => {
  if (newQuantity < 1) return;

  try {
    await dispatch(updateCartItem({ itemId: item.id, qty: Number(newQuantity) })).unwrap();
  } catch (err) {
    if (err?.detail) {
      window.alert(err.detail);
    } else {
      window.alert("Failed to update quantity");
    }
  }
};

   const handleIncrement = (item) => {
    handleQuantityChange(item, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      handleQuantityChange(item, item.quantity - 1);
    }
  };

  const submit = async () => {
    setCheckingOut(true);
    try {
      const res = await dispatch(checkout());
      if (res.meta.requestStatus === "fulfilled") navigate("/orders");
    } finally {
      setCheckingOut(false);
    }
  };

  const total = items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="cart-container">
      <header className="header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
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

      <main className="main-content cart-layout">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
              </svg>
            </div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-description">Looks like you haven't added anything yet. Start shopping to find great products!</p>
            <Link to="/home" className="btn-shop-now">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-wrapper">
            <div className="cart-items-section">
              <div className="cart-section-header">
                <h1 className="section-title">Shopping Cart</h1>
                <span className="item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
              </div>

              <div className="cart-items-list">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image-wrapper">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `https://shop-easy-pro-api-product.onrender.com${item.image?.replace(/^\//, "")}`
                        }
                        alt={item.name}
                        className="item-image"
                      />
                    </div>

                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">₹{item.price}</p>
                    </div>

                     <div className="item-quantity">
                      <label className="quantity-label">Qty</label>
                      <div className="quantity-counter">
                        <button
                          className="quantity-btn"
                          onClick={() => handleDecrement(item)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M19 13H5v-2h14v2z"></path>
                          </svg>
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleIncrement(item)}
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="item-total">
                      <span className="total-label">Subtotal</span>
                      <span className="total-amount">₹{item.price * item.quantity}</span>
                    </div>

                    <button
                      className={`btn-remove ${removingId === item.id ? "removing" : ""}`}
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      aria-label="Remove item"
                    >
                      {removingId === item.id ? (
                        <span className="spinner-small"></span>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-details">
                  <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">₹{total}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Shipping</span>
                    <span className="summary-value summary-free">Free</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Tax</span>
                    <span className="summary-value">₹{Math.round(total * 0.18)}</span>
                  </div>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span className="total-label">Total</span>
                  <span className="total-value">₹{total + Math.round(total * 0.18)}</span>
                </div>

                <button
                  className={`btn-checkout ${checkingOut ? "checking-out" : ""}`}
                  disabled={!items.length || checkingOut}
                  onClick={submit}
                >
                  {checkingOut ? (
                    <>
                      <span className="spinner-small"></span>
                      Checking out...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                      </svg>
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <button className="btn-continue-shopping" onClick={()=> navigate("/home")} disabled={checkingOut}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
