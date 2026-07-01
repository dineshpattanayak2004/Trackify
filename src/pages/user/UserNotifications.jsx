import { useState } from "react";
import {
  FaBell,
  FaTruck,
  FaBoxOpen,
  FaCreditCard,
  FaExclamationTriangle,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const mockNotifications = [
  { id: 1, type: "payment", title: "Payment Successful", message: "₹2,999 payment for ORD-2024-001 via UPI has been confirmed.", time: "2 hours ago", read: false },
  { id: 2, type: "order", title: "Order Confirmed", message: "Your order ORD-2024-005 for Trackify Starter Pack has been confirmed.", time: "5 hours ago", read: false },
  { id: 3, type: "delivery", title: "Order Shipped", message: "Order ORD-2024-002 has been shipped. Tracking: TRK987654321", time: "1 day ago", read: true },
  { id: 4, type: "delivery", title: "Order Delivered", message: "Order ORD-2024-004 has been delivered successfully.", time: "3 days ago", read: true },
  { id: 5, type: "alert", title: "Payment Pending", message: "Payment of ₹1,999 for ORD-2024-003 is pending. Please complete.", time: "3 days ago", read: true },
  { id: 6, type: "payment", title: "Invoice Ready", message: "Invoice for order ORD-2024-001 is ready for download.", time: "5 days ago", read: true },
  { id: 7, type: "order", title: "Order Processing", message: "Your order ORD-2024-003 is being processed by the distributor.", time: "5 days ago", read: true },
];

const typeConfig = {
  payment: { icon: <FaCreditCard />, color: "#10b981", bg: "#d1fae5" },
  order: { icon: <FaBoxOpen />, color: "#7c3aed", bg: "#f5f3ff" },
  delivery: { icon: <FaTruck />, color: "#3b82f6", bg: "#dbeafe" },
  alert: { icon: <FaExclamationTriangle />, color: "#f59e0b", bg: "#fef9c3" },
};

export default function UserNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="main-container main-user">
      <Sidebar />
      <div className="dashboard dashboard-user">
        <Navbar />

        <div className="page-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">Notifications</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>{unreadCount} unread notifications</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }} onClick={markAllRead}>
                <FaCheck /> Mark all read
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 14, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "#dc2626" }} onClick={clearAll}>
                <FaTrash /> Clear all
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {["all", "unread", "payment", "order", "delivery", "alert"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                border: filter === f ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                background: filter === f ? "#f5f3ff" : "white", color: filter === f ? "#7c3aed" : "#374151",
                transition: "all 0.2s ease", textTransform: "capitalize",
              }}>{f === "all" ? `All (${notifications.length})` : f === "unread" ? `Unread (${unreadCount})` : f}</button>
            ))}
          </div>

          {/* Notifications List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((n) => {
              const cfg = typeConfig[n.type] || typeConfig.alert;
              return (
                <div key={n.id} onClick={() => markRead(n.id)} style={{
                  display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 22px", borderRadius: 18,
                  background: n.read ? "white" : "#f5f3ff", border: `1px solid ${n.read ? "#f1f5f9" : "rgba(124,58,237,0.15)"}`,
                  cursor: "pointer", transition: "all 0.3s ease",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                    {cfg.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>{n.title}</h4>
                      {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                    </div>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6 }}>{n.message}</p>
                    <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 6, display: "block" }}>{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
              <FaBell style={{ fontSize: "3rem", marginBottom: 16 }} />
              <p style={{ fontSize: "1.1rem" }}>No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}