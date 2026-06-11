import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI(process.env.GEMINI_API_KEY) : null;

app.use(express.json());

// Divotech B2B Product Database
const products = [
  {
    id: "hv-dc-30k",
    name: "Divotech HV-DC Precision",
    category: "High Voltage DC Power Supplies",
    voltage: "0-30kV",
    current: "0-10mA",
    power: "300W",
    description: "Highly stable, low-ripple regulated DC source for analytical and laboratory experiments.",
    price: 135000,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    features: ["Precision Control", "Arc Protection", "Made in Hyderabad", "Low Ripple < 0.005%"]
  },
  {
    id: "pulse-hv-5k",
    name: "Divo-Pulse Fast Switched",
    category: "Pulsed DC Power Supplies",
    voltage: "5kV Peak",
    current: "20A Peak",
    power: "1.5kW",
    description: "Fast rise-time pulsed HV source for plasma and semiconductor fabrication applications.",
    price: 185000,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    features: ["Variable Duty Cycle", "Microsecond Switching", "Air Cooled", "PLC Compatible"]
  },
  {
    id: "xr-gen-divo120",
    name: "Divotech RayGen 120",
    category: "X-Ray Generators",
    voltage: "20kV-120kV",
    current: "5mA",
    power: "600W",
    description: "Integrated generator system for industrial NDT and medical imaging systems.",
    price: 480000,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
    features: ["Digital Filament Control", "USB/RS232 Interface", "Compact Mono-block", "MSME Certified"]
  },
  {
    id: "custom-hv-sys",
    name: "Divotech Custom OEM System",
    category: "Custom / OEM Power Systems",
    voltage: "Up to 150kV",
    current: "Custom",
    power: "Up to 50kW",
    description: "Bespoke high voltage engineering tailored for specific OEM requirements and mission-critical applications.",
    price: 0,
    currency: "INR",
    image: "https://images.unsplash.com/photo-159742324403d-ef1dd7d6da10?auto=format&fit=crop&q=80&w=800",
    features: ["Bespoke Mechanicals", "Flexible Control Logic", "Expert Consultation", "Rapid Prototyping"]
  }
];

// API Routes
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.post("/api/contact", (req, res) => {
  const { name, email, company, message, industry, voltageRange } = req.body;
  console.log(`B2B Inquiry for Divotech: ${name} (${company}) | Industry: ${industry} | Needs: ${voltageRange}`);
  res.json({ success: true, message: "Thank you. A Divotech engineer will contact you shortly." });
});

app.post("/api/ai/consult", async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ error: "AI service not available" });
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { prompt, history } = req.body;
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a senior technical consultant for Divotech (Divo Technologies Pvt. Ltd.), an Indian high-voltage power supply manufacturer based in Hyderabad. We specialize in HV DC supplies, X-ray generators, and custom power conversion. Established in 2015, we are an MSME and DPIIT Startup. All products are Made in India. Help clients with technical specs, application fit, and custom project inquiries." }],
        },
        {
          role: "model",
          parts: [{ text: "Greetings. I am your Divotech technical consultant. How can we assist with your precision high voltage requirements today? We offer solutions up to 150kV with Indian manufacturing excellence." }],
        },
        ...(history || [])
      ]
    });
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
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
