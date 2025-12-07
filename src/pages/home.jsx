import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, total, loading, error } = useSelector((s) => s.product);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const dropdownRef = useRef();
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

  const totalPages = Math.ceil(total / size);

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">Shop Easy Pro</h1>
          <p className="header-subtitle">Discover amazing products</p>
        </div>

        <div className="header-right">
          <div className="search-wrapper">
            <svg className="home-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="header-search"
            />
          </div>

          {/* Profile Dropdown */}
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
                  {/* <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg> */}
                  Profile
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/cart");
                    setShowProfileDropdown(false);
                  }}
                >
                  {/* <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                  </svg> */}
                  Cart
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/orders");
                    setShowProfileDropdown(false);
                  }}
                >
                  {/* <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54c-.3-.36-.77-.59-1.3-.59-.98 0-1.81.88-1.81 1.97 0 .54.24 1.03.61 1.35 1.05 1.26 2.15 2.29 3.5 3.72 1.35-1.43 2.45-2.46 3.5-3.72.37-.32.61-.81.61-1.35 0-1.09-.83-1.97-1.81-1.97-.53 0-.99.22-1.3.59z"></path>
                  </svg> */}
                  Orders
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  {/* <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                  </svg> */}
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* FILTERS */}
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

        {/* LOADING STATE */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading amazing products...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="error-state">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* PRODUCTS GRID */}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-image-wrapper">
                  {product.image ? (
                    <img
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `http://127.0.0.1:8001/${product.image.startsWith("/") ? product.image.slice(1) : product.image}`
                      }
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
                      </svg>
                      No Image
                    </div>
                  )}
                </div>

                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <button className="add-to-cart-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            <p>No products found</p>
            <p className="empty-subtitle">Try adjusting your search filters</p>
          </div>
        )}

        {/* PAGINATION */}
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
    </div>
  );
}

export default Home;
