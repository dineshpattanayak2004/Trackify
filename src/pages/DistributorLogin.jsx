import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setToken, setRole, setUserName } from '../utils/auth';
import { API_BASE_URL } from "../config/api";
import distributorHero from "../assets/distributor-hero.png";

export default function DistributorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await axios.post(`${API_BASE_URL}/distributor/login`, { email, password });
      setToken(resp.data.token);
      setRole("distributor");
      setUserName(resp.data.name);
      axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`;
      navigate("/distributor/dashboard");
    } catch (err) {
      const raw = err.response?.data?.error || err.response?.data?.message || err.message || "Login failed. Is the backend running?";
      setError(typeof raw === "string" ? raw : JSON.stringify(raw));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page distributor-login-page">
      <div className="login-bg-image">
        <img src={distributorHero} alt="Distributor Login Background" />
      </div>
      <div className="login-bg-overlay"></div>
      <div className="login-card distributor-card">
        <div className="distributor-card-badge">
          <span className="distributor-badge-icon">📦</span>
          <span>Distributor Portal</span>
        </div>
        <h2 className="distributor-title">Distributor Login</h2>
        <p className="login-description">Access your distributor dashboard to manage inventory, orders, and more.</p>
        <form onSubmit={submit}>
          <input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="btn-primary distributor-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <div className="distributor-links">
          <Link to="/distributor/signup" className="distributor-link">
            New here? Register as Distributor
          </Link>
          <Link to="/" className="distributor-link distributor-link-back">
            ← Back to Main Login
          </Link>
        </div>
      </div>
    </div>
  );
}