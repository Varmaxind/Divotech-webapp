import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Shield, Zap, Target, Factory, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>About Us | Divotech Technologies</title>
        <meta name="description" content="Divotech is a premier high voltage manufacturer in Hyderabad, India. MSME and DPIIT Startup focusing on precision power electronics since 2015." />
      </Helmet>

      {/* Hero */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-700 font-bold text-[10px] uppercase tracking-widest block mb-4">The Divotech Story</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 leading-tight italic">
                Engineering <span className="text-blue-700">Power</span> Integrity.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Founded in 2015, Divo Technologies Pvt. Ltd. (Divotech) has emerged as a key Indian specialist in High Voltage & High Current power solutions. Based in Hyderabad's industrial corridor, we bridge the gap between global precision standards and local manufacturing agility.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <Shield className="h-5 w-5 text-blue-700 mb-2" />
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-sm font-bold text-slate-900">DPIIT / MSME Startup</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <Award className="h-5 w-5 text-blue-700 mb-2" />
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quality</div>
                  <div className="text-sm font-bold text-slate-900">ISO 9001 Compliant</div>
                </div>
              </div>
            </div>
            <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200" 
                alt="Divotech Facility"
                className="w-full h-full object-cover grayscale brightness-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-slate-900 p-12 rounded-3xl text-white relative overflow-hidden">
               <Target className="h-12 w-12 text-blue-400 mb-8" />
               <h3 className="text-2xl font-bold mb-6 italic tracking-tight">Our Vision</h3>
               <p className="text-slate-400 text-lg leading-relaxed">To become the global benchmark for Indian-made high voltage systems through consistent innovation and engineering excellence.</p>
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>
            <div className="bg-blue-700 p-12 rounded-3xl text-white relative overflow-hidden">
               <Zap className="h-12 w-12 text-white mb-8" />
               <h3 className="text-2xl font-bold mb-6 italic tracking-tight">Our Mission</h3>
               <p className="text-blue-100 text-lg leading-relaxed">Empowering scientific and industrial sectors with robust, mission-critical power conversion solutions tailored for local conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Bullets */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">Core Strengths</h2>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Why OEMs Partner with Divotech</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "HV Specialists", desc: "Experts in High Voltage & High Current supply design." },
                { title: "Dynamic Range", desc: "Output capabilities from 1W to 50kW+, up to 130kV DC." },
                { title: "OEM Focus", desc: "Long-term partnership philosophy for vendor qualification." },
                { title: "Hyd Hub", desc: "Comprehensive design & manufacturing in Hyderabad, India." }
              ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 bg-blue-50 text-blue-700 flex items-center justify-center rounded-lg mb-6 font-bold text-xs">{i+1}</div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-tight">{s.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
           <h3 className="text-2xl font-bold text-slate-900 mb-8 italic">Ready to discuss your technical requirement?</h3>
           <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all shadow-lg">Request Consultation</button>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all">Download Brochure</button>
           </div>
        </div>
      </section>
    </div>
  );
}
