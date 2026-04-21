import React from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-52 pb-24 overflow-hidden bg-slate-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* ISO Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-emerald-500/20 mb-12 backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
              ISO 9001:2026 Certified Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Master Your Future <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-500 bg-clip-text text-transparent">
              With Precision.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 mb-12 max-w-xl leading-relaxed font-medium">
            World-class educational tracking designed to bridge the gap between
            academic theory and industry mastery.
          </p>

          {/* Symmetrical Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-24">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-emerald-500 text-slate-950 rounded-full font-bold text-sm transition-all flex items-center gap-2 hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.25)] active:scale-95"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#courses"
              className="px-10 py-4 bg-slate-950 border border-slate-800 text-white rounded-full font-bold text-sm hover:bg-slate-900 hover:border-slate-700 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Browse Catalog
            </a>
          </div>

          {/* Stats Section */}
          <div className="relative w-full max-w-5xl">
            <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-12 rounded-[3rem] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl shadow-2xl">
              {[
                { label: "Students", val: "24k+", icon: Users },
                { label: "Courses", val: "150+", icon: GraduationCap },
                { label: "Success", val: "98%", icon: Sparkles },
                { label: "Partners", val: "50+", icon: ShieldCheck },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center group ${i !== 0 ? "md:border-l md:border-slate-800/50" : ""}`}
                >
                  <span className="text-4xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">
                    {stat.val}
                  </span>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-950/60 rounded-full border border-slate-800 shadow-inner">
                    <stat.icon className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
