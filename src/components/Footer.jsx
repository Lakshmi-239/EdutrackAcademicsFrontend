import React from 'react';
import Swal from 'sweetalert2';
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, 
  MapPin, GraduationCap, ChevronRight, ShieldCheck 
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const organizationEmail = "edutrackacademicmanagement@gmail.com";

  const handlePlaceholderClick = (e, page) => {
    e.preventDefault();
    Swal.fire({
      title: `<span style="color: #ffffff; font-family: sans-serif;">${page}</span>`,
      html: `<span style="color: #94a3b8;">This section is currently under development for the 2026 academic release.</span>`,
      icon: 'info',
      iconColor: '#10b981',
      background: '#020617',
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Understood',
      customClass: {
        popup: 'rounded-3xl border border-slate-800 shadow-2xl',
        confirmButton: 'px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-xs'
      }
    });
  };

  return (
    <footer className="relative bg-slate-950 pt-24 overflow-hidden border-t border-slate-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-7 h-7 text-slate-950" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight italic">Edu<span className="text-emerald-400">Track</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Engineering institutional excellence with integrated LMS and Data Analytics infrastructure.</p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center transition-all group"><Icon className="w-5 h-5 group-hover:scale-110" /></a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 lg:ml-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h3>
            <ul className="space-y-4">
              {['Home', 'Programs', 'Course Catalog', 'Scholarships'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-all no-underline"><ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6 lg:ml-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Governance</h3>
            <ul className="space-y-4">
              {['Quality Policy', 'Privacy Shield', 'Compliance', 'Security'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-emerald-400 flex items-center gap-2 group transition-all no-underline"><ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" />{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Global Support</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-emerald-500 flex-shrink-0 border border-slate-800"><Mail className="w-4 h-4" /></div>
                <div>
                  <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Organization Gmail</p>
                  <p className="text-[11px] text-slate-200 font-bold group-hover:text-emerald-400 transition-colors break-all">{organizationEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-emerald-500 flex-shrink-0 border border-slate-800"><MapPin className="w-4 h-4" /></div>
                <div>
                  <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Global HQ</p>
                  <p className="text-xs text-slate-200 font-bold leading-tight group-hover:text-emerald-400 transition-colors">123 Tech Corridor, Silicon Valley, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer: Anni Okate Straight Line lo */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-row items-center justify-between">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">© {currentYear} EduTrack Global</p>
          
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
             <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">AES-256 Encrypted</span>
          </div>
          
          <nav className="flex gap-8">
            <a href="#" onClick={(e) => handlePlaceholderClick(e, "Privacy Policy")} className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] hover:text-white transition-all no-underline">Privacy Policy</a>
            <a href="#" onClick={(e) => handlePlaceholderClick(e, "Terms of Service")} className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] hover:text-white transition-all no-underline">Terms of Service</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;