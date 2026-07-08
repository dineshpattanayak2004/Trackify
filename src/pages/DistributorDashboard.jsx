import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getUserName, getToken, logout } from '../utils/auth';
import { useStore } from '../store/StoreContext';
import { FaBox, FaTruck, FaChartLine, FaClipboardList, FaUsers, FaMoneyBillWave, FaSignOutAlt, FaBell, FaExclamationTriangle, FaCheckCircle, FaCog, FaHome, FaBoxes, FaShippingFast, FaChartBar, FaWarehouse, FaSearch, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from '../config/api';
import MobileMenuToggle from '../components/MobileMenuToggle';
import MobileOverlay from '../components/MobileOverlay';

export default function DistributorDashboard() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userName = getUserName() || "Distributor";
  const { products: storeProducts, orders: storeOrders, payments: storePayments } = useStore();
  const [dbOrders, setDbOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [liveData, setLiveData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", category: "", price: "", stock: "", description: "", image: "📦" });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dbProductList, setDbProductList] = useState([]);
  const [loadingSelections, setLoadingSelections] = useState(false);
  const socketRef = useRef(null);

  const distStats = {
    totalProducts: storeProducts.length,
    ordersToday: dbOrders.length,
    pendingOrders: dbOrders.filter((o) => o.status === "pending").length,
    shippedOrders: dbOrders.filter((o) => o.status === "shipped").length,
    revenue: dbOrders.reduce((s, o) => s + o.total, 0),
    activeDistributions: new Set(dbOrders.map((o) => o.userId)).size,
  };

  const recentActivity = dbOrders.slice(0, 6).map((o) => ({
    action: `${o.userName} ordered ${o.productName} — ₹${o.total.toLocaleString()} (${o.paymentStatus})`,
    time: o.date,
    type: o.paymentStatus === "paid" ? "payment" : "order",
  }));

  const notificationCount = notifications.filter(n => !n.read).length;

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [{ id, message, type, read: false, timestamp: new Date() }, ...prev.slice(0, 19)]);
  };

  const dismissNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearNotifications = () => setNotifications([]);

  useEffect(() => {
    const socket = io(API_BASE_URL);
    socketRef.current = socket;
    socket.on("connect", () => addNotification("Connected to live server", "success"));
    socket.on("analytics:update", (data) => setLiveData(data));
    socket.on("disconnect", () => addNotification("Disconnected from live server", "warning"));
    return () => socket.disconnect();
  }, []);

  const handleLogout = () => { if (socketRef.current) socketRef.current.disconnect(); logout(); };

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        console.error("No token found, using local orders");
        const localOrders = storeOrders.map(order => ({
          ...order,
          product: order.product,
        }));
        setDbOrders(localOrders);
        return;
      }
      
      console.log("Fetching orders from API...");
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("API response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("API returned data:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          // Transform database orders to match UI format
          const transformedOrders = data.map(order => ({
            id: order.id,
            userId: order.userId,
            userName: order.userName,
            product: order.productName,
            productId: order.productId,
            qty: order.qty,
            total: order.total,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            date: order.date,
            distributor: order.distributor,
            tracking: order.tracking,
          }));
          setDbOrders(transformedOrders);
          console.log("✓ Successfully loaded", transformedOrders.length, "orders from database");
        } else {
          console.log("No orders in database response, using local orders");
          const localOrders = storeOrders.map(order => ({
            ...order,
            product: order.product,
          }));
          setDbOrders(localOrders);
        }
      } else {
        console.error("Failed to fetch orders, status:", res.status);
        const errorText = await res.text();
        console.error("Error response:", errorText);
        const localOrders = storeOrders.map(order => ({
          ...order,
          product: order.product,
        }));
        setDbOrders(localOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      const localOrders = storeOrders.map(order => ({
        ...order,
        product: order.product,
      }));
      setDbOrders(localOrders);
    }
  };

  // Fetch DB products and distributor's product selections
  const fetchProductSelections = async () => {
    setLoadingSelections(true);
    try {
      const token = getToken();
      
      // Fetch all DB products
      const productsRes = await fetch(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (productsRes.ok) {
        const dbProducts = await productsRes.json();
        setDbProductList(dbProducts);
      }

      // Fetch distributor's selections
      const res = await fetch(`${API_BASE_URL}/distributor/selections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const selectedDbIds = data.map((s) => s.productId);
        // Map DB IDs to local product IDs by matching product name
        const localSelectedIds = storeProducts
          .filter((localP) => {
            const dbMatch = data.find((s) => s.productId === localP.dbId);
            return dbMatch || selectedDbIds.includes(localP.dbId);
          })
          .map((p) => p.id);
        
        // Also try matching by name
        const nameMatchedIds = storeProducts
          .filter((localP) => data.some((s) => s.product && s.product.name === localP.name))
          .map((p) => p.id);
        
        const mergedIds = [...new Set([...localSelectedIds, ...nameMatchedIds])];
        setSelectedProducts(mergedIds);
      }
    } catch (err) {
      console.error("Failed to fetch selections", err);
    } finally {
      setLoadingSelections(false);
    }
  };

  // Get DB product ID by matching local product name
  const getDbProductId = (localProductId) => {
    const localProduct = storeProducts.find((p) => p.id === localProductId);
    if (!localProduct || !dbProductList.length) return null;
    const dbProduct = dbProductList.find((p) => p.name === localProduct.name);
    return dbProduct ? dbProduct.id : null;
  };

  // Toggle product selection (uses DB product ID for API)
  const toggleProductSelection = async (localProductId) => {
    const token = getToken();
    const isSelected = selectedProducts.includes(localProductId);
    const dbProductId = getDbProductId(localProductId);
    
    if (!dbProductId) {
      addNotification("Product not found in database. Try adding it first.", "warning");
      return;
    }

    try {
      if (isSelected) {
        await fetch(`${API_BASE_URL}/distributor/selections/${dbProductId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedProducts((prev) => prev.filter((id) => id !== localProductId));
        addNotification("Product removed from your selection", "info");
      } else {
        const res = await fetch(`${API_BASE_URL}/distributor/selections`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: dbProductId }),
        });
        if (res.ok) {
          setSelectedProducts((prev) => [...prev, localProductId]);
          addNotification("Product added to your selection. Users will now see it!", "success");
        } else {
          const errData = await res.json();
          addNotification(errData.error || "Failed to select product", "warning");
        }
      }
    } catch (err) {
      console.error("Failed to update selection", err);
      addNotification("Failed to update selection", "warning");
    }
  };

  // Load selections and orders on mount
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) {
        await fetchProductSelections();
        await fetchOrders();
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh orders when switching to orders tab
  useEffect(() => {
    if (activeTab === "orders") {
      // Use setTimeout to avoid cascading renders
      const timer = setTimeout(() => {
        fetchOrders();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const statusConfig = {
    pending: { icon: FaExclamationTriangle, color: "#f59e0b", bg: "rgba(251,191,36,0.12)", label: "Pending" },
    processing: { icon: FaCog, color: "#3b82f6", bg: "rgba(59,130,246,0.12)", label: "Processing" },
    shipped: { icon: FaTruck, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: "Shipped" },
    delivered: { icon: FaCheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Delivered" },
  };

  const getStatusBadge = (status) => { const cfg = statusConfig[status] || statusConfig.pending; const Icon = cfg.icon; return (<span className="dist-order-status" style={{ background: cfg.bg, color: cfg.color }}><Icon size={12} /> {cfg.label}</span>); };

  const filteredOrders = dbOrders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || (o.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) || o.product.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const { addProduct, updateProduct, deleteProduct } = useStore();
  
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", category: "", price: "", stock: "", description: "", image: "📦" });
    setShowAddProductModal(true);
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
      image: product.image || "📦",
    });
    setShowAddProductModal(true);
  };
  
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      addNotification("Product deleted successfully", "success");
    }
  };
  
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.category || !productForm.price || productForm.stock === "") {
      addNotification("Please fill all required fields", "warning");
      return;
    }
    
    const productData = {
      name: productForm.name,
      category: productForm.category,
      price: parseInt(productForm.price),
      stock: parseInt(productForm.stock),
      description: productForm.description,
      image: productForm.image,
    };
    
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      addNotification("Product updated successfully", "success");
    } else {
      addProduct(productData);
      addNotification("Product added successfully", "success");
    }
    
    setShowAddProductModal(false);
    setProductForm({ name: "", category: "", price: "", stock: "", description: "", image: "📦" });
    setEditingProduct(null);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="distributor-layout">
      <MobileMenuToggle onToggle={toggleMobileMenu} isOpen={isMobileMenuOpen} />
      <MobileOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <aside className={`dist-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="dist-sidebar-header"><div className="dist-logo"><div className="dist-logo-icon"><FaBoxes /></div><div><h2>Distributor</h2><p>Partner Portal</p></div></div></div>
        <div className="dist-sidebar-profile"><div className="dist-profile-avatar"><FaWarehouse /></div><div className="dist-profile-info"><span className="dist-profile-name">{userName}</span><span className="dist-profile-role">Distributor Partner</span></div></div>
        <nav className="dist-nav">
          <div className="dist-nav-section">Main</div>
          <button className={`dist-nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => { setActiveTab("overview"); closeMobileMenu(); }}><FaHome /> Overview</button>
          <button className={`dist-nav-item ${activeTab === "orders" ? "active" : ""}`} onClick={() => { setActiveTab("orders"); closeMobileMenu(); }}><FaClipboardList /> Orders {distStats.pendingOrders > 0 && <span className="dist-nav-badge">{distStats.pendingOrders}</span>}</button>
          <button className={`dist-nav-item ${activeTab === "products" ? "active" : ""}`} onClick={() => { setActiveTab("products"); closeMobileMenu(); }}><FaBox /> Products</button>
          <button className={`dist-nav-item ${activeTab === "payments" ? "active" : ""}`} onClick={() => { setActiveTab("payments"); closeMobileMenu(); }}><FaMoneyBillWave /> Payments</button>
          <button className={`dist-nav-item ${activeTab === "analytics" ? "active" : ""}`} onClick={() => { setActiveTab("analytics"); closeMobileMenu(); }}><FaChartBar /> Analytics</button>
          <div className="dist-nav-section">Account</div>
          <button className="dist-nav-item" onClick={() => { navigate("/profile"); closeMobileMenu(); }}><FaCog /> Settings</button>
          <button className="dist-nav-item dist-nav-logout" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </nav>
        <div className="dist-sidebar-footer"><FaShippingFast /> Distributor Access</div>
      </aside>

      <main className="dist-main">
        <header className="dist-topbar">
          <div className="dist-topbar-left">
            <h1 className="dist-greeting">Welcome back, <span className="dist-highlight-name">{userName}</span> 👋</h1>
            <p className="dist-date">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="dist-topbar-right">
            {liveData && (<div className="dist-live-indicator"><span className="dist-live-dot" /><span className="dist-live-text">Live</span><span className="dist-live-users">{liveData.activeUsers} online</span></div>)}
            <div className="dist-notification-wrapper">
              <button className="dist-notif-btn" onClick={() => setShowNotifications(!showNotifications)}><FaBell />{notificationCount > 0 && <span className="dist-notif-count">{notificationCount}</span>}</button>
              {showNotifications && (<div className="dist-notif-dropdown"><div className="dist-notif-header"><h4>Notifications</h4><button onClick={clearNotifications}>Clear all</button></div>{notifications.length === 0 ? <p className="dist-notif-empty">No notifications</p> : notifications.map((n) => (<div key={n.id} className={`dist-notif-item ${n.read ? "read" : ""}`} onClick={() => dismissNotification(n.id)}>{n.type === "success" && <FaCheckCircle color="#10b981" />}{n.type === "warning" && <FaExclamationTriangle color="#f59e0b" />}{n.type === "info" && <FaBell color="#3b82f6" />}<span>{n.message}</span></div>))}</div>)}
            </div>
          </div>
        </header>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="dist-content">
            <div className="dist-stats-grid">
              {[
                { label: "Total Products", value: distStats.totalProducts, icon: <FaBoxes />, cls: "dist-stat-purple" },
                { label: "Total Orders", value: distStats.ordersToday, icon: <FaClipboardList />, cls: "dist-stat-blue" },
                { label: "Pending Orders", value: distStats.pendingOrders, icon: <FaExclamationTriangle />, cls: "dist-stat-orange" },
                { label: "Revenue", value: `₹${distStats.revenue.toLocaleString()}`, icon: <FaMoneyBillWave />, cls: "dist-stat-green" },
                { label: "Shipped", value: distStats.shippedOrders, icon: <FaTruck />, cls: "dist-stat-cyan" },
                { label: "Active Users", value: distStats.activeDistributions, icon: <FaUsers />, cls: "dist-stat-pink" },
              ].map((s, i) => (
                <div key={i} className={`dist-stat-card ${s.cls}`}><div className="dist-stat-icon-wrap">{s.icon}</div><div className="dist-stat-body"><span className="dist-stat-label">{s.label}</span><h3 className="dist-stat-value">{s.value}</h3></div></div>
              ))}
            </div>
            <div className="dist-dashboard-grid">
              <div className="dist-card"><h3 className="dist-card-title">Quick Actions</h3><div className="dist-quick-actions">
                <button className="dist-quick-btn" onClick={() => setActiveTab("orders")}><FaClipboardList /><span>View Orders</span></button>
                <button className="dist-quick-btn" onClick={() => setActiveTab("products")}><FaBox /><span>Manage Stock</span></button>
                <button className="dist-quick-btn" onClick={() => setActiveTab("payments")}><FaMoneyBillWave /><span>Payments</span></button>
                <button className="dist-quick-btn" onClick={() => setActiveTab("analytics")}><FaChartLine /><span>Analytics</span></button>
              </div></div>
              <div className="dist-card"><h3 className="dist-card-title">Recent Activity</h3><div className="dist-activity-list">
                {recentActivity.map((act, i) => (<div key={i} className="dist-activity-item"><div className={`dist-activity-dot dist-activity-${act.type}`} /><div className="dist-activity-content"><span className="dist-activity-action">{act.action}</span><span className="dist-activity-time">{act.time}</span></div></div>))}
              </div></div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="dist-content">
            <div className="dist-tab-header"><div><h2 className="dist-tab-title">User Orders</h2><p className="dist-tab-subtitle">All orders placed by users — see products, payments, and status</p></div>
              <div className="dist-tab-actions"><div className="dist-search-wrapper"><FaSearch /><input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="dist-search-input" /></div></div>
            </div>
            <div className="dist-table-card"><table className="dist-table"><thead><tr><th>Order ID</th><th>User</th><th>Product</th><th>Qty</th><th>Total</th><th>Date</th><th>Payment</th><th>Status</th></tr></thead>
              <tbody>{filteredOrders.map((order) => (<tr key={order.id} className="dist-table-row"><td className="dist-order-id">{order.id}</td><td>{order.userName}</td><td>{order.product}</td><td>{order.qty}</td><td className="dist-amount">₹{order.total.toLocaleString()}</td><td>{order.date}</td><td><span style={{ padding: "4px 10px", borderRadius: 999, background: order.paymentStatus === "paid" ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)", color: order.paymentStatus === "paid" ? "#10b981" : "#f59e0b", fontSize: "0.72rem", fontWeight: 700 }}>{order.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}</span> <span style={{ fontSize: "0.68rem", color: "#9ca3af", marginLeft: 4 }}>{order.paymentMethod}</span></td><td>{getStatusBadge(order.status)}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="dist-content">
            <div className="dist-tab-header"><div><h2 className="dist-tab-title">Product Inventory</h2><p className="dist-tab-subtitle">Same products that users see — stock updates when users purchase</p></div>
              <button className="dist-add-product-btn" onClick={handleAddProduct}><FaPlus /> Add Product</button>
            </div>
            <div className="dist-products-grid">
              {storeProducts.map((product) => (
                <div key={product.id} className="dist-product-card">
                  <div className="dist-product-top">
                    <div className="dist-product-icon">{product.image || "📦"}</div>
                    <div className={`dist-stock-badge ${product.stock > 20 ? "dist-stock-in" : product.stock > 0 ? "dist-stock-low" : "dist-stock-out"}`}>{product.stock > 20 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}</div>
                  </div>
                  <h4 className="dist-product-name">{product.name}</h4>
                  <p className="dist-product-category">{product.category}</p>
                  <div className="dist-product-details">
                    <div className="dist-product-detail"><span>Stock</span><strong className={product.stock < 20 && product.stock > 0 ? "text-warning" : product.stock === 0 ? "text-danger" : ""}>{product.stock} units</strong></div>
                    <div className="dist-product-detail"><span>Price</span><strong>₹{product.price.toLocaleString()}</strong></div>
                  </div>
                  <div className="dist-stock-bar"><div className={`dist-stock-fill ${product.stock < 20 && product.stock > 0 ? "fill-warning" : product.stock === 0 ? "fill-danger" : "fill-success"}`} style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }} /></div>
                  <div className="dist-product-actions">
                    <button 
                      className={`dist-action-btn ${selectedProducts.includes(product.id) ? "dist-selected-btn" : "dist-select-btn"}`} 
                      onClick={() => toggleProductSelection(product.id)}
                      disabled={loadingSelections}
                    >
                      {selectedProducts.includes(product.id) ? "✓ Selected" : "Select"}
                    </button>
                    <button className="dist-action-btn dist-edit-btn" onClick={() => handleEditProduct(product)}><FaEdit /> Edit</button>
                    <button className="dist-action-btn dist-delete-btn" onClick={() => handleDeleteProduct(product.id)}><FaTrash /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <div className="dist-content">
            <div className="dist-tab-header"><div><h2 className="dist-tab-title">User Payments</h2><p className="dist-tab-subtitle">Payment status of all user orders — paid or pending</p></div></div>
            <div className="dist-table-card"><table className="dist-table"><thead><tr><th>Payment ID</th><th>Order</th><th>User</th><th>Amount</th><th>Method</th><th>Status</th><th>Date & Time</th></tr></thead>
              <tbody>{storePayments.map((p) => {
                const relatedOrder = dbOrders.find((o) => o.id === p.orderId || o.orderId === p.orderId || o.id.startsWith(p.orderId));
                const userName = relatedOrder?.userName || "—";
                return (<tr key={p.id} className="dist-table-row"><td className="dist-order-id">{p.id}</td><td>{p.orderId}</td><td>{userName}</td><td className="dist-amount">₹{p.amount.toLocaleString()}</td><td>{p.method}</td><td><span style={{ padding: "5px 12px", borderRadius: 999, background: p.status === "success" ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)", color: p.status === "success" ? "#10b981" : "#f59e0b", fontSize: "0.75rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>{p.status === "success" ? <><FaCheckCircle /> Paid</> : <><FaExclamationTriangle /> Pending</>}</span></td><td><div style={{ fontSize: "0.85rem" }}>{p.date}</div>{p.paidAt ? <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600, marginTop: 2 }}>✅ Paid at {p.paidAt}</div> : <div style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: 2 }}>⏳ Awaiting payment</div>}</td></tr>);
              })}</tbody></table></div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="dist-content">
            <div className="dist-tab-header"><div><h2 className="dist-tab-title">Distribution Analytics</h2><p className="dist-tab-subtitle">Real-time metrics and performance indicators</p></div></div>
            <div className="dist-analytics-grid">
              {[
                { title: "Order Fulfillment Rate", value: "94.2%", width: "94.2%", desc: "+2.1% from last month" },
                { title: "Average Delivery Time", value: "2.4 days", width: "76%", desc: "-0.3 days improvement", fill: "fill-green" },
                { title: "Stock Turnover", value: "4.8x", width: "68%", desc: "Monthly average", fill: "fill-purple" },
                { title: "Customer Satisfaction", value: "4.7/5.0", width: "94%", desc: "Based on 128 reviews", fill: "fill-orange" },
              ].map((a, i) => (
                <div key={i} className="dist-analytics-card"><h4>{a.title}</h4><div className="dist-analytics-big-number">{a.value}</div><div className="dist-progress-bar"><div className={`dist-progress-fill ${a.fill || ""}`} style={{ width: a.width }} /></div><p className="dist-analytics-desc">{a.desc}</p></div>
              ))}
            </div>
          </div>
        )}
      {/* ADD/EDIT PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="dist-modal-overlay" onClick={() => setShowAddProductModal(false)}>
          <div className="dist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dist-modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="dist-modal-close" onClick={() => setShowAddProductModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmitProduct} className="dist-product-form">
              <div className="dist-form-group">
                <label>Product Name *</label>
                <input type="text" name="name" value={productForm.name} onChange={handleFormChange} placeholder="Enter product name" required />
              </div>
              <div className="dist-form-group">
                <label>Category *</label>
                <select name="category" value={productForm.category} onChange={handleFormChange} required>
                  <option value="">Select category</option>
                  <option value="Software">Software</option>
                  <option value="Add-on">Add-on</option>
                  <option value="Service">Service</option>
                  <option value="Feature">Feature</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="dist-form-row">
                <div className="dist-form-group">
                  <label>Price (₹) *</label>
                  <input type="number" name="price" value={productForm.price} onChange={handleFormChange} placeholder="0" min="0" required />
                </div>
                <div className="dist-form-group">
                  <label>Stock *</label>
                  <input type="number" name="stock" value={productForm.stock} onChange={handleFormChange} placeholder="0" min="0" required />
                </div>
              </div>
              <div className="dist-form-group">
                <label>Emoji Icon</label>
                <select name="image" value={productForm.image} onChange={handleFormChange}>
                  <option value="📦">📦 Package</option>
                  <option value="🚀">🚀 Rocket</option>
                  <option value="🔗">🔗 Link</option>
                  <option value="🎧">🎧 Headset</option>
                  <option value="📊">📊 Chart</option>
                  <option value="👥">👥 Users</option>
                  <option value="💻">💻 Laptop</option>
                  <option value="📱">📱 Phone</option>
                  <option value="⚙️">⚙️ Gear</option>
                  <option value="🎯">🎯 Target</option>
                </select>
              </div>
              <div className="dist-form-group">
                <label>Description</label>
                <textarea name="description" value={productForm.description} onChange={handleFormChange} placeholder="Enter product description" rows="3"></textarea>
              </div>
              <div className="dist-modal-actions">
                <button type="button" className="dist-btn-cancel" onClick={() => setShowAddProductModal(false)}>Cancel</button>
                <button type="submit" className="dist-btn-submit">{editingProduct ? "Update Product" : "Add Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}