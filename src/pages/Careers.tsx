import { Helmet } from "react-helmet-async";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";

export default function Careers() {
  const jobs = [
    { title: "Senior HV Design Engineer", dept: "R&D", location: "Hyderabad", type: "Full-time" },
    { title: "Power Electronics Technician", dept: "Manufacturing", location: "Hyderabad", type: "Full-time" },
    { title: "B2B Sales Manager", dept: "Sales", location: "Remote/India", type: "Full-time" }
  ];

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Careers | Join Divotech Technologies</title>
      </Helmet>

      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-700 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Join The Team</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 italic tracking-tighter">
            Build The Future <span className="text-blue-700">Of Power.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-medium">Divotech is always looking for passionate electrical engineers and industrial specialists to join our Hyderabad R&D facility.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {jobs.map((job, i) => (
            <div key={i} className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-700 transition-all cursor-pointer">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{job.dept}</span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest"><MapPin className="h-3 w-3" /> {job.location}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{job.title}</h3>
              </div>
              <button className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-700 group-hover:text-white transition-all">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden">
           <Briefcase className="h-10 w-10 mx-auto mb-6 text-blue-500 opacity-50" />
           <h4 className="text-2xl font-bold mb-4 italic tracking-tight">No match found?</h4>
           <p className="text-slate-400 text-sm mb-8 font-medium">We are always open to hearing from senior talent in HV power electronics.</p>
           <a href="mailto:careers@divotech.in" className="inline-block border-b-2 border-white pb-1 text-xs font-bold uppercase tracking-[0.2em] hover:text-blue-400 hover:border-blue-400 transition-colors">Send CV to careers@divotech.in</a>
        </div>
      </div>
    </div>
  );
}
