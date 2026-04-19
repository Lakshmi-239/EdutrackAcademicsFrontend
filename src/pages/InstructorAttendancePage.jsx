import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import AttendanceCard from '../components/InstructorAttendance/AttendanceCard';
import MarkAttendanceModal from '../components/InstructorAttendance/MarkAttendanceModal';
import AttendanceDetailModal from '../components/InstructorAttendance/AttendanceDetailsModal';
import { Search, Plus, RefreshCcw, Loader2, SearchX, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstructorAttendancePage() {
  const [summaries, setSummaries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const [activeRes, deletedRes] = await Promise.all([
        api.getAttendanceSummary(),
        api.getDeletedAttendanceSummary()
      ]);

      const active = (activeRes.data || []).map(i => ({ ...i, isDeleted: false }));
      const deleted = (deletedRes.data || []).map(i => ({ ...i, isDeleted: true }));

      const combined = [...active, ...deleted].sort((a, b) => 
        new Date(b.sessionDate) - new Date(a.sessionDate)
      );

      setSummaries(combined);
      setFilteredData(combined);
      
      if (!loading) toast.success("Records synchronized", { duration: 2000 });
      
    } catch (err) {
      toast.error("Failed to sync attendance database.");
      console.error("Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  useEffect(() => {
    const results = summaries.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const formattedDate = item.sessionDate 
        ? new Date(item.sessionDate).toLocaleDateString().toLowerCase() 
        : '';

      return (
        item.batchId?.toLowerCase().includes(searchLower) ||
        item.courseName?.toLowerCase().includes(searchLower) ||
        item.courseId?.toLowerCase().includes(searchLower) ||
        formattedDate.includes(searchLower)
      );
    });
    setFilteredData(results);
  }, [searchTerm, summaries]);

  // const handleBulkDelete = async (item) => {
  //   const reason = window.prompt(`Enter reason for deleting Batch ${item.batchId}:`);
  //   if (!reason) return;
  //   try {
  //     const res = await api.deleteBatchAttendance(item.batchId, item.sessionDate, reason);
  //     alert(res.data);
  //     fetchSummary(); 
  //   } catch (err) {
  //     alert(err.response?.data || "Deletion failed");
  //   }
  // };

  // const handleBulkRestore = async (item) => {
  //   try {
  //     const res = await api.restoreBatchAttendance(item.batchId, item.sessionDate);
  //     alert(res.data);
  //     fetchSummary();
  //   } catch (err) {
  //     alert(err.response?.data || "Restore failed");
  //   }
  // };

  const handleBulkDelete = async (item) => {
    const reason = window.prompt(`Enter reason for deleting Batch ${item.batchId}:`);
    if (!reason) return;

    const t = toast.loading(`Deleting Batch ${item.batchId} attendance...`);
    try {
      const res = await api.deleteBatchAttendance(item.batchId, item.sessionDate, reason);
      toast.success(res.data || "Records moved to trash.", { id: t });
      fetchSummary(); 
    } catch (err) {
      toast.error(err.response?.data || "Deletion failed", { id: t });
    }
  };

  const handleBulkRestore = async (item) => {
    const t = toast.loading(`Restoring Batch ${item.batchId}...`);
    try {
      const res = await api.restoreBatchAttendance(item.batchId, item.sessionDate);
      toast.success(res.data || "Records restored successfully.", { id: t, icon: '♻️' });
      fetchSummary();
    } catch (err) {
      toast.error(err.response?.data || "Restore failed", { id: t });
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-vh-100 bg-slate-950">
      <Loader2 className="animate-spin text-teal-400 mb-4" size={48} />
      <span className="font-bold text-slate-400 tracking-widest uppercase text-sm">Loading Attendance Records...</span>
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
                <CalendarCheck className="text-teal-400" size={32} /> 
                Batch <span className="text-teal-400">Attendance</span>
              </h2>
              <p className="text-slate-400 font-medium">Monitor and manage student presence across all active batches.</p>
            </div>
            <button 
              onClick={() => setIsMarkModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-pill font-bold text-white transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="mb-10">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row align-items-center gap-4">
              
              <div className="flex align-items-center flex-grow-1 bg-slate-950/50 rounded-xl px-4 py-2 border border-slate-700 focus-within:border-teal-500/50 transition-all">
                <Search size={20} className="text-slate-500 me-3" />
                <input 
                  type="text" 
                  className="w-full bg-transparent border-0 outline-none text-slate-200 placeholder:text-slate-600 font-medium" 
                  placeholder="Search by Batch, Course Name, or Date..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex align-items-center gap-3 w-full lg:w-auto">
                <button 
                  className="p-2.5 rounded-pill bg-slate-800 border border-slate-700 text-teal-400 hover:bg-slate-700 hover:text-white transition-all duration-300 hover:rotate-180" 
                  onClick={fetchSummary}
                  title="Refresh Records"
                >
                  <RefreshCcw size={18} />
                </button>

                <div className="px-6 py-2.5 rounded-xl bg-slate-800 border border-teal-500/20 text-teal-400 font-black text-sm tracking-wider shadow-lg">
                  {filteredData.length} FOUND
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID OR EMPTY STATE --- */}
        <div className="row g-4">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={idx}>
                <AttendanceCard 
                  item={item} 
                  onClick={() => setSelectedSummary(item)} 
                  onDelete={handleBulkDelete}
                  onRestore={handleBulkRestore}
                />
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
                  We couldn't find any records matching <strong>"{searchTerm}"</strong>. Try a different date or batch ID.
                </p>

                <button 
                  className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)]" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MarkAttendanceModal 
        isOpen={isMarkModalOpen} 
        onClose={() => setIsMarkModalOpen(false)} 
        onRefresh={fetchSummary} 
      />
      {selectedSummary && (
        <AttendanceDetailModal 
          isOpen={!!selectedSummary}
          batchId={selectedSummary.batchId}
          date={selectedSummary.sessionDate}
          onClose={() => setSelectedSummary(null)}
          onUpdate={fetchSummary} 
        />
      )}

      {/* --- STYLES --- */}
      <style>{`
        .hover-rotate:hover { transform: rotate(180deg); transition: transform 0.4s ease; }
        .animate-pulse { animation: pulse 2.5s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
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