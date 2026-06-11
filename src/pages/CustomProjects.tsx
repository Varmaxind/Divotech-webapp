import { Helmet } from "react-helmet-async";
import { Sliders, Cpu, ShieldCheck, Zap, Cog, Layers } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function CustomProjects() {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Custom HV Solutions | Divotech Technologies</title>
        <meta name="description" content="Divotech provides bespoke high voltage engineering for OEMs. Custom voltage, cooling, and mechanical designs tailored to your mission-critical applications." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-slate-900 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(29,78,216,0.15),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-6 block">Made In Hyderabad, Globally Compatible</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] italic">
            Custom <span className="text-blue-500 font-sans tracking-normal not-italic">HV</span> Engineering.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto">
            Where standard modules fail, our specialized engineering team succeeds. Tailored cooling, peak-performance logic, and mission-hardened components.
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                 <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4">The Differentiator</h2>
                 <h3 className="text-3xl font-bold text-slate-900 leading-tight mb-8">Engineering Without <span className="text-blue-700 italic">Compromise.</span></h3>
                 <p className="text-slate-500 text-sm leading-relaxed mb-8">Divotech excels in creating bespoke HV systems that standard vendors avoid. Our MSME agility allows for faster prototyping and deeper technical collaboration.</p>
                 <Link to="/contact" className="text-xs font-bold text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-blue-700 hover:border-blue-700 transition-all uppercase tracking-widest">Discuss Your Project</Link>
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { icon: Sliders, title: "Custom Voltage/Current", desc: "Precise ranges up to 150kV and multi-kilowatt power densities designed specifically for your system rails." },
                   { icon: ShieldCheck, title: "Cooling & Insulation", desc: "Specialized Water, Oil, and Air cooling solutions for high-density electronic modules in specialized enclosures." },
                   { icon: Cog, title: "Mechanical Flexibility", desc: "Custom rack-mount, PCB-mount, or standalone shielded canisters tailored to fit your existing hardware footprint." },
                   { icon: Layers, title: "OEM Confidentiality", desc: "Dedicated production lines and confidentiality assurance for Tier-1 industrial and medical system integrators." }
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-slate-50 p-2.5 rounded-lg w-fit mb-6 text-slate-400"><item.icon className="h-5 w-5" /></div>
                      <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Case Studies Placeholder */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Case Studies</h3>
              <h4 className="text-3xl font-bold text-slate-900">Proven Technical Milestones</h4>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { title: "Pulse Gen for Semiconductor", status: "Completed 2023", desc: "A custom 10kV nanosecond pulse generator designed for an OEM client's advanced etching process." },
                { title: "Modular X-Ray Rack", status: "Ongoing Program", desc: "Multi-channel kV system for high-throughput airport security scanners with Ethernet redundancy." }
              ].map((caseStudy, i) => (
                <div key={i} className="group relative rounded-3xl overflow-hidden aspect-video bg-slate-900">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-159742324403d-ef1dd7d6da10?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30 grayscale group-hover:scale-105 transition-transform duration-700"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                   <div className="absolute bottom-10 left-10 right-10">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{caseStudy.status}</span>
                      <h5 className="text-2xl font-bold text-white mt-4 mb-2">{caseStudy.title}</h5>
                      <p className="text-slate-400 text-sm italic">{caseStudy.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
