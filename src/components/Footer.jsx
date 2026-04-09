import React from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, 
  MapPin, GraduationCap, ChevronRight, ShieldCheck 
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Updated handler using SweetAlert2
  const handlePlaceholderClick = (e, page) => {
    e.preventDefault();
    
    Swal.fire({
      title: `<span style="color: #ffffff; font-family: inherit;">${page}</span>`,
      html: `<span style="color: #94a3b8;">The ${page} is currently being optimized for the 2026 academic release. Please check back soon for the full documentation.</span>`,
      icon: 'info',
      iconColor: '#10b981', // Your theme's Emerald color
      background: '#020617', // Match Slate-950
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Understood',
      customClass: {
        popup: 'rounded-3xl border border-slate-800 shadow-2xl',
        confirmButton: 'px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-xs'
      },
      buttonsStyling: true,
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
      }
    });
  };

  return (
    <footer className="relative bg-slate-950 pt-20 overflow-hidden border-t border-slate-900">
      {/* Structural Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <GraduationCap className="w-7 h-7 text-slate-950" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight italic">
                Edu<span className="text-emerald-400">Track</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The world’s most advanced academic operations management system. 
              Engineering the future of institutional excellence with integrated 
              LMS and Data Analytics infrastructure.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 rounded-xl flex items-center justify-center transition-all duration-300 group shadow-lg"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-white tracking-wide">Platform</h3>
            <ul className="space-y-4">
              {['Home', 'Programs', 'Course Catalog', 'Scholarships', 'Resources'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-all no-underline">
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-white tracking-wide">Governance</h3>
            <ul className="space-y-4">
              {['Quality Policy', 'Privacy Shield', 'Compliance', 'Security', 'SLA'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-all no-underline">
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold text-white tracking-wide">Global Support</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-500 shadow-inner">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.15em] mb-1">Organization Gmail</p>
                  <a href="mailto:edutrackacademicmanagement@gmail.com" className="text-sm text-slate-200 font-bold group-hover:text-emerald-400 transition-colors no-underline">edutrackacademicmanagement@gmail.com</a>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-500 shadow-inner">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.15em] mb-1">Global HQ</p>
                  <p className="text-sm text-slate-200 font-bold leading-tight group-hover:text-emerald-400 transition-colors">123 Tech Corridor, Chennai, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                © {currentYear} EduTrack Global
              </p>
              <div className="hidden md:block h-3 w-[1px] bg-slate-800" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
                 <ShieldCheck className="w-3 h-3 text-emerald-500/60" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">AES-256 Encrypted</span>
              </div>
            </div>
            
            <nav className="flex items-center gap-8">
              <a 
                href="#" 
                onClick={(e) => handlePlaceholderClick(e, "Privacy Policy")}
                className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] hover:text-white transition-all no-underline"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                onClick={(e) => handlePlaceholderClick(e, "Terms of Service")}
                className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] hover:text-white transition-all no-underline"
              >
                Terms of Service
              </a>
            </nav>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;