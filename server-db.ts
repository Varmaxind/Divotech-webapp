import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export interface Product {
  id: string;
  name: string;
  category: string;
  modelNumber: string;
  voltage: string;
  current: string;
  power: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  features: string[];
  specs: Record<string, string>;
  applications: string[];
  brochureUrl?: string;
}

export interface Model {
  id: string;
  name: string;
  applications?: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
  industry: string;
  voltageRange?: string;
  createdAt: string;
}

export interface CMSData {
  companyName: string;
  companyNameShort: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  statusMessage: string;
  sliders: Array<{
    title: string;
    description: string;
    image: string;
    accent: string;
  }>;
}

// Ensure database file and directory exist
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultProducts: Product[] = [
      {
        id: "er-rack-40kv-50ma",
        name: "Divotech ER-40-50 Regulated DC Supply",
        category: "High Voltage Regulated DC Power Supplies",
        modelNumber: "ER-40-50",
        voltage: "0 to 40kV",
        current: "0 to 50mA",
        power: "2000W (2kW)",
        description: "Divotech’s ER Series of high voltage power supplies are designed to meet the best performance standards. They are low ripple, air/epoxy insulated, fast response units, with precise regulation and low arc discharge currents. Ideal for electrostatics, E-beam systems, hipot testing, and capacitor charging.",
        price: 245000,
        currency: "INR",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
        features: [
          "Positive or Negative Polarity (Available with either with respect to chassis ground)",
          "High reliability with air/epoxy insulated design",
          "High frequency operated PWM controlled switch mode topology",
          "Precise regulation (Line < 0.01% for 10% line change, Load < 0.01% for 0 to 100% load variation)",
          "Automatic crossover from constant-voltage (CV) to constant-current (CC) regulation",
          "Output Control & Monitoring: Local (Manual with 10-turn lockable dials, 3½ digit meters)",
          "Protections: Against overload, over voltage, short circuit, arc & external interlock"
        ],
        specs: {
          "Input Voltage": "220V AC ± 10%, 50 Hz, Single Phase",
          "Output Voltage": "0 to 40kV DC Adjustable",
          "Output Current": "0 to 50 mA",
          "Polarity": "Positive or Negative with respect to chassis ground (specify on order)",
          "Line Regulation (Voltage)": "< 0.01 % for 10% variation in input voltage",
          "Load Regulation (Voltage)": "< 0.01% for 0 to 100% load variation",
          "Line Regulation (Current)": "< 0.01 % of rated current",
          "Load Regulation (Current)": "< 0.05% of rated current",
          "Stability": "≤ 100 ppm, after 1/2 hour warm-up",
          "Temperature Coefficient": "100ppm/⁰C",
          "Output Voltage Ripple": "≤0.025% V Peak to Peak of rated voltage at full load",
          "Topology": "PWM – controlled switch mode",
          "Mechanical": "Dimensions: ≤4U, Mounting: 19\" rack, Cooling: Forced air, Cable: 3 meters shielded HV DC cable",
          "Operating Environment": "0 to +40 °C, 10-90% RH (non-condensing)",
          "Warranty / Support": "One Year Manufacturer Warranty"
        },
        applications: ["Electrostatics", "E-Beam Systems", "General Laboratory", "Hipot Testing", "Capacitor Charging", "Industrial Processes"]
      },
      {
        id: "xrf-50kv-50w",
        name: "Divotech XRF-50-50 X-Ray Source",
        category: "X-Ray Power Supplies",
        modelNumber: "XRF-50-50",
        voltage: "0 to 50kV",
        current: "0 to 1mA",
        power: "50W",
        description: "Section B Item III, solid-state encapsulated 50kV 50W high-stability power supply ideal for XRF analysis and material inspection. Designed specifically for industrial NDT and medical diagnostic systems, featuring an integrated high-stability filament power supply.",
        price: 195000,
        currency: "INR",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        features: [
          "Integrated Filament Power Supply (0-3A, 5V automatic constant current loop)",
          "Ultra-stable solid-state epoxy encapsulation for noise suppression",
          "Very low ripple ≤0.01% Peak-to-Peak",
          "Analog 0-10V control interface or optional USB/RS-232 digital interface",
          "Fast response arc and overload sense with emergency shut-off",
          "Excellent long-term repeatability"
        ],
        specs: {
          "Input Voltage": "24V DC ± 10%",
          "Output Voltage": "0 to 50kV DC Adjustable",
          "Output Current": "0 to 1 mA",
          "Power": "50W maximum",
          "Filament Drive": "Automatic Constant Current 0 to 3 A, 5 V Max voltage clamp",
          "Voltage Ripple": "≤ 0.01% Peak-to-Peak of maximum rated voltage",
          "Regulation": "Line: 0.01%, Load: 0.01% for full load sweep",
          "Temperature Coefficient": "50ppm/⁰C",
          "Stability": "≤ 100 ppm/hour after 45 min warm-up",
          "Protections": "Arc fault shutdown, thermal shutdown, filament overcurrent clamp",
          "Mechanical": "Deep potted epoxy resin block, compact industrial layout",
          "Warranty": "One Year Manufacturer Warranty"
        },
        applications: ["Analytical Instrumentation", "Vacuum & Plasma", "General Laboratory", "Inspection & Test Equipment"]
      },
      {
        id: "pulse-dc-15kv",
        name: "Divo-Pulse Fast Switched Power Supply",
        category: "Pulsed DC Power Supplies",
        modelNumber: "DIVO-PULSE-15K",
        voltage: "0 to 15kV Peak",
        current: "0 to 30A Peak",
        power: "2.5kW",
        description: "Fast rise-time pulsed HV source for plasma and semiconductor fabrication applications. Supports variable duty cycles and high frequency remote control signaling.",
        price: 285000,
        currency: "INR",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
        features: [
          "Microsecond switching with variable duty cycle (5% to 95%)",
          "Built-in PLC and digital interface",
          "Automatic arc quench protection block",
          "Forced air cooling with thermal shutdown overrides"
        ],
        specs: {
          "Input Voltage": "415V AC ± 10%, 50 Hz, Three Phase (3-Phase)",
          "Output Voltage Peak": "0 to 15kV Adjustable",
          "Output Current Peak": "0 to 30 A adjustable limits",
          "Duty Cycle": "5% to 95% adjustable at up to 20 kHz pulse rate",
          "Rise Time": "< 1.5 microseconds",
          "Short Circuit Protection": "Instantaneous safety latch-out on plasma arc",
          "Interface": "PLC Input/Output 0-10V, RS-485 Modbus Support",
          "Warranty": "One Year Manufacturer Warranty"
        },
        applications: ["Vacuum & Plasma", "Semiconductor Fabrication", "Research & Academia", "Industrial Processes"]
      },
      {
        id: "custom-oem-system",
        name: "Divotech Custom OEM System",
        category: "Custom / OEM Power Systems",
        modelNumber: "DIVO-OEM-150",
        voltage: "Up to 150kV",
        current: "Custom",
        power: "Up to 50kW",
        description: "Bespoke high voltage engineering tailored for specific OEM requirements and mission-critical applications.",
        price: 0,
        currency: "INR",
        image: "https://images.unsplash.com/photo-159742324403d-ef1dd7d6da10?auto=format&fit=crop&q=80&w=800",
        features: [
          "Custom structural envelope and oil/air/epoxy insulation type",
          "Specialized voltage and current ranges up to 150kV & 50kW",
          "Custom interface (EtherCAT, CANopen, Profibus, etc.)",
          "Made on-site in Hyderabad with complete MSME/DPIIT certified engineering support"
        ],
        specs: {
          "Output Capability": "Up to 150kV Potential, 50kW active load",
          "Insulation Media": "Oil tank, SF6 gas, epoxy cast encapsulation or ambient air depending on layout",
          "Safety Standards": "CE compliance ready, ISO-9001 build, arc protection",
          "Control": "Bespoke digital, analog loop integration",
          "Warranty": "Extensive 2-Year OEM SLA"
        },
        applications: ["Research & Academia", "Industrial Processes", "Vacuum & Plasma", "Semiconductor Fabrication"]
      }
    ];

    const defaultCMS: CMSData = {
      companyName: "Divo Technologies Pvt. Ltd.",
      companyNameShort: "Divotech",
      contactEmail: "Info@divotech.in",
      contactPhone: "+91-40-40048466",
      address: "Plot no 28, House No : 5-5-35/80/1A | Kukatpally Industrial Area | RangaReddydt, | Hyderabad - 500072 Telangana, INDIA",
      statusMessage: "Systems Status: Optimal",
      sliders: [
        {
          title: "Precision High Voltage DC Supplies",
          description: "ER-Series featuring precision regulation, adjustable 0-40kV outputs, air/epoxy insulation, and low arc discharges. Engineered in Hyderabad for continuous B2B duty.",
          image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200",
          accent: "Up to 150kV Excellence"
        },
        {
          title: "Vacuum-Plasma Sputtering Solutions",
          description: "High-stability pulsed DC power supplies featuring fast dual-slope switching and automatic arc quench. Engineered for chemical vapor deposition and semiconductor tooling.",
          image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200",
          accent: "ARC Quench Safeguards"
        },
        {
          title: "Integrated X-Ray Imaging Generators",
          description: "Hermetically encapsulated XRF generators (20kV to 120kV) featuring solid-state potting and digital filament drives for non-destructive inspection systems.",
          image: "https://images.unsplash.com/photo-1516321111749-2ec3915f5486?auto=format&fit=crop&q=80&w=1200",
          accent: "Analytical Integrity"
        },
        {
          title: "Advanced Semiconductor Process Power",
          description: "Extremely quiet power modules with stability under 100ppm and rapid transient feedback. Manufactured inside clean labs supporting global lithography standards.",
          image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=1200",
          accent: "Silicon Wafer Grade Tech"
        },
        {
          title: "Ultra-Low Ripple Capacitor Chargers",
          description: "HCH-Series with rapid dual-resonance charging rates, active safety triggers, and low ripple. Optimized for laser pump chambers, pulsed accelerators, and experimental research grids.",
          image: "https://images.unsplash.com/photo-1631553127988-cb9af36f014e?auto=format&fit=crop&q=80&w=1200",
          accent: "Rapid Resonant Charging Cycles"
        },
        {
          title: "Deep-Oil Tank Sub-Assemblies",
          description: "Bespoke hermetically sealed liquid-dielectric systems for up to 150kV insulation. High reliability under critical high-voltage thermal loads in industrial manufactories.",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
          accent: "Liquid-Dielectric Insulation"
        }
      ]
    };

    const initialDB = {
      products: defaultProducts,
      inquiries: [],
      cms: defaultCMS
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), "utf8");
  }
}

