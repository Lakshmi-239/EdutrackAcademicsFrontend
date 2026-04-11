import React from 'react';
import Swal from 'sweetalert2';
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, 
  MapPin, GraduationCap, ChevronRight, ShieldCheck 
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handlePlaceholderClick = (e, page) => {
    e.preventDefault();
    Swal.fire({
      title: `<span style="color: #ffffff; font-family: sans-serif;">${page}</span>`,
      html: `<span style="color: #94a3b8;">The ${page} is currently being optimized for the 2026 academic release. Please check back soon for the full documentation.</span>`,
      icon: 'info',
      iconColor: '#10b981',
      background: '#020617',
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Understood',
      customClass: {
        popup: 'rounded-3xl border border-slate-800 shadow-2xl',
        confirmButton: 'px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px]'
      }
    });
  };

  return (
    <footer className="relative bg-slate-950 pt-16 overflow-hidden border-t border-slate-900">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight italic">
                Edu<span className="text-emerald-400">Track</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The world’s most advanced academic operations management system. 
              Engineering excellence with integrated LMS and Data Analytics infrastructure.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center transition-all group">
                  <Icon className="w-4 h-4 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Column */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Platform</h3>
            <ul className="space-y-3">
              {['Home', 'Programs', 'Course Catalog', 'Scholarships', 'Resources'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-500 hover:text-emerald-400 flex items-center gap-2 group transition-all no-underline">
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance Column */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Governance</h3>
            <ul className="space-y-3">
              {['Quality Policy', 'Privacy Shield', 'Compliance', 'Security', 'SLA'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-500 hover:text-emerald-400 flex items-center gap-2 group transition-all no-underline">
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column - Address & Email Maintained */}
          <div className="lg:col-span-4 space-y-5">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Global Support</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-500 flex-shrink-0 border border-slate-800">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-1">Organization Gmail</p>
                  <a href="mailto:edutrackacademicmanagement@gmail.com" className="text-[13px] text-slate-200 font-bold group-hover:text-emerald-400 no-underline block truncate">
                    edutrackacademicmanagement@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-500 flex-shrink-0 border border-slate-800">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-1">Global HQ</p>
                  <p className="text-[13px] text-slate-200 font-bold leading-snug group-hover:text-emerald-400 transition-colors">
                    123 Tech Corridor, Chennai, Tamil Nadu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENTERPRISE SUB-FOOTER: Compact & Balanced */}
      <div className="border-t border-slate-900 bg-slate-950/90 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-5">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              © {currentYear} EduTrack Global
            </p>
            <div className="hidden md:block w-[1px] h-3 bg-slate-800" />
            <div className="flex items-center gap-1.5">
               <ShieldCheck className="w-3 h-3 text-emerald-500/40" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">AES-256 Secured</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-10">
            <a 
              href="#" 
              onClick={(e) => handlePlaceholderClick(e, "Privacy Policy")} 
              className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-all no-underline"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              onClick={(e) => handlePlaceholderClick(e, "Terms of Service")} 
              className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-all no-underline"
            >
              Terms of Service
            </a>
          </nav>

        </div>
      </div>
    </footer>
  );
};

export default Footer;