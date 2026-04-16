import React from 'react';
import Swal from 'sweetalert2';
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, 
  GraduationCap, ShieldCheck, Youtube 
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const organizationEmail = "edutrackacademicmanagement@gmail.com";

  const socialLinks = [
    { Icon: Facebook, label: 'FB', url: 'https://www.facebook.com/login' },
    { Icon: Instagram, label: 'IG', url: 'https://www.instagram.com/accounts/login' },
    { Icon: Twitter, label: 'X', url: 'https://x.com/i/flow/login' },
    { Icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/login' },
    { Icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com' }
  ];

  // Specific scroll logic for About Us
  const handleAboutClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlaceholderClick = (e, page) => {
    e.preventDefault();
    Swal.fire({
      title: `<span style="color: #ffffff; font-family: sans-serif;">${page}</span>`,
      html: `<span style="color: #94a3b8;">This section is currently under development for the 2026 academic release.</span>`,
      icon: 'info',
      iconColor: '#2dd4bf', 
      background: '#020617',
      confirmButtonColor: '#14b8a6',
      confirmButtonText: 'Understood',
      customClass: {
        popup: 'rounded-3xl border border-slate-800 shadow-2xl',
        confirmButton: 'px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-xs'
      }
    });
  };

  return (
    <footer className="relative bg-slate-950 pt-16 overflow-hidden border-t border-slate-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/10">
                <GraduationCap className="w-6 h-6 text-teal-400" />
              </div>
              <span className="text-xl font-black text-white tracking-tight italic">
                Edu<span className="text-teal-400 not-italic">Track</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Engineering institutional excellence with integrated LMS and Data Analytics infrastructure for the modern era.
            </p>
            <a 
              href={`mailto:${organizationEmail}`}
              className="flex items-center gap-3 !text-slate-400 hover:!text-teal-400 transition-colors group !no-underline"
            >
              <Mail className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium">{organizationEmail}</span>
            </a>
          </div>

          {/* Company Section */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-[11px] font-semibold text-white tracking-[0.01em] mb-7">Company</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a 
                  href="#about" 
                  onClick={handleAboutClick} 
                  className="text-[13px] !text-slate-400 hover:!text-teal-400 transition-all !no-underline block"
                >
                  About Us
                </a>
              </li>
              {['Careers', 'Press'].map((item) => (
                <li key={item}>
                  <a href="#" onClick={(e) => handlePlaceholderClick(e, item)} className="text-[13px] !text-slate-400 hover:!text-teal-400 transition-all !no-underline block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Support (Remaining the same) */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-[11px] font-semibold text-white tracking-[0.01em] mb-7">Resources</h3>
            <ul className="flex flex-col gap-3">
              {['Blog', 'Guides', 'Case Studies'].map((item) => (
                <li key={item}>
                  <a href="#" onClick={(e) => handlePlaceholderClick(e, item)} className="text-[13px] !text-slate-400 hover:!text-teal-400 transition-all !no-underline block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-[11px] font-semibold text-white tracking-[0.01em] mb-7">Support</h3>
            <ul className="flex flex-col gap-3">
              {['FAQ', 'Contact Us', 'Help Center'].map((item) => (
                <li key={item}>
                  <a href="#" onClick={(e) => handlePlaceholderClick(e, item)} className="text-[13px] !text-slate-400 hover:!text-teal-400 transition-all !no-underline block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-[11px] font-semibold text-white tracking-[0.01em] mb-7">Connect</h3>
            <div className="flex items-center gap-4 flex-wrap">
              {socialLinks.map(({ Icon, label, url }) => (
                <a 
                  key={label} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="!text-slate-400 hover:!text-teal-400 transition-all duration-300 flex-shrink-0"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em]">
            © {currentYear} EduTrack Global. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/5 border border-teal-500/10">
             <ShieldCheck className="w-3 h-3 text-teal-500" />
             <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">AES-256 Encrypted</span>
          </div>
          
          <nav className="flex gap-6">
            <a href="#" onClick={(e) => handlePlaceholderClick(e, "Privacy Policy")} className="text-[9px] font-bold !text-slate-500 uppercase tracking-[0.15em] hover:!text-white transition-all !no-underline">Privacy Policy</a>
            <a href="#" onClick={(e) => handlePlaceholderClick(e, "Terms of Service")} className="text-[9px] font-bold !text-slate-500 uppercase tracking-[0.15em] hover:!text-white transition-all !no-underline">Terms of Service</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};