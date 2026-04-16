import React, { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, BookOpen, AlertCircle, Calendar, Clock, Octagon, CheckCircle2 } from 'lucide-react';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = localStorage.getItem("studentId"); 
  const BASE_URL = "https://localhost:7157/api/Enrollment";

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/student-attendance/${studentId}`);
        if (response.data && response.data.attendance) {
          setAttendanceData(response.data.attendance);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [studentId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-[#020617] text-slate-200 selection:bg-emerald-500/30 custom-scrollbar">
      <div className="max-w-5xl mx-auto px-8 py-12">
        
        {/* Sync Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] mb-6 shadow-2xl shadow-emerald-500/5">
            <GraduationCap className="text-emerald-400" size={40} />
          </div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter uppercase">Attendance Records</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Academic Presence Portfolio</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-400 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Verifying Database</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2.5rem] flex items-center gap-4 text-red-400 shadow-2xl">
            <AlertCircle size={24} />
            <p className="font-black uppercase tracking-wider text-sm">{error}</p>
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/20 border border-slate-800/60 border-dashed rounded-[3rem]">
            <BookOpen className="mx-auto text-slate-800 mb-6" size={60} />
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active enrollments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {attendanceData.map((item, index) => {
              const isDropped = item.status === "Dropped";
              const percentage = item.attendancePercentage;
              
              // Emerald Sync Color Logic
              const colorClass = isDropped ? "bg-red-500" : (percentage >= 75 ? "bg-emerald-500" : "bg-orange-500");
              const glowClass = isDropped ? "shadow-red-500/20" : (percentage >= 75 ? "shadow-emerald-500/20" : "shadow-orange-500/20");
              const borderClass = isDropped ? "border-red-900/30" : "border-slate-800/60";

              return (
                <div 
                  key={item.courseId || index} 
                  className={`group relative bg-[#020617]/40 border ${borderClass} p-10 rounded-[3rem] transition-all duration-500 hover:border-emerald-500/30 hover:bg-slate-900/20 shadow-xl`}
                >
                  {/* Status Ribbon */}
                  <div className="absolute -top-4 right-10">
                    <span className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase border shadow-2xl ${
                      isDropped ? 'bg-red-600 text-white border-red-400' : 'bg-emerald-500 text-slate-950 border-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-10">
                    {/* Course Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 size={18} className={isDropped ? "text-red-500" : "text-emerald-500"} />
                        <h3 className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter">
                          {item.courseName}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                            <Calendar size={14} className="text-emerald-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-black text-slate-600 tracking-widest">Commencement</span>
                            <span className="text-xs font-bold text-slate-400">{formatDate(item.startDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                            <Clock size={14} className="text-emerald-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-black text-slate-600 tracking-widest">Conclusion</span>
                            <span className="text-xs font-bold text-slate-400">{formatDate(item.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Percentage Display */}
                    <div className="flex flex-col items-center lg:items-end justify-center px-8 lg:border-l border-slate-800/60 min-w-[150px]">
                      <div className={`text-6xl font-black tracking-tighter ${isDropped ? 'text-red-500' : 'text-white'}`}>
                        {percentage}<span className="text-2xl text-slate-600 ml-1">%</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mt-1">Aggregate</span>
                    </div>
                  </div>

                  {/* Progress Bar Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                        {isDropped && <Octagon size={14} className="text-red-500 fill-red-500/20" />}
                        {isDropped ? "Course Dropped - Attendance Deficiency" : "Current Attendance Standing"}
                      </span>
                      <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">Target: 75%</span>
                    </div>
                    
                    <div className="h-5 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-1">
                      <div 
                        className={`h-full rounded-xl ${colorClass} ${glowClass} shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Warning Box */}
                  {!isDropped && percentage < 80 && (
                    <div className="mt-8 p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-4 transition-all hover:bg-orange-500/10">
                      <div className="p-2 bg-orange-500/10 rounded-xl">
                        <AlertCircle className="text-orange-500" size={20} />
                      </div>
                      <p className="text-[11px] text-orange-200/60 font-bold uppercase tracking-wide leading-relaxed">
                        Critical Warning: Your attendance is nearing the 75% threshold. Sustained absence will trigger an automated drop.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; border: 2px solid #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
};

export default Attendance;