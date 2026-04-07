import React from 'react';
import { Target, Award, Users, TrendingUp } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
            About EduTrack
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Empowering learners worldwide with cutting-edge education and innovative learning solutions
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-violet-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">Our Mission</h3>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed">
            At EduTrack, we're on a mission to transform education through technology. We believe that quality education 
            should be accessible to everyone, everywhere. Our platform connects passionate instructors with eager learners, 
            creating a vibrant community of knowledge exchange and continuous growth.
          </p>
        </div>

        {/* What Makes Us Unique */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Makes Us <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Unique</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl p-8 text-white transform transition-all hover:scale-105 hover:shadow-2xl">
              <Award className="w-12 h-12 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Industry-Recognized</h4>
              <p className="text-violet-100">
                Our programs are designed with industry experts, ensuring you gain skills that matter in today's job market.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-8 text-white transform transition-all hover:scale-105 hover:shadow-2xl">
              <Users className="w-12 h-12 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Expert Instructors</h4>
              <p className="text-teal-100">
                Learn from professionals who bring real-world experience and passion to every course they teach.
              </p>
            </div>

            <div className="bg-gradient-to-br from-coral-500 to-orange-500 rounded-2xl p-8 text-white transform transition-all hover:scale-105 hover:shadow-2xl">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Career Growth</h4>
              <p className="text-orange-100">
                We focus on practical skills and career development, helping you advance in your professional journey.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-violet-100 hover:border-violet-300 transition-colors">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <div className="text-gray-600">Active Students</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-teal-100 hover:border-teal-300 transition-colors">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-gray-600">Expert Instructors</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-coral-100 hover:border-coral-300 transition-colors">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-coral-500 to-orange-500 bg-clip-text text-transparent mb-2">
              200+
            </div>
            <div className="text-gray-600">Courses</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-indigo-100 hover:border-indigo-300 transition-colors">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              95%
            </div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

//export default About;