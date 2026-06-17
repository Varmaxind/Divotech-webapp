import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded shadow-lg shadow-blue-500/20">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-base tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                DIVOTECH
              </span>
              <span className="text-[9px] font-bold text-blue-500 tracking-[0.2em] uppercase leading-none mt-0.5">
                Technologies Pvt. Ltd.
              </span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-slate-500 mb-5">
            High Voltage Power Supply manufacturer based in Hyderabad, India. MSME &amp; DPIIT Startup. Made in India.
          </p>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-medium text-slate-500">Systems Status: Optimal</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/about", label: "About Us" },
              { to: "/catalog", label: "Products" },
              { to: "/applications", label: "Applications" },
              { to: "/custom-projects", label: "Custom Projects" },
              { to: "/resources", label: "Resources" },
              { to: "/careers", label: "Careers" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-blue-400 transition-colors font-medium">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-5">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed text-slate-500 font-medium">
                Industrial Park Phase II, Genome Valley<br />
                Turkapally, Hyderabad<br />
                Telangana 500101, India
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <a href="tel:+914040048466" className="hover:text-blue-400 transition-colors font-medium">
                +91 40 4004 8466
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <a href="mailto:info@divotech.in" className="hover:text-blue-400 transition-colors font-medium">
                info@divotech.in
              </a>
            </li>
          </ul>
        </div>

        {/* Certifications */}
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-5">Certifications</h4>
          <ul className="space-y-3 text-sm text-slate-500 font-medium">
            <li>ISO 9001:2015 Compliant</li>
            <li>CE Certified</li>
            <li>MSME Registered</li>
            <li>DPIIT Startup India</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <span>© {new Date().getFullYear()} Divo Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/resources" className="hover:text-blue-400 transition-colors font-bold uppercase tracking-widest">
              Technical Specs
            </Link>
            <Link to="/careers" className="hover:text-blue-400 transition-colors font-bold uppercase tracking-widest">
              Careers
            </Link>
            <span className="font-bold text-slate-500 uppercase tracking-widest">Hyderabad, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
