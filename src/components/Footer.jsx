import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom'; // Changed from 'react-router' to 'react-router-dom' as it's the standard for web

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EduTrack</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering learners worldwide with cutting-edge education and innovative learning solutions. 
              Join thousands of students on their journey to success.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 hover:bg-violet-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 hover:bg-coral-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-violet-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#programs" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-xl font-bold mb-6">Why Choose Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">✓</span>
                <span className="text-gray-400">Industry-recognized certifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">✓</span>
                <span className="text-gray-400">Expert instructors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">✓</span>
                <span className="text-gray-400">Flexible learning schedules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">✓</span>
                <span className="text-gray-400">Lifetime access to materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 mt-1">✓</span>
                <span className="text-gray-400">Career support services</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-400">Email</div>
                  <a href="mailto:info@edutrack.com" className="text-white hover:text-violet-400 transition-colors">
                    info@edutrack.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-400">Phone</div>
                  <a href="tel:+1234567890" className="text-white hover:text-teal-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coral-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-400">Address</div>
                  <p className="text-white">123 Education Street, Learning City, ED 12345</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} EduTrack. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;