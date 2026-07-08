import {
 FaHome,
 FaUsers,
 FaChartLine,
 FaRobot,
 FaCog,
 FaUserShield,
 FaUserFriends,
 FaChartBar,
 FaQuestionCircle,
 FaSignOutAlt,
 FaDatabase,
 FaShieldAlt,
 FaBoxOpen,
 FaShoppingCart,
 FaCreditCard,
 FaBell,
 FaHeadset,
} from "react-icons/fa";

import { useState } from "react";
import { Link } from "react-router-dom";
import { getRole, logout, getUserName } from '../utils/auth';
import Logo from './Logo';
import MobileMenuToggle from './MobileMenuToggle';
import MobileOverlay from './MobileOverlay';

export default function Sidebar() {
  const role = getRole();
  const isAdmin = role === "admin";
  const userName = getUserName() || (isAdmin ? "Admin" : "User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <MobileMenuToggle onToggle={toggleMobileMenu} isOpen={isMobileMenuOpen} />
      <MobileOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <div className={`sidebar ${isAdmin ? "sidebar-admin" : "sidebar-user"} ${isMobileMenuOpen ? "open" : ""}`}>

      {/* Logo Section */}
      <div className="logo">
        <Logo size={52} />
        <div>
          <h2>{isAdmin ? "Admin Panel" : "Trackify"}</h2>
          <p>{isAdmin ? "System Control" : "AI CRM"}</p>
        </div>
      </div>

      {/* User Profile Mini Card */}
      <div className={`sidebar-profile ${isAdmin ? "sidebar-profile-admin" : "sidebar-profile-user"}`}>
        <div className="sidebar-profile-avatar">
          {isAdmin ? "👑" : "👤"}
        </div>
        <div className="sidebar-profile-info">
          <span className="sidebar-profile-name">{userName}</span>
          <span className={`sidebar-profile-role ${isAdmin ? "role-admin" : "role-user"}`}>
            {isAdmin ? "Administrator" : "Regular User"}
          </span>
        </div>
      </div>

      {/* ---- MAIN NAVIGATION ---- */}
      <div className="sidebar-section-label">Main</div>

      <Link className="menu-item" to="/dashboard" onClick={closeMobileMenu}>
        <FaHome />
        Dashboard
      </Link>

      <Link className="menu-item" to="/ai-agent" onClick={closeMobileMenu}>
        <FaRobot />
        AI Agent
      </Link>

      {/* ---- USER SPECIFIC MENUS ---- */}
      {!isAdmin && (
        <>
          <div className="sidebar-section-label">My Work</div>
          <Link className="menu-item menu-item-user" to="/products" onClick={closeMobileMenu}>
            <FaShoppingCart />
            Products
          </Link>
          <Link className="menu-item menu-item-user" to="/orders" onClick={closeMobileMenu}>
            <FaBoxOpen />
            Orders
          </Link>
          <Link className="menu-item menu-item-user" to="/payments" onClick={closeMobileMenu}>
            <FaCreditCard />
            Payments
          </Link>
        </>
      )}

      {/* ---- ADMIN SPECIFIC MENUS ---- */}
      {isAdmin && (
        <>
          <div className="sidebar-section-label">Management</div>
          <Link className="menu-item menu-item-admin" to="/admin" onClick={closeMobileMenu}>
            <FaUserShield />
            Admin Console
          </Link>
          <Link className="menu-item menu-item-admin" to="/leads" onClick={closeMobileMenu}>
            <FaUsers />
            Manage Leads
          </Link>
          <Link className="menu-item menu-item-admin" to="/customers" onClick={closeMobileMenu}>
            <FaUserFriends />
            Manage Customers
          </Link>
          <Link className="menu-item menu-item-admin" to="/contacts" onClick={closeMobileMenu}>
            <FaDatabase />
            Contact Database
          </Link>
          <Link className="menu-item menu-item-admin" to="/reports" onClick={closeMobileMenu}>
            <FaChartBar />
            Reports & Analytics
          </Link>
          <Link className="menu-item menu-item-admin" to="/analytics" onClick={closeMobileMenu}>
            <FaChartLine />
            Advanced Analytics
          </Link>
        </>
      )}

      {/* ---- COMMON ---- */}
      <div className="sidebar-section-label">Account</div>

      <Link className="menu-item" to="/profile" onClick={closeMobileMenu}>
        <FaCog />
        Profile Settings
      </Link>

      <Link className="menu-item" to="/notifications" onClick={closeMobileMenu}>
        <FaBell />
        Notifications
      </Link>

      <Link className="menu-item" to="/support" onClick={closeMobileMenu}>
        <FaHeadset />
        Support & Help
      </Link>

      <Link className="menu-item" to="/help" onClick={closeMobileMenu}>
        <FaQuestionCircle />
        Help & Support
      </Link>

      {/* Logout */}
      <div className="sidebar-spacer" />
      <button className="menu-item menu-item-logout" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>

      {/* Footer */}
      <div className={`sidebar-footer ${isAdmin ? "sidebar-footer-admin" : "sidebar-footer-user"}`}>
        <FaShieldAlt />
        <span>{isAdmin ? "Admin Access Level 5" : "Standard Access"}</span>
      </div>
    </div>
    </>
  );
}
