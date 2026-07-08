import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setToken, setRole, setUserName } from '../utils/auth';
import { API_BASE_URL } from "../config/api";

export default function DistributorSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await axios.post(
        `${API_BASE_URL}/distributor/register`,
        { name, email, password, company, phone, address }
      );
      if (resp.data.token) {
        setToken(resp.data.token);
        setRole("distributor");
        setUserName(resp.data.distributor.name);
        axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`;
        setSuccess(true);
        setTimeout(() => {
          navigate("/distributor/dashboard");
        }, 1500);
      } else {
        navigate("/distributor/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page distributor-login-page">
      <div className="login-card distributor-card">
        <div className="distributor-card-badge">
          <span className="distributor-badge-icon">📦</span>
          <span>Distributor</span>
        </div>
        <h2 className="distributor-title">Create Distributor Account</h2>
        <p className="login-description">Register to join our distributor network and start managing your inventory.</p>
        <form onSubmit={submit}>
          <div className="distributor-form-row">
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <input
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <div className="distributor-form-row">
            <input
              placeholder="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <textarea
            placeholder="Business Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
          />
          <button
            className="btn-primary distributor-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register as Distributor"}
          </button>
        </form>
        {success && (
          <div className="success-popup">
            <p className="success-text">🎉 Registration successful! Redirecting to dashboard...</p>
          </div>
        )}
        {error && <p className="login-error">{error}</p>}
        <p className="distributor-switch">
          Already have an account?{" "}
          <Link to="/distributor/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}