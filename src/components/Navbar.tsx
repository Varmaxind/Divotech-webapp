import { Link } from "react-router-dom";
import { Zap, ShoppingCart, Menu, X, Box } from "lucide-react";
import { useState } from "react";
import { useCart } from "../App";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group p-2">
              <div className="flex items-center gap-2">
                {/* Precision Engineered High Voltage Emblem */}
                <div className="relative w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:bg-blue-700 transition-all overflow-hidden">
                  <div className="absolute inset-px rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-amber-400 fill-amber-400 drop-shadow-md transform -skew-x-6" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline leading-none">
                    <span className="text-[19px] font-black tracking-tight text-slate-900 uppercase">Divo</span>
                    <span className="text-[19px] font-medium tracking-tight text-blue-600 uppercase">tech</span>
                  </div>
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mt-1">High Voltage Systems</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav - visible on lg screens and up */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/about" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">About Us</Link>
            <Link to="/catalog" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Products</Link>
            <Link to="/applications" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Applications</Link>
            <Link to="/custom-projects" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Custom Systems</Link>
            <Link to="/resources" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Technical Specs</Link>
            <Link to="/careers" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Careers</Link>
            <Link to="/contact" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Contact</Link>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <Link to="/admin" className="text-[10px] font-extrabold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest px-2 py-1 bg-slate-50 rounded border border-slate-100">Portal</Link>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <Link to="/cart" className="relative group p-1">
              <ShoppingCart className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Tablet & Mobile Menu Button - visible below lg */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-1">
              <ShoppingCart className="h-6 w-6 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-0.5 bg-orange-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Content */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 animate-in fade-in slide-in-from-top duration-200">
          <div className="px-4 pt-4 pb-6 space-y-1 sm:px-6">
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wider uppercase border-b border-slate-50">About Us</Link>
            <Link to="/catalog" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wider uppercase border-b border-slate-50">Products & Catalog</Link>
            <Link to="/applications" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wider uppercase border-b border-slate-50">HV Applications</Link>
            <Link to="/custom-projects" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wider uppercase border-b border-slate-50">Custom Systems</Link>
            <Link to="/resources" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wider uppercase border-b border-slate-50">Technical Specs</Link>
            <Link to="/careers" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wider uppercase border-b border-slate-50">Careers</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wider uppercase border-b border-slate-50">Contact Us</Link>
            <div className="pt-4 flex items-center justify-between">
              <Link to="/admin" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-[11px] rounded uppercase tracking-wider border border-slate-200">Admin Portal</Link>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Divotech India</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
