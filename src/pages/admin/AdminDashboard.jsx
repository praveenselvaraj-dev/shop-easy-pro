import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "../../store/orderSlice";
import { fetchLowStock } from "../../store/productSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import AdminProtectedRoute from "../../components/AdminProtectedRoute";
import { useNavigate } from "react-router-dom";
import "../../styles/admindashboard.css";

function DashboardInner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const { analytics, lowStock, loading } = useSelector((s) => s.admin);

 const [fromInput, setFromInput] = useState(() => {
  const date = new Date();
  date.setDate(date.getDate() - 7); 
  const isoString = date.toISOString();
  return isoString.slice(0, 16); 
});

const [toInput, setToInput] = useState(() => {
  const isoString = new Date().toISOString();
  return isoString.slice(0, 16); 
});
  const [threshold, setThreshold] = useState(10);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const loadAnalytics = () => {
  console.log("RAW INPUTS:", { fromInput, toInput });

  let from = "";
  let to = "";
  
  if (fromInput) {
    from = new Date(fromInput).toISOString();
  }
  
  if (toInput) {
    to = new Date(toInput).toISOString();
  }

  console.log("CONVERTED:", { from, to });

  if (from || to) {
    dispatch(fetchAnalytics({ from, to }));
  } else {
    console.log("No dates selected, skipping analytics fetch");
  }
};

  const loadLowStock = () => dispatch(fetchLowStock(threshold));

  useEffect(() => {
    loadAnalytics();
    loadLowStock();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const analyticsChartData = analytics
    ? [
        { name: "Total Sales", value: analytics.total_sales },
        { name: "Total Orders", value: analytics.total_orders }
      ]
    : [];

  return (
    <div className="admin-dashboard-container">
      <header className="header">
        <div className="header-left">
          <h1 className="dashboard-header-title">Admin Dashboard</h1>
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
                  Add Product
                </button>
                {/* <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/admin/users");
                    setShowAdminDropdown(false);
                  }}
                >
                  Users
                </button> */}
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

      <main className="main-content dashboard-layout">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <div className="dashboard-wrapper">
            {/* ANALYTICS SECTION */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">Analytics</h2>
                <p className="section-subtitle">Track sales and orders performance</p>
              </div>

              <div className="filters-card">
                <div className="filters-grid">
                  <div className="filter-group">
                    <label className="filter-label">From</label>
                    <input
  type="datetime-local"
  value={fromInput}
  onChange={(e) => 
  {
        console.log("FROM INPUT CHANGED:", e.target.value);
    setFromInput(e.target.value)}}
  className="filter-input"
/>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">To</label>
                    <input
  type="datetime-local"
  value={toInput}
  onChange={(e) => setToInput(e.target.value)}
  className="filter-input"
/>
                  </div>

                  <button onClick={loadAnalytics} className="btn-filter">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </svg>
                    Load Analytics
                  </button>
                </div>
              </div>

              {analytics && (
                <>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-header">
                        <h3 className="metric-title">Total Sales</h3>
                        <div className="metric-icon sales">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="metric-value">₹{analytics.total_sales}</p>
                      <p className="metric-label">Revenue</p>
                    </div>

                    <div className="metric-card">
                      <div className="metric-header">
                        <h3 className="metric-title">Total Orders</h3>
                        <div className="metric-icon orders">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="metric-value">{analytics.total_orders}</p>
                      <p className="metric-label">Orders</p>
                    </div>

                    <div className="metric-card">
                      <div className="metric-header">
                        <h3 className="metric-title">Low Stock Items</h3>
                        <div className="metric-icon inventory">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="metric-value">{lowStock.length}</p>
                      <p className="metric-label">Items Below Threshold</p>
                    </div>
                  </div>

                  <div className="chart-card">
                    <h3 className="chart-title">Sales & Orders Overview</h3>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                          <XAxis dataKey="name" stroke="var(--neutral-500)" />
                          <YAxis stroke="var(--neutral-500)" />
                          <Tooltip
                            contentStyle={{
                              background: "white",
                              border: "1px solid var(--neutral-200)",
                              borderRadius: "8px"
                            }}
                          />
                          <Bar dataKey="value" fill="var(--primary-color)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* LOW STOCK SECTION */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="section-title">Inventory Management</h2>
                <p className="section-subtitle">Monitor products below threshold</p>
              </div>

              <div className="filters-card">
                <div className="filters-grid filter-compact">
                  <div className="filter-group">
                    <label className="filter-label">Stock Threshold</label>
                    <input
                      type="number"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      className="filter-input"
                      placeholder="Enter threshold"
                    />
                  </div>

                  <button onClick={loadLowStock} className="btn-filter">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </svg>
                    Load Low Stock
                  </button>
                </div>
              </div>

              {lowStock.length > 0 ? (
                <div className="chart-card">
                  <h3 className="chart-title">Low Stock Products</h3>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={lowStock}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                        <XAxis dataKey="name" stroke="var(--neutral-500)" />
                        <YAxis stroke="var(--neutral-500)" />
                        <Tooltip
                          contentStyle={{
                            background: "white",
                            border: "1px solid var(--neutral-200)",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar dataKey="stock" fill="var(--warning-color)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
                    </svg>
                  </div>
                  <h3 className="empty-state-title">All items in stock</h3>
                  <p className="empty-state-description">No products below the specified threshold. Great inventory management!</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProtectedRoute>
      <DashboardInner />
    </AdminProtectedRoute>
  );
}
