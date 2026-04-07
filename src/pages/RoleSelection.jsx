import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Standard for web
import { GraduationCap, Users, BookOpen, Award } from 'lucide-react';

export const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Join as a student to access courses and programs',
      icon: GraduationCap,
      color: 'from-violet-500 to-indigo-500',
      features: ['Access to all courses', 'Track your progress', 'Get certifications', 'Join study groups'],
      path: '/register/student',
    },
    {
      id: 'instructor',
      title: 'Instructor',
      description: 'Teach and inspire students with your expertise',
      icon: BookOpen,
      color: 'from-teal-500 to-cyan-500',
      features: ['Create courses', 'Manage students', 'Earn revenue', 'Build your brand'],
      path: '/register/instructor',
    },
    {
      id: 'coordinator',
      title: 'Coordinator',
      description: 'Coordinate programs and manage academic activities',
      icon: Award,
      color: 'from-coral-500 to-orange-500',
      features: ['Manage programs', 'Oversee instructors', 'Monitor performance', 'Generate reports'],
      path: '/login',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-teal-50 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              < GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              EduTrack
            </span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-teal-600 to-coral-600 bg-clip-text text-transparent">
            Join EduTrack Today
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started on your learning or teaching journey
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${role.color} p-8 text-white`}>
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">{role.title}</h3>
                  <p className="text-center text-sm opacity-90">{role.description}</p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-teal-600 text-xs">✓</span>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Register Button */}
                  <button
                    onClick={() => navigate(role.path)}
                    className={`w-full py-3 bg-gradient-to-r ${role.color} text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105`}
                  >
                    Register as {role.title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
              Login here
            </Link>
          </p>
          <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;