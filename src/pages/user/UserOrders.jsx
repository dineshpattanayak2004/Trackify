import { useState, useEffect } from "react";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClock, FaSearch, FaEye, FaStore } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store/StoreContext";

const statusConfig = {
  pending: { color: "#f59e0b", bg: "#fef9c3", icon: <FaClock />, label: "Pending" },
  processing: { color: "#3b82f6", bg: "#dbeafe", icon: <FaBoxOpen />, label: "Processing" },
  shipped: { color: "#8b5cf6", bg: "#ede9fe", icon: <FaTruck />, label: "Shipped" },
  delivered: { color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle />, label: "Delivered" },
};

export default function UserOrders() {
  const { orders, distributors, fetchDistributors } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [distributorFilter, setDistributorFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDistributorFilter, setShowDistributorFilter] = useState(false);

  // Fetch distributors on mount
  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  // Filter orders for current user (user1)
  let userOrders = orders.filter((o) => o.userId === "user1");

  // Apply distributor filter
  if (distributorFilter !== "all") {
    const selectedDist = distributors.find(d => d.id === distributorFilter);
    if (selectedDist) {
      userOrders = userOrders.filter((o) => o.distributor === selectedDist.company);
    }
  }

  const statuses = ["all", "pending", "processing", "shipped", "delivered"];
  const filtered = userOrders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: userOrders.length,
    pending: userOrders.filter((o) => o.status === "pending").length,
    processing: userOrders.filter((o) => o.status === "processing").length,
    shipped: userOrders.filter((o) => o.status === "shipped").length,
    delivered: userOrders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="main-container main-user">
      <Sidebar />
      <div className="dashboard dashboard-user">
        <Navbar />
        <div className="page-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">My Orders</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Track and manage your orders</p>
            </div>
          </div>

          <div className="card-grid" style={{ marginBottom: 28 }}>
            {[
              { label: "Total Orders", value: stats.total, icon: "📦", color: "#f5f3ff" },
              { label: "Pending", value: stats.pending, icon: "⏳", color: "#fef9c3" },
              { label: "Processing", value: stats.processing, icon: "⚙️", color: "#dbeafe" },
              { label: "Shipped", value: stats.shipped, icon: "🚚", color: "#ede9fe" },
              { label: "Delivered", value: stats.delivered, icon: "✅", color: "#d1fae5" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>{s.icon}</div>
                <div>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>{s.label}</p>
                  <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>{s.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", position: "relative" }}>
            <div className="dist-search-wrapper" style={{ flex: 1, minWidth: 250 }}>
              <FaSearch />
              <input className="dist-search-input" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {/* Distributor Filter Button */}
              <button 
                onClick={() => setShowDistributorFilter(!showDistributorFilter)}
                style={{
                  padding: "8px 16px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                  border: distributorFilter !== "all" ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                  background: distributorFilter !== "all" ? "#f5f3ff" : "white", color: distributorFilter !== "all" ? "#7c3aed" : "#374151",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <FaStore /> Distributor
              </button>
              
              {/* Distributor Filter Dropdown */}
              {showDistributorFilter && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  padding: 8,
                  zIndex: 100,
                  minWidth: 220,
                }}>
                  <button
                    onClick={() => { setDistributorFilter("all"); setShowDistributorFilter(false); }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "none",
                      background: distributorFilter === "all" ? "#f5f3ff" : "transparent",
                      color: distributorFilter === "all" ? "#7c3aed" : "#374151",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    All Distributors
                  </button>
                  {distributors.map((dist) => (
                    <button
                      key={dist.id}
                      onClick={() => { setDistributorFilter(dist.id); setShowDistributorFilter(false); }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "none",
                        background: distributorFilter === dist.id ? "#f5f3ff" : "transparent",
                        color: distributorFilter === dist.id ? "#7c3aed" : "#374151",
                        borderRadius: 8,
                        cursor: "pointer",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      {dist.company}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Status Filters */}
              {statuses.map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding: "8px 16px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                  border: statusFilter === s ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                  background: statusFilter === s ? "#f5f3ff" : "white", color: statusFilter === s ? "#7c3aed" : "#374151",
                }}>{s === "all" ? "All" : statusConfig[s].label}</button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Total</th><th>Distributor</th><th>Status</th><th>Payment</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700, color: "#7c3aed" }}>{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.qty}</td>
                    <td style={{ fontWeight: 700 }}>₹{order.total.toLocaleString()}</td>
                    <td>
                      <span style={{ 
                        padding: "4px 10px", 
                        borderRadius: 999, 
                        background: "#f5f3ff", 
                        color: "#7c3aed", 
                        fontSize: "0.72rem", 
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}>
                        <FaStore style={{ fontSize: "0.65rem" }} /> {order.distributor || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color, fontSize: "0.75rem", fontWeight: 700 }}>
                        {statusConfig[order.status]?.icon} {statusConfig[order.status]?.label}
                      </span>
                    </td>
                    <td>
                      <span style={{ padding: "4px 10px", borderRadius: 999, background: order.paymentStatus === "paid" ? "#d1fae5" : "#fef9c3", color: order.paymentStatus === "paid" ? "#10b981" : "#f59e0b", fontSize: "0.72rem", fontWeight: 700 }}>
                        {order.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
                      </span>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)} style={{ background: "none", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: "1rem" }} title="View Details"><FaEye /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>
              <FaBoxOpen style={{ fontSize: "2.5rem", marginBottom: 12 }} />
              <p>No orders found.</p>
            </div>
          )}

          {selectedOrder && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setSelectedOrder(null)}>
              <div style={{ background: "white", borderRadius: 24, padding: 36, maxWidth: 480, width: "90%", animation: "slideDown 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 20px", fontSize: "1.3rem" }}>Order Details</h2>
                <div style={{ display: "grid", gap: 14 }}>
                  {[["Order ID", selectedOrder.id], ["Product", selectedOrder.product], ["Quantity", selectedOrder.qty], ["Total", `₹${selectedOrder.total.toLocaleString()}`], ["Status", statusConfig[selectedOrder.status]?.label], ["Payment", selectedOrder.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"], ["Payment Method", selectedOrder.paymentMethod], ["Date", selectedOrder.date], ["Distributor", selectedOrder.distributor], ["Tracking", selectedOrder.tracking]].map(([label, value], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ color: "#6b7280" }}>{label}</span><strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}