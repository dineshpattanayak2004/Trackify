import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";
import { Server } from "socket.io";
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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

const getAnalyticsSnapshot = () => ({
  activeUsers: Math.floor(100 + Math.random() * 200),
  leads: Math.floor(500 + Math.random() * 200),
  conversionRate: (Math.random() * 10 + 5).toFixed(2),
  revenue: Math.floor(100000 + Math.random() * 50000),
  timestamp: new Date().toISOString(),
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  socket.emit("welcome", { message: "connected to Trackify realtime" });
  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

setInterval(() => {
  const payload = getAnalyticsSnapshot();
  io.emit("analytics:update", payload);
}, 3000);

// Export io to be used by analytics module
app.set("io", io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
