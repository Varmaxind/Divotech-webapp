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
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded shadow-lg shadow-blue-500/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">DIVOTECH</span>
                <span className="text-[9px] font-bold text-blue-700 tracking-[0.2em] -mt-1 uppercase">Technologies</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/about" className="text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-widest">About Us</Link>
            <Link to="/catalog" className="text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-widest">Products</Link>
            <Link to="/applications" className="text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-widest">Applications</Link>
            <Link to="/custom-projects" className="text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-widest">Custom</Link>
            <Link to="/resources" className="text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-widest">Resources</Link>
            <Link to="/contact" className="text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-widest">Contact</Link>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <Link to="/cart" className="relative group">
              <ShoppingCart className="h-5 w-5 text-slate-400 group-hover:text-blue-700 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/catalog" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900">Catalog</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
