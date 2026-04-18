import React, { useState } from 'react';
import { BookOpen, Users, ArrowRight, Calendar, Trash2, RotateCcw } from 'lucide-react';

export default function AttendanceCard({ item, onClick, onDelete, onRestore }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isDeleted = item.isDeleted || item.IsDeleted;
  const watermarkText = isDeleted ? (item.presentCount === 0 ? "EMPTY" : "VOID") : null;

  const percentage = item.totalStudents > 0
    ? Math.round((item.presentCount / item.totalStudents) * 100)
    : 0;

  // PREMIUM THEME SELECTOR: Enhanced color palette
  const getTheme = (pct) => {
    if (isDeleted) return { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', glow: 'transparent', border: 'border-slate-800' };
    if (pct >= 80) return { color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.15)', glow: 'rgba(45, 212, 191, 0.3)', border: 'border-teal-500/40' };
    if (pct >= 50) return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', glow: 'rgba(251, 191, 36, 0.3)', border: 'border-amber-400/40' };
    return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', glow: 'rgba(248, 113, 113, 0.3)', border: 'border-red-500/40' };
  };

  const theme = getTheme(percentage);

  return (
    <div
      className={`group relative h-full rounded-[2rem] border transition-all duration-500 overflow-hidden bg-slate-900/60 backdrop-blur-xl ${theme.border} ${isDeleted ? 'opacity-60 shadow-none' : 'hover:-translate-y-1 shadow-2xl'}`}
      style={{
        filter: isDeleted ? 'grayscale(0.6)' : 'none',
        cursor: isDeleted ? 'default' : 'pointer',
        boxShadow: isDeleted ? 'none' : `0 10px 30px -15px ${theme.glow}`
      }}
      onClick={() => !isDeleted && onClick()}
    >
      {/* 🔴 "VOID/EMPTY" WATERMARK OVERLAY */}
      {isDeleted && (
        <div
          className="position-absolute top-50 start-50 translate-middle font-black text-slate-800/20 select-none pointer-events-none"
          style={{ fontSize: '4.5rem', zIndex: 0, transform: 'translate(-50%, -50%) rotate(-12deg)', letterSpacing: '0.2em' }}
        >
          {watermarkText}
        </div>
      )}

      <div className="p-6 flex flex-col h-full position-relative" style={{ zIndex: 1 }}>

        {/* HEADER: Batch & Percentage */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl d-flex align-items-center justify-center shadow-lg border"
              style={{ backgroundColor: theme.bg, color: theme.color, borderColor: `${theme.color}33` }}
            >
              <Users size={22} />
            </div>

            <div className="d-flex flex-column">
              <span className="font-black text-white text-base tracking-tight leading-tight">{item.batchId}</span>
              <div className="d-flex align-items-center gap-1.5 text-slate-500 font-bold uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                <Calendar size={11} className="text-teal-500" />
                <span>{new Date(item.sessionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div
            className="px-3 py-1 rounded-full font-black text-[10px] tracking-widest border"
            style={{ backgroundColor: theme.bg, color: theme.color, borderColor: `${theme.color}44` }}
          >
            {isDeleted ? 'ARCHIVED' : `${percentage}%`}
          </div>
        </div>

        {/* COURSE DETAILS PILL */}
        <div className="mb-4 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 transition-colors group-hover:bg-slate-800/40">
          <div className="d-flex align-items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 d-flex align-items-center justify-center">
              <BookOpen size={14} className="text-teal-400" />
            </div>
            <div className="d-flex flex-column overflow-hidden">
              <span className="text-[9px] font-black text-teal-500 tracking-widest uppercase opacity-80">{item.courseId}</span>
              <span className="text-slate-200 font-bold text-xs text-truncate">{item.courseName}</span>
            </div>
          </div>
        </div>

        {/* STATS GRID: Balanced Layout */}
        <div className="row g-2 text-center mb-6">
          <div className="col-4">
            <div className="py-3 rounded-xl bg-slate-950/30 border border-slate-800/50">
              <div className="font-black text-white text-lg">{item.totalStudents}</div>
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mt-0.5">Total</div>
            </div>
          </div>
          <div className="col-4">
            <div className="py-3 rounded-xl bg-slate-950/30 border border-slate-800/50">
              <div className="font-black text-emerald-400 text-lg">{item.presentCount}</div>
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mt-0.5">Present</div>
            </div>
          </div>
          <div className="col-4">
            <div className="py-3 rounded-xl bg-slate-950/30 border border-slate-800/50">
              <div className="font-black text-red-400 text-lg">{item.absentCount}</div>
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mt-0.5">Absent</div>
            </div>
          </div>
        </div>

        {/* FOOTER: Integrated Actions */}
        <div className="mt-auto d-flex justify-content-between align-items-center pt-4 border-t border-slate-800/40">
          <div className="d-flex gap-2">
            <button
              className={`w-9 h-9 rounded-pill d-flex align-items-center justify-center transition-all border border-slate-700/50 text-slate-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 ${isDeleted ? 'd-none' : ''}`}
              title="Void Record"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
            >
              <Trash2 size={16} />
            </button>

            <button
              className={`w-9 h-9 rounded-pill d-flex align-items-center justify-center transition-all border ${isDeleted ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-slate-700/50 text-slate-500 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/30'}`}
              title="Restore Data"
              onClick={(e) => { e.stopPropagation(); onRestore(item); }}
            >
              <RotateCcw size={16} className={isDeleted ? 'animate-spin-slow' : ''} />
            </button>
          </div>

          {/* View Details Pill - Dynamic Theme Applied */}
          <button
            className={`font-black text-[10px] uppercase tracking-widest d-flex align-items-center gap-2 px-5 py-2 rounded-pill transition-all duration-300 shadow-xl border ${isDeleted
              ? 'text-slate-600 bg-slate-800/50 border-slate-700 cursor-not-allowed'
              : 'text-slate-950 hover:scale-105 active:scale-95 hover:brightness-110'
              }`}
            style={{
              // This dynamically sets the color based on the attendance percentage
              backgroundColor: !isDeleted ? theme.color : '',
              borderColor: !isDeleted ? theme.color : ''
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDeleted) onClick();
            }}
          >
            Details <ArrowRight size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- MINI CONFIRMATION OVERLAY --- */}
      {showConfirm && (
        <div className="position-absolute inset-0 w-100 h-100 bg-slate-950/90 backdrop-blur-md d-flex flex-column align-items-center justify-center p-4 text-center animate-fade-in" style={{ zIndex: 50, borderRadius: '2rem' }}>
          <div className="w-12 h-12 rounded-circle bg-red-500/20 text-red-500 d-flex align-items-center justify-center mb-3">
            <Trash2 size={24} />
          </div>
          <h6 className="text-white font-black mb-1">RECORD?</h6>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight mb-4">This action will move this batch to the archive.</p>

          <div className="d-flex gap-2 w-100">
            <button
              className="btn-slate-outline flex-fill py-2 rounded-pill text-[10px] font-black border-slate-700 text-slate-400"
              onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
            >
              CANCEL
            </button>
            <button
              className="bg-red-500 text-white flex-fill py-2 rounded-pill text-[10px] font-black border-0 shadow-lg shadow-red-500/20"
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                setShowConfirm(false);
                onDelete(item);
              }}
            >
              CONFIRM
            </button>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .animate-fade-in { 
          animation: fadeIn 0.2s ease-out forwards; 
        }
        
        @keyframes fadeIn { 
          from { opacity: 0; transform: scale(0.95); } 
          to { opacity: 1; transform: scale(1); } 
        }

        /* Confirmation Button Styles */
        .btn-slate-outline {
          background: transparent;
          border: 1px solid #1e293b;
          transition: all 0.2s;
        }
        
        .btn-slate-outline:hover { 
          background: rgba(255, 255, 255, 0.05); 
          color: white; 
          border-color: #334155;
        }

        /* Utility for the overlay positioning */
        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
}