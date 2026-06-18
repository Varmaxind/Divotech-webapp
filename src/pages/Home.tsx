import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, Cpu, Globe, ArrowRight, Play, Server, Layers, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import AIConsultant from "../components/AIConsultant";

const defaultSlides = [
  {
    title: "Precision High Voltage DC Power Supplies",
    description: "ER-Series featuring precision regulation, adjustable up to 150kV outputs, air/epoxy isolation, and low arc discharges. Engineered for continuous industrial, laboratory, and B2B duty.",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200",
    accent: "Up to 150kV Engineering Excellence"
  },
  {
    title: "Vacuum & Thin-Film Sputtering",
    description: "High-frequency pulsed DC power supplies featuring fast dual-slope switching and automatic arc quench protection loops. Ideal for physical vapor deposition and plasma CVD tooling.",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200",
    accent: "CV/CC Automatic Crossover"
  },
  {
    title: "Integrated X-Ray Imaging Generators",
    description: "Hermetically encapsulated XRF sources and generators (20kV to 120kV) featuring solid-state epoxy potting, low ripple, and digital filament management for high-precision radiography.",
    image: "https://images.unsplash.com/photo-1516321111749-2ec3915f5486?auto=format&fit=crop&q=80&w=1200",
    accent: "Analytical High-Stability Units"
  },
  {
    title: "Silicon Wafer Ion Implantation",
    description: "Bespoke semiconductor processing power units with under 100ppm stability, ultra-low electromagnetic interference, rapid transient recovery loops, and PLC interfacing.",
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=1200",
    accent: "Semiconductor Grade Clean Designs"
  },
  {
    title: "Ultra-Low Ripple Capacitor Chargers",
    description: "HCH-Series with rapid dual-resonance charging rates, active safety triggers, and low ripple. Optimized for laser pump chambers, pulsed accelerators, and experimental research grids.",
    image: "https://images.unsplash.com/photo-1631553127988-cb9af36f014e?auto=format&fit=crop&q=80&w=1200",
    accent: "Rapid Resonant Charging Cycles"
  },
  {
    title: "Deep-Oil Tank Sub-Assemblies",
    description: "Bespoke hermetically sealed liquid-dielectric systems for up to 150kV insulation. High reliability under critical high-voltage thermal loads in industrial manufactories.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
    accent: "Liquid-Dielectric Insulation"
  }
];

