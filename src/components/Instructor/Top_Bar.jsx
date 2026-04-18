import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { GraduationCap } from 'lucide-react';

function Top_Bar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex justify-between items-center w-full h-full px-6 bg-transparent">
      {/* Brand Identity */}
      <Link to="/" className="flex items-center gap-2 !no-underline group">
        <div className="bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shadow-sm w-10 h-10 group-hover:border-teal-500/50 transition-all">
          <GraduationCap size={24} className="text-teal-400" />
        </div>
        <span className="text-lg font-black text-white tracking-tight italic leading-none">
          Edu<span className="text-teal-400 not-italic">Track</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Notifications Icon */}
        <button
          className="relative text-slate-400 hover:text-teal-400 transition-all bg-transparent border-0 p-0 shadow-none outline-none"
          onClick={() => navigate("/Inotifications")}    
        >
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 p-1 bg-emerald-500 border border-slate-950 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]"></span>
        </button>

        {/* Simplified User Section - Only Logout remains */}
        <div className="relative pl-4 border-l border-slate-800/60">
          <div
            className="rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] w-9 h-9 cursor-pointer text-xs hover:scale-105 transition-transform"
            onClick={() => setShowProfile(!showProfile)}
          >
            JS
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-3 shadow-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl w-40 z-50">
              <button
                className="flex items-center gap-2 text-rose-500 py-2.5 px-3 rounded-xl hover:bg-rose-500/10 transition-all border-0 bg-transparent w-full text-left text-sm font-semibold"
                onClick={() => { 
                  localStorage.clear(); 
                  navigate("/login"); 
                }}
              >
                <FaSignOutAlt size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Top_Bar;