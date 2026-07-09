import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import distributorRoutes from "./routes/distributor.js";
import aiRoutes from "./routes/ai.js";
import contactsRoutes from "./routes/contacts.js";
import analyticsRoutes from "./routes/analytics.js";
import productsRoutes from "./routes/products.js";
import ordersRoutes from "./routes/orders.js";
import distributorsPublicRoutes from "./routes/distributors-public.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes - mounted with /api prefix for Vercel compatibility
app.use("/api/auth", authRoutes);
app.use("/api/distributor", distributorRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/public/distributors", distributorsPublicRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export for Vercel serverless functions
export default app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}