import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// =====================
// GET ALL PRODUCTS
// =====================
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// GET SINGLE PRODUCT
// =====================
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// CREATE PRODUCT (distributor/admin)
// =====================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, category, price, stock, description, image } = req.body;

    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({
        error: "Name, category, price, and stock are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: parseInt(price),
        stock: parseInt(stock),
        description: description || "",
        image: image || "📦",
        status: stock === 0 ? "out-of-stock" : stock < 20 ? "low-stock" : "in-stock",
      },
    });

    res.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// UPDATE PRODUCT (distributor/admin)
// =====================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, category, price, stock, description, image } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        category,
        price: price !== undefined ? parseInt(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        description,
        image,
        status: stock !== undefined ? (stock === 0 ? "out-of-stock" : stock < 20 ? "low-stock" : "in-stock") : undefined,
      },
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// DELETE PRODUCT (admin only)
// =====================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;