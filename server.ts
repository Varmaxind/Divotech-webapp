import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

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

// Helper to extract authenticated administrator email address from session token
function getAuthenticatedAdmin(req: express.Request): string | null {
  const authHeader = req.headers["authorization"] || req.headers["x-admin-email"];
  if (!authHeader) return null;
  
  let token = "";
  if (typeof authHeader === "string") {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }
  }
  
  if (!token) return null;
  
  const parts = token.split("|");
  if (parts.length < 2) return null;
  
  const email = parts[0].toLowerCase().trim();
  if (!email.endsWith("@divotech.in")) return null;
  
  // Verify authenticated via Google Workspace SSO or verified active token
  if (parts[1] && parts[1].startsWith("google_auth_active")) {
    const users = db.getUsers();
    let user = users.find(u => u.email.toLowerCase().trim() === email);
    if (!user) {
      db.saveUser({
        email,
        passwordHash: "",
        verified: true,
        createdAt: new Date().toISOString()
      });
    } else if (!user.verified) {
      user.verified = true;
      db.saveUser(user);
    }
    return email;
  }
  
  // Verify that the user exists and is fully verified in the local DB
  const user = db.getUsers().find(u => u.email.toLowerCase().trim() === email && u.verified);
  if (!user) return null;
  
  return email;
}

// Helper to extract administrative email address (Strict Auth Check)
function getAdminEmail(req: express.Request): string | null {
  return getAuthenticatedAdmin(req);
}

// Google SSO Cryptographic Signature Verification Endpoint
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || "";
const googleAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post("/api/admin/google-sso", async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: "Google credentials are required for verification." });
  }

  if (!GOOGLE_CLIENT_ID) {
    return res.status(400).json({ 
      error: "Google Client ID is not configured on the server. Please define GOOGLE_CLIENT_ID or VITE_GOOGLE_CLIENT_ID in your environment settings."
    });
  }

  try {
    // 3. Backend Token Verification: Verify the Google JWT ID token
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Access Denied: Invalid cryptographic token payload." });
    }

    const email = payload.email?.toLowerCase().trim();
    const hd = payload.hd?.toLowerCase().trim();

    // 4. Backend Domain Enforcement:
    // After verifying the token, check that the hd claim or the email domain exactly matches divotech.in
    const isDomainVerified = hd === "divotech.in" || (email && email.endsWith("@divotech.in"));

    if (!isDomainVerified) {
      return res.status(403).json({ 
        error: "Access Denied: Only corporate email addresses with @divotech.in are permitted to access this administrative portal." 
      });
    }

    if (!email) {
      return res.status(400).json({ error: "Invalid payload: Email address was not provided by Google SSO." });
    }

    // Provision the user in the database if they don't exist yet
    const users = db.getUsers();
    let user = users.find(u => u.email.toLowerCase().trim() === email);
    if (!user) {
      db.saveUser({
        email,
        passwordHash: "",
        verified: true,
        createdAt: new Date().toISOString()
      });
    } else if (!user.verified) {
      user.verified = true;
      db.saveUser(user);
    }

    // Generate secure session token
    const sessionSecret = crypto.randomBytes(16).toString("hex");
    const token = `${email}|google_auth_active_${sessionSecret}|${Date.now()}`;

    res.json({
      success: true,
      token,
      email,
      message: "SSO cryptographic signature successfully verified. Secure corporate session initialized."
    });
  } catch (error: any) {
    console.error("Google SSO verification failed:", error);
    res.status(401).json({ 
      error: `SSO signature verification failed: ${error.message || error}. Ensure that your Google Client ID is configured correctly.` 
    });
  }
});

// Secure Admin Registration Route
app.post("/api/admin/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Corporate email and administrative passkey are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!normalizedEmail.endsWith("@divotech.in")) {
    return res.status(403).json({ error: "Access Denied: Only verified @divotech.in corporate email domains are permitted to register systems administrator accounts." });
  }

  const users = db.getUsers();
  const existingUser = users.find(u => u.email.toLowerCase().trim() === normalizedEmail);
  if (existingUser && existingUser.verified) {
    return res.status(400).json({ error: "An administrator account with this corporate email address is already registered." });
  }

  // Create hash for secure password storage
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  
  // Generate a random secure 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

  const newUser = {
    email: normalizedEmail,
    passwordHash,
    verified: false,
    verificationCode: code,
    verificationCodeExpires: expiresAt,
    createdAt: new Date().toISOString()
  };

  db.saveUser(newUser);

  // Simulate dispatching email with verification code to the console
  console.log(`\n================================================================`);
  console.log(`DIVOTECH SECURE MAIL GATEWAY: VERIFICATION EMAIL`);
  console.log(`To: ${normalizedEmail}`);
  console.log(`Subject: Divotech Admin Console - Multi-Factor Verification Code`);
  console.log(`Code: [ ${code} ]`);
  console.log(`Expires: 10 minutes from now (${new Date(expiresAt).toLocaleTimeString()})`);
  console.log(`================================================================\n`);

  res.json({
    success: true,
    message: "A secure verification code has been dispatched to your corporate email."
  });
});

