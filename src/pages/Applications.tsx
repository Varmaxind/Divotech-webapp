import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Zap, Target, Search, FlaskConical, Globe, Hammer, Shield, Sliders } from "lucide-react";
import { Link } from "react-router-dom";

export default function Applications() {
  const sections = [
    {
      title: "Industrial Processes",
      icon: Hammer,
      desc: "Robust performance for harsh continuous operation environments.",
      bullets: ["Electron Beam Welding", "E-Beam Coating", "Electrostatics", "Electrospinning", "Microwave Processing", "Thickness Gauging"],
      keywords: "industrial high voltage power supply, e-beam welding power supply"
    },
    {
      title: "Vacuum & Plasma",
      icon: Zap,
      desc: "Precise energy control with arc detection and quench protection.",
      bullets: ["E-Beam Evaporation", "Ion Sources", "DC Magnetron Sputtering", "Glow Discharge"],
      keywords: "plasma power supply, vacuum high voltage power supply"
    },
    {
      title: "Analytical Instrumentation",
      icon: Search,
      desc: "Low-noise stable supplies for measurement accuracy and beam quality.",
      bullets: ["Scanning Electron Microscopes (SEM)", "Mass Spectrometers", "X-Ray Fluorescence (XRF)", "Microfluidics", "Electrokinetics"],
      keywords: "SEM high voltage power supply, analytical HVPS"
    },
    {
      title: "Inspection & Test Equipment",
      icon: Shield,
      desc: "Safe, accurate, and repeatable testing in qualification systems.",
      bullets: ["Non-Destructive Testing (NDT)", "Hi-Pot Testing", "Dielectric Breakdown", "Capacitor Testing", "TWT Testing"],
      keywords: "hi-pot tester power supply, HV test equipment"
    },
    {
      title: "Semiconductor Fabrication",
      icon: Target,
      desc: "Precision stability and low ripple for advanced wafer processing.",
      bullets: ["Ion Implantation", "Physical Vapor Deposition (PVD)", "Electron Beam Lithography"],
      keywords: "semiconductor HV power supply, PVD power supply"
    },
    {
      title: "Research & Academia",
      icon: FlaskConical,
      desc: "Flexible precision HV supporting advanced scientific lab programs.",
      bullets: ["Particle Accelerators", "Free Electron Lasers", "Neutron Sources", "Marx Generators", "Capacitor Chargers"],
      keywords: "accelerator HVPS, research power supply"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>HV Applications | Divotech Technologies</title>
        <meta name="description" content="Divotech's high voltage systems are used in Industrial, Semiconductor, Medical, and Research sectors. Explore our application specialized solutions." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mb-16">
          <span className="text-blue-700 font-bold text-[10px] uppercase tracking-[0.3em] block mb-4">Application Scenarios</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight uppercase italic tracking-tighter">
            Regulated <span className="text-blue-700">HV DC</span> Power Solutions.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            Divotech’s systems deliver high stability, low ripple, fast response, and long-term reliability for demanding applications requiring precise high voltage control.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col group hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 group-hover:bg-blue-700 group-hover:text-white transition-all flex items-center justify-center rounded-2xl">
                  <section.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight italic">{section.title}</h3>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Specialized Module Area</div>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{section.desc}</p>
              
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex-grow">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Key Applications</div>
                <div className="flex flex-wrap gap-2">
                  {section.bullets.map((b, i) => (
                    <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">{b}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-auto">
                <span>SEO Index: {section.keywords}</span>
                <Link to="/catalog" className="text-blue-700 font-black flex items-center gap-2 hover:translate-x-1 transition-transform group-hover:text-blue-800">
                  Discuss Now &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom CTA */}
        <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-extrabold mb-6 italic tracking-tight">Need a Custom <span className="text-blue-400 font-sans tracking-normal">HV</span> Solution?</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">When standard products do not meet your specific application requirements, Divotech offers bespoke electrical and mechanical designs.</p>
              <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-bold rounded-xl uppercase tracking-widest text-[11px] hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20">
                <Sliders className="h-4 w-4" /> Consult with Our Experts
              </Link>
            </div>
            <div className="hidden lg:flex justify-end gap-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-1 h-32 bg-white/5 rounded-full">
                    <motion.div 
                      animate={{ height: ["0%", "100%", "0%"] }} 
                      transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                      className="w-full bg-blue-500 rounded-full"
                    />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