// Ensure execution
initDB();

function getDB() {
  initDB();
  const content = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(content);
}

function saveDB(data: any) {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

export const db = {
  getProducts: (): Product[] => {
    return getDB().products;
  },
  saveProduct: (product: Product): Product => {
    const data = getDB();
    const index = data.products.findIndex((p: any) => p.id === product.id);
    if (index >= 0) {
      data.products[index] = product;
    } else {
      data.products.push(product);
    }
    saveDB(data);
    return product;
  },
  deleteProduct: (id: string): boolean => {
    const data = getDB();
    const initialLen = data.products.length;
    data.products = data.products.filter((p: any) => p.id !== id);
    saveDB(data);
    return data.products.length < initialLen;
  },
  getModels: (): Model[] => {
    const dbData = getDB();
    if (!dbData.models) {
      dbData.models = [
        { id: "regulated-dc", name: "High Voltage Regulated DC Power Supplies", applications: ["Industrial Processes", "Vacuum & Plasma", "Analytical Instrumentation", "Inspection & Test Equipment", "Semiconductor Fabrication", "Research & Academia"] },
        { id: "pulsed-hvps", name: "Pulsed High Voltage Power Supplies (Pulsed HVPS)", applications: ["Vacuum & Plasma", "Semiconductor Fabrication", "Research & Academia"] },
        { id: "ccps", name: "HV Capacitor Charging Power Supplies (CCPS)", applications: ["Research & Academia", "Industrial Processes", "Inspection & Test Equipment"] },
        { id: "sinewave-generators", name: "High Voltage Sinewave Generators", applications: ["Research & Academia", "Vacuum & Plasma"] },
        { id: "x-ray-supplies", name: "X-Ray Power Supplies", applications: ["Analytical Instrumentation", "Inspection & Test Equipment"] },
        { id: "hcps", name: "High Current Power Supplies (HCPS)", applications: ["Industrial Processes", "Research & Academia"] },
        { id: "custom-special", name: "Customised / Special Power Supply Products", applications: ["Industrial Processes", "Vacuum & Plasma", "Research & Academia", "Semiconductor Fabrication", "Inspection & Test Equipment"] }
      ];
      saveDB(dbData);
    }
    return dbData.models;
  },
  saveModel: (model: Model): Model => {
    const data = getDB();
    if (!data.models) {
      data.models = [];
    }
    const index = data.models.findIndex((m: any) => m.id === model.id);
    if (index >= 0) {
      data.models[index] = model;
    } else {
      data.models.push(model);
    }
    saveDB(data);
    return model;
  },
  deleteModel: (id: string): boolean => {
    const data = getDB();
    if (!data.models) return false;
    const initialLen = data.models.length;
    data.models = data.models.filter((m: any) => m.id !== id);
    saveDB(data);
    return data.models.length < initialLen;
  },
  getInquiries: (): Inquiry[] => {
    return getDB().inquiries || [];
  },
  saveInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt">): Inquiry => {
    const data = getDB();
    if (!data.inquiries) {
      data.inquiries = [];
    }
    const newInquiry: Inquiry = {
      ...inquiry,
      id: "inq_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      createdAt: new Date().toISOString()
    };
    data.inquiries.unshift(newInquiry);
    saveDB(data);
    return newInquiry;
  },
  getCMS: (): CMSData => {
    return getDB().cms;
  },
  updateCMS: (cms: CMSData): CMSData => {
    const data = getDB();
    data.cms = { ...data.cms, ...cms };
    saveDB(data);
    return data.cms;
  }
};
