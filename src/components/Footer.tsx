import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 px-8 py-6 text-slate-500 font-medium">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-[11px]">
          <span className="font-bold text-slate-900 pr-4">DIVOTECH TECHNOLOGIES</span>
          <span>© 2024 Divo Technologies Pvt. Ltd.</span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 
            Systems Status: Optimal
          </span>
          <span>ISO 9001:2015 & CE Certified</span>
        </div>
        
        <div className="flex items-center gap-6 text-[11px]">
          <Link to="/careers" className="hover:text-blue-700 uppercase tracking-widest transition-colors font-bold">Careers</Link>
          <Link to="/resources" className="hover:text-blue-700 uppercase tracking-widest transition-colors font-bold">Technical Specs</Link>
          <div className="hidden md:block w-px h-3 bg-slate-200"></div>
          <span className="text-slate-900 font-bold uppercase tracking-widest">Hyderabad, Telangana, India</span>
        </div>
      </div>
    </footer>
  );
}
