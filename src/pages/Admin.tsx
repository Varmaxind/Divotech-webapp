import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Lock, Settings, Users, Database, Globe, Plus, Trash2, Save, 
  RefreshCw, LogOut, FileText, Sparkles, Check, AlertCircle, Eye, 
  MapPin, Phone, Mail, Sliders, Image, Tag, Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Product {
  id: string;
  name: string;
  category: string;
  modelNumber: string;
  voltage: string;
  current: string;
  power: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  specs: Record<string, string>;
  applications: string[];
  brochureUrl?: string;
}

interface Model {
  id: string;
  name: string;
  applications?: string[];
}

interface Inquiry {
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

interface CMSData {
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

const APPLICATION_SECTIONS = [
  "Industrial Processes",
  "Vacuum & Plasma",
  "Analytical Instrumentation",
  "Inspection & Test Equipment",
  "Semiconductor Fabrication",
  "Research & Academia"
];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("admin_token"));
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"inquiries" | "products" | "cms" | "models">("inquiries");
  
  // Data State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [cms, setCms] = useState<CMSData | null>(null);
  
  // UI Loading / Feedback State
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // New Model Form State
  const [newModel, setNewModel] = useState({
    id: "",
    name: "",
    applications: [] as string[]
  });

  // New Product Form State
  const [newProd, setNewProd] = useState({
    id: "",
    name: "",
    category: "",
    modelNumber: "",
    voltage: "",
    current: "",
    power: "",
    description: "",
    price: 0,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    featuresInput: "",
    specsInput: "Input Voltage: 220V AC\nLoad Regulation: < 0.01%\nPolarity: Positive/Negative",
    applications: [] as string[],
    brochureUrl: ""
  });

  // Verify / Load Admin Data
  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [productsRes, inquiriesRes, cmsRes, modelsRes] = await Promise.all([
        fetch("/api/products").then(r => r.json()),
        fetch("/api/admin/inquiries").then(r => {
          if (r.status === 401) {
            localStorage.removeItem("admin_token");
            setToken(null);
            throw new Error("Session expired");
          }
          return r.json();
        }),
        fetch("/api/cms").then(r => r.json()),
        fetch("/api/models").then(r => r.json())
      ]);

      setProducts(productsRes);
      setInquiries(inquiriesRes);
      setCms(cmsRes);
      setModels(modelsRes);

