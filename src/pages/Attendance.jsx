import React, { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, BookOpen, AlertCircle, Calendar, Clock, Octagon } from 'lucide-react';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = "S001"; 
  const BASE_URL = "https://localhost:7157/api/Enrollment";

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/student-attendance/${studentId}`);
        // Backend now returns: { status, studentId, attendance: [...] }
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

  // Helper to format dates from backend
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-slate-950 text-slate-200 selection:bg-blue-500/30 custom-scrollbar">
      <div className="max-w-5xl mx-auto px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-4">
            <GraduationCap className="text-blue-400" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Attendance Tracking</h1>
          <p className="text-slate-500 font-medium italic">Track your presence across all enrolled courses</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-400 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Processing Records</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 text-red-400">
            <AlertCircle size={24} />
            <p className="font-bold">{error}</p>
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-800 border-dashed rounded-[2.5rem]">
            <BookOpen className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-bold text-lg">No active batch assignments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {attendanceData.map((item, index) => {
              const isDropped = item.status === "Dropped";
              const percentage = item.attendancePercentage;
              
              // Color Logic
              const colorClass = isDropped ? "bg-red-600" : (percentage >= 75 ? "bg-green-500" : "bg-yellow-500");
              const glowClass = isDropped ? "shadow-red-900/40" : (percentage >= 75 ? "shadow-green-500/20" : "shadow-yellow-500/20");

              return (
                <div 
                  key={item.courseId || index} 
                  className={`group relative bg-slate-900/40 border ${isDropped ? 'border-red-900/50' : 'border-slate-800'} p-8 rounded-[2rem] transition-all duration-300 hover:bg-slate-900/60`}
                >
                  {/* Status Ribbon */}
                  <div className="absolute -top-3 right-8">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border shadow-xl ${
                      isDropped ? 'bg-red-500 text-white border-red-400' : 'bg-blue-600 text-white border-blue-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
                    {/* Course Info */}
                    <div className="flex-grow">
                      <h3 className="text-3xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">
                        {item.courseName}
                      </h3>
                      
                      <div className="flex flex-wrap gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-500" />
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-600">Start Date</span>
                            <span className="text-sm font-semibold">{formatDate(item.startDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-purple-500" />
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-600">End Date</span>
                            <span className="text-sm font-semibold">{formatDate(item.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Circular/Large Percentage Display */}
                    <div className="flex flex-col items-end justify-center px-6 border-l border-slate-800">
                      <div className={`text-5xl font-black tracking-tighter ${isDropped ? 'text-red-500' : 'text-white'}`}>
                        {percentage}<span className="text-xl text-slate-500 ml-1">%</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Score</span>
                    </div>
                  </div>

                  {/* Progress Bar Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        {isDropped && <Octagon size={12} className="text-red-500 fill-red-500" />}
                        {isDropped ? "DROPPED - ATTENDANCE BELOW 75%" : "CURRENT STANDING"}
                      </span>
                      <span className="text-xs font-bold text-slate-400">Goal: 75%</span>
                    </div>
                    
                    <div className="h-4 bg-slate-800/50 rounded-full overflow-hidden border border-slate-800 p-1">
                      <div 
                        className={`h-full rounded-full ${colorClass} ${glowClass} shadow-lg transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Warning Message for Active students near threshold */}
                  {!isDropped && percentage < 80 && (
                    <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-center gap-3">
                      <AlertCircle className="text-yellow-500" size={18} />
                      <p className="text-xs text-yellow-500/80 font-medium">
                        Warning: Your attendance is close to the 75% threshold. Falling below will result in an automatic course drop.
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default Attendance;