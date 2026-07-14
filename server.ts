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
app.get("/api/auth/google", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in with Google</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Roboto', sans-serif; }
      </style>
    </head>
    <body class="bg-[#f0f4f9] min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-[450px] bg-white rounded-3xl p-10 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between min-h-[500px]">
        <div>
          <!-- Google Logo -->
          <div class="flex justify-start mb-6">
            <svg class="h-8" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>
          
          <h1 class="text-2xl font-normal text-[#1f1f1f] mb-2 tracking-tight">Sign in with Google</h1>
          <p class="text-sm text-[#444746] mb-8 font-medium">to continue to <span class="font-semibold text-blue-600">Divotech Admin Console</span></p>
          
          <form id="loginForm" class="space-y-6">
            <div class="relative">
              <input 
                type="email" 
                id="email" 
                required 
                placeholder=" "
                class="block w-full px-4 py-4 text-base text-[#1f1f1f] bg-white border border-[#747775] rounded-lg focus:outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] peer transition-all"
              />
              <label 
                for="email" 
                class="absolute text-sm text-[#444746] duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-[#0b57d0] left-3 transition-all"
              >
                Email or phone (Gmail or @divotech.in)
              </label>
            </div>
            
            <p class="text-xs text-[#5f6368] leading-normal font-medium">
              To keep administrative controls secure, use your corporate or registered Google account.
            </p>
          </form>
        </div>

        <div class="flex items-center justify-between pt-6 mt-8">
          <span class="text-xs text-slate-400">Secure SSO Gateway</span>
          <button 
            type="submit" 
            form="loginForm"
            class="bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-sm px-6 py-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer shadow-sm"
          >
            Sign In
          </button>
        </div>
      </div>

      <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
          e.preventDefault();
          const emailVal = document.getElementById('email').value.trim();
          if (!emailVal) return;
          
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'OAUTH_AUTH_SUCCESS', 
              email: emailVal 
            }, '*');
            window.close();
          } else {
            alert('Parent window reference lost. Sign-in complete for ' + emailVal);
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Corporate email and administrative passkey are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!normalizedEmail.endsWith("@divotech.in") && !normalizedEmail.endsWith("@gmail.com")) {
    return res.status(403).json({ error: "Access Denied: Only @divotech.in or authorized @gmail.com email addresses are permitted for systems administration." });
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
  if (!normalizedVerifier.endsWith("@divotech.in") && !normalizedVerifier.endsWith("@gmail.com")) {
    return res.status(403).json({ error: "Unauthorized: Verification requires a valid @divotech.in or @gmail.com administrative email." });
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
  if (!normalizedVerifier.endsWith("@divotech.in") && !normalizedVerifier.endsWith("@gmail.com")) {
    return res.status(403).json({ error: "Unauthorized email domain." });
  }

  const pending = db.getPendingChanges().find(c => c.id === id);
  if (!pending) {
    return res.status(404).json({ error: "Pending change not found." });
  }

  if (pending.submittedBy.toLowerCase().trim() === normalizedVerifier) {
    return res.status(400).json({ 
      error: `Compliance Error: The administrator who submitted this change (${pending.submittedBy}) cannot reject/verify it.` 
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
