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
      
      {/* Background Subtle Glow - Teal to match Navbar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 py-6">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo Box - Exactly like Navbar code you gave */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative w-11 h-11 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-xl">
                  <GraduationCap className="w-7 h-7 text-teal-400" />
                </div>
              </div>
              {/* Logo Text - Exactly like Navbar (Edu-italic, Track-teal/not-italic) */}
              <span className="text-2xl font-extrabold tracking-tight text-white italic">
                Edu<span className="text-teal-400 not-italic">Track</span>
              </span>
            </Link>
          </div>
          
          {/* UPDATED: Compact White Heading as per your image */}
          <span className="text-cyan-400 font-extrabold tracking-widest text-lg md:text-xl ml-1">
            Select your Identity
          </span>

          <p className="text-slate-400 text-sm font-medium opacity-70 max-w-md mx-auto">
            Choose a professional role to continue your journey.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="group relative bg-[#0f172a]/40 backdrop-blur-md border border-slate-800/60 rounded-[2rem] p-8 hover:border-teal-400/30 transition-all duration-500 flex flex-col shadow-2xl hover:shadow-teal-400/5"
              >
                <div className="mb-8 flex-grow">
                  <div className="w-14 h-14 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-400/10 group-hover:border-teal-400/20 transition-all duration-500">
                    <Icon className="w-7 h-7 text-teal-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{role.title}</h3>
                  <p className="text-slate-400 text-[15px] leading-relaxed mb-6 font-medium">
                    {role.description}
                  </p>
                  
                  <div className="space-y-3">
                    {role.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                        <Check className="w-4 h-4 text-teal-400/70" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sleek Compact Button - Synced with Teal Navbar theme */}
                <div className="mt-auto pt-6">
                  <button
                    onClick={() => navigate(role.path)}
                    className="group/btn relative w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/80 border border-slate-700 text-[14px] font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 active:scale-[0.98] hover:border-teal-400/40 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(45,212,191,0.15)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-teal-400 transition-colors duration-300">
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
            <Link to="/Login" className="text-white hover:text-teal-400 font-bold transition-all border-b border-slate-800 hover:border-teal-400 pb-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;