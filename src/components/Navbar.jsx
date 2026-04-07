import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Changed to react-router-dom for compatibility
import { Menu, X, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 ">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              < GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              EduTrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-violet-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('programs')}
              className="text-gray-700 hover:text-violet-600 transition-colors"
            >
              Programs
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="text-gray-700 hover:text-violet-600 transition-colors"
            >
              Courses
            </button>
            
            {!isAuthenticated ? (
              <>
                <Link
                  to="/Login"
                  className="text-gray-700 hover:text-violet-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700 text-sm font-medium">
                  Welcome, {user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-violet-600 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('programs')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
            >
              Programs
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
            >
              Courses
            </button>
            
            {!isAuthenticated ? (
              <>
                <Link
                  to="/Login"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-gray-700 text-sm font-medium border-b border-gray-100 mb-2">
                  Welcome, {user?.email?.split('@')[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};