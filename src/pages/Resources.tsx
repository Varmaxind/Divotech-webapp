import { Helmet } from "react-helmet-async";
import { Play, FileText, Lightbulb, ArrowRight, Video } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Resources() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Technical Resources | Divotech Technologies</title>
        <meta name="description" content="Access Divotech's technical blogs, application notes, and video demonstrations. Learn about HV design basics and industrial safety." />
      </Helmet>

      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-700 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Engineering Hub</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 italic tracking-tighter">
            Insights & <span className="text-blue-700">Documentation.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-medium">Explore our collection of expert insights, technical breakdowns, and instructional videos designed for the high-voltage community.</p>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Blog Section */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                 <FileText className="h-4 w-4" /> Technical Blog
               </h2>
               <span className="text-[10px] font-bold text-blue-700 cursor-pointer hover:underline">View All Articles</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { category: "HV Design Basics", title: "How to select a high voltage power supply for analytical apps", date: "May 2024" },
                { category: "System Safety", title: "The importance of Arc Detection in HV Vacuum systems", date: "April 2024" },
                { category: "Thermal Design", title: "Oil vs Water cooling in High Density HV designs", date: "March 2024" },
                { category: "Integration", title: "Common mistakes in HV system integration and grounding", date: "Feb 2024" }
              ].map((blog, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-blue-700 transition-all cursor-pointer group shadow-sm"
                >
                  <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full">{blog.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 mb-4 group-hover:text-blue-700 transition-colors leading-tight">{blog.title}</h3>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 italic text-[11px] text-slate-400">
                    <span>{blog.date}</span>
                    <span className="flex items-center gap-1 text-slate-900 font-bold not-italic font-sans text-[10px] uppercase">Read <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div className="lg:col-span-1 space-y-12">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                 <Video className="h-4 w-4" /> Video Gallery
               </h2>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "HV-DC Precision Module Setup", type: "Demo" },
                { title: "In-House Lab & HV Testing", type: "Facility Walkthrough" }
              ].map((video, i) => (
                <div key={i} className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-slate-200">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 brightness-50 group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-all">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">{video.type}</span>
                    <h4 className="text-white text-xs font-bold mt-1 line-clamp-1">{video.title}</h4>
                  </div>
                </div>
              ))}
              
              <div className="bg-blue-700 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-blue-500/10">
                 <Lightbulb className="h-8 w-8 text-white/50 mb-6" />
                 <h4 className="text-lg font-bold mb-4 tracking-tight leading-tight">Need technical consultation?</h4>
                 <p className="text-blue-100 text-[11px] mb-8 leading-relaxed opacity-80">Our engineering team provides dedicated briefings and design selection guidance.</p>
                 <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest bg-white text-blue-700 px-6 py-2.5 rounded-lg inline-block hover:shadow-lg transition-shadow">Consult Engineer</Link>
                 <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mb-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
