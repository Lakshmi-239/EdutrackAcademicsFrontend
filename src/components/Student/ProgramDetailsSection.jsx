import React from 'react';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Circle,
  ChevronRight,
  Layers
} from 'lucide-react';


export const ProgramDetailsSection = ({ programDetails }) => {
  // Logic: Calculate completion percentage
  const progressPercentage = (programDetails.completedCredits / programDetails.totalCredits) * 100;

  // Helper: Get Icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'In Progress': return <Clock className="w-3.5 h-3.5" />;
      default: return <Circle className="w-3.5 h-3.5" />;
    }
  };

  // Helper: Status chip colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Journey</h2>
        <p className="text-slate-500 mt-1">Real-time tracking of your program milestones and curriculum progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* GPA Card - The Hero Metric */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Academic Standing</span>
                <Award className="w-5 h-5 text-indigo-200" />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black">{programDetails.gpa.toFixed(2)}</h3>
                <span className="text-indigo-200 font-medium">GPA</span>
              </div>
              <p className="text-xs text-indigo-100 mt-4 leading-relaxed opacity-80">
                Maintained across {programDetails.completedCredits} earned credits.
              </p>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Program Quick Facts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-500" /> Program Info
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Degree</p>
                <p className="text-sm font-semibold text-slate-700">{programDetails.programName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Current</p>
                  <p className="text-sm font-semibold text-slate-700">Sem {programDetails.currentSemester}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Graduation</p>
                  <p className="text-sm font-semibold text-slate-700">May 2028</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Progress & Courses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Bar Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                <h3 className="font-bold text-slate-800">Degree Completion</h3>
              </div>
              <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Start</span>
                <span>{programDetails.completedCredits} of {programDetails.totalCredits} Credits</span>
                <span>Finish</span>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-500" /> Current Enrolment
              </h3>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                View Curriculum
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {programDetails.enrolledCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{course.courseName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-slate-400">{course.courseId}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-xs font-medium text-slate-500">{course.instructor}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusStyle(course.status)}`}>
                        {getStatusIcon(course.status)}
                        {course.status}
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-700" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 w-8">{course.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};