import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AIWidget from "../components/AIWidget";
import { getRole, getUserName } from '../utils/auth';
import { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from '../utils/auth';
import { Link } from "react-router-dom";
import { FaBoxOpen, FaCreditCard, FaBell, FaTruck, FaCheckCircle } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";

// ============================================================
//  USER DASHBOARD — Welcome, Activities, Orders, Notifications
// ============================================================
function UserDashboard({ name }) {
  const recentActivities = [
    { icon: <FaCheckCircle />, color: "#10b981", text: "Payment of ₹2,999 confirmed via UPI", time: "2 hours ago" },
    { icon: <FaTruck />, color: "#3b82f6", text: "Order ORD-2024-002 has been shipped", time: "5 hours ago" },
    { icon: <FaBoxOpen />, color: "#7c3aed", text: "Order ORD-2024-005 confirmed", time: "1 day ago" },
    { icon: <FaCreditCard />, color: "#f59e0b", text: "Payment pending for ORD-2024-003", time: "3 days ago" },
    { icon: <FaCheckCircle />, color: "#10b981", text: "Order ORD-2024-004 delivered", time: "4 days ago" },
  ];

  const orderSummary = {
    totalOrders: 5,
    pending: 1,
    processing: 1,
    shipped: 1,
    delivered: 2,
    totalSpent: 13589,
  };

  const unreadNotifications = 2;

  return (
    <div className="dashboard dashboard-user">
      <Navbar />

      {/* Welcome Banner */}
      <div className="user-welcome-banner">
        <div className="user-welcome-content">
          <h1 className="user-welcome-title">
            Welcome back, <span className="user-welcome-name">{name || "User"}</span> 
          </h1>
          <p className="user-welcome-text">
            Here's your workspace overview for today. Stay productive!
          </p>
        </div>
        <div className="user-welcome-illustration">
          <span className="user-welcome-emoji"></span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="card-grid user-card-grid">
        <Link to="/orders" style={{ textDecoration: "none" }}>
          <div className="stat-card user-stat-card user-stat-blue">
            <div className="user-stat-icon">📦</div>
            <div className="user-stat-info">
              <h3>Total Orders</h3>
              <h2 className="card-number">{orderSummary.totalOrders}</h2>
              <span className="user-stat-trend up">{orderSummary.delivered} delivered</span>
            </div>
          </div>
        </Link>
        <Link to="/payments" style={{ textDecoration: "none" }}>
          <div className="stat-card user-stat-card user-stat-green">
            <div className="user-stat-icon">💳</div>
            <div className="user-stat-info">
              <h3>Total Spent</h3>
              <h2 className="card-number">₹{orderSummary.totalSpent.toLocaleString()}</h2>
              <span className="user-stat-trend up">↑ All paid</span>
            </div>
          </div>
        </Link>
        <div className="stat-card user-stat-card user-stat-purple">
          <div className="user-stat-icon">📋</div>
          <div className="user-stat-info">
            <h3>Active Deals</h3>
            <h2 className="card-number">43</h2>
            <span className="user-stat-trend up">5 pending</span>
          </div>
        </div>
        <Link to="/notifications" style={{ textDecoration: "none" }}>
          <div className="stat-card user-stat-card user-stat-orange">
            <div className="user-stat-icon">🔔</div>
            <div className="user-stat-info">
              <h3>Notifications</h3>
              <h2 className="card-number">{unreadNotifications}</h2>
              <span className="user-stat-trend up">unread</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="user-quick-actions">
        <h3 className="user-section-title">Quick Actions</h3>
        <div className="user-actions-grid">
          <Link to="/products" className="user-action-btn" style={{ textDecoration: "none" }}>
            <span className="user-action-icon">🛒</span>
            <span>Browse Products</span>
          </Link>
          <Link to="/orders" className="user-action-btn" style={{ textDecoration: "none" }}>
            <span className="user-action-icon">📦</span>
            <span>My Orders</span>
          </Link>
          <Link to="/payments" className="user-action-btn" style={{ textDecoration: "none" }}>
            <span className="user-action-icon">💳</span>
            <span>Make Payment</span>
          </Link>
          <Link to="/support" className="user-action-btn" style={{ textDecoration: "none" }}>
            <span className="user-action-icon">🎧</span>
            <span>Get Support</span>
          </Link>
          <Link to="/notifications" className="user-action-btn" style={{ textDecoration: "none" }}>
            <span className="user-action-icon">🔔</span>
            <span>Notifications</span>
          </Link>
          <Link to="/ai-agent" className="user-action-btn" style={{ textDecoration: "none" }}>
            <span className="user-action-icon">🤖</span>
            <span>Ask AI</span>
          </Link>
        </div>
      </div>

      {/* Two Column: Order Summary + Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* Order Summary */}
        <div className="dist-card">
          <h3 className="dist-card-title"><FaBoxOpen /> Order Summary</h3>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#6b7280" }}>Pending</span>
              <span style={{ fontWeight: 700, color: "#f59e0b" }}>{orderSummary.pending}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#6b7280" }}>Processing</span>
              <span style={{ fontWeight: 700, color: "#3b82f6" }}>{orderSummary.processing}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#6b7280" }}>Shipped</span>
              <span style={{ fontWeight: 700, color: "#8b5cf6" }}>{orderSummary.shipped}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span style={{ color: "#6b7280" }}>Delivered</span>
              <span style={{ fontWeight: 700, color: "#10b981" }}>{orderSummary.delivered}</span>
            </div>
          </div>
          <Link to="/orders" className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 16, textDecoration: "none" }}>View All Orders →</Link>
        </div>

        {/* Recent Activity */}
        <div className="dist-card">
          <h3 className="dist-card-title"><FaBell /> Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, transition: "background 0.2s ease" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + "15", color: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600 }}>{a.text}</p>
                  <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Widget */}
      <AIWidget />
    </div>
  );
}

