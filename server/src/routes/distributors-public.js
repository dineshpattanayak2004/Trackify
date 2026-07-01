import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get all active distributors (for user selection)
router.get("/", async (req, res) => {
  try {
    const distributors = await prisma.distributor.findMany({
      where: { status: "active" },
      select: {
        id: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        address: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(distributors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get products available from a specific distributor
router.get("/:distributorId/products", async (req, res) => {
  try {
    const { distributorId } = req.params;

    const selections = await prisma.distributorProductSelection.findMany({
      where: { distributorId },
      include: {
        product: true,
      },
    });

    const products = selections.map((s) => s.product);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;