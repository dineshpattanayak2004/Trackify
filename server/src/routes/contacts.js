import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ contacts });
});

router.post("/", verifyToken, async (req, res) => {
  const { name, email, phone, company } = req.body;
  const created = await prisma.contact.create({ data: { name, email, phone, company } });
  res.json({ contact: created });
});

export default router;
