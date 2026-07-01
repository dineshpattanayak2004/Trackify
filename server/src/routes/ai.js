import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// ============================================================
//  POWERFUL LOCAL AI AGENT  🤖
//  No API key needed — uses real DB data + smart logic
// ============================================================

/**
 * Get real-time business metrics from the database
 */
async function getBusinessMetrics() {
  const totalUsers = await prisma.user.count();
  const totalContacts = await prisma.contact.count();

  // Recent signups (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = await prisma.user.count({
    where: { createdAt: { gte: weekAgo } },
  });
  const recentContacts = await prisma.contact.count({
    where: { createdAt: { gte: weekAgo } },
  });

  // All contacts with company info for analysis
  const contacts = await prisma.contact.findMany();

  // Company distribution
  const companies = contacts
    .filter((c) => c.company)
    .reduce((acc, c) => {
      acc[c.company] = (acc[c.company] || 0) + 1;
      return acc;
    }, {});
  const topCompany =
    Object.entries(companies).sort((a, b) => b[1] - a[1])[0] || null;

  // Users with their signup dates for growth calc
  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    totalUsers,
    totalContacts,
    recentUsers,
    recentContacts,
    topCompany: topCompany ? { name: topCompany[0], count: topCompany[1] } : null,
    totalCompanies: Object.keys(companies).length,
    contactsWithoutCompany: contacts.filter((c) => !c.company).length,
    usersWithEmail: contacts.filter((c) => c.email).length,
    usersWithPhone: contacts.filter((c) => c.phone).length,
    firstUser: allUsers[allUsers.length - 1] || null,
    latestUser: allUsers[0] || null,
  };
}

/**
 * AI Agent Brain — understands natural language and answers
 * using real database context
 */
