import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export default function Register() {

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
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          name,
          email,
          password
        }
      );

      setSuccess("Registration Successful! You can now login.");
      setName("");
      setEmail("");
      setPassword("");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
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
            placeholder="Name"
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
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