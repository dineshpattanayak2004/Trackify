import { useState } from "react";
import { FaCreditCard, FaDownload, FaCheckCircle, FaClock, FaUniversity, FaMobileAlt, FaMoneyBill, FaFileInvoiceDollar, FaSearch, FaWallet } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store/StoreContext";

const paymentMethods = [
  { id: "upi", name: "UPI", icon: <FaMobileAlt />, desc: "Google Pay, PhonePe, Paytm", color: "#7c3aed" },
  { id: "credit", name: "Credit Card", icon: <FaCreditCard />, desc: "Visa, Mastercard, Amex", color: "#0ea5e9" },
  { id: "debit", name: "Debit Card", icon: <FaCreditCard />, desc: "All bank debit cards", color: "#10b981" },
  { id: "netbanking", name: "Net Banking", icon: <FaUniversity />, desc: "All major banks", color: "#f59e0b" },
  { id: "cod", name: "Cash on Delivery", icon: <FaMoneyBill />, desc: "Pay when delivered", color: "#ef4444" },
];

export default function UserPayments() {
  const { payments } = useStore();
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");

  // Filter payments for current user (user1)
  const userPayments = payments.filter((p) => p.userId === "user1");

  const filtered = userPayments.filter((p) =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.orderId.toLowerCase().includes(search.toLowerCase()) ||
    p.method.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = userPayments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const totalPending = userPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const handlePay = () => {
    if (selectedMethod && payAmount) {
      alert(`Payment of ₹${Number(payAmount).toLocaleString()} initiated via ${selectedMethod.name}!\n\nIn production, this connects to Razorpay/Stripe API.\nThe distributor dashboard will show this payment status.`);
      setShowPayModal(false);
      setSelectedMethod(null);
      setPayAmount("");
    }
  };

  return (
    <div className="main-container main-user">
      <Sidebar />
      <div className="dashboard dashboard-user">
        <Navbar />
        <div className="page-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">Payments</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Manage payments and download invoices</p>
            </div>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowPayModal(true)}>
              <FaWallet /> Make Payment
            </button>
          </div>

          <div className="card-grid" style={{ marginBottom: 28 }}>
            <div className="stat-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", color: "#10b981" }}><FaCheckCircle /></div>
              <div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>Total Paid</p>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#10b981" }}>₹{totalPaid.toLocaleString()}</h3>
              </div>
            </div>
            <div className="stat-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", color: "#f59e0b" }}><FaClock /></div>
              <div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>Pending</p>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#f59e0b" }}>₹{totalPending.toLocaleString()}</h3>
              </div>
            </div>
            <div className="stat-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", color: "#7c3aed" }}><FaFileInvoiceDollar /></div>
              <div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>Transactions</p>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>{userPayments.length}</h3>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="dist-search-wrapper" style={{ maxWidth: 400 }}>
              <FaSearch />
              <input className="dist-search-input" placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr><th>Payment ID</th><th>Order</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Invoice</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: "#7c3aed", fontFamily: "monospace" }}>{p.id}</td>
                    <td>{p.orderId}</td>
                    <td style={{ fontWeight: 700 }}>₹{p.amount.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: p.status === "success" ? "#d1fae5" : "#fef9c3", color: p.status === "success" ? "#10b981" : "#f59e0b", fontSize: "0.75rem", fontWeight: 700 }}>
                        {p.status === "success" ? <FaCheckCircle /> : <FaClock />} {p.status === "success" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td>{p.date}</td>
                    <td>
                      <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white", color: "#374151", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }} onClick={() => alert(`Downloading invoice for ${p.id}...`)}>
                        <FaDownload /> Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>Payment Methods</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {paymentMethods.map((m) => (
                <div key={m.id} style={{ padding: 24, borderRadius: 20, border: `2px solid ${selectedMethod?.id === m.id ? m.color : "#e2e8f0"}`, background: selectedMethod?.id === m.id ? `${m.color}10` : "white", cursor: "pointer", transition: "all 0.3s ease", textAlign: "center" }} onClick={() => setSelectedMethod(m)}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: `${m.color}15`, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", margin: "0 auto 12px" }}>{m.icon}</div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{m.name}</h4>
                  <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.78rem" }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {showPayModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setShowPayModal(false)}>
              <div style={{ background: "white", borderRadius: 24, padding: 36, maxWidth: 440, width: "90%", animation: "slideDown 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 20px", fontSize: "1.3rem" }}>Make a Payment</h2>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#374151", fontSize: "0.85rem" }}>Amount (₹)</label>
                <input type="number" placeholder="Enter amount" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none", marginBottom: 16 }} onFocus={(e) => e.target.style.borderColor = "#7c3aed"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#374151", fontSize: "0.85rem" }}>Payment Method</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {paymentMethods.map((m) => (
                    <button key={m.id} onClick={() => setSelectedMethod(m)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 12, border: selectedMethod?.id === m.id ? `2px solid ${m.color}` : "1px solid #e2e8f0", background: selectedMethod?.id === m.id ? `${m.color}10` : "white", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                      <span style={{ color: m.color }}>{m.icon}</span> {m.name}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handlePay}>Pay ₹{Number(payAmount || 0).toLocaleString()}</button>
                  <button style={{ flex: 1, padding: "12px 24px", borderRadius: 14, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: 600 }} onClick={() => setShowPayModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}