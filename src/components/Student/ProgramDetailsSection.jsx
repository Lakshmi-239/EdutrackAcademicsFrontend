import React from 'react';
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export const ProgramDetailsSection = ({ programDetails }) => {
  // Guard clause to handle loading or empty states
  if (!programDetails) {
    return (
      <div className="p-8 text-center text-slate-500">
        No program information available.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Program Details</h2>
        <p className="text-slate-500 mt-1">Your official academic registration and qualification info.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Program Name Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled Program</span>
          </div>
          <p className="text-lg font-bold text-slate-800 leading-tight">
            {programDetails.studentProgram || "Not Assigned"}
          </p>
        </div>

        {/* Academic Year Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Year</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {programDetails.studentAcademicYear ? `Academic Year ${programDetails.studentAcademicYear}` : "N/A"}
          </p>
        </div>

        {/* Qualification Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qualification</span>
          </div>
          <p className="text-lg font-bold text-slate-800">
            {programDetails.studentQualification || "Pending"}
          </p>
        </div>
      </div>

      {/* Curriculum Placeholder - Since no courses are in backend yet */}
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <BookOpen className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="font-bold text-slate-700">Detailed Curriculum</h4>
        <p className="text-sm text-slate-500 max-w-xs mt-1">
          Once your specific course enrollments are processed, they will appear here.
        </p>
      </div>
    </div>
  );
};