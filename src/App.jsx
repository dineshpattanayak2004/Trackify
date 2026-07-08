import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Leads from "./pages/Leads";
import Customer from "./pages/Customer";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import Register from "./pages/Register"
import AIAgent from "./pages/AIAgent"
import DistributorLogin from "./pages/DistributorLogin"
import DistributorSignup from "./pages/DistributorSignup"
import DistributorDashboard from "./pages/DistributorDashboard"

import UserProducts from "./pages/user/UserProducts"
import UserOrders from "./pages/user/UserOrders"
import UserPayments from "./pages/user/UserPayments"
import UserNotifications from "./pages/user/UserNotifications"
import UserSupport from "./pages/user/UserSupport"
import { StoreProvider } from "./store/StoreContext"

import "./App.css";

function App() {
  return (
    <StoreProvider>
    <HashRouter>

      <Routes>

        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin-login" element={<AdminLogin/>} />
        <Route path="/user-login" element={<UserLogin/>} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><Dashboard/></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />

        <Route path="/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><Analytics/></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts/></ProtectedRoute>} />

        <Route path="/products" element={<ProtectedRoute><UserProducts/></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><UserOrders/></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><UserPayments/></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><UserNotifications/></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><UserSupport/></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads/></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customer/></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/ai-agent" element={<ProtectedRoute><AIAgent/></ProtectedRoute>} />

        {/* Distributor Routes */}
        <Route path="/distributor/login" element={<DistributorLogin />} />
        <Route path="/distributor/signup" element={<DistributorSignup />} />
        <Route path="/distributor/dashboard" element={<DistributorDashboard />} />

      </Routes>

    </HashRouter>
    </StoreProvider>
  );
}

export default App;