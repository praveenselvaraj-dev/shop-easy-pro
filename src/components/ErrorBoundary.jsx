import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error Boundary Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.wrapper}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.message}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>

            <button style={styles.button} onClick={() => window.location.reload()}>
              Refresh Page
            </button>

            <p style={styles.subtext}>
              If the issue continues, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  wrapper: {
    height: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #eef2ff, #e0f2fe)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(12px)",
    padding: "40px 35px",
    borderRadius: "20px",
    boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
    maxWidth: "420px",
    textAlign: "center",
    animation: "fadeIn 0.6s ease",
    border: "1px solid rgba(255,255,255,0.5)",
  },

  icon: {
    fontSize: "48px",
    marginBottom: "15px",
  },

  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "10px",
  },

  message: {
    fontSize: "1rem",
    color: "#475569",
    marginBottom: "25px",
    lineHeight: "1.5",
  },

  button: {
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
    transition: "all 0.25s ease",
  },

  subtext: {
    marginTop: "15px",
    fontSize: "0.85rem",
    color: "#64748b",
  },
};

// Add fadeIn animation globally
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`, styleSheet.cssRules.length);

export default ErrorBoundary;
