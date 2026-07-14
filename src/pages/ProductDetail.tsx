import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Zap, Shield, Check, ShoppingCart, ArrowLeft, Info, Download } from "lucide-react";
import { useCart } from "../App";
import { motion } from "motion/react";
import { formatProductPrice } from "../utils";

interface Product {
  id: string;
  name: string;
  category: string;
  voltage: string;
  current: string;
  power: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  specs?: Record<string, string>;
  brochureUrl?: string;
  priceType?: "standard" | "range" | "contact";
  priceRangeMin?: number;
  priceRangeMax?: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        priceType: product.priceType,
        priceRangeMin: product.priceRangeMin,
        priceRangeMax: product.priceRangeMax
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const hasPricing = product && product.price > 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Zap className="h-8 w-8 text-blue-600 animate-pulse" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      Product not found
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <Helmet>
        <title>{product.name} | Divo Technologies</title>
        <meta name="description" content={`Detailed technical specifications for Divotech ${product.name} High Voltage device.`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-12 transition-colors uppercase text-xs font-bold tracking-widest bg-white px-4 py-2 border border-slate-100 rounded-lg shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-blue-600" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Column */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-white border border-slate-200 rounded-3xl overflow-hidden p-8 flex items-center justify-center group shadow-sm"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full max-w-full object-cover transition-transform hover:scale-105 duration-500 rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-700/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h4 className="flex items-center gap-2 font-bold mb-6 text-xs uppercase tracking-widest border-b border-white/5 pb-4 text-slate-400">
                <Info className="h-4 w-4 text-blue-500" /> Quick Snapshot
              </h4>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Max Potential</div>
                  <div className="text-xl font-mono text-blue-400">{product.voltage}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Active Power Target</div>
                  <div className="text-xl font-mono text-blue-400">{product.power}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                {product.category}
              </span>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
                S/N: {product.id.split("-").pop()?.toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight italic uppercase tracking-tighter">{product.name}</h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-semibold opacity-90">{product.description}</p>

            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Core Highlights</div>
              <div className="space-y-3">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                    <div className="bg-emerald-500/15 p-1 rounded">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-xs leading-relaxed text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct specs list */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-10 bg-slate-100/50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Full Engineering Specs</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-medium">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-dashed border-slate-200 pb-1.5 text-xs items-center gap-2">
                      <span className="text-slate-400 uppercase text-[9px] font-bold tracking-wider">{key}</span>
                      <span className="text-slate-800 font-semibold text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Commercial Pricing</span>
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {formatProductPrice(product)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-2 rounded-lg.5 border border-emerald-100 uppercase tracking-wider">
                  <Shield className="h-4 w-4 text-emerald-600" /> One Year Standard Warranty
                </div>
              </div>

              {product.brochureUrl && (
                <a 
                  href={product.brochureUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="mb-6 h-12 border border-blue-200 hover:bg-blue-50 bg-blue-50/20 text-blue-750 transition-all rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 w-full shadow-sm"
                >
                  <Download className="h-4 w-4 text-blue-700" /> Download PDF Brochure
                </a>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={`h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all cursor-pointer ${
                    added ? "bg-emerald-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/10"
                  }`}
                >
                  {added ? (
                    <> <Check className="h-5 w-5" /> Added to Inquiry </>
                  ) : (
                    <> <ShoppingCart className="h-5 w-5" /> Add to Quote Cart </>
                  )}
                </button>
                <Link 
                  to="/contact" 
                  className="h-14 border border-slate-200 hover:bg-slate-50 bg-white text-slate-900 transition-all rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2"
                >
                  Submit Specs Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
