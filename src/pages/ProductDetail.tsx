import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Zap, Shield, Check, ShoppingCart, ArrowLeft, Info, Download } from "lucide-react";
import { useCart } from "../App";
import { motion } from "motion/react";

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
      .then(res => res.json())
      .then(data => {
        setProduct(data);
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
        image: product.image
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Zap className="h-8 w-8 text-amber-500 animate-pulse" />
  </div>;

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Product not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <Helmet>
        <title>{product.name} | Vidyut HV Systems</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-12 transition-colors uppercase text-xs font-bold tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
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
                className="max-h-full max-w-full object-contain filter grayscale transition-transform hover:scale-105 duration-500"
              />
            </motion.div>
            
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-700/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h4 className="flex items-center gap-2 font-bold mb-6 text-xs uppercase tracking-widest border-b border-white/5 pb-4 text-slate-400">
                <Info className="h-4 w-4 text-blue-500" /> Technical Parameters
              </h4>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Max Potential</div>
                  <div className="text-xl font-mono text-blue-400">{product.voltage}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Active Power</div>
                  <div className="text-xl font-mono text-blue-400">{product.power}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
                S/N: {product.id.split("-").pop()?.toUpperCase()}
              </span>
            </div>

            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">{product.name}</h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed italic font-serif opacity-80">{product.description}</p>

            <div className="space-y-4 mb-10">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="bg-green-500/10 p-1 rounded">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Commercial Price (Ex-GST)</span>
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-3 py-2 rounded-lg">
                  <Shield className="h-4 w-4" /> 2 Year Standard Warranty
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-grow h-14 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
                    added ? "bg-green-600 text-white" : "bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-500/20"
                  }`}
                >
                  {added ? (
                    <> <Check className="h-5 w-5" /> Added to Order </>
                  ) : (
                    <> <ShoppingCart className="h-5 w-5" /> Initiate Order </>
                  )}
                </button>
                <button className="h-14 border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-colors rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" /> Data Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
