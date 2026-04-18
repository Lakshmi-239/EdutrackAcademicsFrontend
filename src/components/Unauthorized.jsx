import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl">
      
      {/* Card */}
      <div className="relative bg-slate-900/70 border border-slate-800/60 rounded-[2.5rem] shadow-2xl px-10 py-12 max-w-lg w-full text-center">
        
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
          <ShieldAlert size={36} />
        </div>

        {/* Brand */}
        <p className="text-[11px] font-black tracking-[0.4em] uppercase text-slate-500 mb-2">
          EDUTRACK
        </p>

        {/* Title */}
        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-4">
          Access Denied
        </h2>

        {/* Message */}
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          You do not have permission to access this page.
          <br />
          Please Login with the appropriate account or contact your administrator.
        </p>

        {/* Action */}
        <button
          onClick={() => navigate("/")}
          className="
            inline-flex items-center gap-3
            px-10 py-3
            rounded-full
            bg-emerald-500 text-slate-950
            font-bold text-sm uppercase tracking-widest
            transition-all
            hover:bg-emerald-400
            shadow-[0_8px_30px_rgba(16,185,129,0.35)]
            active:scale-95
          "
        >
          <ArrowLeft size={16} />
          Return Home
        </button>
      </div>
    </div>
  );
}