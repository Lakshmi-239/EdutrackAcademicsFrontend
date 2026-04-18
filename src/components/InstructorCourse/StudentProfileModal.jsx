import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { 
  X, Mail, Phone, User, GraduationCap, 
  BookOpen, Calendar, ShieldCheck, Loader2, Hash 
} from 'lucide-react';

const StudentProfileModal = ({ studentId, isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!studentId || !isOpen) return;
      try {
        setLoading(true);
        const [personalRes, programRes] = await Promise.all([
          api.getStudentPersonalInfo(studentId),
          api.getStudentProgramDetails(studentId)
        ]);

        const personal = personalRes.data || {};
        const program = programRes.data || {};

        setProfile({
          studentName: personal.studentName || program.studentName,
          studentEmail: personal.studentEmail || program.studentEmail,
          studentPhone: (personal.studentPhone && personal.studentPhone !== 0) ? personal.studentPhone : program.studentPhone,
          studentGender: personal.studentGender || program.studentGender,
          studentQualification: program.studentQualification || personal.studentQualification,
          studentProgram: program.studentProgram || personal.studentProgram,
          studentAcademicYear: program.studentAcademicYear || personal.studentAcademicYear,
        });
      } catch (err) {
        console.error("Error fetching student details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, [studentId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1060] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col transform animate-in zoom-in-95 duration-300">
        
        {/* Header Section - Premium Dark Gradient */}
        <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-800">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-slate-800 border-2 border-teal-500/30 rounded-2xl flex items-center justify-center text-teal-400 font-black text-3xl shadow-inner">
              {profile?.studentName?.charAt(0).toUpperCase() || <User size={35} />}
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white tracking-tight text-capitalize">
                {profile?.studentName || "Student Profile"}
              </h2>
              <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-lg w-fit">
                <Hash size={12} className="text-teal-500" />
                <span className="text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                  UID: {studentId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 bg-slate-900/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-teal-400 mb-4" size={40} />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Accessing Database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="space-y-6">
                <h6 className="flex items-center gap-2 text-teal-500 font-black text-[10px] tracking-[0.2em] uppercase">
                  <ShieldCheck size={16} /> Personal Info
                </h6>
                <div className="space-y-4">
                  <InfoRow icon={<Mail size={16}/>} label="Email Address" value={profile?.studentEmail} />
                  <InfoRow icon={<Phone size={16}/>} label="Contact Number" value={profile?.studentPhone} />
                  <InfoRow icon={<User size={16}/>} label="Gender" value={profile?.studentGender} />
                </div>
              </div>

              {/* Academic Details */}
              <div className="space-y-6">
                <h6 className="flex items-center gap-2 text-teal-500 font-black text-[10px] tracking-[0.2em] uppercase">
                  <GraduationCap size={16} /> Academic Standing
                </h6>
                <div className="space-y-4">
                  <InfoRow icon={<BookOpen size={16}/>} label="Qualification" value={profile?.studentQualification} />
                  <InfoRow icon={<GraduationCap size={16}/>} label="Target Program" value={profile?.studentProgram} />
                  <InfoRow icon={<Calendar size={16}/>} label="Enrollment Date" value={formatDate(profile?.studentAcademicYear)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/30 border-t border-slate-800 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-sm transition-colors"
           >
             Close Records
           </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => {
  const isInvalid = !value || value === "null" || value === 0 || value === "0";
  return (
    <div className="flex items-start gap-4 p-3 rounded-2xl bg-slate-800/30 border border-slate-800/50 group hover:border-teal-500/30 transition-all">
      <div className="p-2.5 rounded-xl bg-slate-800 text-teal-500 border border-slate-700 group-hover:bg-teal-500/10 group-hover:text-teal-400 transition-colors">
        {icon}
      </div>
      <div className="flex flex-col">
        <label className="text-slate-500 font-bold text-[9px] uppercase tracking-widest mb-0.5">
          {label}
        </label>
        <span className={`text-sm font-semibold truncate max-w-[180px] ${isInvalid ? 'text-slate-600 italic font-normal' : 'text-slate-200'}`}>
          {isInvalid ? 'Data Missing' : value}
        </span>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString || dateString.startsWith("0001")) return null;
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

export default StudentProfileModal;