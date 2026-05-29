import { useAuth } from "./AuthContext"

export default function LoginPage() {
  const { loginWithGoogle } = useAuth()

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ textAlign: "center", padding: "40px", maxWidth: "420px", width: "100%" }}>
        
        <div style={{ fontSize: "50px", marginBottom: "16px" }}>🎙️</div>
        
        <h1 style={{
          margin: "0 0 8px",
          fontSize: "24px",
          background: "linear-gradient(90deg, #a855f7, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Figuring Out
        </h1>
        
        <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#555" }}>
          Guest Intelligence System
        </p>
        
        <p style={{ margin: "0 0 40px", fontSize: "12px", color: "#333" }}>
          Private access — Raj Shamani's team only
        </p>

        <button
          onClick={loginWithGoogle}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "#fff",
            color: "#000",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img src="https://www.google.com/favicon.ico" width="20" height="20" />
          Sign in with Google
        </button>

        <p style={{ margin: "32px 0 0", fontSize: "11px", color: "#222" }}>
          Built for Figuring Out With Raj Shamani
        </p>
      </div>
    </div>
  )
}