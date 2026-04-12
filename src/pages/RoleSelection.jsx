import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, ChevronRight, Check } from 'lucide-react';

export const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access courses, track progress, and earn certifications.',
      icon: GraduationCap,
      path: '/register/student',
      features: ['2k+ Courses', 'Certifications', 'Study Groups']
    },
    {
      id: 'instructor',
      title: 'Instructor',
      description: 'Create content, manage students, and build your brand.',
      icon: BookOpen,
      path: '/register/instructor',
      features: ['Course Builder', 'Analytics', 'Student Management']
    },
    {
      id: 'coordinator',
      title: 'Coordinator',
      description: 'Oversee programs and manage academic excellence.',
      icon: Award,
      path: '/login',
      features: ['Program Management', 'Reports', 'Performance']
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 py-6">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center group-hover:border-cyan-400/50 transition-all duration-500 shadow-xl">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Edu<span className="text-cyan-400">Track</span>
              </span>
            </Link>
          </div>
          
          {/* UPDATED: Heading Font much smaller for Professional Look */}
          <span className="text-cyan-400 font-extrabold tracking-widest text-lg md:text-xl ml-1">
            Select your Identity
          </span>
          <p className="text-slate-400 text-sm font-medium opacity-70">
            Professional roles tailored for the EduTrack ecosystem.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="group relative bg-[#0f172a]/40 backdrop-blur-md border border-slate-800/60 rounded-[2rem] p-8 hover:border-cyan-400/30 transition-all duration-500 flex flex-col shadow-2xl hover:shadow-cyan-400/5"
              >
                <div className="mb-8 flex-grow">
                  <div className="w-14 h-14 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-400/10 group-hover:border-cyan-400/20 transition-all duration-500">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{role.title}</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed mb-6 font-medium">
                    {role.description}
                  </p>
                  
                  <div className="space-y-3">
                    {role.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                        <Check className="w-4 h-4 text-cyan-400/70" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sleek Compact Button */}
                <div className="mt-auto pt-6">
                  <button
                    onClick={() => navigate(role.path)}
                    className="group/btn relative w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/80 border border-slate-700 text-[14px] font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 active:scale-[0.98] hover:border-cyan-400/40 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    
                    <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-cyan-400 transition-colors duration-300">
                      Continue as {role.title}
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-cyan-400 font-bold transition-all border-b border-slate-800 hover:border-cyan-400 pb-1">
              Login 
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;