export default function Home() {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Fetch dynamic, database-configured sliders from server if active
    fetch("/api/cms")
      .then(r => r.json())
      .then(data => {
        if (data && data.sliders && data.sliders.length > 0) {
          setSlides(data.sliders);
        }
      })
      .catch(() => { /* fallback to static defaultSlides on network lag */ });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative">
      <Helmet>
        <title>Divo Technologies | Regulated High Voltage DC Supplies & X-Ray Sources</title>
        <meta name="description" content="Leading Indian B2B manufacturer of regulated high voltage DC power supplies and encapsulated X-ray generators. Precision engineering based in Hyderabad." />
      </Helmet>

      {/* Hero Animated Sliding Banner Section */}
      <section className="relative min-h-[85vh] bg-slate-900 overflow-hidden flex items-center pt-10">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/75 to-transparent z-10"></div>
        
        {/* Sliding Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={slides[current].image}
              alt={slides[current].title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.55, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Slide Content */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold rounded-full mb-6 tracking-widest uppercase">
                    <Zap className="h-3 w-3 animate-pulse" /> {slides[current].accent}
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight uppercase italic tracking-tighter">
                    {slides[current].title.split(" ").map((word, i, arr) => (
                      <span key={i}>
                        {i === arr.length - 2 || i === arr.length - 1 ? (
                          <span className="text-blue-500 font-sans tracking-normal not-italic">{word} </span>
                        ) : (
                          <span>{word} </span>
                        )}
                      </span>
                    ))}
                  </h1>
                  
                  <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed font-medium">
                    {slides[current].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link to="/catalog" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-500/10 transition-all uppercase tracking-widest text-[11px] shrink-0">
                  Products & Specifications <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[11px]">
                  Custom Engineering Consult
                </Link>
              </div>
            </div>

            {/* Quick Spec Preview Card / Visualizer */}
            <div className="hidden lg:block lg:col-span-4 bg-slate-950/70 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-4">Manufacturer Directory</div>
              <div className="text-lg font-bold text-white mb-1">Divo Technologies Pvt. Ltd.</div>
              <div className="text-xs font-semibold text-slate-400 mb-6">Hyderabad, India</div>
              
              <div className="space-y-4 border-t border-white/5 pt-4">
                {[
                  { name: "Input Voltage", val: "1-Phase, 3-Phase & 24V DC" },
                  { name: "Max Voltage", val: "150,000 V (150kV)" },
                  { name: "Insulation Media", val: "SF6 Gas / Resin cast / Oil tank" },
                  { name: "Status Indicator", val: "Systems Operating Optimally", dot: "bg-green-500" }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">{row.name}</span>
                    <span className="text-slate-200 font-mono font-bold flex items-center gap-1.5">
                      {row.dot && <div className={`w-2 h-2 rounded-full ${row.dot} animate-pulse`} />}
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Controls & Indicators */}
          <div className="mt-12 flex justify-between items-center border-t border-white/15 pt-6 relative z-30">
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-blue-500 w-10" : "bg-white/20 hover:bg-white/40 w-2.5"}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handlePrev} className="w-10 h-10 bg-white/5 border border-white/15 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={handleNext} className="w-10 h-10 bg-white/5 border border-white/15 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators / Counters */}
      <section className="py-16 bg-white border-y border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12">
            {[
              { label: "Est. Year", value: "2015" },
              { label: "Products Delivered", value: "1200+" },
              { label: "Happy Clients", value: "250+" },
              { label: "Custom Projects", value: "85+" },
              { label: "Max Potential", value: "150kV" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-20 px-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Core Expertise</h2>
            <div className="h-px flex-1 mx-8 bg-slate-200/50"></div>
            <Link to="/catalog" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-colors">Full Range &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "HV DC Power Supplies", desc: "Regulated precision sources from 100V to 150kV with ultra-low ripple performance." },
              { icon: Cpu, title: "Pulsed DC & Sinewave", desc: "Fast rise-time switching modules for selective plasma and grid applications." },
              { icon: Globe, title: "X-Ray Generators", desc: "Integrated high-stability imaging sources for NDT and medical diagnostic systems." },
              { icon: ShieldCheck, title: "Arc Detection & Quench", desc: "Advanced protection logic ensuring safety for vacuum and plasma processes." },
              { icon: Cpu, title: "Liquid Cooled Systems", desc: "Thermal management for high-density power systems (Water/Oil cooled)." },
              { icon: Zap, title: "Custom OEM Design", desc: "Tailored electrical and mechanical engineering for specific B2B volume production." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group shadow-sm">
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg mb-6 group-hover:bg-blue-700 group-hover:text-white transition-all">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hyderabad Manufacturing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-video bg-slate-100 relative group overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200" 
                  alt="Manufacturing Facility"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-16 w-16 text-white fill-white" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Our Hub: Hyderabad</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">Advanced Manufacturing in the Heart of India</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Operating out of Kukatpally Industrial Area, our R&D facility is staffed with leading electrical engineers pushing the boundaries of miniaturization and isolation technology. Being in Hyderabad allows us to provide rapid on-site support across the nation.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-500 font-medium text-sm"><Zap className="h-4 w-4 text-blue-700" /> High-speed PCB prototyping</li>
                <li className="flex items-center gap-3 text-slate-500 font-medium text-sm"><Zap className="h-4 w-4 text-blue-700" /> Dedicated HV testing laboratory</li>
                <li className="flex items-center gap-3 text-slate-500 font-medium text-sm"><Zap className="h-4 w-4 text-blue-700" /> Clean room assembly for medical units</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AIConsultant />
    </div>
  );
}
