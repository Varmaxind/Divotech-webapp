import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, Cpu, Globe, ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";
import AIConsultant from "../components/AIConsultant";
import { useState, useEffect, useCallback } from "react";

// HV Power Supply application images with captions
const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600",
    caption: "High Voltage DC Power Supplies",
    sub: "Precision regulated sources up to 150kV"
  },
  {
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1600",
    caption: "Industrial Manufacturing Systems",
    sub: "E-Beam welding & plasma process power"
  },
  {
    url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1600",
    caption: "X-Ray Generator Systems",
    sub: "NDT & medical imaging solutions"
  },
  {
    url: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=1600",
    caption: "Analytical Instrumentation",
    sub: "SEM, mass spectrometry & XRF supplies"
  },
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1600",
    caption: "Semiconductor Fabrication",
    sub: "Ion implantation & PVD process power"
  }
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[current].url}
            alt={heroSlides[current].caption}
            className="w-full h-full object-cover brightness-75"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          {/* Caption */}
          <div className="absolute bottom-6 left-6 right-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1"
            >
              {heroSlides[current].sub}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white font-bold text-lg leading-tight"
            >
              {heroSlides[current].caption}
            </motion.h3>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all"
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-5 h-1.5 bg-blue-400" : "w-1.5 h-1.5 bg-white/40"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative">
      <Helmet>
        <title>Divo Technologies Pvt. Ltd. | High Voltage Power Supplies | Made in India</title>
        <meta name="description" content="Leading manufacturer of high voltage power supplies based in Hyderabad. Modular DC-DC converters and X-ray generators developed in India." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-slate-50 overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full mb-6 tracking-widest uppercase border border-blue-100">
                MSME / DPIIT Startup Hub · Hyderabad
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1]">
                Precision High Voltage <span className="text-blue-700">& X-Ray Solutions.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
                Up to 150kV | OEM & Custom Power Systems | Made in India excellence for global innovators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalog" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all uppercase tracking-wider text-xs">
                  Products & Modules
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors uppercase tracking-wider text-xs">
                  Contact HV Experts
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/3] lg:aspect-square w-full"
            >
              <HeroCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators / Counters */}
      <section className="py-16 bg-white border-y border-slate-100">
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
                Operating out of Genome Valley, our R&D facility is staffed with leading electrical engineers pushing the boundaries of miniaturization and isolation technology. Being in Hyderabad allows us to provide rapid on-site support across the nation.
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
