import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productSlice";
import { productApi } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminProductList.css";

function AdminProductListInner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();
const { products, total, loading, error } = useSelector((s) => s.product);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const size = 10;

   useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        sortBy,
        sortOrder,
        page,
        size,
      })
    );
  }, [search, sortBy, sortOrder, page, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productApi.remove(id);
      dispatch(fetchProducts({ search, page: 1, size: 20 }));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const totalPages = Math.ceil(total / size);

  return (
    <div className="admin-product-container">
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">Product Management</h1>
        </div>

        <div className="header-right">
          <button
            className="btn-add-product"
            onClick={() => navigate("/admin/products/add")}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Add Product
          </button>

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
                    navigate("/admin/dashboard");
                    setShowAdminDropdown(false);
                  }}
                >
                  Dashboard
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setShowAdminDropdown(false);
                  }}
                >
                  Profile
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
           <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="sort-by">Sort By</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-order">Order</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="product-wrapper">
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="section-title">All Products</h2>
                <p className="section-subtitle">Manage your product inventory</p>
              </div>

              <div className="search-card">
                <div className="search-box">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                  />
                  <button
                    onClick={handleSearch}
                    className="btn-search"
                  >
                    Search
                  </button>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="table-row">
                          <td className="cell-name">
                            <span className="product-name">{product.name}</span>
                          </td>
                          <td className="cell-price">
                            <span className="price-badge">₹{product.price}</span>
                          </td>
                          <td className="cell-stock">
                            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="cell-actions">
                            <button
                              className="btn-action btn-edit"
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                              title="Edit product"
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"></path>
                                <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                              </svg>
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => setDeleteConfirm(product.id)}
                              title="Delete product"
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"></path>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path>
                    </svg>
                  </div>
                  <h3 className="empty-state-title">No products found</h3>
                  <p className="empty-state-description">
                    {search ? "Try adjusting your search criteria" : "Start by adding your first product"}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

          {!loading && !error && products.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </svg>
              Previous
            </button>

            <div className="pagination-info">
              <span className="current-page">{page}</span>
              <span className="divider">/</span>
              <span className="total-pages">{totalPages}</span>
            </div>

            <button
              className="pagination-btn"
              disabled={page * size >= total}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              Next
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </svg>
            </button>
          </div>
        )}
      </main>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon delete-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
            </div>
            <h2 className="modal-title">Delete Product?</h2>
            <p className="modal-description">This action cannot be undone. The product will be permanently removed.</p>
            <div className="modal-actions">
              <button
                className="btn-modal btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-modal btn-confirm-delete"
                onClick={() => deleteProduct(deleteConfirm)}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductList() {
  return <AdminProductListInner />;
}
