import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import { toast } from 'react-hot-toast';
import ModuleCard from '../components/InstructorModule/ModuleCard';
import CreateModuleModal from '../components/InstructorModule/CreateModuleModal';
import { Search, Plus, RefreshCcw, Layers, Loader2, SearchX, BookOpen } from 'lucide-react';

export default function InstructorModulePage() {
  const [modules, setModules] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleReset = () => {
    setSearchTerm(''); 
    // setFilterStatus is not defined in original state, but kept the logic as per request
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getAllModules(); 
      const rawData = Array.isArray(response.data) ? response.data : [];
      
      const enhancedData = rawData.map(item => ({
        ...item,
        moduleID: String(item.moduleID ||item.moduleId || 'N/A'),
        courseId: String(item.courseId || 'N/A')
      }));

      const sortedData = enhancedData.sort((a, b) => 
        a.courseId.localeCompare(b.courseId) || a.sequenceOrder - b.sequenceOrder
      );

      setModules(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load modules from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = modules.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.courseId.toLowerCase().includes(searchLower) ||
        item.moduleID.toLowerCase().includes(searchLower) ||
        (item.learningObjectives && item.learningObjectives.toLowerCase().includes(searchLower))
      );
    });
    setFilteredData(results);
  }, [searchTerm, modules]);

  // --- LOADING STATE THEME ---
  if (loading) return (
    <div className="flex flex-col justify-center items-center min-vh-100 bg-slate-950">
      <Loader2 className="animate-spin text-teal-400 mb-4" size={48} />
      <span className="font-bold text-slate-400 tracking-widest uppercase text-sm">Syncing Global Curriculum...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 lg:px-8 text-slate-200">
      
      {/* --- PREMIUM BACKGROUND SHIMMER --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -inset-[100%] animate-[spin_30s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0ea5e9_0%,#10b981_50%,#0ea5e9_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {showCreateModal && (
          <CreateModuleModal 
            onClose={() => setShowCreateModal(false)} 
            onRefresh={fetchData} 
          />
        )}

        {/* --- HEADER --- */}
        <div className="mb-8">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row justify-between items-md-center gap-4"> 
            <div className="text-start">
              <h2 className="text-3xl font-extrabold mb-1 flex items-center gap-3 text-white">
                <Layers className="text-teal-400" size={32} /> 
                Course <span className="text-teal-400">Modules</span>
              </h2>
              <p className="text-slate-400 font-medium">Managing modules across all registered courses.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-pill font-bold text-white transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5"
            >
              <Plus size={16}/>
              <span>Create Module</span>
            </button>
          </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="mb-10">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="flex align-items-center gap-4">
              <div className="flex align-items-center flex-grow-1 bg-slate-950/50 rounded-xl px-4 py-2 border border-slate-700 focus-within:border-teal-500/50 transition-all">
                <Search size={20} className="text-slate-500 me-3" />
                <input 
                  type="text" 
                  className="w-full bg-transparent border-0 outline-none text-slate-200 placeholder:text-slate-600 font-medium shadow-none" 
                  placeholder="Search by Course ID or Module Title..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex align-items-center gap-3">
                <button 
                  className="p-2.5 rounded-pill bg-slate-800 border border-slate-700 text-teal-400 hover:bg-slate-700 hover:text-white transition-all duration-300" 
                  onClick={fetchData}
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

        {/* --- GRID --- */}
        <div className="row g-4">
          {filteredData.length > 0 ? (
            filteredData.map((module, index) => (
              <div className="col-12" key={module.moduleID || index}>
                <ModuleCard module={module} onRefresh={fetchData}/>
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
                  Adjust your search terms or course IDs to find specific curriculum content.
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

      <style>{`
        .animate-pulse { animation: pulse 2.5s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        /* Scrollbar customization */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #2dd4bf; }
      `}</style>
    </div>
  );
}