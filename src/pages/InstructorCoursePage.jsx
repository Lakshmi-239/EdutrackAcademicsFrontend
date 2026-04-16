import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import CourseCard from '../components/InstructorCourse/CourseCard'; 
import { Search, Filter, RefreshCcw, GraduationCap, UserCheck, Loader2, SearchX } from 'lucide-react';

export default function InstructorCoursePage() {
  const [courses, setCourses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const instructorId = localStorage.getItem("instructorId");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getInstructorCourses(instructorId);
      const rawData = response.data || response || [];
      setCourses(rawData);
      setFilteredData(rawData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('All');
    fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = courses.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const bId = String(item.batchId || item.BatchId || "").toLowerCase();
      const cId = String(item.courseId || item.CourseId || "").toLowerCase();
      const cName = String(item.courseName || item.CourseName || "").toLowerCase();

      const enrolled = item.currentStudents || 0;
      const capacity = item.batchSize || 0;
      const displayStatus = (enrolled === capacity && capacity > 0) ? 'Active' : 'Inactive';

      const matchesSearch = bId.includes(searchLower) || cId.includes(searchLower) || cName.includes(searchLower);
      const matchesStatus = statusFilter === 'All' || displayStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredData(results);
  }, [searchTerm, statusFilter, courses]);

  // --- THEME ADAPTED LOADING STATE ---
  if (loading) return (
    <div className="flex flex-col justify-center items-center min-vh-100 bg-slate-950">
      <Loader2 className="animate-spin text-teal-400 mb-4" size={48} />
      <span className="font-bold text-slate-400 tracking-widest uppercase text-sm">Syncing Course Data...</span>
    </div>
  );

  return (
    // Main Background changed to Slate-950
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 lg:px-8 text-slate-200">
      
      {/* --- PREMIUM BACKGROUND SHIMMER (Matching Navbar) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -inset-[100%] animate-[spin_30s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0ea5e9_0%,#10b981_50%,#0ea5e9_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER (Glassmorphism Style) --- */}
        <div className="mb-8">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row justify-between items-md-center gap-4"> 
            <div className="text-start">
              <h2 className="text-3xl font-extrabold mb-1 flex items-center gap-3 text-white">
                <GraduationCap className="text-teal-400" size={32} /> 
                My <span className="text-teal-400">Courses</span>
              </h2>
              <p className="text-slate-400 font-medium">Monitor enrollment status and manage course modules.</p>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-800/80 border border-teal-500/20 shadow-lg">
              <UserCheck size={18} className="text-emerald-400" />
              <span className="font-bold text-emerald-400 text-sm tracking-wide">Instructor: {instructorId}</span>
            </div>
          </div>
        </div>

        {/* --- SEARCH & FILTERS (Dark Modern Style) --- */}
        <div className="mb-10">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row align-items-center gap-4">
              
              {/* Search Input */}
              <div className="flex align-items-center flex-grow-1 bg-slate-950/50 rounded-xl px-4 py-2 border border-slate-700 focus-within:border-teal-500/50 transition-all">
                <Search size={20} className="text-slate-500 me-3" />
                <input 
                  type="text" 
                  className="w-full bg-transparent border-0 outline-none text-slate-200 placeholder:text-slate-600 font-medium" 
                  placeholder="Search by Batch, ID, or Course Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex align-items-center gap-3 w-full lg:w-auto">
                {/* Filter Dropdown */}
                <div className="flex align-items-center bg-slate-950/50 rounded-xl px-4 py-2 border border-slate-700">
                  <Filter size={16} className="text-teal-400 me-3" />
                  <select 
                    className="bg-transparent border-0 outline-none text-slate-300 font-bold text-sm cursor-pointer min-w-[100px]" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All" className="bg-slate-900 text-white">All Status</option>
                    <option value="Active" className="bg-slate-900 text-white">Active</option>
                    <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button 
                  className="p-2.5 rounded-pill bg-slate-800 border border-slate-700 text-teal-400 hover:bg-slate-700 hover:text-white transition-all duration-300 hover:rotate-180" 
                  onClick={handleReset}
                  title="Reset Filters"
                >
                  <RefreshCcw size={18} />
                </button>

                {/* Counter Badge */}
                <div className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black text-sm shadow-lg">
                  {filteredData.length} FOUND
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID --- */}
        <div className="row g-4">
          {filteredData.length > 0 ? (
            filteredData.map((course, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={course.batchId || index}>
                <CourseCard course={course} />
              </div>
            ))
          ) : (
            /* --- EMPTY STATE (Adapted) --- */
            <div className="col-12 flex justify-center mt-10">
              <div className="bg-slate-900/50 p-10 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col align-items-center max-w-lg w-full">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-teal-500/10 rounded-full absolute animate-ping"></div>
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex align-items-center justify-center relative z-10 border border-slate-700">
                    <SearchX size={40} className="text-slate-500" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">No Matches Found</h3>
                <p className="text-slate-400 text-center mb-8">
                  We couldn't find any courses matching your current search or filter criteria.
                </p>

                <button 
                  className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)]" 
                  onClick={handleReset}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Custom scrollbar for a premium feel */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #2dd4bf; }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232dd4bf'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.5rem center !important;
          background-size: 1.2em !important;
          padding-right: 2rem !important;
        }
      `}</style>
    </div>
  );
}