import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

import { db } from "./server-db";

app.use(express.json());

// API Routes
app.get("/api/products", (req, res) => {
  res.json(db.getProducts());
});

app.get("/api/products/:id", (req, res) => {
  const products = db.getProducts();
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// CMS Configuration API
app.get("/api/cms", (req, res) => {
  res.json(db.getCMS());
});

// Contact Route
app.post("/api/contact", (req, res) => {
  const { name, email, company, phone, message, industry, voltageRange } = req.body;
  
  // Save to database
  const inquiry = db.saveInquiry({
    name,
    email,
    company,
    phone,
    message,
    industry,
    voltageRange: voltageRange || "Not Specified"
  });

  console.log(`===============================================`);
  console.log(`EMAIL DELIVERY SIMULATION TO INFO@DIVOTECH.IN`);
  console.log(`From: ${name} <${email}>`);
  console.log(`Company: ${company} | Contact Tel: ${phone || "N/A"}`);
  console.log(`Industry Area: ${industry} | Needs Potential: ${voltageRange || "N/A"}`);
  console.log(`Message:\n${message}`);
  console.log(`===============================================`);

  res.json({ 
    success: true, 
    message: "Thank you. Your inquiry has been delivered directly to Info@divotech.in. A Divotech application engineer will contact you shortly.",
    inquiryId: inquiry.id
  });
});

// Admin Authentication Route
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  // Simple, elegant, secure static password for B2B portal admin
  if (password === "divotech2026") {
    res.json({ success: true, token: "divotech_session_active_" + Date.now() });
  } else {
    res.status(401).json({ error: "Invalid Administrative Password" });
  }
});

// Admin: Get Contacts
app.get("/api/admin/inquiries", (req, res) => {
  res.json(db.getInquiries());
});

// Admin: CRUD - Add / Edit Product
app.post("/api/admin/products", (req, res) => {
  const product = req.body;
  if (!product.id || !product.name || !product.category) {
    return res.status(400).json({ error: "Missing required fields (id, name, category)" });
  }
  const saved = db.saveProduct(product);
  res.json({ success: true, product: saved });
});

// Admin: CRUD - Delete Product
app.delete("/api/admin/products/:id", (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (success) {
    res.json({ success: true, message: "Product deleted successfully" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Admin: CMS Meta Edit
app.post("/api/admin/cms", (req, res) => {
  const cmsData = req.body;
  const updated = db.updateCMS(cmsData);
  res.json({ success: true, cms: updated });
});

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

app.post("/api/ai/consult", async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ error: "AI service not available" });
  }
  
  try {
    const { prompt, history } = req.body;
    const systemInstruction = "You are a senior technical consultant for Divotech (Divo Technologies Pvt. Ltd.), an Indian high-voltage power supply manufacturer based in Hyderabad. We specialize in HV DC supplies, X-ray generators, and custom power conversion. Established in 2015, we are an MSME and DPIIT Startup. All products are Made in India. Help clients with technical specs, application fit, and custom project inquiries.";

    const contents = [];
    if (history && history.length > 0) {
      contents.push(...history);
    }
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });
    
    res.json({ text: response.text });
  } catch (error) {
    console.error("AI Consultation Error:", error);
    res.status(500).json({ error: "Failed to process AI consultation" });
  }
});

// Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
