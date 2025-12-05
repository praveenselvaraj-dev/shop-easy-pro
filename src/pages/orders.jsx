import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dropdownRef = useRef();
  const { orders, loading } = useSelector((s) => s.order);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const IMAGE_BASE_URL = "http://localhost:8001";

  const getProductImageUrl = (path) => {
    if (!path) return "/placeholder.png";
    return `${IMAGE_BASE_URL}${path}`;
  };

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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

  const statusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-badge status-pending";
      case "completed":
        return "status-badge status-completed";
      case "cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"></path>
          </svg>
        );
      case "completed":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
          </svg>
        );
      case "cancelled":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="orders-page">
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

                <button className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="orders-main">
        <div className="orders-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track and manage your purchases</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
              </svg>
            </div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders. Start shopping to see them here!</p>
            <button className="btn-continue-shopping" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => navigate(`/orderdetails/${order.id}`)}
              >
                <div className="order-card-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={statusClass(order.status)}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-image-wrapper">
                        <img
                          src={getProductImageUrl(item.product_image)}
                          alt={item.product_name}
                          className="item-image"
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                      </div>

                      <div className="item-details">
                        <p className="item-name">{item.product_name}</p>
                        <p className="item-meta">Qty: {item.quantity}</p>
                      </div>

                      <p className="item-price">₹{item.price}</p>
                    </div>
                  ))}
                  {order.items && order.items.length > 2 && (
                    <p className="items-more">+{order.items.length - 2} more item(s)</p>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-summary">
                    <span className="summary-label">Order Total</span>
                    <span className="summary-amount">₹{order.total_amount}</span>
                  </div>
                  <button className="view-details-btn">
                    View Details
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
