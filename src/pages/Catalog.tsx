import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Filter, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface Product {
  id: string;
  name: string;
  category: string;
  voltage: string;
  price: number;
  image: string;
  description: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Helmet>
        <title>Product Catalog | Vidyut HV Systems</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tight">Technical <span className="text-amber-600 italic font-serif">Catalog</span></h1>
            <p className="text-slate-600 max-w-xl">Browse our complete range of high-voltage solutions optimized for industrial reliability and precision.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search specifications or models..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl h-[450px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-100 rounded-2xl flex flex-col group cursor-pointer shadow-sm hover:border-blue-200 ring-1 ring-transparent hover:ring-blue-100 transition-all"
              >
                <div className="aspect-square bg-slate-50 rounded-xl m-4 flex items-center justify-center overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale brightness-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/80 backdrop-blur-md text-slate-900 text-[9px] font-bold px-2 py-1 rounded shadow-sm border border-slate-100 uppercase tracking-widest">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="px-5 pb-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 mb-6 line-clamp-1">{product.voltage} Module | Precision Power</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Price</span>
                      <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString("en-IN")}</span>
                    </div>
                    <Link 
                      to={`/product/${product.id}`}
                      className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-700 hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
            <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No components found matching your technical search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
