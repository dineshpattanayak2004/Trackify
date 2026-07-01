import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import {
  FaUser,
  FaUserShield,
  FaTruck,
  FaArrowRight,
  FaChartLine,
  FaRobot,
  FaUsers,
  FaBullseye,
  FaStar,
  FaChevronRight,
} from "react-icons/fa";
import adminHero from "../assets/admin-hero.png";
import distributorHero from "../assets/distributor-hero.png";
import userHero from "../assets/user-hero.png";

const features = [
  {
    icon: <FaRobot />,
    title: "AI-Powered Insights",
    desc: "Leverage intelligent automation to convert leads faster and smarter.",
  },
  {
    icon: <FaChartLine />,
    title: "Real-Time Analytics",
    desc: "Track performance metrics and revenue with live dashboards.",
  },
  {
    icon: <FaUsers />,
    title: "Team Management",
    desc: "Assign leads, monitor activity, and boost team productivity.",
  },
  {
    icon: <FaBullseye />,
    title: "Lead Tracking",
    desc: "Capture, nurture, and convert leads with automated pipelines.",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "98%", label: "Satisfaction" },
  { value: "50M+", label: "Leads Managed" },
  { value: "24/7", label: "AI Support" },
];

const roles = [
  {
    icon: <FaUser />,
    title: "User Login",
    desc: "Access your dashboard, leads, and reports.",
    link: "/user-login",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    image: userHero,
  },
  {
    icon: <FaUserShield />,
    title: "Admin Login",
    desc: "Manage users, analytics, and system settings.",
    link: "/admin-login",
    color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    image: adminHero,
  },
  {
    icon: <FaTruck />,
    title: "Distributor Login",
    desc: "Manage distribution, inventory, and orders.",
    link: "/distributor/login",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    image: distributorHero,
  },
];

const particleData = [...Array(20)].map((_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  animationDelay: `${(i * 0.7) % 5}s`,
  animationDuration: `${3 + (i % 4)}s`,
}));

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Animated Background Particles */}
      <div className="landing-particles">
        {particleData.map((p, i) => (
          <div key={i} className="particle" style={p} />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`landing-navbar ${scrollY > 50 ? "navbar-scrolled" : ""}`}>
        <div className="landing-nav-left">
          <Logo size={40} />
          <span className="landing-nav-brand">Trackify</span>
        </div>
        <div className="landing-nav-right">
          <Link to="/user-login" className="nav-role-btn nav-role-user">
            <FaUser /> User
          </Link>
          <Link to="/admin-login" className="nav-role-btn nav-role-admin">
            <FaUserShield /> Admin
          </Link>
          <Link to="/distributor/login" className="nav-role-btn nav-role-distributor">
            <FaTruck /> Distributor
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero hero-visible">
        <div className="hero-content">
          <div className="hero-badge">
            <FaStar /> #1 AI-Powered CRM Platform
          </div>
          <h1 className="hero-title">
            Trackify CRM –<span className="hero-gradient-text"> Track. Connect. Grow.</span>
          </h1>
          <p className="hero-subtitle">
            Trackify combines artificial intelligence with powerful CRM tools to
            help you capture leads, close deals, and grow your business
            — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/user-login" className="hero-btn hero-btn-primary">
              Get Started <FaArrowRight />
            </Link>
            <a href="#features" className="hero-btn hero-btn-secondary">
              Explore Features
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="floating-card card-1">
              <div className="fc-icon" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                <FaChartLine />
              </div>
              <div>
                <strong>Revenue</strong>
                <span>+42.5% this month</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="fc-icon" style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}>
                <FaUsers />
              </div>
              <div>
                <strong>New Leads</strong>
                <span>1,248 this week</span>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="fc-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <FaRobot />
              </div>
              <div>
                <strong>AI Agent</strong>
                <span>Active & Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Role Selection Section */}
      <section className="landing-roles" id="roles">
        <div className="section-header">
          <span className="section-badge">Choose Your Path</span>
          <h2>Login as Your Role</h2>
          <p>Select your access level to get started with Trackify</p>
        </div>
        <div className="roles-grid">
          {roles.map((role, i) => (
            <Link key={i} to={role.link} className="role-card" style={{ "--accent": role.color }}>
              <div className="role-card-bg">
                <img src={role.image} alt={role.title} />
              </div>
              <div className="role-card-overlay"></div>
              <div className="role-card-content">
                <div className="role-card-icon" style={{ background: role.gradient }}>
                  {role.icon}
                </div>
                <h3>{role.title}</h3>
                <p>{role.desc}</p>
                <span className="role-card-cta">
                  Continue <FaChevronRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features" id="features">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2>Everything You Need to Close Deals</h2>
          <p>Powerful tools designed for modern sales teams</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Sales?</h2>
          <p>Join thousands of teams already using Trackify to close more deals.</p>
          <Link to="/user-login" className="hero-btn hero-btn-primary">
            Start Free Trial <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Logo size={32} />
            <span>Trackify</span>
          </div>
          <p>&copy; 2026 Trackify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}