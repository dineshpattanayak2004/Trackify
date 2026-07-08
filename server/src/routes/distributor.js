import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "secret";

const SALT_ROUNDS = 10;

// =====================
// DISTRIBUTOR REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, company, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !company) {
      return res.status(400).json({
        error: "Please fill all required fields: Name, Email, Password, and Company",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({
        error: "Name must be at least 2 characters long",
      });
    }

    // Validate company name length
    if (company.trim().length < 2) {
      return res.status(400).json({
        error: "Company name must be at least 2 characters long",
      });
    }

    const existingDistributor =
      await prisma.distributor.findUnique({
        where: { email },
      });

    if (existingDistributor) {
      return res.status(400).json({
        error: "Email already registered. Please use a different email or login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const distributor = await prisma.distributor.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        company: company.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        status: "active",
      },
    });

    const token = jwt.sign(
      {
        userId: distributor.id,
        role: "distributor",
        email: distributor.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Registration successful",
      token,
      distributor: {
        id: distributor.id,
        name: distributor.name,
        email: distributor.email,
        company: distributor.company,
        phone: distributor.phone,
        address: distributor.address,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle unique constraint violation
    if (err.code === 'P2002') {
      return res.status(400).json({
        error: "Email already registered. Please use a different email or login.",
      });
    }
    
    res.status(500).json({
      error: "Server error during registration. Please try again.",
    });
  }
});

// =====================
// DISTRIBUTOR LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const distributor =
      await prisma.distributor.findUnique({
        where: { email },
      });

    if (!distributor) {
      return res.status(401).json({
        error: "Distributor not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, distributor.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    if (distributor.status !== "active") {
      return res.status(403).json({
        error: "Account is not active. Contact admin.",
      });
    }

    const token = jwt.sign(
      {
        userId: distributor.id,
        role: "distributor",
        email: distributor.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: "distributor",
      email: distributor.email,
      name: distributor.name,
      company: distributor.company,
      phone: distributor.phone,
      address: distributor.address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// =====================
// GET ALL DISTRIBUTORS (admin)
// =====================
router.get("/", verifyToken, async (req, res) => {
  try {
    const distributors = await prisma.distributor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        address: true,
        status: true,
        createdAt: true,
      },
    });
    res.json(distributors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// GET SINGLE DISTRIBUTOR
// =====================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const distributor = await prisma.distributor.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        address: true,
        status: true,
        createdAt: true,
      },
    });

    if (!distributor) {
      return res.status(404).json({ error: "Distributor not found" });
    }

    res.json(distributor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// GET DISTRIBUTOR PRODUCT SELECTIONS
// =====================
router.get("/selections", verifyToken, async (req, res) => {
  try {
    const selections = await prisma.distributorProductSelection.findMany({
      where: { distributorId: req.user.userId },
      include: {
        product: true,
      },
      orderBy: { selectedAt: "desc" },
    });

    res.json(selections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// ADD PRODUCT SELECTION (distributor)
// =====================
router.post("/selections", verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const selection = await prisma.distributorProductSelection.create({
      data: {
        distributorId: req.user.userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.json({
      success: true,
      message: "Product selected successfully",
      selection,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// REMOVE PRODUCT SELECTION (distributor)
// =====================
router.delete("/selections/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    await prisma.distributorProductSelection.delete({
      where: {
        distributorId_productId: {
          distributorId: req.user.userId,
          productId,
        },
      },
    });

    res.json({
      success: true,
      message: "Product selection removed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// UPDATE DISTRIBUTOR STATUS (admin)
// =====================
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const distributor = await prisma.distributor.update({
      where: { id: req.params.id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        status: true,
      },
    });
    res.json(distributor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;