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

import { Link } from "react-router-dom";
import { getRole, logout, getUserName } from '../utils/auth';
import Logo from './Logo';

export default function Sidebar() {
  const role = getRole();
  const isAdmin = role === "admin";
  const userName = getUserName() || (isAdmin ? "Admin" : "User");

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar ${isAdmin ? "sidebar-admin" : "sidebar-user"}`}>

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

      <Link className="menu-item" to="/dashboard">
        <FaHome />
        Dashboard
      </Link>

      <Link className="menu-item" to="/ai-agent">
        <FaRobot />
        AI Agent
      </Link>

      {/* ---- USER SPECIFIC MENUS ---- */}
      {!isAdmin && (
        <>
          <div className="sidebar-section-label">My Work</div>
          <Link className="menu-item menu-item-user" to="/products">
            <FaShoppingCart />
            Products
          </Link>
          <Link className="menu-item menu-item-user" to="/orders">
            <FaBoxOpen />
            Orders
          </Link>
          <Link className="menu-item menu-item-user" to="/payments">
            <FaCreditCard />
            Payments
          </Link>
        </>
      )}

      {/* ---- ADMIN SPECIFIC MENUS ---- */}
      {isAdmin && (
        <>
          <div className="sidebar-section-label">Management</div>
          <Link className="menu-item menu-item-admin" to="/admin">
            <FaUserShield />
            Admin Console
          </Link>
          <Link className="menu-item menu-item-admin" to="/leads">
            <FaUsers />
            Manage Leads
          </Link>
          <Link className="menu-item menu-item-admin" to="/customers">
            <FaUserFriends />
            Manage Customers
          </Link>
          <Link className="menu-item menu-item-admin" to="/contacts">
            <FaDatabase />
            Contact Database
          </Link>
          <Link className="menu-item menu-item-admin" to="/reports">
            <FaChartBar />
            Reports & Analytics
          </Link>
          <Link className="menu-item menu-item-admin" to="/analytics">
            <FaChartLine />
            Advanced Analytics
          </Link>
        </>
      )}

      {/* ---- COMMON ---- */}
      <div className="sidebar-section-label">Account</div>

      <Link className="menu-item" to="/profile">
        <FaCog />
        Profile Settings
      </Link>

      <Link className="menu-item" to="/notifications">
        <FaBell />
        Notifications
      </Link>

      <Link className="menu-item" to="/support">
        <FaHeadset />
        Support & Help
      </Link>

      <Link className="menu-item" to="/help">
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
  );
}