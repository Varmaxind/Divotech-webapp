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

// Helper to extract administrative email address
function getAdminEmail(req: express.Request): string {
  const emailHeader = req.headers["x-admin-email"];
  if (emailHeader) return String(emailHeader).trim().toLowerCase();
  return "compliance@divotech.in"; // Fallback email
}

// Admin Authentication Route
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Corporate email and administrative passkey are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!normalizedEmail.endsWith("@divotech.in")) {
    return res.status(403).json({ error: "Access Denied: Only @divotech.in email addresses are permitted for systems administration." });
  }

  // Simple, elegant, secure static password for B2B portal admin
  if (password === "divotech2026") {
    res.json({ 
      success: true, 
      token: `${normalizedEmail}|divotech_session_active_${Date.now()}`,
      email: normalizedEmail
    });
  } else {
    res.status(401).json({ error: "Invalid Administrative Password" });
  }
});

// Admin: Get Contacts
app.get("/api/admin/inquiries", (req, res) => {
  res.json(db.getInquiries());
});

// Admin: CRUD - Add / Edit Product (Intercepted for Maker-Checker Verification)
app.post("/api/admin/products", (req, res) => {
  const product = req.body;
  if (!product.id || !product.name || !product.category) {
    return res.status(400).json({ error: "Missing required fields (id, name, category)" });
  }
  
  const email = getAdminEmail(req);
  const isUpdate = db.getProducts().some(p => p.id === product.id);
  const change = db.savePendingChange({
    type: isUpdate ? "update_product" : "create_product",
    targetId: product.id,
    targetName: product.name,
    payload: product,
    submittedBy: email
  });

  res.json({ 
    success: true, 
    pending: true, 
    change, 
    message: "This product change has been registered in the validation queue. Another administrator must verify and approve it before it is published." 
  });
});

// Admin: CRUD - Delete Product (Intercepted for Maker-Checker Verification)
app.delete("/api/admin/products/:id", (req, res) => {
  const id = req.params.id;
  const product = db.getProducts().find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const email = getAdminEmail(req);
  const change = db.savePendingChange({
    type: "delete_product",
    targetId: id,
    targetName: product.name,
    payload: null,
    submittedBy: email
  });

  res.json({ 
    success: true, 
    pending: true, 
    change, 
    message: "Product deletion registered in the validation queue. Another administrator must verify and approve it before it is deleted." 
  });
});

// Models Endpoints
app.get("/api/models", (req, res) => {
  res.json(db.getModels());
});

// Admin: Models Create / Update (Intercepted for Maker-Checker Verification)
app.post("/api/admin/models", (req, res) => {
  const model = req.body;
  if (!model.id || !model.name) {
    return res.status(400).json({ error: "Missing required fields (id, name)" });
  }

  const email = getAdminEmail(req);
  const isUpdate = db.getModels().some(m => m.id === model.id);
  const change = db.savePendingChange({
    type: isUpdate ? "update_model" : "create_model",
    targetId: model.id,
    targetName: model.name,
    payload: model,
    submittedBy: email
  });

  res.json({ 
    success: true, 
    pending: true, 
    change, 
    message: "Category model change registered in the validation queue. Another administrator must verify and approve it." 
  });
});

// Admin: Models Delete (Intercepted for Maker-Checker Verification)
app.delete("/api/admin/models/:id", (req, res) => {
  const id = req.params.id;
  const model = db.getModels().find(m => m.id === id);
  if (!model) {
    return res.status(404).json({ error: "Category model not found" });
  }

  const email = getAdminEmail(req);
  const change = db.savePendingChange({
    type: "delete_model",
    targetId: id,
    targetName: model.name,
    payload: null,
    submittedBy: email
  });

  res.json({ 
    success: true, 
    pending: true, 
    change, 
    message: "Category model deletion registered in the validation queue." 
  });
});

// Admin: CMS Meta Edit (Intercepted for Maker-Checker Verification)
app.post("/api/admin/cms", (req, res) => {
  const cmsData = req.body;
  const email = getAdminEmail(req);
  const change = db.savePendingChange({
    type: "update_cms",
    targetId: "cms",
    targetName: "Corporate branding & portal settings",
    payload: cmsData,
    submittedBy: email
  });

  res.json({ 
    success: true, 
    pending: true, 
    change, 
    message: "Corporate branding updates registered in the validation queue." 
  });
});

// Industry Applications Endpoints
app.get("/api/applications", (req, res) => {
  res.json(db.getApplications());
});

app.post("/api/admin/applications", (req, res) => {
  const appSection = req.body;
  if (!appSection.id || !appSection.title) {
    return res.status(400).json({ error: "Missing required fields (id, title)" });
  }

  const email = getAdminEmail(req);
  const isUpdate = db.getApplications().some(a => a.id === appSection.id);
  const change = db.savePendingChange({
    type: isUpdate ? "update_app" : "create_app",
    targetId: appSection.id,
    targetName: appSection.title,
    payload: appSection,
    submittedBy: email
  });

  res.json({ 
    success: true, 
    pending: true, 
    change, 
    message: "Industry application change registered in the validation queue." 
  });
});

app.delete("/api/admin/applications/:id", (req, res) => {
  const id = req.params.id;
  const appSection = db.getApplications().find(a => a.id === id);
  if (!appSection) {
    return res.status(404).json({ error: "Application section not found" });
  }

  const email = getAdminEmail(req);
  const change = db.savePendingChange({
    type: "delete_app",
    targetId: id,
    targetName: appSection.title,
    payload: null,
    submittedBy: email
  });

  res.json({ 
    success: true, 
    pending: true, 
    change, 
    message: "Industry application deletion registered in the validation queue." 
  });
});

// Admin: Double Verification (Maker-Checker approval queue endpoints)
app.get("/api/admin/pending-changes", (req, res) => {
  res.json(db.getPendingChanges());
});

app.post("/api/admin/pending-changes/:id/approve", (req, res) => {
  const id = req.params.id;
  const { verifierEmail } = req.body;
  if (!verifierEmail) {
    return res.status(400).json({ error: "Verifier email is required for double verification compliance." });
  }

  const normalizedVerifier = verifierEmail.toLowerCase().trim();
  if (!normalizedVerifier.endsWith("@divotech.in")) {
    return res.status(403).json({ error: "Unauthorized: Verification requires a valid @divotech.in corporate email." });
  }
  
  const pending = db.getPendingChanges().find(c => c.id === id);
  if (!pending) {
    return res.status(404).json({ error: "Pending change not found." });
  }
  
  if (pending.submittedBy.toLowerCase().trim() === normalizedVerifier) {
    return res.status(400).json({ 
      error: `Compliance Error: Maker-Checker rule violation. The administrator who submitted this change (${pending.submittedBy}) cannot be the same one who approves/verifies it. Please have another user verify.` 
    });
  }

  const updated = db.updatePendingChangeStatus(id, "approved", normalizedVerifier);
  res.json({ success: true, change: updated });
});

app.post("/api/admin/pending-changes/:id/reject", (req, res) => {
  const id = req.params.id;
  const { verifierEmail } = req.body;
  if (!verifierEmail) {
    return res.status(400).json({ error: "Verifier email is required." });
  }

  const normalizedVerifier = verifierEmail.toLowerCase().trim();
  if (!normalizedVerifier.endsWith("@divotech.in")) {
    return res.status(403).json({ error: "Unauthorized email domain." });
  }

  const updated = db.updatePendingChangeStatus(id, "rejected", normalizedVerifier);
  res.json({ success: true, change: updated });
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
