import { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaStar,
  FaBoxOpen,
  FaPlus,
  FaMinus,
  FaTrash,
  FaCheck,
  FaStore,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store/StoreContext";
import { getUserName } from "../../utils/auth";

export default function UserProducts() {
  const { 
    products, 
    userCart, 
    setUserCart, 
    placeOrder,
    distributors,
    selectedDistributor,
    distributorProducts,
    fetchDistributors,
    selectDistributor,
  } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  const [showDistributorSelector, setShowDistributorSelector] = useState(false);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Fetch distributors on mount
  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  // Use distributor products if distributor is selected, otherwise use all products
  const displayProducts = selectedDistributor ? distributorProducts : products;

  const filtered = displayProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filter === "All" || p.category === filter;
    return matchSearch && matchCategory;
  });

  const addToCart = (product) => {
    setUserCart((prev) => {
      const exists = prev.find((c) => c.id === product.id);
      if (exists) return prev.map((c) => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const updateQty = (id, delta) => {
    setUserCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, qty: c.qty + delta } : c).filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setUserCart((prev) => prev.filter((c) => c.id !== id));
  };

  const cartTotal = userCart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = userCart.reduce((sum, c) => sum + c.qty, 0);

  const handleCheckout = async () => {
    const userId = "user1"; // In real app, get from auth
    const userName = getUserName() || "User";
    const distributorName = selectedDistributor ? selectedDistributor.company : "TechDistro Pvt Ltd";
    const distributorId = selectedDistributor ? selectedDistributor.id : null;
    const result = await placeOrder(userId, userName, userCart, paymentMethod, distributorName, distributorId);
    
    // Show success popup
    setLastOrderDetails({
      orderId: result.orderId,
      total: result.total,
      paymentMethod: paymentMethod,
      distributor: distributorName,
    });
    setShowSuccessPopup(true);
    
    setShowCheckout(false);
    setShowCart(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setLastOrderDetails(null);
  };

  return (
    <div className="main-container main-user">
      <Sidebar />
      <div className="dashboard dashboard-user">
        <Navbar />

        <div className="page-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">Products</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Browse products from your distributor</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* Distributor Selector Button */}
              <button 
                className="btn-secondary" 
                style={{ display: "flex", alignItems: "center", gap: 8 }}
                onClick={() => setShowDistributorSelector(!showDistributorSelector)}
              >
                <FaStore />
                {selectedDistributor ? selectedDistributor.company : "Select Distributor"}
              </button>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowCart(!showCart)}>
                <FaShoppingCart /> Cart ({cartCount})
              </button>
            </div>
          </div>

          {/* Distributor Selector Dropdown */}
          {showDistributorSelector && (
            <div className="dist-card" style={{ marginBottom: 24, padding: 20, animation: "slideDown 0.3s ease" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>Choose Your Distributor</h3>
              <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "0.9rem" }}>
                Select a distributor to view their products. If no distributor is selected, you'll see all available products.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {/* All Products Option */}
                <div
                  onClick={() => { selectDistributor(null); setShowDistributorSelector(false); }}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: !selectedDistributor ? "2px solid #7c3aed" : "2px solid #e2e8f0",
                    background: !selectedDistributor ? "#f5f3ff" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem" }}>
                      📦
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>All Products</strong>
                      <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem" }}>View all available products</p>
                    </div>
                  </div>
                </div>

                {/* Distributor Options */}
                {distributors.map((dist) => (
                  <div
                    key={dist.id}
                    onClick={() => { selectDistributor(dist); setShowDistributorSelector(false); }}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: selectedDistributor?.id === dist.id ? "2px solid #7c3aed" : "2px solid #e2e8f0",
                      background: selectedDistributor?.id === dist.id ? "#f5f3ff" : "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem" }}>
                        🏢
                      </div>
                      <div>
                        <strong style={{ fontSize: "0.95rem" }}>{dist.company}</strong>
                        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8rem" }}>{dist.name}</p>
                      </div>
                    </div>
                    {dist.address && (
                      <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}>
                        📍 {dist.address}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {distributors.length === 0 && (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>No distributors available at the moment.</p>
              )}
            </div>
          )}

          {/* Search & Filter */}
          <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            <div className="dist-search-wrapper" style={{ flex: 1, minWidth: 250 }}>
              <FaSearch />
              <input className="dist-search-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setFilter(cat)} style={{
                  padding: "8px 18px", borderRadius: 999, cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                  border: filter === cat ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                  background: filter === cat ? "#f5f3ff" : "white", color: filter === cat ? "#7c3aed" : "#374151",
                  transition: "all 0.2s ease",
                }}>{cat}</button>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          {showCart && userCart.length > 0 && (
            <div className="dist-card" style={{ marginBottom: 28, animation: "slideDown 0.3s ease" }}>
              <h3 style={{ margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}><FaShoppingCart /> Shopping Cart</h3>
              {userCart.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "1.5rem" }}>{item.image}</span>
                    <div>
                      <strong>{item.name}</strong>
                      <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaMinus /></button>
                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaPlus /></button>
                    <button onClick={() => removeFromCart(item.id)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaTrash /></button>
                    <span style={{ fontWeight: 700, color: "#7c3aed" }}>₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: "2px solid #e2e8f0" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Total: <span style={{ color: "#7c3aed" }}>₹{cartTotal.toLocaleString()}</span></span>
                <button className="btn-primary" onClick={() => { setShowCheckout(true); setShowCart(false); }}>Proceed to Checkout →</button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="dist-products-grid">
            {filtered.map((product) => (
              <div key={product.id} className="dist-product-card">
                <div className="dist-product-top">
                  <div className="dist-product-icon">{product.image}</div>
                  <div className={`dist-stock-badge ${product.stock > 0 ? "dist-stock-in" : "dist-stock-out"}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                  </div>
                </div>
                <h3 className="dist-product-name">{product.name}</h3>
                <p className="dist-product-category">{product.category}</p>
                <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.6, margin: "0 0 14px" }}>{product.description}</p>
                <div className="dist-product-details">
                  <div className="dist-product-detail">
                    <span>Price</span>
                    <strong style={{ color: "#7c3aed" }}>₹{product.price.toLocaleString()}</strong>
                  </div>
                  <div className="dist-product-detail">
                    <span>Rating</span>
                    <strong style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <FaStar style={{ color: "#f59e0b", fontSize: "0.8rem" }} /> {product.rating}
                    </strong>
                  </div>
                </div>
                <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0" }} onClick={() => addToCart(product)}>
                  {addedId === product.id ? <><FaCheck /> Added!</> : <><FaShoppingCart /> Add to Cart</>}
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
              <FaBoxOpen style={{ fontSize: "3rem", marginBottom: 16 }} />
              <p style={{ fontSize: "1.1rem" }}>No products found matching your search.</p>
            </div>
          )}

          {/* Success Popup */}
          {showSuccessPopup && lastOrderDetails && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, animation: "fadeIn 0.3s ease" }} onClick={closeSuccessPopup}>
              <div style={{ background: "white", borderRadius: 24, padding: 40, maxWidth: 480, width: "90%", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", animation: "slideUp 0.4s ease" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2.5rem", boxShadow: "0 12px 30px rgba(16,185,129,0.3)" }}>
                    ✅
                  </div>
                  <h2 style={{ margin: "0 0 12px", fontSize: "1.8rem", color: "#111827" }}>Order Placed Successfully!</h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "1rem" }}>Your order has been confirmed and sent to the distributor</p>
                </div>

                <div style={{ background: "#f8fafc", borderRadius: 16, padding: 20, marginBottom: 24, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Order ID</span>
                    <span style={{ fontWeight: 700, color: "#7c3aed", fontFamily: "monospace" }}>{lastOrderDetails.orderId}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Total Amount</span>
                    <span style={{ fontWeight: 700, color: "#111827", fontSize: "1.1rem" }}>₹{lastOrderDetails.total.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Payment Method</span>
                    <span style={{ fontWeight: 600, color: "#374151" }}>{lastOrderDetails.paymentMethod}</span>
                  </div>
                </div>

                <div style={{ background: "rgba(124,58,237,0.08)", borderRadius: 12, padding: 16, marginBottom: 24, border: "1px solid rgba(124,58,237,0.15)" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#5b21b6", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.2rem" }}>📦</span>
                    <strong>Your order is now visible in the distributor dashboard</strong>
                  </p>
                  {lastOrderDetails.distributor && (
                    <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                      Distributor: <strong>{lastOrderDetails.distributor}</strong>
                    </p>
                  )}
                </div>

                <button className="btn-primary" style={{ width: "100%", padding: "14px 24px", fontSize: "1rem", fontWeight: 700 }} onClick={closeSuccessPopup}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

          {/* Checkout Modal */}
          {showCheckout && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setShowCheckout(false)}>
              <div style={{ background: "white", borderRadius: 24, padding: 36, maxWidth: 500, width: "90%", maxHeight: "85vh", overflowY: "auto", animation: "slideDown 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 20px" }}>Checkout</h2>

                {/* Order Summary */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: "0 0 10px", color: "#6b7280" }}>Order Summary</h4>
                  {userCart.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: "0.9rem" }}>
                      <span>{item.name} × {item.qty}</span>
                      <strong>₹{(item.price * item.qty).toLocaleString()}</strong>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontWeight: 700, fontSize: "1.05rem" }}>
                    <span>Total</span>
                    <span style={{ color: "#7c3aed" }}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <h4 style={{ margin: "0 0 10px", color: "#6b7280" }}>Payment Method</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[
                    { id: "UPI", label: "UPI", icon: "📱" },
                    { id: "Credit Card", label: "Credit Card", icon: "💳" },
                    { id: "Debit Card", label: "Debit Card", icon: "💳" },
                    { id: "Net Banking", label: "Net Banking", icon: "🏦" },
                    { id: "Cash on Delivery", label: "COD", icon: "💵" },
                  ].map((m) => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 12,
                      border: paymentMethod === m.id ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                      background: paymentMethod === m.id ? "#f5f3ff" : "white", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                    }}><span>{m.icon}</span> {m.label}</button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handleCheckout}>Pay ₹{cartTotal.toLocaleString()} & Place Order</button>
                  <button style={{ flex: 1, padding: "12px 24px", borderRadius: 14, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: 600 }} onClick={() => setShowCheckout(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}