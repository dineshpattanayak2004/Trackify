import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken, setRole, setUserName } from '../utils/auth';
import { API_BASE_URL } from "../config/api";
import adminHero from "../assets/admin-hero.png";

export default function AdminLogin(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    setError("");
    try{
      const resp = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      setToken(resp.data.token);
      setRole(resp.data.role);
      setUserName(resp.data.name);
      axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`;
      navigate("/dashboard");
    }catch(err){
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-image">
        <img src={adminHero} alt="Admin Login Background" />
      </div>
      <div className="login-bg-overlay"></div>
      <div className="login-card">
        <h2>Admin Login</h2>
        <form onSubmit={submit}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn-primary" type="submit">Login as Admin</button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <p className="login-hint"></p>
      </div>
    </div>
  );
}
