import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Zap, Target, Search, FlaskConical, Hammer, Shield, Sliders, ArrowRight, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  voltage: string;
  price: number;
  image: string;
  applications: string[];
}

export default function Applications() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sections = [
    {
      title: "Industrial Processes",
      icon: Hammer,
      desc: "Robust voltage sources for heavy duty B2B environments. Built to last with forced air grids.",
      bullets: ["Electron Beam Welding", "E-Beam Coating", "Electrostatics", "Electrospinning", "Thickness Gauging"],
      keywords: "industrial high voltage power supply, e-beam welding power supply"
    },
    {
      title: "Vacuum & Plasma",
      icon: Zap,
      desc: "Precise energy delivery with robust arc quench and automatic switch crossover regulators.",
      bullets: ["E-Beam Evaporation", "Ion Sources", "DC Magnetron Sputtering", "Glow Discharge"],
      keywords: "plasma power supply, vacuum high voltage power supply"
    },
    {
      title: "Analytical Instrumentation",
      icon: Search,
      desc: "Ultra-low-noise stable high potential generators optimized for inspection and scientific testing.",
      bullets: ["Scanning Electron Microscopes (SEM)", "Mass Spectrometers", "X-Ray Fluorescence (XRF) Scan"],
      keywords: "SEM high voltage power supply, analytical HVPS"
    },
    {
      title: "Inspection & Test Equipment",
      icon: Shield,
      desc: "Repeatable safety grids and diagnostics for insulation breakdown and NDT laboratories.",
      bullets: ["Non-Destructive Testing (NDT)", "Hi-Pot Testing", "Dielectric Breakdown", "Capacitor Testing"],
      keywords: "hi-pot tester power supply, HV test equipment"
    },
    {
      title: "Semiconductor Fabrication",
      icon: Target,
      desc: "Precision stability (under 100ppm error bounds) and low ripple for advanced wafer-level lithography.",
      bullets: ["Ion Implantation", "Physical Vapor Deposition (PVD)", "Electron Beam Lithography"],
      keywords: "semiconductor HV power supply, PVD power supply"
    },
    {
      title: "Research & Academia",
      icon: FlaskConical,
      desc: "Bespoke, flexible laboratory configurations for high energy university accelerator designs.",
      bullets: ["Particle Accelerators", "Free Electron Lasers", "Marx Generators", "Capacitor Chargers"],
      keywords: "accelerator HVPS, research power supply"
    }
  ];

  // Helper to find matching products case-insensitively
  const getMatchingProducts = (sectionTitle: string) => {
    const normalizedTitle = sectionTitle.toLowerCase().replace(/[^a-z]/g, "");
    return products.filter(p => {
      if (!p.applications) return false;
      return p.applications.some(app => 
        app.toLowerCase().replace(/[^a-z]/g, "") === normalizedTitle
      );
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>HV Applications | Divo Technologies</title>
        <meta name="description" content="Explore how Divo Technologies High Voltage products map to Industrial, Semiconductor, Medical, X-Ray, and Advanced scientific research applications." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mb-16">
          <span className="text-blue-700 font-bold text-[10px] uppercase tracking-[0.3em] block mb-4">Application Matrix</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight uppercase italic tracking-tighter">
            HV Solutions <span className="text-blue-700">By Industry</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-semibold">
            Divo Technologies manufactures high voltage systems specifically mapped to key industrial, manufacturing, and laboratory workflows. See our compatible systems below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {sections.map((section, idx) => {
            const matchedSystems = getMatchingProducts(section.title);
            
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group hover:border-blue-250 hover:shadow-md transition-all duration-305"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center rounded-2xl shrink-0">
                    <section.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">{section.title}</h3>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Divo Integrated Area</div>
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{section.desc}</p>
                
                <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Sub-Sectors Covered</div>
                  <div className="flex flex-wrap gap-2">
                    {section.bullets.map((b, i) => (
                      <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-100 shadow-sm">{b}</span>
                    ))}
                  </div>
                </div>

                {/* Dynamic Compatible Products Mapping */}
                <div className="mb-8">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers className="h-3 w-3 text-blue-600" /> Compatible Divotech Systems ({matchedSystems.length})
                  </div>
                  {loading ? (
                    <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
                  ) : matchedSystems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchedSystems.map(prod => (
                        <Link 
                          key={prod.id} 
                          to={`/product/${prod.id}`}
                          className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 rounded-xl transition-all hover:border-blue-200"
                        >
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-10 h-10 object-cover rounded-lg bg-white border border-slate-150 shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">{prod.name}</div>
                            <div className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5">{prod.voltage} Module</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl italic font-medium">
                      Bespoke system required. Contact us to configure or draft specs.
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-auto border-t border-slate-50 pt-6">
                  <span className="hidden sm:inline">Index: {section.keywords.split(",")[0]}</span>
                  <Link to="/contact" className="text-blue-600 font-black flex items-center gap-2 hover:translate-x-1 transition-transform group-hover:text-blue-700">
                    Get Application Quote &rarr;
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom B2B CTA */}
        <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-extrabold mb-6 italic tracking-tight uppercase">Custom <span className="text-blue-400 font-sans tracking-normal not-italic">HV</span> Spec Design</h3>
              <p className="text-slate-400 text-base leading-relaxed mb-8 font-medium">When standard modules do not satisfy your specific environmental, mechanical, or electrical constraints, our Hyderabad R&D lab drafts custom drawings.</p>
              <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10">
                <Sliders className="h-4 w-4" /> Consult with R&D Engineers
              </Link>
            </div>
            <div className="hidden lg:flex justify-end gap-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-1 h-32 bg-white/5 rounded-full">
                    <motion.div 
                      animate={{ height: ["0%", "100%", "0%"] }} 
                      transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                      className="w-full bg-blue-500 rounded-full"
                    />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
