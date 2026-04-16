import React from 'react';
import { GraduationCap, Calendar, Award, ShieldCheck, Database } from 'lucide-react';

export const ProgramDetailsSection = ({ programDetails }) => {
  if (!programDetails) return null;

  const dataCards = [
    { label: 'Enrolled Program', value: programDetails.studentProgram, icon: GraduationCap, color: 'teal' },
    { label: 'Academic Phase', value: programDetails.studentAcademicYear, icon: Calendar, color: 'emerald' },
    { label: 'Current Qualification', value: programDetails.studentQualification, icon: Award, color: 'blue' },
  ];

  return (
    <div className="w-full space-y-10">
      {/* Platform-Style Grid: Prevents overlapping by using flex-col inside cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataCards.map((card, i) => (
          <div key={i} className="group relative bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 transition-all hover:bg-slate-800/40">
            <div className={`w-12 h-12 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-400 border border-${card.color}-500/20 mb-6`}>
              <card.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
              {card.label}
            </p>
            <h3 className="text-xl font-bold text-white leading-tight tracking-tight">
              {card.value || "Not Assigned"}
            </h3>
          </div>
        ))}
      </div>

      {/* Verified Status Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 bg-slate-900/20 border border-slate-800/50 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 border border-teal-500/20">
            <Database size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Institutional Sync</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-teal-500/5 border border-teal-500/10 rounded-xl">
           <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Active Status</span>
        </div>
      </div>
    </div>
  );
};