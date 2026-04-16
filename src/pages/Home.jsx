import React from 'react';
import { Navbar } from '../components/Navbar';
import {Hero} from '../components/Hero';
import { About } from '../components/About';
import { Programs } from '../components/Programs';
import { Courses } from '../components/Courses';
import { Footer } from '../components/Footer';
import { ArrowRight, Sparkles, ShieldCheck, GraduationCap, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero/>
      {/* Main Sections */}
      <About />
      <Programs />
      <Courses />
      <Footer />
    </div>
  );
};

export default Home;