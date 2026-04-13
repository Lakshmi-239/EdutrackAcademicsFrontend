import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for glassmorphism depth
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Programs', id: 'programs' },
    { name: 'Courses', id: 'courses' },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
        ? 'bg-slate-900/90 backdrop-blur-md py-3 shadow-2xl' 
        : 'bg-slate-900 py-5'
      }`}
    >
      {/* Premium Shimmer Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0ea5e9_0%,#10b981_50%,#0ea5e9_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label="EduTrack Home"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-11 h-11 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <GraduationCap className="w-7 h-7 text-teal-400" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white italic">
              Edu<span className="text-teal-400 not-italic">Track</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="relative text-slate-300 text-sm font-semibold uppercase tracking-widest hover:text-white transition-colors group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>

            <div className="h-6 w-[1px] bg-slate-700 mx-2"></div>

            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                  to="/Login"
                  className="relative group !text-slate-300 font-semibold hover:!text-white transition-all duration-300 px-4 py-2">
                    Login
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  <Link
                    to="/register"
                    className="relative inline-flex items-center justify-center px-7 py-2.5 overflow-hidden font-bold text-white transition-all duration-300 bg-emerald-500 rounded-full group hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                  >
                    <span className="relative">Register</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
                    <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <span className="text-slate-200 text-sm font-medium">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-teal-400 transition-colors"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50"></div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-slate-900 border-l border-slate-800 z-[110] p-8 transform transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end mb-8">
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="flex items-center justify-between w-full text-left text-xl font-medium text-slate-300 hover:text-teal-400 transition-colors group"
              >
                {link.name}
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-800 space-y-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/Login"
                  className="block w-full py-3 text-center text-slate-300 font-semibold border border-slate-700 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full py-3 text-center bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-3 bg-rose-500/10 text-rose-500 font-bold rounded-xl border border-rose-500/20"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};