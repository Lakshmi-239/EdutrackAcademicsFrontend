import React from 'react';
import { Navbar } from '../components/Navbar';
import { About } from '../components/About';
import { Programs } from '../components/Programs';
import { Courses } from '../components/Courses';
import { Footer } from '../components/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-violet-600 via-indigo-600 to-teal-600">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Welcome to EduTrack
          </h1>
          <p className="text-xl md:text-2xl text-violet-100 mb-8 max-w-3xl mx-auto">
            Transform your future with world-class education. Learn from the best, grow with purpose, 
            and achieve your dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#programs"
              className="px-8 py-4 bg-white text-violet-600 rounded-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Explore Programs
            </a>
            <a
              href="#courses"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-violet-600 transition-all transform hover:scale-105"
            >
              Browse Courses
            </a>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <About />
      <Programs />
      <Courses />
      <Footer />
    </div>
  );
};

export default Home;