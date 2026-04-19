import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import AssessmentCard from '../components/InstructorAssessment/AssessmentCard';
import CreateAssessmentModal from '../components/InstructorAssessment/CreateAssessmentModal';
import { Search, Filter, Plus, RefreshCcw, LayoutGrid, Loader2, SearchX, ClipboardCheck } from 'lucide-react';

export default function InstructorAssessmentPage() {
  const [assessments, setAssessments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getAllAssessments();
      const rawData = Array.isArray(data) ? data : [data];

      const enhancedData = rawData.map(item => {
        const idValue = item.assessmentId || item.assessmentID || item.id || 'N/A';
        
        // 1. Get raw status from backend
        const rawStatus = (item.status || '').toLowerCase();
        
        let finalStatus = 'Active';

        // 2. Priority 1: If backend says it's closed/inactive, it's Inactive.
        if (rawStatus === 'closed' || rawStatus === 'inactive') {
          finalStatus = 'Inactive';
        } else {
          // 3. Priority 2: Check the clock
          const now = new Date(); // Current local time

          // Ensure the date string is formatted correctly for local parsing
          // We replace the space with 'T' to make it a standard ISO local string
          const rawDateStr = item.dueDate || item.date || '';
          const dateString = rawDateStr.includes('T') ? rawDateStr : rawDateStr.replace(' ', 'T');
          
          const targetDate = new Date(dateString);

          // If the date is valid, compare strictly
          if (!isNaN(targetDate.getTime())) {
            // If the current time has passed the deadline
            if (now > targetDate) {
              finalStatus = 'Inactive';
            }
          }
        }

        return {
          ...item,
          assessmentID: String(idValue),
          displayStatus: finalStatus 
        };
      });
      
      setAssessments(enhancedData);
      setFilteredData(enhancedData);
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
    fetchData();

    const interval = setInterval(fetchData, 30000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const results = assessments.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const dateObj = item.date || item.Date || item.dueDate || item.DueDate;
      const formattedDate = dateObj ? new Date(dateObj).toLocaleDateString() : "";

      const searchableText = [
        item.assessmentID,
        item.assessmentName,
        item.courseId,
        item.courseName,
        item.type,
        formattedDate 
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = searchableText.includes(searchLower);
      const matchesStatus = statusFilter === 'All' || item.displayStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredData(results);
  }, [searchTerm, statusFilter, assessments]);

  // --- THEME ADAPTED LOADING STATE ---
  if (loading) return (
    <div className="flex flex-col justify-center items-center min-vh-100 bg-slate-950">
      <Loader2 className="animate-spin text-teal-400 mb-4" size={48} />
      <span className="font-bold text-slate-400 tracking-widest uppercase text-sm">Syncing Assessments...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 lg:px-8 text-slate-200">
      
      {/* --- PREMIUM BACKGROUND SHIMMER --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -inset-[100%] animate-[spin_30s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0ea5e9_0%,#10b981_50%,#0ea5e9_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row justify-between items-md-center gap-4"> 
            <div className="text-start">
              <h2 className="text-3xl font-extrabold mb-1 flex items-center gap-3 text-white">
                <ClipboardCheck className="text-teal-400" size={32} /> 
                Course <span className="text-teal-400">Assessments</span>
              </h2>
              <p className="text-slate-400 font-medium">Design and manage academic evaluations and student grades.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-pill font-bold text-white transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span>Create Assessment</span>
            </button>
          </div>
        </div>

        {/* --- ACTION BAR (PILL DESIGN) --- */}
        <div className="mb-10">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row align-items-center gap-4">
              
              {/* Search Section */}
              <div className="flex align-items-center flex-grow-1 bg-slate-950/50 rounded-xl px-4 py-2 border border-slate-700 focus-within:border-teal-500/50 transition-all">
                <Search size={20} className="text-slate-500 me-3" />
                <input 
                  type="text" 
                  className="w-full bg-transparent border-0 outline-none text-slate-200 placeholder:text-slate-600 font-medium shadow-none" 
                  placeholder="Search by ID, Course, Type or Date..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Section */}
              <div className="flex align-items-center gap-3 w-full lg:w-auto">
                <div className="flex align-items-center bg-slate-950/50 rounded-xl px-4 py-2 border border-slate-700">
                  <Filter size={16} className="text-teal-400 me-3" />
                  <select 
                    className="bg-transparent border-0 outline-none text-slate-300 font-bold text-sm cursor-pointer min-w-[110px]" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All" className="bg-slate-900 text-white">All Status</option>
                    <option value="Active" className="bg-slate-900 text-white">Active</option>
                    <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                  </select>
                </div>

                <button 
                  className="p-2.5 rounded-pill bg-slate-800 border border-slate-700 text-teal-400 hover:bg-slate-700 hover:text-white transition-all duration-300 hover:rotate-180" 
                  onClick={handleReset}
                >
                  <RefreshCcw size={18} />
                </button>

                <div className="px-6 py-2.5 rounded-xl bg-slate-800 border border-teal-500/20 text-teal-400 font-black text-sm tracking-wider shadow-lg whitespace-nowrap">
                  {filteredData.length} FOUND
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID / LIST SECTION --- */}
        <div className="row g-4">
          {filteredData.length > 0 ? (
            filteredData.map((assessment, index) => (
              <div className="col-12" key={assessment.assessmentID || index}>
                <AssessmentCard assessment={assessment} onRefresh={fetchData} />
              </div>
            ))
          ) : (
            /* --- EMPTY STATE --- */
            <div className="col-12 flex justify-center mt-10">
              <div className="bg-slate-900/50 p-10 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col align-items-center max-w-lg w-full">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-teal-500/10 rounded-full absolute animate-ping"></div>
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex align-items-center justify-center relative z-10 border border-slate-700">
                    <SearchX size={40} className="text-slate-500" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 text-center">No Matches Found</h3>
                <p className="text-slate-400 text-center mb-8">
                  Adjust your filters or keywords to find specific evaluations.
                </p>

                <button 
                  className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)]" 
                  onClick={handleReset}
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateAssessmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchData} />

      <style>{`
        .hover-rotate:hover { transform: rotate(180deg); transition: transform 0.4s ease; }
        .animate-pulse { animation: pulse 2.5s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        /* Custom scrollbar for premium feel */
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