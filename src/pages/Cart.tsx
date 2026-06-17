import { useCart } from "../App";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Trash2, ArrowRight, ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function Cart() {
  const { cart, removeFromCart, total, clearCart } = useCart();

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <Helmet>
        <title>Your Order | Divo Technologies Pvt. Ltd.</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-12 uppercase tracking-tight flex items-center gap-4">
          <ShoppingBag className="h-6 w-6 text-blue-700" /> Procurement <span className="text-blue-700">Orders</span>
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-xl text-slate-500 mb-8 font-medium italic font-serif">No technical components selected for order.</p>
            <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm">
              Explore Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <motion.div 
                  layout
                  key={item.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm"
                >
                  <div className="h-24 w-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain filter grayscale" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">QTY: {item.quantity}</p>
                    <p className="text-slate-900 font-bold mt-2">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
              
              <button 
                onClick={clearCart}
                className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors flex items-center gap-2 px-2"
              >
                Clear All Components
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-32 shadow-xl border border-white/5">
                <h3 className="font-bold mb-8 uppercase text-xs tracking-widest text-slate-400 border-b border-white/10 pb-4">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Merchant Tools</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Shipping (Hyd Hub)</span>
                    <span className="text-green-400 uppercase font-bold text-[10px]">Quote Required</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">GST (18%)</span>
                    <span className="text-slate-200">₹{(total * 0.18).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6 mb-10">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Estimate Total</span>
                    <span className="text-3xl font-bold tracking-tight">₹{(total * 1.18).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Link 
                  to="/contact" 
                  className="w-full h-14 bg-blue-700 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
                >
                  <CreditCard className="h-4 w-4" /> Finalize Purchase
                </Link>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3" /> Secure Export Commercial Gateway
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