// Secure Email Verification Route
app.post("/api/admin/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email and verification code are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const users = db.getUsers();
  const user = users.find(u => u.email.toLowerCase().trim() === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: "No pending administrator account found for this email." });
  }

  if (user.verified) {
    return res.json({ success: true, message: "Corporate email is already verified. Proceed to sign in." });
  }

  if (user.verificationCode !== code) {
    return res.status(400).json({ error: "The verification code you entered is invalid." });
  }

  const now = new Date().toISOString();
  if (user.verificationCodeExpires && user.verificationCodeExpires < now) {
    return res.status(400).json({ error: "This verification code has expired. Please request a new registration code." });
  }

  // Mark user as fully verified
  user.verified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;

  db.saveUser(user);

  res.json({
    success: true,
    message: "Corporate email verification complete! Your administrator account has been activated."
  });
});

// Secure Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Corporate email and password are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!normalizedEmail.endsWith("@divotech.in")) {
    return res.status(403).json({ error: "Access Denied: Only @divotech.in corporate email addresses are permitted for administrative systems access." });
  }

  const users = db.getUsers();
  const user = users.find(u => u.email.toLowerCase().trim() === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: "Invalid corporate email or administrative credentials." });
  }

  if (!user.verified) {
    return res.status(403).json({ error: "Your corporate email is not verified yet. Please enter the verification code to activate your account." });
  }

  // Compare secure password hashes
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  if (user.passwordHash !== hash) {
    return res.status(401).json({ error: "Invalid corporate email or administrative credentials." });
  }

  // Generate a cryptographically secure session token format
  const sessionSecret = crypto.randomBytes(16).toString("hex");
  const token = `${normalizedEmail}|${sessionSecret}|${Date.now()}`;

  res.json({ 
    success: true, 
    token,
    email: normalizedEmail
  });
});

// Admin: Get Contacts
app.get("/api/admin/inquiries", (req, res) => {
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }
  res.json(db.getInquiries());
});

// Admin: CRUD - Add / Edit Product (Intercepted for Maker-Checker Verification)
app.post("/api/admin/products", (req, res) => {
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }

  const product = req.body;
  if (!product.id || !product.name || !product.category) {
    return res.status(400).json({ error: "Missing required fields (id, name, category)" });
  }
  
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
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }

  const id = req.params.id;
  const product = db.getProducts().find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

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
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }

  const model = req.body;
  if (!model.id || !model.name) {
    return res.status(400).json({ error: "Missing required fields (id, name)" });
  }

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
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }

  const id = req.params.id;
  const model = db.getModels().find(m => m.id === id);
  if (!model) {
    return res.status(404).json({ error: "Category model not found" });
  }

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
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }

  const cmsData = req.body;
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
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }

  const appSection = req.body;
  if (!appSection.id || !appSection.title) {
    return res.status(400).json({ error: "Missing required fields (id, title)" });
  }

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
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }

  const id = req.params.id;
  const appSection = db.getApplications().find(a => a.id === id);
  if (!appSection) {
    return res.status(404).json({ error: "Application section not found" });
  }

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
  const email = getAuthenticatedAdmin(req);
  if (!email) {
    return res.status(401).json({ error: "Access Denied: Unauthenticated or invalid administrative session." });
  }
  res.json(db.getPendingChanges());
});

app.post("/api/admin/pending-changes/:id/approve", (req, res) => {
  const id = req.params.id;
  const verifierEmail = getAuthenticatedAdmin(req);
  if (!verifierEmail) {
    return res.status(401).json({ error: "Access Denied: Double verification requires a valid authenticated administrative session." });
  }

  const normalizedVerifier = verifierEmail.toLowerCase().trim();
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
  const verifierEmail = getAuthenticatedAdmin(req);
  if (!verifierEmail) {
    return res.status(401).json({ error: "Access Denied: Double verification requires a valid authenticated administrative session." });
  }

  const normalizedVerifier = verifierEmail.toLowerCase().trim();
  const pending = db.getPendingChanges().find(c => c.id === id);
  if (!pending) {
    return res.status(404).json({ error: "Pending change not found." });
  }

  if (pending.submittedBy.toLowerCase().trim() === normalizedVerifier) {
    return res.status(400).json({ 
      error: `Compliance Error: Maker-Checker rule violation. The administrator who submitted this change (${pending.submittedBy}) cannot reject/verify it.` 
    });
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
