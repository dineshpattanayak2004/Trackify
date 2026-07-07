import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export default function Register() {
  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");
  const [loading,setLoading] = useState(false);

  const register = async(e)=>{
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          name,
          email,
          password
        }
      );

      setSuccess("Registration Successful! Redirecting to user login...");
      setName("");
      setEmail("");
      setPassword("");
      
      setTimeout(() => {
        navigate("/user-login", { replace: true });
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Registration failed. Please try again.");
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Register</h1>
        <p className="login-description">Create a new Trackify account and start tracking your leads.</p>
        
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        
        <form onSubmit={register}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}