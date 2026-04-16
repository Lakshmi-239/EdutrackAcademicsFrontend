import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import { 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  CalendarCheck, 
  Hash, 
  AlertCircle, 
  CheckCircle,
  PartyPopper,
  Loader2
} from 'lucide-react';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [batchId, setBatchId] = useState(course.batchId || course.BatchId || null);
  const [isResolvingBatch, setIsResolvingBatch] = useState(false);

  const cId = course.courseId || course.CourseId || 'N/A';
  const cName = course.courseName || course.CourseName || 'Untitled Course';
  const credits = course.credits ?? course.Credits ?? 0;
  const duration = course.durationInWeeks || course.DurationInWeeks || 0;
  const academicYear = course.academicYearId || course.AcademicYearId || 'N/A';
  const capacity = course.batchSize || course.BatchSize || 0;
  const enrolled = course.currentStudents || course.CurrentStudents || 0;

  const isActiveStatus = (enrolled === capacity && capacity > 0);
  const statusLabel = isActiveStatus ? 'ACTIVE' : 'ENROLLING';

  useEffect(() => {
    const fetchBatchId = async () => {
      if (!batchId && cId !== 'N/A') {
        try {
          setIsResolvingBatch(true);
          const response = await api.getBatchByCourse(cId, cName);
          if (response.data && response.data.batchId) {
            setBatchId(response.data.batchId);
          } else {
            setBatchId("N/A");
          }
        } catch (err) {
          setBatchId("N/A");
        } finally {
          setIsResolvingBatch(false);
        }
      }
    };
    fetchBatchId();
  }, [cId, cName, batchId]);

  return (
    <div className={`group relative h-full rounded-[2rem] border transition-all duration-500 overflow-hidden bg-slate-900/40 backdrop-blur-xl hover:-translate-y-1 ${isActiveStatus ? 'border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.1)]' : 'border-slate-800 shadow-2xl'}`}>
      
      {/* Top Status Tab - Reduced height */}
      <div className={`py-1.5 text-center flex items-center justify-center gap-2 transition-colors duration-300 ${isActiveStatus ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
        {isActiveStatus ? <CheckCircle size={12} className="font-bold" /> : <Loader2 size={12} className="animate-spin" />}
        <span className="font-black tracking-[0.2em] text-[9px] uppercase">
          {statusLabel}
        </span>
      </div>

      <div className="p-5 flex flex-col h-full">
        {/* Header Section - Reduced Margin */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-700 text-teal-400 shadow-inner">
            <Hash size={10} /> 
            <span className="text-[10px] font-black tracking-tighter">
              {isResolvingBatch ? "..." : (batchId || 'N/A')}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-[9px] font-extrabold tracking-widest uppercase border border-slate-700">
            {academicYear}
          </span>
        </div>

        {/* Title & Info - Reduced Margins and Padding */}
        <div className="text-center mb-4">
          <h5 className="text-xl font-black text-white mb-1 group-hover:text-teal-400 transition-colors leading-tight">{cName}</h5>
          <div className="inline-block px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
             <code className="text-teal-400 text-[10px] font-bold">ID: {cId}</code>
          </div>
          
          {/* Reduced space between ID and Duration (mt-3 instead of mt-5) */}
          <div className="flex items-center justify-center gap-4 text-slate-400 text-[10px] font-bold mt-3 pt-3 border-t border-slate-800/50">
            <div className="flex items-center gap-1.5"><Clock size={12} className="text-teal-500" /> {duration} Weeks</div>
            <div className="flex items-center gap-1.5"><Award size={12} className="text-emerald-500" /> {credits} Credits</div>
          </div>
        </div>

        {/* Enrollment Stats - More compact rounded corners */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="py-3 px-2 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center">
            <div className="text-slate-500 text-[8px] uppercase font-black mb-0.5 tracking-widest">Capacity</div>
            <div className="text-xl font-black text-slate-100">{capacity}</div>
          </div>
          <div className={`py-3 px-2 rounded-2xl border text-center transition-all duration-500 ${isActiveStatus ? 'bg-teal-500/10 border-teal-500/40' : 'bg-slate-950/40 border-slate-800/60'}`}>
            <div className={`${isActiveStatus ? 'text-teal-400' : 'text-slate-500'} text-[8px] uppercase font-black mb-0.5 tracking-widest`}>Enrolled</div>
            <div className={`text-xl font-black ${isActiveStatus ? 'text-teal-400' : 'text-slate-100'}`}>{enrolled}</div>
          </div>
        </div>

        {/* Notification Area - Reduced margin */}
        <div className="mb-4">
          {isActiveStatus ? (
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <PartyPopper size={14} className="text-emerald-400" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Full Capacity</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <AlertCircle size={14} className="text-slate-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">In Progress</span>
            </div>
          )}
        </div>

        {/* --- BUTTONS --- */}
        {/* --- PREMIUM UI BUTTONS --- */}
<div className="mt-auto space-y-3">
  {/* Primary Button: View Students */}
  {/* --- COMPACT PREMIUM BUTTONS --- */}
<div className="mt-auto space-y-2">
  {/* Primary Button: Reduced padding from 3.5 to 2.5 */}
  <button 
    className="group/btn w-full py-2 rounded-pill font-black text-[10px] uppercase tracking-[0.12em] 
               flex items-center justify-center gap-2 transition-all duration-300 
               bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 
               hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:scale-[1.01] 
               active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
    disabled={!batchId || batchId === 'N/A'}
    onClick={() => navigate(`/view-batch-students/${batchId}`)}
  >
    <Users size={15} className="transition-transform group-hover/btn:scale-110" /> 
    <span className="drop-shadow-sm">View Students</span>
  </button>

  {/* Secondary Action Grid: Reduced padding from 3 to 2 */}
  <div className="grid grid-cols-2 gap-2">
    {/* Attendance Button */}
    <button 
      className={`py-2 rounded-pill font-black text-[8px] uppercase tracking-widest 
                 flex items-center justify-center gap-1.5 transition-all duration-300
                 bg-slate-800/40 border border-teal-500/20 text-teal-400
                 hover:bg-teal-500/10 hover:border-teal-400/50 hover:text-white
                 ${(!batchId || batchId === 'N/A') ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`}
      onClick={() => batchId && batchId !== 'N/A' && navigate(`/Iattendances?batchId=${batchId}`)}
    >
      <CalendarCheck size={13} /> 
      Attendance
    </button>

    {/* Modules Button */}
    <button 
      className="py-2 rounded-pill font-black text-[8px] uppercase tracking-widest 
                 flex items-center justify-center gap-1.5 transition-all duration-300
                 bg-slate-800/40 border border-slate-700 text-slate-400
                 hover:bg-slate-700 hover:border-slate-500 hover:text-white
                 active:scale-95"
      onClick={() => navigate(`/Imodules?courseId=${cId}`)}
    >
      <BookOpen size={13} /> 
      Modules
    </button>
  </div>
</div>
</div>
      </div>
    </div>
  );
};

export default CourseCard;