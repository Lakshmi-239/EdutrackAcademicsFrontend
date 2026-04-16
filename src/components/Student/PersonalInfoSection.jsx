import React from 'react';
import {
  Mail,
  Phone,
  User,
  Info,
  UserCircle,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const PersonalInfoSection = ({ personalInfo }) => {
  // Shared Styles to match the dark workspace theme
  const labelStyles = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-2";
  const displayBoxStyles = "px-5 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-slate-200 font-medium min-h-[56px] flex items-center shadow-inner transition-all hover:border-slate-600";

  // Handle case where profile might still be loading from parent
  if (!personalInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-slate-500 animate-pulse">Syncing record...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Grid Layout for Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        
        {/* Full Name */}
        <div className="space-y-1">
          <label className={labelStyles}>
            <User size={14} className="text-teal-500" /> Full Name
          </label>
          <div className={displayBoxStyles}>
            {personalInfo.fullName || personalInfo.studentName || 'Not Available'}
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className={labelStyles}>
            <Mail size={14} className="text-teal-500" /> Email Address
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative px-5 py-4 bg-slate-800/60 border border-teal-500/30 rounded-2xl flex justify-between items-center overflow-hidden">
              <span className="font-semibold text-slate-100 truncate mr-2">
                {personalInfo.email || personalInfo.studentEmail}
              </span>
              
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className={labelStyles}>
            <Phone size={14} className="text-teal-500" /> Phone Number
          </label>
          <div className={displayBoxStyles}>
            <span className={!personalInfo.phone && !personalInfo.studentPhone ? "text-slate-600 italic" : ""}>
              {personalInfo.phone || personalInfo.studentPhone || 'No contact number on file'}
            </span>
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className={labelStyles}>
            <Info size={14} className="text-teal-500" /> Gender
          </label>
          <div className={displayBoxStyles}>
            {personalInfo.gender || personalInfo.studentGender || 'Unspecified'}
          </div>
        </div>

      </div>

      {/* Decorative Info Card */}
      <div className="relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent opacity-50" />
        <div className="relative p-6 rounded-3xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 shrink-0">
            <UserCircle size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold">Identity Verification</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your identity has been verified via the Institutional Student Information System (ISIS). 
              Changes to core identity fields require legal documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};