// ============================================================
//  ADMIN DASHBOARD — Advanced, data-rich, management focused
// ============================================================
function AdminDashboard({ name }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContacts: 0,
    totalCompanies: 0,
    recentUsers: 0,
    recentContacts: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await axios.get(`${API_BASE_URL}/ai/stats`, { headers: authHeader() });
        if (resp.data?.metrics) {
          setStats(resp.data.metrics);
        }
      } catch (e) {
        console.error("Failed to fetch admin stats", e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="dashboard dashboard-admin">
      <Navbar />

      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="admin-shield-icon">🛡️</div>
          <div>
            <h1 className="dashboard-title admin-dashboard-title">
              Admin Dashboard
            </h1>
            <p className="admin-subtitle">
              Welcome, <strong>{name || "Admin"}</strong> — System Overview
            </p>
          </div>
        </div>
        <div className="admin-header-badge">
          <span className="admin-badge-dot" />
          System Online
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card admin-stat-primary">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Users</span>
            <span className="admin-stat-icon">👥</span>
          </div>
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-footer">
            <span className="admin-stat-change up">+{stats.recentUsers}</span> this week
          </div>
        </div>

        <div className="admin-stat-card admin-stat-secondary">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Contacts</span>
            <span className="admin-stat-icon">📇</span>
          </div>
          <div className="admin-stat-value">{stats.totalContacts}</div>
          <div className="admin-stat-footer">
            <span className="admin-stat-change up">+{stats.recentContacts}</span> this week
          </div>
        </div>

        <div className="admin-stat-card admin-stat-accent">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Companies</span>
            <span className="admin-stat-icon">🏢</span>
          </div>
          <div className="admin-stat-value">{stats.totalCompanies}</div>
          <div className="admin-stat-footer">
            Top: {stats.topCompany?.name || "N/A"}
          </div>
        </div>

        <div className="admin-stat-card admin-stat-warning">
          <div className="admin-stat-header">
            <span className="admin-stat-label">System Health</span>
            <span className="admin-stat-icon">⚡</span>
          </div>
          <div className="admin-stat-value">98%</div>
          <div className="admin-stat-footer">
            <span className="admin-stat-change up">●</span> All systems operational
          </div>
        </div>
      </div>

      {/* Management Quick Links */}
      <div className="admin-management-section">
        <h3 className="admin-section-title">Management Console</h3>
        <div className="admin-management-grid">
          <div className="admin-management-card" onClick={() => window.location.href = "/leads"}>
            <span className="admin-mgmt-icon">📋</span>
            <span className="admin-mgmt-title">Manage Leads</span>
            <span className="admin-mgmt-count">{stats.totalContacts}+</span>
          </div>
          <div className="admin-management-card" onClick={() => window.location.href = "/analytics"}>
            <span className="admin-mgmt-icon">📊</span>
            <span className="admin-mgmt-title">Analytics</span>
            <span className="admin-mgmt-count">Live</span>
          </div>
          <div className="admin-management-card" onClick={() => window.location.href = "/contacts"}>
            <span className="admin-mgmt-icon">🗄️</span>
            <span className="admin-mgmt-title">Contact DB</span>
            <span className="admin-mgmt-count">{stats.totalContacts}</span>
          </div>
          <div className="admin-management-card" onClick={() => window.location.href = "/reports"}>
            <span className="admin-mgmt-icon">📈</span>
            <span className="admin-mgmt-title">Reports</span>
            <span className="admin-mgmt-count">Generate</span>
          </div>
        </div>
      </div>

      {/* AI Widget */}
      <AIWidget />
    </div>
  );
}

// ============================================================
//  MAIN DASHBOARD — Switches between User & Admin
// ============================================================
export default function Dashboard() {
  const role = getRole();
  const name = getUserName();
  const isAdmin = role === "admin";

  return (
    <div className={`main-container ${isAdmin ? "main-admin" : "main-user"}`}>
      <Sidebar />
      {isAdmin ? <AdminDashboard name={name} /> : <UserDashboard name={name} />}
    </div>
  );
}