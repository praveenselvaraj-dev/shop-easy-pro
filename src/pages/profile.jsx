import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile, deleteProfile } from "../store/profileSlice";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const { profile, loading } = useSelector((state) => state.profile);

  const [editMode, setEditMode] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const role = profile?.role;
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        username: profile.username || "",
      });
    }
  }, [profile]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateProfile(form));
      setEditMode(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProfile());
      navigate("/login");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const menuItems = role === "admin"
    ? [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Add Product", path: "/admin/products" },
      ]
    : [
        { label: "Home", path: "/home" },
        { label: "Cart", path: "/cart" },
        { label: "Orders", path: "/orders" },
      ];

  if (loading || !profile) {
    return (
      <div className="profile-container">
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
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      className="dropdown-item"
                      onClick={() => {
                        navigate(item.path);
                        setShowProfileDropdown(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-container">
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
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    className="dropdown-item"
                    onClick={() => {
                      navigate(item.path);
                      setShowProfileDropdown(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content profile-layout">
        <div className="profile-wrapper-container">
          <div className="profile-header">
            <div className="header-content">
              <h1 className="page-title">Profile Settings</h1>
              <p className="page-subtitle">Manage your personal information</p>
            </div>

            <button
              className={`btn-edit-toggle ${editMode ? "cancel" : "edit"}`}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"></path>
                  </svg>
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="profile-content">
            {!editMode ? (
              <div className="profile-display">
                <div className="profile-card">
                  <div className="card-header">
                    <div className="avatar">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="profile-info">
                      <h2 className="profile-name">{profile.name}</h2>
                      <p className="profile-username">@{profile.username}</p>
                    </div>
                  </div>

                  <div className="profile-fields">
                    <div className="profile-field">
                      <label className="field-label">Username</label>
                      <p className="field-value">@{profile.username}</p>
                    </div>

                    <div className="profile-field">
                      <label className="field-label">Email Address</label>
                      <p className="field-value">{profile.email}</p>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-delete"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"></path>
                  </svg>
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="profile-edit">
                <div className="edit-form">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Choose a username"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn-save"
                      onClick={handleUpdate}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner-small"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path>
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Account</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-warning">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn-modal-delete"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