function agentBrain(question, metrics) {
  const q = question.toLowerCase();

  // ---- USER / PEOPLE QUERIES ----
  if (
    q.includes("user") ||
    q.includes("people") ||
    q.includes("signup") ||
    q.includes("registered") ||
    q.includes("member")
  ) {
    if (q.includes("total") || q.includes("how many") || q.includes("count")) {
      return `We have **${metrics.totalUsers} total users** registered in the system. ${
        metrics.recentUsers > 0
          ? `${metrics.recentUsers} joined in the last 7 days!`
          : ""
      }`;
    }
    if (q.includes("recent") || q.includes("new") || q.includes("latest")) {
      return `📈 **${metrics.recentUsers} new users** joined in the past week. ${
        metrics.latestUser
          ? `The most recent signup was **${metrics.latestUser.name || "someone"}** (${metrics.latestUser.email}) on ${new Date(metrics.latestUser.createdAt).toLocaleDateString()}.`
          : ""
      }`;
    }
    if (q.includes("first") || q.includes("oldest") || q.includes("earliest")) {
      return metrics.firstUser
        ? `The very first user was **${metrics.firstUser.name || "Unknown"}** (${metrics.firstUser.email}), registered on ${new Date(metrics.firstUser.createdAt).toLocaleDateString()}. 🎉`
        : "No user data found yet.";
    }
    return `👥 You have **${metrics.totalUsers} users** total. ${metrics.recentUsers} joined recently. ${
      metrics.latestUser
        ? `Latest: **${metrics.latestUser.name || metrics.latestUser.email}**`
        : ""
    }`;
  }

  // ---- CONTACT QUERIES ----
  if (
    q.includes("contact") ||
    q.includes("client") ||
    q.includes("customer") ||
    q.includes("lead")
  ) {
    if (q.includes("total") || q.includes("how many") || q.includes("count")) {
      return `📇 You have **${metrics.totalContacts} contacts** in your network. ${
        metrics.recentContacts > 0
          ? `${metrics.recentContacts} were added recently!`
          : ""
      }`;
    }
    if (q.includes("company") || q.includes("organization")) {
      if (metrics.topCompany) {
        return `🏢 You have contacts across **${metrics.totalCompanies} different companies**. The top company is **${metrics.topCompany.name}** with ${metrics.topCompany.count} contacts.`;
      }
      return `📊 You have contacts across **${metrics.totalCompanies} companies** in your database.`;
    }
    if (q.includes("email")) {
      return `📧 Out of ${metrics.totalContacts} contacts, **${metrics.usersWithEmail} have email addresses** provided.`;
    }
    if (q.includes("phone") || q.includes("call")) {
      return `📞 **${metrics.usersWithPhone} out of ${metrics.totalContacts} contacts** have phone numbers on file.`;
    }
    if (q.includes("without") || q.includes("missing") || q.includes("no company")) {
      return `⚠️ **${metrics.contactsWithoutCompany} contacts** don't have a company name assigned yet. You may want to update those!`;
    }
    return `📇 Your network has **${metrics.totalContacts} contacts** across **${metrics.totalCompanies} companies**. ${
      metrics.topCompany
        ? `Top: **${metrics.topCompany.name}** (${metrics.topCompany.count})`
        : ""
    }`;
  }

  // ---- ANALYTICS / GROWTH ----
  if (
    q.includes("analytics") ||
    q.includes("growth") ||
    q.includes("trend") ||
    q.includes("overview") ||
    q.includes("summary") ||
    q.includes("dashboard") ||
    q.includes("insight")
  ) {
    return `📊 **System Overview**
• 👥 **${metrics.totalUsers} users** registered
• 📇 **${metrics.totalContacts} contacts** in database
• 🏢 **${metrics.totalCompanies} companies** represented
• 📈 **+${metrics.recentUsers} new users** (7 days)
• 📨 **+${metrics.recentContacts} new contacts** (7 days)
• 📧 **${metrics.usersWithEmail} contacts** with email
• 📞 **${metrics.usersWithPhone} contacts** with phone

💡 _Tip: Keep growing your network by adding more contacts with complete information!_`;
  }

  // ---- COMPANY QUERIES ----
  if (
    q.includes("top") ||
    q.includes("biggest") ||
    q.includes("largest") ||
    q.includes("most")
  ) {
    if (metrics.topCompany) {
      return `🏆 **${metrics.topCompany.name}** is your top company with **${metrics.topCompany.count} contacts**.`;
    }
    return "No company data available yet. Add companies to your contacts to see insights!";
  }

  // ---- GREETINGS ----
  if (
    q.includes("hello") ||
    q.includes("hi ") ||
    q.includes("hey") ||
    q.includes("good morning") ||
    q.includes("good evening") ||
    q === "hi"
  ) {
    return `🤖 Hello! I'm **Trackify AI Assistant**. I can help you with:
• 👥 User reports and statistics
• 📇 Contact and client insights
• 🏢 Company analysis
• 📊 Business overview and trends
• 📈 Growth metrics

_Just ask me anything about your business data!_`;
  }

  if (q.includes("who are you") || q.includes("what can you") || q.includes("help")) {
    return `🤖 I'm **Trackify AI** — your intelligent business assistant!
    
I'm connected directly to your database and can answer questions about:
• **Users** — total count, recent signups, growth
• **Contacts** — network size, email/phone stats, company distribution
• **Companies** — top companies, organization insights
• **Analytics** — overview, trends, performance metrics

Try asking: "How many users?", "Show my contacts", "Give me an overview", or "Who joined recently?"`;
  }

  // ---- DEFAULT INTELLIGENT RESPONSE ----
  return `🤖 I understand you're asking about "${question}".

Here's what I know from your database right now:
• 👥 **${metrics.totalUsers} users** | 📇 **${metrics.totalContacts} contacts**
• 🏢 **${metrics.totalCompanies} companies** ${
    metrics.topCompany ? `| Top: **${metrics.topCompany.name}**` : ""
  }
• 📈 **${metrics.recentUsers} new users** & **${metrics.recentContacts} new contacts** this week

💡 _Try being more specific. Ask about users, contacts, companies, or request an overview!_`;
}

// ============================================================
//  POST /ai/ask  — Ask the AI Agent anything
// ============================================================
router.post("/ask", verifyToken, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Please provide a question." });
    }

    // Gather real-time business metrics from database
    const metrics = await getBusinessMetrics();

    // Let the AI agent process the question with real data
    const answer = agentBrain(question.trim(), metrics);

    res.json({ answer });
  } catch (err) {
    console.error("AI Agent Error:", err);
    res.status(500).json({
      error: "AI agent encountered an error. Please try again.",
    });
  }
});

// ============================================================
//  GET /ai/stats  — Quick statistics endpoint for the UI
// ============================================================
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const metrics = await getBusinessMetrics();
    res.json({ metrics });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;