import { useEffect, useState } from "react";
import axios from "axios";

const contactColors = [
  { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", accent: "#667eea" },
  { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", accent: "#f5576c" },
  { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", accent: "#4facfe" },
  { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", accent: "#43e97b" },
  { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", accent: "#fa709a" },
  { bg: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", accent: "#a18cd1" },
  { bg: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)", accent: "#d57eeb" },
  { bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", accent: "#8ec5fc" },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });

  const fetchList = async () => {
    const resp = await axios.get("http://localhost:4000/contacts");
    setContacts(resp.data.contacts || []);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/contacts", form);
    setForm({ name: "", email: "", phone: "", company: "" });
    fetchList();
  };

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <div className="contacts-header-left">
          <h2 className="contacts-title">Contacts</h2>
          <p className="contacts-subtitle">
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""} in your network
          </p>
        </div>
        <div className="contacts-header-badge">
          <span className="contacts-badge-icon">👥</span>
          <span>Network</span>
        </div>
      </div>

      <div className="contacts-grid">
        {contacts.map((c, index) => {
          const colors = contactColors[index % contactColors.length];
          return (
            <div key={c.id} className="contact-card" style={{ "--accent": colors.accent }}>
              <div className="contact-card-bg" style={{ background: colors.bg }} />
              <div className="contact-avatar" style={{ background: colors.bg }}>
                {getInitials(c.name)}
              </div>
              <div className="contact-info">
                <h3 className="contact-name">{c.name}</h3>
                <div className="contact-detail">
                  <span className="contact-detail-icon">✉</span>
                  <span>{c.email || "—"}</span>
                </div>
                <div className="contact-detail">
                  <span className="contact-detail-icon">📞</span>
                  <span>{c.phone || "—"}</span>
                </div>
                <div className="contact-detail">
                  <span className="contact-detail-icon">🏢</span>
                  <span className="contact-company">{c.company || "—"}</span>
                </div>
              </div>
              <div className="contact-card-shine" />
            </div>
          );
        })}
      </div>

      <div className="add-contact-section">
        <div className="add-contact-glow" />
        <div className="add-contact-content">
          <h3 className="add-contact-title">
            <span className="add-contact-icon">+</span> Add New Contact
          </h3>
          <form className="add-contact-form" onSubmit={submit}>
            <div className="add-contact-fields">
              <div className="add-contact-field">
                <label>Full Name</label>
                <input
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="add-contact-field">
                <label>Email</label>
                <input
                  placeholder="e.g. john@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="add-contact-field">
                <label>Phone</label>
                <input
                  placeholder="e.g. +1 234 567 890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="add-contact-field">
                <label>Company</label>
                <input
                  placeholder="e.g. Acme Inc."
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
            </div>
            <button className="add-contact-submit" type="submit">
              <span className="add-contact-submit-icon">+</span>
              Add Contact
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}