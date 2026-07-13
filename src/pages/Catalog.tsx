import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Filter, ArrowRight, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { formatProductPrice } from "../utils";

interface Product {
  id: string;
  name: string;
  category: string;
  voltage: string;
  price: number;
  image: string;
  description: string;
  specs?: Record<string, string>;
  brochureUrl?: string;
  priceType?: "standard" | "range" | "contact";
  priceRangeMin?: number;
  priceRangeMax?: number;
}

interface Model {
  id: string;
  name: string;
  applications?: string[];
}

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputFilter, setInputFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(res => res.json()),
      fetch("/api/models").then(res => res.json())
    ]).then(([productsData, modelsData]) => {
      setProducts(productsData);
      setModels(modelsData);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (inputFilter === "all") return true;
    
    const inputVoltage = p.specs?.["Input Voltage"] || "";
    if (inputFilter === "single-phase") {
      return inputVoltage.toLowerCase().includes("single phase") || inputVoltage.toLowerCase().includes("1-phase");
    }
    if (inputFilter === "three-phase") {
      return inputVoltage.toLowerCase().includes("three phase") || inputVoltage.toLowerCase().includes("3-phase");
    }
    if (inputFilter === "24v-dc") {
      return inputVoltage.toLowerCase().includes("24v dc") || inputVoltage.toLowerCase().includes("24vdc");
    }
    
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Helmet>
        <title>Product Catalog | Divo Technologies</title>
        <meta name="description" content="Explore our catalog of high voltage products including regulated DC supplies, pulsed high voltage converters, and encapsulated X-ray sources." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tight">Technical <span className="text-blue-700 italic">Catalog</span></h1>
            <p className="text-slate-600 max-w-xl">Browse our complete range of high-voltage solutions optimized for industrial reliability, lab research, and extreme precision.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search specifications or models..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Input Voltage Specification Guide */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-1">Power Input Configurator</span>
              <h3 className="text-base font-bold text-slate-800">Filter by Manufacturing Supply Voltages</h3>
              <p className="text-xs text-slate-500 mt-1">Our products are custom built for local and international grids supporting Single Phase, Three Phase AC, or continuous 24V DC battery bus line inputs.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setInputFilter("all")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${inputFilter === "all" ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15" : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"}`}
              >
                All Inputs
              </button>
              <button 
                onClick={() => setInputFilter("single-phase")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${inputFilter === "single-phase" ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15" : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"}`}
              >
                Single Phase (220V)
              </button>
              <button 
                onClick={() => setInputFilter("three-phase")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${inputFilter === "three-phase" ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15" : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"}`}
              >
                Three Phase (415V)
              </button>
              <button 
                onClick={() => setInputFilter("24v-dc")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${inputFilter === "24v-dc" ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15" : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"}`}
              >
                24V DC Bus
              </button>
            </div>
          </div>
        </div>


        {(() => {
          // Group products by category/model
          const groupedProducts = models.reduce((acc, model) => {
            const modelProducts = filtered.filter(p => 
              p.category.toLowerCase() === model.name.toLowerCase() || 
              p.category.toLowerCase() === model.id.toLowerCase()
            );
            if (modelProducts.length > 0) {
              acc.push({
                id: model.id,
                name: model.name,
                products: modelProducts
              });
            }
            return acc;
          }, [] as Array<{ id: string; name: string; products: Product[] }>);

          // Catch any filtered products whose category didn't match any of the models
          const matchedProductIds = new Set(groupedProducts.flatMap(g => g.products.map(p => p.id)));
          const unmatchedProducts = filtered.filter(p => !matchedProductIds.has(p.id));

          if (unmatchedProducts.length > 0) {
            // Group unmatched products by their category field
            const extraGroups: Record<string, Product[]> = {};
            unmatchedProducts.forEach(p => {
              const cat = p.category || "Other Power Products";
              if (!extraGroups[cat]) extraGroups[cat] = [];
              extraGroups[cat].push(p);
            });
            Object.entries(extraGroups).forEach(([catName, prods]) => {
              groupedProducts.push({
                id: catName.toLowerCase().replace(/\s+/g, "-"),
                name: catName,
                products: prods
              });
            });
          }

          if (loading) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl h-[450px] animate-pulse" />
                ))}
              </div>
            );
          }

          if (groupedProducts.length > 0) {
            return (
              <div className="space-y-16">
                {groupedProducts.map((group, groupIdx) => (
                  <div key={group.id} className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                      <div className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                      <h2 className="text-xl font-extrabold text-slate-900 uppercase italic tracking-tight">{group.name}</h2>
                      <span className="ml-auto bg-slate-100 text-slate-500 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 uppercase">
                        {group.products.length} {group.products.length === 1 ? "System" : "Systems"}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {group.products.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="bg-white border border-slate-100 rounded-2xl flex flex-col group cursor-pointer shadow-sm hover:border-blue-200 hover:shadow-md ring-1 ring-transparent hover:ring-blue-100 transition-all duration-300"
                        >
                          <div className="aspect-square bg-slate-50 rounded-xl m-4 flex items-center justify-center overflow-hidden relative">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover grayscale brightness-110 group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3 max-w-[85%]">
                              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[8px] font-extrabold px-2 py-1 rounded shadow-sm border border-slate-100 uppercase tracking-wider block truncate">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="px-5 pb-5 flex flex-col flex-grow">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase italic tracking-tight">{product.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-1 mb-3 line-clamp-1 font-semibold uppercase tracking-wider">{product.voltage} Module | Precision Power</p>
                            
                            {product.specs?.["Input Voltage"] && (
                              <div className="mb-4 bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                <Zap className="h-3 w-3 text-blue-600 fill-blue-100 shrink-0" />
                                <span className="text-[9px] text-blue-700 font-extrabold uppercase tracking-wide truncate">
                                  Input: {product.specs["Input Voltage"]}
                                </span>
                              </div>
                            )}

                            <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                              <div className="flex flex-col">
                                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Pricing</span>
                                <span className="text-base font-extrabold text-slate-900">
                                  {formatProductPrice(product)}
                                </span>
                              </div>
                              <Link 
                                to={`/product/${product.id}`}
                                className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
              <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No components found matching your technical search.</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
