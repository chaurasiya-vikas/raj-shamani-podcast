import { useAuth } from "./AuthContext"
import LoginPage from "./LoginPage"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: "14px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎙️</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return children
}