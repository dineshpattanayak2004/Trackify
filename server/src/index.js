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

app.use("/auth", authRoutes);
app.use("/distributor", distributorRoutes);
app.use("/ai", aiRoutes);
app.use("/contacts", contactsRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/public/distributors", distributorsPublicRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
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
