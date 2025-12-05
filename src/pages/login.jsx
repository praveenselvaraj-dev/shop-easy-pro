import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loadProfile } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "../styles/home.css";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');
  setLoading(true);

  const res = await dispatch(loginUser({ username, password }));

  if (res.meta.requestStatus === "fulfilled") {
    const role = res.payload?.user?.role;
    await dispatch(loadProfile());

    if (role === "admin") {
      navigate("/admin/dashboard");
      console.log(`role -> ${role}`)
    } else {
      navigate("/home");
    }
  } else {
    setError("Invalid username or password");
  }

  setLoading(false);
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to Your Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter your username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} style={styles.link}>
            Register
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
    maxWidth: "400px",
    textAlign: "center",
    border: "1px solid var(--neutral-200)",
    transition: "var(--transition)",
  },

  title: {
    marginBottom: "20px",
    fontSize: "1.9rem",
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


export default Login;
