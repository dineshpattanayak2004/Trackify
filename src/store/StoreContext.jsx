import { createContext, useContext, useState, useCallback } from "react";
import { getToken } from "../utils/auth";

const StoreContext = createContext(null);

// Shared products - same for user and distributor (24 products, 8 per distributor)
const defaultProducts = [
  // Test Distribution Co. Products (8 products)
  { id: 1, name: "Trackify Pro License", category: "Software", price: 2999, stock: 50, rating: 4.8, image: "📦", description: "Full CRM suite with AI agent, analytics, and unlimited leads." },
  { id: 2, name: "Trackify Starter Pack", category: "Software", price: 999, stock: 120, rating: 4.5, image: "🚀", description: "Basic CRM with lead management and reports." },
  { id: 3, name: "Premium Support Plan", category: "Service", price: 599, stock: 999, rating: 4.9, image: "🎧", description: "24/7 priority support with dedicated manager." },
  { id: 4, name: "Data Backup & Recovery", category: "Service", price: 1499, stock: 200, rating: 4.6, image: "💾", description: "Automated data backup and disaster recovery solution." },
  { id: 5, name: "Email Marketing Suite", category: "Add-on", price: 1299, stock: 180, rating: 4.4, image: "📧", description: "Professional email marketing with analytics and templates." },
  { id: 6, name: "Custom Domain Setup", category: "Service", price: 499, stock: 500, rating: 4.3, image: "🌐", description: "Custom domain configuration with SSL certificate." },
  { id: 7, name: "Multi-User Access Pack", category: "Feature", price: 1999, stock: 100, rating: 4.7, image: "👨‍👩‍👧‍👦", description: "Add up to 20 team members with role-based access." },
  { id: 8, name: "Payment Gateway Integration", category: "Add-on", price: 2499, stock: 60, rating: 4.8, image: "💳", description: "Seamless payment gateway with 10+ payment options." },

  // TechDistro Pvt Ltd Products (8 products)
  { id: 9, name: "AI Chatbot Assistant", category: "Feature", price: 4999, stock: 30, rating: 4.9, image: "🤖", description: "Intelligent AI chatbot for customer support automation." },
  { id: 10, name: "Social Media Manager", category: "Add-on", price: 1799, stock: 85, rating: 4.5, image: "📱", description: "Schedule, manage, and analyze social media posts." },
  { id: 11, name: "Lead Scoring Engine", category: "Feature", price: 2999, stock: 45, rating: 4.6, image: "🎯", description: "AI-powered lead scoring with predictive analytics." },
  { id: 12, name: "Video Conferencing Pro", category: "Add-on", price: 899, stock: 200, rating: 4.3, image: "📹", description: "HD video conferencing with recording and screen share." },
  { id: 13, name: "Invoice Generation Tool", category: "Feature", price: 699, stock: 300, rating: 4.4, image: "🧾", description: "Auto-generate invoices and send payment reminders." },
  { id: 14, name: "Zapier Integration Pack", category: "Add-on", price: 1999, stock: 90, rating: 4.7, image: "⚡", description: "Connect with 5000+ apps via Zapier integration." },
  { id: 15, name: "Workflow Automation", category: "Feature", price: 3499, stock: 40, rating: 4.8, image: "🔄", description: "Automate repetitive tasks with custom workflows." },
  { id: 16, name: "GDPR Compliance Toolkit", category: "Add-on", price: 3999, stock: 25, rating: 4.9, image: "🛡️", description: "Complete GDPR compliance with consent management." },

  // Software Solutions Inc Products (8 products)
  { id: 17, name: "Cloud Storage 1TB", category: "Add-on", price: 2499, stock: 300, rating: 4.3, image: "☁️", description: "Secure cloud storage with 1TB space and 24/7 access." },
  { id: 18, name: "Security Suite Pro", category: "Software", price: 3999, stock: 40, rating: 4.9, image: "🔒", description: "Advanced security with encryption, firewall, threat detection." },
  { id: 19, name: "Team Collaboration Tools", category: "Feature", price: 799, stock: 150, rating: 4.4, image: "👥", description: "Real-time team chat, file sharing, task assignment." },
  { id: 20, name: "Analytics Dashboard Pro", category: "Add-on", price: 1999, stock: 75, rating: 4.6, image: "📊", description: "Advanced analytics with custom reports and charts." },
  { id: 21, name: "Slack Integration", category: "Add-on", price: 599, stock: 250, rating: 4.5, image: "💬", description: "Direct Slack integration for real-time notifications." },
  { id: 22, name: "HR Management Module", category: "Feature", price: 4499, stock: 20, rating: 4.7, image: "👔", description: "Complete HR management with payroll and attendance." },
  { id: 23, name: "Project Roadmap Tool", category: "Feature", price: 1499, stock: 60, rating: 4.6, image: "🗺️", description: "Visual project planning with timeline and milestones." },
  { id: 24, name: "Smart Notification System", category: "Add-on", price: 399, stock: 500, rating: 4.2, image: "🔔", description: "Multi-channel notifications via email, SMS, and push." },
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts);
  const [orders, setOrders] = useState([
    { id: "ORD-2024-001", userId: "user1", userName: "Rahul Sharma", product: "Trackify Pro License", productId: 1, qty: 1, total: 2999, status: "delivered", paymentStatus: "paid", paymentMethod: "UPI", date: "2026-06-10", distributor: "TechDistro Pvt Ltd", tracking: "TRK123456789" },
    { id: "ORD-2024-002", userId: "user1", userName: "Rahul Sharma", product: "Premium Support Plan", productId: 4, qty: 2, total: 1198, status: "shipped", paymentStatus: "paid", paymentMethod: "Credit Card", date: "2026-06-12", distributor: "TechDistro Pvt Ltd", tracking: "TRK987654321" },
    { id: "ORD-2024-003", userId: "user2", userName: "Priya Patel", product: "Analytics Dashboard Pro", productId: 5, qty: 1, total: 1999, status: "processing", paymentStatus: "pending", paymentMethod: "Net Banking", date: "2026-06-14", distributor: "TechDistro Pvt Ltd", tracking: "—" },
    { id: "ORD-2024-004", userId: "user1", userName: "Rahul Sharma", product: "Team Collaboration Tools", productId: 6, qty: 3, total: 2397, status: "delivered", paymentStatus: "paid", paymentMethod: "Debit Card", date: "2026-06-08", distributor: "TechDistro Pvt Ltd", tracking: "TRK456123789" },
    { id: "ORD-2024-005", userId: "user3", userName: "Amit Singh", product: "Trackify Starter Pack", productId: 2, qty: 5, total: 4995, status: "pending", paymentStatus: "pending", paymentMethod: "Cash on Delivery", date: "2026-06-15", distributor: "TechDistro Pvt Ltd", tracking: "—" },
  ]);
  const [payments, setPayments] = useState([
    { id: "PAY-001", orderId: "ORD-2024-001", userId: "user1", amount: 2999, method: "UPI", status: "success", date: "2026-06-10", paidAt: "2026-06-10 14:23:45", reference: "UPI-TRK-20240610" },
    { id: "PAY-002", orderId: "ORD-2024-002", userId: "user1", amount: 1198, method: "Credit Card", status: "success", date: "2026-06-12", paidAt: "2026-06-12 09:15:22", reference: "CC-TRK-20240612" },
    { id: "PAY-003", orderId: "ORD-2024-003", userId: "user2", amount: 1999, method: "Net Banking", status: "pending", date: "2026-06-14", paidAt: null, reference: "NB-TRK-20240614" },
    { id: "PAY-004", orderId: "ORD-2024-004", userId: "user1", amount: 2397, method: "Debit Card", status: "success", date: "2026-06-08", paidAt: "2026-06-08 16:45:10", reference: "DC-TRK-20240608" },
    { id: "PAY-005", orderId: "ORD-2024-005", userId: "user3", amount: 4995, method: "Cash on Delivery", status: "pending", date: "2026-06-15", paidAt: null, reference: "COD-TRK-20240615" },
  ]);
  const [userCart, setUserCart] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [distributorProducts, setDistributorProducts] = useState([]);

  // Get orders for a specific user
  const getUserOrders = useCallback((userId) => {
    return orders.filter((o) => o.userId === userId);
  }, [orders]);

  // Get payments for a specific user
  const getUserPayments = useCallback((userId) => {
    return payments.filter((p) => p.userId === userId);
  }, [payments]);

  // Place order from cart (user checkout)
  const placeOrder = useCallback(async (userId, userName, cartItems, paymentMethod, distributorName = "TechDistro Pvt Ltd", distributorId = null) => {
    const orderId = `ORD-${Date.now()}`;
    const total = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0);
    const paymentId = `PAY-${Date.now()}`;

    try {
      console.log("Placing order for user:", userId, "Items:", cartItems.length, "Distributor:", distributorName, "DistributorID:", distributorId);
      
      // Save each order item to database
      for (const item of cartItems) {
        console.log("Saving order item:", item.name);
        const response = await fetch("http://localhost:4000/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            userId: String(userId),
            userName,
            productId: String(item.id),
            productName: item.name,
            qty: item.qty,
            total: item.price * item.qty,
            paymentMethod,
            distributor: distributorName,
            distributorId: distributorId,
          }),
        });
        
        const result = await response.json();
        console.log("Order save response:", response.status, result);
      }

      // Create order for each cart item
      const newOrders = cartItems.map((item, i) => ({
        id: `${orderId}-${i + 1}`,
        userId,
        userName,
        product: item.name,
        productId: item.id,
        qty: item.qty,
        total: item.price * item.qty,
        status: "pending",
        paymentStatus: paymentMethod === "Cash on Delivery" ? "pending" : "paid",
        paymentMethod,
        date: new Date().toISOString().split("T")[0],
        distributor: distributorName,
        distributorId: distributorId,
        tracking: "—",
      }));

      // Create payment record
      const newPayment = {
        id: paymentId,
        orderId,
        userId,
        amount: total,
        method: paymentMethod,
        status: paymentMethod === "Cash on Delivery" ? "pending" : "success",
        date: new Date().toISOString().split("T")[0],
        paidAt: paymentMethod === "Cash on Delivery" ? null : new Date().toLocaleString("en-IN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        reference: `${paymentMethod.substring(0, 3).toUpperCase()}-${orderId}`,
      };

      // Update stock
      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cartItems.find((c) => c.id === p.id);
          if (cartItem) return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
          return p;
        })
      );

      setOrders((prev) => [...newOrders, ...prev]);
      setPayments((prev) => [newPayment, ...prev]);
      setUserCart([]);

      return { orderId, total, paymentId };
    } catch (err) {
      console.error("Failed to save orders to database:", err);
      // Still update local state even if API fails
      const newOrders = cartItems.map((item, i) => ({
        id: `${orderId}-${i + 1}`,
        userId,
        userName,
        product: item.name,
        productId: item.id,
        qty: item.qty,
        total: item.price * item.qty,
        status: "pending",
        paymentStatus: paymentMethod === "Cash on Delivery" ? "pending" : "paid",
        paymentMethod,
        date: new Date().toISOString().split("T")[0],
        distributor: distributorName,
        tracking: "—",
      }));

      setOrders((prev) => [...newOrders, ...prev]);
      setUserCart([]);

      return { orderId, total, paymentId };
    }
  }, []);

  // Update order status (distributor)
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  // Update payment status (distributor)
  const updatePaymentStatus = useCallback((paymentId, status) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
  }, []);

  // Fetch all active distributors
  const fetchDistributors = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/public/distributors");
      if (response.ok) {
        const data = await response.json();
        setDistributors(data);
      }
    } catch (err) {
      console.error("Failed to fetch distributors:", err);
    }
  }, []);

  // Fetch products for selected distributor and map to local format
  const fetchDistributorProducts = useCallback(async (distributorId) => {
    try {
      const response = await fetch(`http://localhost:4000/public/distributors/${distributorId}/products`);
      if (response.ok) {
        const dbProducts = await response.json();
        // Map DB products to local product format by matching name
        const mappedProducts = dbProducts.map((dbProduct) => {
          // Find matching local product by name
          const localProduct = defaultProducts.find(
            (p) => p.name === dbProduct.name
          );
          if (localProduct) {
            // Use local product format with its own ID
            return {
              ...localProduct,
              id: localProduct.id,
              stock: dbProduct.stock || localProduct.stock,
              price: dbProduct.price || localProduct.price,
              description: dbProduct.description || localProduct.description,
            };
          }
          // If no match, convert DB product to local format
          return {
            id: dbProduct.id,
            name: dbProduct.name,
            category: dbProduct.category,
            price: dbProduct.price,
            stock: dbProduct.stock,
            rating: dbProduct.rating || 4.0,
            image: dbProduct.image || "📦",
            description: dbProduct.description || "",
          };
        });
        setDistributorProducts(mappedProducts);
      } else {
        setDistributorProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch distributor products:", err);
      setDistributorProducts([]);
    }
  }, []);

  // Select distributor
  const selectDistributor = useCallback((distributor) => {
    setSelectedDistributor(distributor);
    if (distributor) {
      fetchDistributorProducts(distributor.id);
    } else {
      setDistributorProducts([]);
    }
  }, [fetchDistributorProducts]);

  // Update product stock (distributor)
  const updateProductStock = useCallback((productId, stock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stock, status: stock === 0 ? "out-of-stock" : stock < 20 ? "low-stock" : "in-stock" }
          : p
      )
    );
  }, []);

  // Add new product (distributor)
  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      rating: 4.0,
      image: productData.image || "📦",
      status: productData.stock === 0 ? "out-of-stock" : productData.stock < 20 ? "low-stock" : "in-stock",
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  // Update product (distributor)
  const updateProduct = useCallback((productId, productData) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              ...productData,
              status: productData.stock !== undefined
                ? productData.stock === 0 ? "out-of-stock" : productData.stock < 20 ? "low-stock" : "in-stock"
                : p.status,
            }
          : p
      )
    );
  }, []);

  // Delete product (distributor)
  const deleteProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const value = {
    products,
    orders,
    payments,
    userCart,
    setUserCart,
    getUserOrders,
    getUserPayments,
    placeOrder,
    fetchDistributors,
    fetchDistributorProducts,
    selectDistributor,
    distributors,
    selectedDistributor,
    distributorProducts,
    updateOrderStatus,
    updatePaymentStatus,
    updateProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}