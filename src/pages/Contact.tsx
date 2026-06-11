import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Send, CheckCircle2, Factory, Loader2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "", industry: "Research", voltageRange: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("idle");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <Helmet>
        <title>Technical Inquiry | Divotech Technologies</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Request <span className="text-blue-700">Collaboration</span></h1>
            <p className="text-lg text-slate-500 mb-12 font-medium">Whether you need a standard power supply or a custom-engineered X-ray generator, our Hyderabad-based team is ready to assist.</p>
            
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-widest text-slate-400">Our Engineering HQ</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Divotech Bhavan, Industrial Park Phase II<br />
                    Genome Valley, Turkapally<br />
                    Hyderabad, Telangana 500101, India
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-widest text-slate-400">Direct Sales</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Corporate: +91 40 4004 8466<br />
                    Inquiries: sales@divotech.in
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 shadow-xl">
            {status === "success" ? (
              <div className="text-center py-12">
                <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Transmission Received</h3>
                <p className="text-slate-500 mb-10">Our technical team will review your requirements and provide a detailed proforma and datasheet within 24 business hours.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Name"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Corporate Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Email"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Target Voltage (kV)</label>
                    <input 
                      type="text" 
                      value={formData.voltageRange}
                      onChange={(e) => setFormData({...formData, voltageRange: e.target.value})}
                      placeholder="e.g. 30kV"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Industry Sector</label>
                    <select 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    >
                       <option>Research</option>
                       <option>Semiconductor</option>
                       <option>Industrial</option>
                       <option>Medical</option>
                       <option>Environmental</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Organization / Lab</label>
                  <input 
                    type="text" 
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g. BARC, TIFR, Siemens"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Technical Requirements</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Describe your application and precision needs..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  {status === "sending" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Finalize Technical Request</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
