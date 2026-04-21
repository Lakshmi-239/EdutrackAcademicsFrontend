import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", id: "about" },
    { name: "Programs", id: "programs" },
    { name: "Courses", id: "courses" },
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
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-md py-3 shadow-2xl"
          : "bg-slate-900 py-5"
      }`}
    >
      {/* Premium Shimmer Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0ea5e9_0%,#10b981_50%,#0ea5e9_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition" />
              <div className="relative w-11 h-11 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
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
                  className="relative text-slate-300 text-sm font-semibold uppercase tracking-widest hover:text-white transition group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-700 mx-2" />

            <div className="flex items-center gap-4">
              <Link
                to="/Login"
                className="relative group !text-slate-300 font-semibold hover:!text-white transition-all duration-300 px-4 py-2"
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/register"
                className="relative inline-flex items-center justify-center px-7 py-2.5 font-bold text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-teal-400 transition"
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-slate-900 border-l border-slate-800 p-8 transform transition-transform duration-500 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="flex items-center justify-between w-full text-xl text-slate-300 hover:text-teal-400 transition group"
              >
                {link.name}
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-800 space-y-4">
            <Link
              to="/Login"
              className="relative group !text-slate-300 font-semibold hover:!text-white transition-all duration-300 px-4 py-2"
            >
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 text-center bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
