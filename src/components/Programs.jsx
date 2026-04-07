import React, { useState, useEffect } from 'react';
import { GraduationCap, Clock, BookOpen } from 'lucide-react';
import { api } from '../services/Api';

export const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await api.getPrograms();
        // Defensive check: ensure data is an array
        setPrograms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      Technology: 'from-violet-500 to-indigo-500',
      Business: 'from-teal-500 to-cyan-500',
      Engineering: 'from-coral-500 to-orange-500',
      Arts: 'from-pink-500 to-rose-500',
      Healthcare: 'from-emerald-500 to-green-500',
    };
    return colors[category] || 'from-slate-500 to-gray-500';
  };

  if (loading) {
    return (
      <section id="programs" className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-teal-600 to-coral-600 bg-clip-text text-transparent">
            Our Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of accredited programs designed to advance your career
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((item) => {
            // Helper to handle both PascalCase (C# default) and camelCase (JSON default)
            const id = item.qualificationId || item.QualificationId;
            const name = item.qualificationName || item.QualificationName;
            const shortName = item.qualificationsh || item.Qualificationsh;
            const years = item.qualificationYears || item.QualificationYears;
            const desc = item.qualificationDescription || item.QualificationDescription;

            return (
              <div
                key={id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 border border-gray-100"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${getCategoryColor(shortName)} p-6 text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-8 h-8" />
                    <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                      {shortName}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{name}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{years} Years</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {desc}
                  </p>
                  <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Programs;