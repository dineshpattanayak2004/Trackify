import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// Get all orders (distributor/admin)
// If distributor, only show their orders; if admin, show all
router.get("/", verifyToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.userId;

    let orders;
    if (userRole === "distributor") {
      // Distributor can only see their own orders
      orders = await prisma.order.findMany({
        where: { distributorId: userId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Admin can see all orders
      orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get orders for a specific user
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId, userName, productId, productName, qty, total, paymentMethod, distributor, distributorId } = req.body;

    if (!userId || !productId || !qty || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        userName: userName || "Unknown User",
        productId,
        productName: productName || "Unknown Product",
        qty: parseInt(qty),
        total: parseInt(total),
        paymentMethod: paymentMethod || "Cash on Delivery",
        paymentStatus: paymentMethod === "Cash on Delivery" ? "pending" : "paid",
        date: new Date().toISOString().split("T")[0],
        distributor: distributor || "TechDistro Pvt Ltd",
        distributorId: distributorId || null,
        status: "pending",
      },
    });

    res.json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// Update order status
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update payment status
router.patch("/:id/payment", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidAt } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: status,
        ...(paidAt && { paidAt }),
      },
    });

    res.json({
      success: true,
      message: "Payment status updated",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete an order
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;