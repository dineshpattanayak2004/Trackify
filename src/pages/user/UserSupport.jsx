import { useState } from "react";
import {
  FaHeadset,
  FaExclamationCircle,
  FaComments,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaChevronRight,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const mockTickets = [
  { id: "TKT-001", subject: "Payment not reflecting after UPI transfer", status: "open", priority: "high", date: "2026-06-15", messages: [
    { from: "user", text: "I made a UPI payment of ₹2,999 but it's not reflecting in my account.", time: "2 hours ago" },
    { from: "support", text: "We're looking into this. Please share your UPI reference number.", time: "1 hour ago" },
  ]},
  { id: "TKT-002", subject: "Need help with order cancellation", status: "resolved", priority: "medium", date: "2026-06-10", messages: [
    { from: "user", text: "I want to cancel order ORD-2024-003.", time: "5 days ago" },
    { from: "support", text: "Your order has been cancelled and refund will be processed in 3-5 business days.", time: "4 days ago" },
  ]},
  { id: "TKT-003", subject: "Product licensing issue", status: "open", priority: "low", date: "2026-06-14", messages: [
    { from: "user", text: "My Trackify Pro license key is not working.", time: "3 days ago" },
  ]},
];

const faqData = [
  { q: "How do I track my order?", a: "Go to Orders section and click on the eye icon next to any order to see tracking details." },
  { q: "What payment methods are accepted?", a: "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery." },
  { q: "How do I request a refund?", a: "Raise a support ticket with your order ID and reason. Refunds are processed within 3-5 business days." },
  { q: "Can I cancel an order after placing it?", a: "Yes, orders can be cancelled before they are shipped. Go to Orders and click Cancel." },
  { q: "How do I contact my distributor?", a: "Use the Contact Distributor section below, or raise a ticket selecting 'Contact Distributor' as the category." },
];

export default function UserSupport() {
  const [tickets, setTickets] = useState(mockTickets);
  const [activeTab, setActiveTab] = useState("tickets");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [newTicket, setNewTicket] = useState({ subject: "", category: "order", message: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");

  const submitTicket = () => {
    if (!newTicket.subject || !newTicket.message) return;
    const ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      subject: newTicket.subject,
      status: "open",
      priority: "medium",
      date: new Date().toISOString().split("T")[0],
      messages: [{ from: "user", text: newTicket.message, time: "Just now" }],
    };
    setTickets((prev) => [ticket, ...prev]);
    setNewTicket({ subject: "", category: "order", message: "" });
    setShowNewTicket(false);
    alert("Support ticket created! Our team will respond within 24 hours.");
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    setTickets((prev) => prev.map((t) =>
      t.id === selectedTicket.id
        ? { ...t, messages: [...t.messages, { from: "user", text: replyText, time: "Just now" }] }
        : t
    ));
    setSelectedTicket((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "user", text: replyText, time: "Just now" }],
    }));
    setReplyText("");
  };

  const priorityColor = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
  const statusColor = { open: "#3b82f6", resolved: "#10b981" };

  return (
    <div className="main-container main-user">
      <Sidebar />
      <div className="dashboard dashboard-user">
        <Navbar />

        <div className="page-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">Support & Help</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Raise tickets, chat with support, contact distributor</p>
            </div>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowNewTicket(true)}>
              <FaExclamationCircle /> New Ticket
            </button>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[
              { id: "tickets", label: "My Tickets", icon: <FaHeadset /> },
              { id: "faq", label: "FAQ", icon: <FaComments /> },
              { id: "contact", label: "Contact Distributor", icon: <FaPhoneAlt /> },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 14,
                border: activeTab === tab.id ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                background: activeTab === tab.id ? "#f5f3ff" : "white", color: activeTab === tab.id ? "#7c3aed" : "#374151",
                fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease", fontSize: "0.9rem",
              }}>{tab.icon} {tab.label}</button>
            ))}
          </div>

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <div>
              {tickets.map((ticket) => (
                <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px",
                  borderRadius: 18, background: "white", border: "1px solid #f1f5f9", marginBottom: 12,
                  cursor: "pointer", transition: "all 0.3s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: statusColor[ticket.status] + "15", color: statusColor[ticket.status], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                      {ticket.status === "open" ? <FaClock /> : <FaCheckCircle />}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: "#7c3aed", fontSize: "0.8rem" }}>{ticket.id}</span>
                        <span style={{ padding: "2px 10px", borderRadius: 999, background: priorityColor[ticket.priority] + "15", color: priorityColor[ticket.priority], fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>{ticket.priority}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{ticket.subject}</h4>
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{ticket.date}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ padding: "4px 12px", borderRadius: 999, background: statusColor[ticket.status] + "15", color: statusColor[ticket.status], fontSize: "0.75rem", fontWeight: 700, textTransform: "capitalize" }}>{ticket.status}</span>
                    <FaChevronRight style={{ color: "#9ca3af" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div style={{ maxWidth: 700 }}>
              <h3 style={{ marginBottom: 16 }}>Frequently Asked Questions</h3>
              {faqData.map((faq, i) => (
                <div key={i} style={{ marginBottom: 10, borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  <div onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: expandedFaq === i ? "#f5f3ff" : "white", cursor: "pointer", transition: "all 0.2s ease" }}>
                    <strong style={{ fontSize: "0.95rem" }}>{faq.q}</strong>
                    <FaChevronRight style={{ color: "#7c3aed", transform: expandedFaq === i ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }} />
                  </div>
                  {expandedFaq === i && (
                    <div style={{ padding: "0 20px 16px", color: "#6b7280", lineHeight: 1.7, fontSize: "0.9rem" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contact Distributor Tab */}
          {activeTab === "contact" && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ padding: 32, borderRadius: 22, background: "linear-gradient(135deg, #f0fdfa, #f5f3ff)", border: "1px solid rgba(13,148,136,0.15)" }}>
                <h3 style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>🏢 TechDistro Pvt Ltd</h3>
                <p style={{ color: "#6b7280", margin: "0 0 24px" }}>Your assigned distributor</p>
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: "white", border: "1px solid #f1f5f9" }}>
                    <FaUser style={{ color: "#0d9488" }} />
                    <div><p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Contact Person</p><strong style={{ margin: 0 }}>Rajesh Kumar</strong></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: "white", border: "1px solid #f1f5f9" }}>
                    <FaPhoneAlt style={{ color: "#0d9488" }} />
                    <div><p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Phone</p><strong style={{ margin: 0 }}>+91 98765 43210</strong></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: "white", border: "1px solid #f1f5f9" }}>
                    <FaEnvelope style={{ color: "#0d9488" }} />
                    <div><p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>Email</p><strong style={{ margin: 0 }}>support@techdistro.in</strong></div>
                  </div>
                </div>
                <button className="btn-primary" style={{ marginTop: 20, width: "100%", background: "linear-gradient(135deg, #0d9488, #0891b2)" }} onClick={() => alert("Opening chat with distributor...")}>
                  <FaComments style={{ marginRight: 8 }} /> Chat with Distributor
                </button>
              </div>
            </div>
          )}

          {/* New Ticket Modal */}
          {showNewTicket && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setShowNewTicket(false)}>
              <div style={{ background: "white", borderRadius: 24, padding: 36, maxWidth: 500, width: "90%", animation: "slideDown 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 20px" }}>New Support Ticket</h2>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.85rem" }}>Subject</label>
                <input value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="Brief description of your issue" style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #e2e8f0", marginBottom: 14, fontSize: "0.95rem", outline: "none" }} />
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.85rem" }}>Category</label>
                <select value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #e2e8f0", marginBottom: 14, fontSize: "0.95rem", outline: "none", background: "white" }}>
                  <option value="order">Order Issue</option>
                  <option value="payment">Payment Issue</option>
                  <option value="product">Product Issue</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="other">Other</option>
                </select>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.85rem" }}>Message</label>
                <textarea value={newTicket.message} onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} placeholder="Describe your issue in detail..." rows={4} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #e2e8f0", marginBottom: 20, fontSize: "0.95rem", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={submitTicket}>Submit Ticket</button>
                  <button style={{ flex: 1, padding: "12px 24px", borderRadius: 14, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: 600 }} onClick={() => setShowNewTicket(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Detail Modal */}
          {selectedTicket && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setSelectedTicket(null)}>
              <div style={{ background: "white", borderRadius: 24, padding: 36, maxWidth: 550, width: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column", animation: "slideDown 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{selectedTicket.id} — {selectedTicket.subject}</h2>
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: statusColor[selectedTicket.status] + "15", color: statusColor[selectedTicket.status], fontSize: "0.72rem", fontWeight: 700, textTransform: "capitalize", marginTop: 4, display: "inline-block" }}>{selectedTicket.status}</span>
                  </div>
                  <button onClick={() => setSelectedTicket(null)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#9ca3af" }}>✕</button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, padding: 16, borderRadius: 14, background: "#f8fafc", maxHeight: 300 }}>
                  {selectedTicket.messages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: 16, background: msg.from === "user" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "white", color: msg.from === "user" ? "white" : "#1f2937", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderBottomLeftRadius: msg.from === "support" ? 4 : 16, borderBottomRightRadius: msg.from === "user" ? 4 : 16 }}>
                        <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6 }}>{msg.text}</p>
                        <span style={{ fontSize: "0.68rem", opacity: 0.7, marginTop: 4, display: "block" }}>{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." onKeyDown={(e) => e.key === "Enter" && sendReply()} style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "2px solid #e2e8f0", outline: "none", fontSize: "0.9rem" }} />
                  <button className="btn-primary" style={{ padding: "12px 18px" }} onClick={sendReply}><FaPaperPlane /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}