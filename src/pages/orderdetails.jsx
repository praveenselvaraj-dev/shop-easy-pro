import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderDetails } from "../store/orderSlice";
import "../styles/OrderDetails.css";

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orderDetails, loading } = useSelector(s => s.order);

  const IMAGE_BASE_URL = "http://localhost:8001";

  const getProductImageUrl = (path) => {
    if (!path) return "/placeholder.png";
    return `${IMAGE_BASE_URL}${path}`;
  };

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading || !orderDetails)
    return (
      <div className="order-loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );

  return (
    <div className="order-container">
      <div className="order-layout">
        {/* Back button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="order-wrapper">

          {/* Header */}
          <div className="order-header">
            <h1 className="order-title">Order #{orderDetails.id.slice(0, 8)}</h1>
            <p className="order-subtitle">
              Placed on {new Date(orderDetails.created_at).toLocaleString()}
            </p>
          </div>

          {/* Main Order Card */}
          <div className="order-card">
            <div className="order-info-grid">
              <div className="order-info-field">
                <p className="label">Status</p>
                <p className="value status">{orderDetails.status}</p>
              </div>

              <div className="order-info-field">
                <p className="label">Total Amount</p>
                <p className="value">₹{orderDetails.total_amount}</p>
              </div>

              <div className="order-info-field">
                <p className="label">Items Count</p>
                <p className="value">{orderDetails.items.length}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <h2 className="section-title">Ordered Items</h2>

          <div className="items-list">
            {orderDetails.items.map((item, idx) => (
              <div className="item-card" key={idx}>
                <img
                  src={getProductImageUrl(item.product_image)}
                  alt={item.product_name}
                  className="item-image"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />

                <div className="item-content">
                  <p className="item-name">{item.product_name}</p>
                  <p className="item-qty">Quantity: {item.quantity}</p>
                  <p className="item-price">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
