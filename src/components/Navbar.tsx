import { Link, NavLink } from "react-router-dom";
import { Zap, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../App";

const navLinks = [
  { to: "/about", label: "About Us" },
  { to: "/catalog", label: "Products" },
  { to: "/applications", label: "Applications" },
  { to: "/custom-projects", label: "Custom" },
  { to: "/resources", label: "Resources" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[11px] font-bold transition-colors uppercase tracking-widest ${
      isActive ? "text-blue-700" : "text-slate-500 hover:text-blue-700"
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded shadow-lg shadow-blue-500/20">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors leading-none">
                DIVOTECH
              </span>
              <span className="text-[9px] font-bold text-blue-700 tracking-[0.2em] uppercase leading-none mt-0.5">
                Technologies Pvt. Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
            <div className="h-4 w-px bg-slate-200 mx-2" />
            <Link to="/cart" className="relative group" aria-label="Cart">
              <ShoppingCart className="h-5 w-5 text-slate-400 group-hover:text-blue-700 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/cart" className="relative" aria-label="Cart" onClick={() => setIsOpen(false)}>
              <ShoppingCart className="h-6 w-6 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-1"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — full-screen overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto border-t border-slate-100">
          <div className="px-6 py-8 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between py-4 text-base font-bold border-b border-slate-50 transition-colors uppercase tracking-wider ${
                    isActive ? "text-blue-700" : "text-slate-700 hover:text-blue-700"
                  }`
                }
              >
                {label}
                <span className="text-slate-300 text-xl font-light">›</span>
              </NavLink>
            ))}

            {/* Mobile CTA */}
            <div className="pt-8 space-y-3">
              <Link
                to="/catalog"
                onClick={() => setIsOpen(false)}
                className="block w-full py-4 bg-slate-900 text-white text-center font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors"
              >
                View Products
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full py-4 bg-blue-700 text-white text-center font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-blue-800 transition-colors"
              >
                Contact Us
              </Link>
            </div>

            <div className="pt-8 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Divo Technologies Pvt. Ltd.
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Hyderabad, Telangana, India</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
