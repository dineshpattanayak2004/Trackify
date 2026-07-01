import express from "express";
import { verifyToken, requireRole } from '../middleware/auth.js';
const router = express.Router();

// return a quick snapshot; realtime pushes happen over socket.io
router.get("/snapshot", verifyToken, requireRole(['admin', 'user']), (req, res) => {
  const snapshot = {
    activeUsers: Math.floor(100 + Math.random() * 200),
    leads: Math.floor(500 + Math.random() * 200),
    conversionRate: (Math.random() * 10 + 5).toFixed(2),
    revenue: Math.floor(100000 + Math.random() * 50000),
    timestamp: new Date().toISOString(),
  };
  res.json({ snapshot });
});

export default router;