      // Pre-select first category and its applications if category is currently empty
      if (modelsRes && modelsRes.length > 0) {
        setNewProd(prev => {
          if (!prev.category) {
            return {
              ...prev,
              category: modelsRes[0].name,
              applications: modelsRes[0].applications || []
            };
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Admin Load Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
      } else {
        const err = await res.json();
        setLoginError(err.error || "Authentication Failed");
      }
    } catch {
      setLoginError("Could not connect to back-end services.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setSelectedInquiry(null);
  };

  // Create Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.id || !newProd.name) {
      alert("ID and Name are mandatory parameter settings.");
      return;
    }

    // Parse features (one per line)
    const features = newProd.featuresInput
      .split("\n")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    // Parse specifications (Key: Value per line)
    const specs: Record<string, string> = {};
    newProd.specsInput.split("\n").forEach(line => {
      const pts = line.split(":");
      if (pts.length >= 2) {
        const k = pts[0].trim();
        const v = pts.slice(1).join(":").trim();
        if (k && v) specs[k] = v;
      }
    });

    const payload: Product = {
      id: newProd.id.trim().toLowerCase().replace(/\s+/g, "-"),
      name: newProd.name.trim(),
      category: newProd.category || (models.length > 0 ? models[0].name : ""),
      modelNumber: newProd.modelNumber || newProd.id.toUpperCase(),
      voltage: newProd.voltage || "0V",
      current: newProd.current || "0A",
      power: newProd.power || "0W",
      description: newProd.description || "No specifications description provided.",
      price: Number(newProd.price) || 0,
      image: newProd.image || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
      features,
      specs,
      applications: newProd.applications,
      brochureUrl: newProd.brochureUrl ? newProd.brochureUrl.trim() : undefined
    };

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveStatus("Product Saved successfully!");
        setNewProd({
          id: "",
          name: "",
          category: models.length > 0 ? models[0].name : "",
          modelNumber: "",
          voltage: "",
          current: "",
          power: "",
          description: "",
          price: 0,
          image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
          featuresInput: "",
          specsInput: "Input Voltage: 220V AC\nLoad Regulation: < 0.01%\nPolarity: Positive/Negative",
          applications: models.length > 0 ? (models[0].applications || []) : [],
          brochureUrl: ""
        });
        loadAdminData();
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert("Failed to submit system settings");
      }
    } catch {
      alert("Error saving modular product.");
    } finally {
      setLoading(false);
    }
  };

  // Add Category Model Handler
  const handleCreateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.id || !newModel.name) {
      alert("ID and Name are required.");
      return;
    }
    const payload = {
      id: newModel.id.trim().toLowerCase().replace(/\s+/g, "-"),
      name: newModel.name.trim(),
      applications: newModel.applications
    };
    setLoading(true);
    try {
      const res = await fetch("/api/admin/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSaveStatus("Category model saved successfully!");
        setNewModel({ id: "", name: "", applications: [] });
        loadAdminData();
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert("Failed to save category model.");
      }
    } catch {
      alert("Error saving category model.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Category Model Handler
  const handleDeleteModel = async (id: string) => {
    const productsInModel = products.filter(p => p.category.toLowerCase() === id.toLowerCase() || p.category === id);
    if (productsInModel.length > 0) {
      if (!confirm(`Warning: There are ${productsInModel.length} products associated with this category model. Deleting it may leave them uncategorized. Proceed?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete category model "${id}"?`)) return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/models/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSaveStatus("Category model deleted successfully!");
        loadAdminData();
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert("Deletion failed.");
      }
    } catch {
      alert("Error deleting category model.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm(`Are you absolutely sure you want to delete product "${id}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSaveStatus("Deleted product " + id);
        loadAdminData();
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert("Deletion failed.");
      }
    } catch {
      alert("Failed to execute deletion command");
    } finally {
      setLoading(false);
    }
  };

  // Update CMS data
  const handleUpdateCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cms)
      });
      if (res.ok) {
        setSaveStatus("Company CMS settings applied dynamically!");
        loadAdminData();
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert("Failed to update corporate CMS structure.");
      }
    } catch {
      alert("Error syncing corporate CMS config file.");
    } finally {
      setLoading(false);
    }
  };

  const updateCMSField = (field: keyof CMSData, value: any) => {
    if (!cms) return;
    setCms({
      ...cms,
      [field]: value
    });
  };

  const updateSliderField = (index: number, field: string, value: string) => {
    if (!cms) return;
    const newSliders = [...cms.sliders];
    newSliders[index] = {
      ...newSliders[index],
      [field]: value
    };
    setCms({
      ...cms,
      sliders: newSliders
    });
  };

  if (!token) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 flex items-center justify-center px-4 font-sans text-slate-850">
        <Helmet>
          <title>Administrative Sign In | Divo Technologies</title>
        </Helmet>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-[2rem] p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-slate-200">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight italic text-slate-900">SYSTEMS <span className="text-blue-600">CONSOLE</span></h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Divo Technologies B2B Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Administrator Passkey</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4.5 pl-4 pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-center text-lg text-slate-800"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">Use password <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-600 font-mono">divotech2026</code> to log in</p>
            </div>

            {loginError && (
              <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-4 rounded-xl flex items-center gap-2 border border-rose-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full h-14 bg-slate-900 text-white font-extrabold rounded-xl uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-500/5 flex items-center justify-center gap-2"
            >
              Sign In to Terminal &rarr;
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Divotech Administration Portal</title>
      </Helmet>

      {/* Admin Subheader Panel */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-6 sticky top-[80px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-white/5 text-blue-400">
              <Settings className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">HYDERABAD MANUFACTORY CONSOLE</div>
              <h1 className="text-lg font-black uppercase tracking-tight text-white italic">DIVOTECH <span className="text-blue-500">ADMIN CONTROL</span></h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={loadAdminData}
              disabled={loading}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Reload Terminal
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rose-900/40 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border border-rose-900/10"
            >
              <LogOut className="h-4 w-4" /> End Session
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {saveStatus && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-2xl flex items-center gap-2 animate-fade-in shadow-sm">
            <Check className="h-4 w-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Internal Sidebar Selector */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 space-y-2 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 mb-3">Modular Sectors</p>
            
            <button 
              onClick={() => setActiveTab("inquiries")}
              className={`w-full text-left px-4 py-4.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "inquiries" 
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Inbox className="h-5 w-5" /> Client Inquiries
              </span>
              <span className="bg-blue-600/15 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded font-black">
                {inquiries.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab("products")}
              className={`w-full text-left px-4 py-4.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "products" 
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Database className="h-5 w-5" /> Products Matrix
              </span>
              <span className="bg-blue-600/15 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded font-black">
                {products.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab("cms")}
              className={`w-full text-left px-4 py-4.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "cms" 
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Globe className="h-5 w-5" /> Theme & Slides CMS
              </span>
              <span className="bg-emerald-600/10 text-emerald-700 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase font-black">
                Edit
              </span>
            </button>

            <button 
              onClick={() => setActiveTab("models")}
              className={`w-full text-left px-4 py-4.5 rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "models" 
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Sliders className="h-5 w-5" /> Category Models
              </span>
              <span className="bg-blue-600/15 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded font-black">
                {models.length}
              </span>
            </button>

            <div className="pt-6 border-t border-slate-100 mt-6 text-center text-[10px] text-slate-400 uppercase font-black tracking-widest">
              Secure TLS Tunneling Active
            </div>
          </div>

          {/* Core Content Area */}
          <div className="lg:col-span-3">
            
            {/* INQUIRIES PANELS */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 lg:p-10 shadow-sm">
                  <h2 className="text-2xl font-extrabold uppercase tracking-tight italic text-slate-900 mb-2">CLIENT <span className="text-blue-600 font-serif normal-case not-italic">RFQs & Inquiries</span></h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 font-semibold">
                    The following specifications and direct contact inquiries were compiled via the platform with automatic simulation forwards deployed to <code className="bg-slate-100 px-1.5 py-0.5 text-blue-600 font-mono text-xs font-semibold">Info@divotech.in</code>.
                  </p>

                  {inquiries.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center bg-slate-50">
                      <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm font-semibold mb-1">No customer inquiries submitted yet.</p>
                      <p className="text-slate-400 text-xs">Verify by filling the contact form on the home or contact page.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse font-sans">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold tracking-wider">
                            <th className="py-4 px-3">Date</th>
                            <th className="py-4 px-3">Company & Representative</th>
                            <th className="py-4 px-3">Potential Class</th>
                            <th className="py-4 px-3">Industry Domain</th>
                            <th className="py-4 px-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {inquiries.map((inq) => (
                            <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-5 px-3 font-mono text-slate-400 leading-relaxed whitespace-nowrap">
                                {new Date(inq.createdAt).toLocaleDateString("en-IN")}<br/>
                                <span className="text-[10px] text-slate-300">{new Date(inq.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                              </td>
                              <td className="py-5 px-3">
                                <div className="font-bold text-slate-800">{inq.company}</div>
                                <div className="text-slate-500 font-semibold text-[11px] mt-0.5">{inq.name} | {inq.email}</div>
                              </td>
                              <td className="py-5 px-3">
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2 py-1 rounded border border-blue-100">
                                  {inq.voltageRange || "Not Specified"}
                                </span>
                              </td>
                              <td className="py-5 px-3 text-slate-600 font-semibold uppercase text-[11px]">
                                {inq.industry}
                              </td>
                              <td className="py-5 px-2 text-right">
                                <button 
                                  onClick={() => setSelectedInquiry(inq)}
                                  className="p-2.5 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                                >
                                  <Eye className="h-4 w-4" /> <span className="text-[10px] font-bold uppercase tracking-wider">Review Specs</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Selected Inquiry Modal */}
                <AnimatePresence>
                  {selectedInquiry && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white border-2 border-blue-500/25 rounded-[2.5rem] p-8 lg:p-10 shadow-xl relative"
                    >
                      <button 
                        onClick={() => setSelectedInquiry(null)}
                        className="absolute top-6 right-6 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 h-9 w-9 rounded-full flex items-center justify-center font-bold transition-all cursor-pointer"
                      >
                        &times;
                      </button>

                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-blue-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                          Active Specs Sheet
                        </span>
                        <span className="bg-slate-100 text-slate-400 font-mono text-[9px] font-bold px-3 py-1 rounded-full border border-slate-200">
                          ID: {selectedInquiry.id}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 italic border-b border-slate-100 pb-4">
                        Inquiry from <span className="text-blue-600 font-serif normal-case not-italic">{selectedInquiry.company}</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Contract representative</span>
                            <p className="text-sm font-bold text-slate-800">{selectedInquiry.name}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Email Coordinates</span>
                            <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-bold text-blue-600 hover:underline">{selectedInquiry.email}</a>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Contact Telephone</span>
                            <p className="text-sm font-bold text-slate-800 font-mono">{selectedInquiry.phone || "No phone number supplied"}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Client Business Field</span>
                            <span className="inline-block bg-slate-100 px-3 py-1 text-slate-600 font-bold text-xs rounded-lg border border-slate-200 uppercase mt-1">{selectedInquiry.industry}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Requested Potential Voltage</span>
                            <span className="inline-block bg-blue-50 px-3 py-1 text-blue-700 font-black text-xs rounded-lg border border-blue-150 uppercase mt-1">{selectedInquiry.voltageRange || "Not Specified"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest block mb-1">Transmission Timestamp</span>
                            <p className="text-xs font-mono text-slate-500 mt-1">{new Date(selectedInquiry.createdAt).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-150">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-3 border-b border-slate-200 pb-1.5 leading-none">Specifications Pitch & Description</span>
                        <p className="text-slate-700 text-xs font-semibold leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button 
                          onClick={() => setSelectedInquiry(null)}
                          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                        >
                          Acknowledge & Close
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* PRODUCTS SECTOR */}
            {activeTab === "products" && (
              <div className="space-y-8">
                
                {/* Product Add Grid Form */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 lg:p-10 shadow-sm">
                  <h2 className="text-2xl font-extrabold uppercase tracking-tight italic text-slate-900 mb-2">ADD NEW <span className="text-blue-600 font-serif normal-case not-italic">High-Voltage System</span></h2>
                  <p className="text-slate-500 text-xs leading-relaxed mb-8 font-semibold">
                    Submit structural specifications for modular 19" benchtop grids or encapsulated X-ray power devices.
                  </p>

                  <form onSubmit={handleCreateProduct} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Unambiguous Product Key Unique ID</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. divotech-er-60"
                          value={newProd.id}
                          onChange={(e) => setNewProd({...newProd, id: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Commercial Model Title Name</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Divotech ER 60kV Regulated Supply"
                          value={newProd.name}
                          onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Taxonomy Category (Dynamic Models)</label>
                        <select 
                          value={newProd.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            const modelObj = models.find(m => m.name === val || m.id === val);
                            setNewProd({
                              ...newProd,
                              category: val,
                              applications: modelObj?.applications || []
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                        >
                          <option value="">-- Select Dynamic Model --</option>
                          {models.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Commercial Model Tag / Number</label>
                        <input 
                          type="text"
                          placeholder="e.g. ER-60-10"
                          value={newProd.modelNumber}
                          onChange={(e) => setNewProd({...newProd, modelNumber: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold font-mono text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Active Pricing (INR) (Ex-GST)</label>
                        <input 
                          type="number"
                          placeholder="Set to 0 for Custom OEM Quote mode"
                          value={newProd.price}
                          onChange={(e) => setNewProd({...newProd, price: Number(e.target.value)})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Max Potential Potential (Voltage)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 0 to 60kV"
                          value={newProd.voltage}
                          onChange={(e) => setNewProd({...newProd, voltage: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold font-mono text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Peak Current bounds (Current)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 10 mA"
                          value={newProd.current}
                          onChange={(e) => setNewProd({...newProd, current: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold font-mono text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Total Watt Active Load (Power)</label>
                        <input 
                          type="text"
                          placeholder="e.g. 600W"
                          value={newProd.power}
                          onChange={(e) => setNewProd({...newProd, power: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold font-mono text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Core Product Showcase Image URL</label>
                        <input 
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={newProd.image}
                          onChange={(e) => setNewProd({...newProd, image: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Optional PDF Brochure Download URL</label>
                        <input 
                          type="text"
                          placeholder="e.g. /brochures/supply.pdf (or https://...)"
                          value={newProd.brochureUrl}
                          onChange={(e) => setNewProd({...newProd, brochureUrl: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">B2B Product Bio / Overview</label>
                      <textarea 
                        rows={3}
                        placeholder="Detailed pitch explaining circuit insulation media and control dials..."
                        value={newProd.description}
                        onChange={(e) => setNewProd({...newProd, description: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs leading-relaxed text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block mb-1.5">Highlights (One bullet per line)</label>
                        <textarea 
                          rows={4}
                          placeholder="Automatic CV to CC regulation&#10;Integrated Overload interlock protective switches&#10;Local 10-turn dials"
                          value={newProd.featuresInput}
                          onChange={(e) => setNewProd({...newProd, featuresInput: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs leading-relaxed text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block mb-1.5">Full Datasheet Technical Specifications (Key: Value per line)</label>
                        <textarea 
                          rows={4}
                          placeholder="Input Potential: 220V AC ± 10%, 50 Hz&#10;Ripple Factor: ≤0.02% Peak-to-Peak&#10;Insulation style: Deep epoxy vacuum encapsulation"
                          value={newProd.specsInput}
                          onChange={(e) => setNewProd({...newProd, specsInput: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs leading-relaxed text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Linked Industry Applications</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {APPLICATION_SECTIONS.map((appSec) => {
                          const checked = newProd.applications.includes(appSec);
                          return (
                            <label key={appSec} className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${checked ? "bg-blue-50/50 border-blue-200 text-blue-950 font-bold" : "bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100"}`}>
                              <input 
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const nextApps = e.target.checked 
                                    ? [...newProd.applications, appSec]
                                    : newProd.applications.filter(a => a !== appSec);
                                  setNewProd({...newProd, applications: nextApps});
                                }}
                                className="h-4.5 w-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-[11px] leading-none">{appSec}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 h-14 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl uppercase tracking-widest text-[11px] transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center gap-2"
                      >
                        <Plus className="h-5 w-5" /> Enlist Machine Configuration
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Catalog Systems Deck */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 lg:p-10 shadow-sm">
                  <h2 className="text-2xl font-extrabold uppercase tracking-tight italic text-slate-900 mb-6">EXISTING <span className="text-blue-600 font-serif normal-case not-italic">Manufacturing Index</span></h2>
                  
                  <div className="space-y-4">
                    {products.map((prod) => (
                      <div key={prod.id} className="p-5 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between gap-4 flex-wrap hover:border-slate-250 transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                          <img src={prod.image} alt={prod.name} className="h-14 w-14 object-cover rounded-xl bg-white border border-slate-200 shrink-0" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-400 text-[8px] font-bold uppercase tracking-widest">{prod.category}</span>
                            <h4 className="font-extrabold text-slate-900 mt-1 truncate uppercase italic text-sm">{prod.name}</h4>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{prod.voltage} Potential | {prod.power} Power Class</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-[8px] uppercase tracking-widest font-extrabold text-slate-400">Pricing Scale</div>
                            <div className="text-sm font-extrabold text-slate-800">{prod.price > 0 ? `₹${prod.price.toLocaleString("en-IN")}` : "Custom Quote"}</div>
                          </div>
                          
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-3 bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl hover:border-rose-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* COMPANY CMS EDITORS */}
            {activeTab === "cms" && cms && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 lg:p-10 shadow-sm space-y-10">
                <div>
                  <h2 className="text-2xl font-extrabold uppercase tracking-tight italic text-slate-900 mb-2">GENERAL <span className="text-blue-600 font-serif normal-case not-italic">Company Coordinates</span></h2>
                  <p className="text-slate-500 text-xs leading-relaxed mb-8 font-semibold">
                    The fields below populate global parameters, SEO meta tags, footer info lines, and status lights dynamically down the system grid.
                  </p>

                  <form onSubmit={handleUpdateCMS} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Registered Corporate Title Name</label>
                        <input 
                          type="text"
                          required
                          value={cms.companyName}
                          onChange={(e) => updateCMSField("companyName", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Registered Short Branding Key</label>
                        <input 
                          type="text"
                          required
                          value={cms.companyNameShort}
                          onChange={(e) => updateCMSField("companyNameShort", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold font-mono text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Primary Contact Email Address</label>
                        <input 
                          type="email"
                          required
                          value={cms.contactEmail}
                          onChange={(e) => updateCMSField("contactEmail", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold font-mono text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Hyderabad Head Office Telephone</label>
                        <input 
                          type="text"
                          required
                          value={cms.contactPhone}
                          onChange={(e) => updateCMSField("contactPhone", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold font-mono text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Main Office Physical Address</label>
                      <input 
                        type="text"
                        required
                        value={cms.address}
                        onChange={(e) => updateCMSField("address", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Terminal System Status Feed</label>
                      <input 
                        type="text"
                        required
                        value={cms.statusMessage}
                        onChange={(e) => updateCMSField("statusMessage", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                      <h3 className="text-md font-extrabold uppercase tracking-tight text-slate-900 mb-6 italic">Home Screen Hero Sliders Configuration</h3>
                      
                      <div className="space-y-8">
                        {cms.sliders.map((slider, index) => (
                          <div key={index} className="p-6 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                            <span className="bg-slate-900 text-white font-mono text-[9px] font-black px-2.5 py-1 rounded">Slide {index + 1} Settings</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Slide Display Title</label>
                                <input 
                                  type="text"
                                  value={slider.title}
                                  onChange={(e) => updateSliderField(index, "title", e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Display Accent Badge</label>
                                <input 
                                  type="text"
                                  value={slider.accent}
                                  onChange={(e) => updateSliderField(index, "accent", e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Slide Image Vector URL</label>
                              <input 
                                type="text"
                                value={slider.image}
                                onChange={(e) => updateSliderField(index, "image", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs text-slate-800"
                              />
                            </div>

                            <div>
                              <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Slide Text Bio Paragraph</label>
                              <textarea 
                                rows={2}
                                value={slider.description}
                                onChange={(e) => updateSliderField(index, "description", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-850 leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-6">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 h-14 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl uppercase tracking-widest text-[11px] transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex items-center gap-2"
                      >
                        <Save className="h-5 w-5" /> Commit CMS Configuration
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODELS & CATEGORIES MANAGEMENT */}
            {activeTab === "models" && (
              <div className="space-y-8">
                {/* Model/Category Add Form */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 lg:p-10 shadow-sm">
                  <h2 className="text-2xl font-extrabold uppercase tracking-tight italic text-slate-900 mb-2">ADD OR UPDATE <span className="text-blue-600 font-serif normal-case not-italic">Product Category / Model</span></h2>
                  <p className="text-slate-500 text-xs leading-relaxed mb-8 font-semibold">
                    Dynamic categorization of high-voltage models such as modules, racks, CCPS, or customized units.
                  </p>

                  <form onSubmit={handleCreateModel} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Model ID Key (URL Slug)</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. ccps, modules, racks"
                          value={newModel.id}
                          onChange={(e) => setNewModel({...newModel, id: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Model/Category Display Name</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. HV Capacitor Charging Power Supplies (CCPS)"
                          value={newModel.name}
                          onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Link to Application Sections</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {APPLICATION_SECTIONS.map((appSec) => {
                          const checked = newModel.applications.includes(appSec);
                          return (
                            <label key={appSec} className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${checked ? "bg-blue-50/50 border-blue-200 text-blue-950 font-bold" : "bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100"}`}>
                              <input 
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const nextApps = e.target.checked 
                                    ? [...newModel.applications, appSec]
                                    : newModel.applications.filter(a => a !== appSec);
                                  setNewModel({...newModel, applications: nextApps});
                                }}
                                className="h-4.5 w-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-[11px] leading-none">{appSec}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 h-14 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl uppercase tracking-widest text-[11px] transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center gap-2"
                      >
                        <Plus className="h-5 w-5" /> Save Category Model
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Models Index */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 lg:p-10 shadow-sm">
                  <h2 className="text-2xl font-extrabold uppercase tracking-tight italic text-slate-900 mb-6">DYNAMIC <span className="text-blue-600 font-serif normal-case not-italic">Category Models Index</span></h2>
                  
                  <div className="space-y-4">
                    {models.map((model) => (
                      <div key={model.id} className="p-6 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between gap-4 flex-wrap hover:border-slate-250 transition-colors">
                        <div className="min-w-0 flex-1">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-400 text-[8px] font-bold uppercase tracking-widest font-mono">ID: {model.id}</span>
                          <h4 className="font-extrabold text-slate-900 mt-1 uppercase italic text-sm">{model.name}</h4>
                          {model.applications && model.applications.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {model.applications.map(app => (
                                <span key={app} className="bg-blue-50/50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-100/50">
                                  {app}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-medium italic mt-2">No application sections linked.</p>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setNewModel({
                              id: model.id,
                              name: model.name,
                              applications: model.applications || []
                            })}
                            className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteModel(model.id)}
                            className="p-3 bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl hover:border-rose-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
