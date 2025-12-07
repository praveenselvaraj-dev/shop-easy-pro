import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice";
function Registration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      setShowErrorMessage(true)
      return;
    }

    const res = await dispatch(registerUser({ email, username, password, role }));

    if (res.meta.requestStatus === "fulfilled") {
      alert("Registration successful!");
      setShowSuccessMessage(true);
      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>

        {localError && <p style={styles.error}>{localError}</p>}

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Re-enter Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "var(--spacing-unit)",
    background: "linear-gradient(135deg, var(--neutral-50), #f0f9ff)",
  },

  card: {
    backgroundColor: "#fff",
    padding: "calc(var(--spacing-unit) * 4)",
    borderRadius: "14px",
    boxShadow: "var(--shadow-lg)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    border: "1px solid var(--neutral-200)",
    transition: "var(--transition)",
  },

  title: {
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  inputGroup: {
    textAlign: "left",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1.5px solid var(--neutral-300)",
    background: "var(--neutral-50)",
    fontSize: "15px",
    color: "var(--neutral-800)",
    marginTop: "6px",
    transition: "var(--transition)",
  },

  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, var(--primary-color), var(--primary-light))",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "var(--shadow-md)",
    transition: "var(--transition)",
  },

  error: {
    color: "var(--error-color)",
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: 500,
  },

  footerText: {
    marginTop: "18px",
    fontSize: "14px",
    color: "var(--neutral-600)",
  },

  link: {
    color: "var(--primary-color)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "var(--transition)",
  },

  "@media (max-width: 480px)": {
    card: {
      padding: "calc(var(--spacing-unit) * 3)",
    },
    title: {
      fontSize: "1.6rem",
    },
    input: {
      padding: "12px",
      fontSize: "14px",
    },
    button: {
      padding: "12px",
      fontSize: "15px",
    },
  },
};


export default Registration;
