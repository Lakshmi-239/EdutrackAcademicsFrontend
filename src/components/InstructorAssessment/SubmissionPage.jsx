import React, { useState, useEffect, useCallback } from 'react'; // useCallback added for optimization
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Search, Clock, 
  CheckCircle, Filter, Fingerprint, Award, Loader2
} from 'lucide-react';
import { api } from '../../services/Api';

const SubmissionsPage = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Function ni extract chesi ikkada define cheyali
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getSubmissionsByAssessment(assessmentId);
      if (response && response.data) {
        setSubmissions(response.data);
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  // 2. Initial load ki loadData function ni vaadali
  useEffect(() => {
    if (assessmentId) {
      loadData();
    }
  }, [assessmentId, loadData]);

  const filtered = submissions.filter(s => {
    const term = searchTerm.toLowerCase();
    const dateStr = new Date(s.submissionDateTime).toLocaleString('en-GB', {
      day: '2-digit', month: 'short'
    }).toLowerCase();

    return (
      s.studentName?.toLowerCase().includes(term) ||
      s.studentId?.toLowerCase().includes(term) ||
      s.submissionId?.toLowerCase().includes(term) ||
      s.feedback?.toLowerCase().includes(term) ||
      dateStr.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#060b13] text-white pt-24 pb-12 px-6 lg:px-10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 blur-[120px] rounded-full"></div>
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-teal-400 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1 italic text-nowrap">
              Assessment <span className="text-teal-400 not-italic">Results</span>
            </h2>
            <div className="px-3 py-1 w-fit bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-black tracking-widest uppercase">
              Assessment ID: {assessmentId}
            </div>
          </div>
        </div>

        {/* --- BIG SEARCH BAR --- */}
        <div className="flex items-center gap-3 w-full md:max-w-[700px]"> 
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500 group-focus-within:text-teal-400 transition-colors" />
            </div>
            <input 
              type="text" 
              className="w-full bg-slate-900/50 border border-slate-800 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 rounded-2xl py-3.5 pl-12 pr-32 text-sm text-slate-200 placeholder:text-slate-600 transition-all outline-none backdrop-blur-md" 
              placeholder="Search student, ID, or date..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-2">
              <div className="h-full flex items-center px-3 border-l border-slate-800 text-slate-500">
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-teal-400 mr-1">{filtered.length}</span> Found
                </span>
              </div>
              <button 
                onClick={loadData} 
                disabled={loading}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-teal-400 rounded-xl transition-all active:scale-90 disabled:opacity-50"
              >
                <Loader2 size={16} className={loading ? "animate-spin text-teal-400" : "hidden"} />
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="relative z-10 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-800/30">
                <th className="px-8 py-5 text-left text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Student Details</th>
                <th className="px-6 py-5 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Fingerprint</th>
                <th className="px-6 py-5 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Performance</th>
                <th className="px-6 py-5 text-left text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Feedback</th>
                <th className="px-8 py-5 text-right text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading && submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto mb-4" />
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Database...</span>
                  </td>
                </tr>
              ) : filtered.map((sub) => (
                <tr key={sub.submissionId} className="group hover:bg-slate-800/30 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
                        <User size={20} className="text-teal-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-100">{sub.studentName}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase">ID: {sub.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400">
                      <Fingerprint size={12} className="text-teal-500/50" />
                      {sub.submissionId}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-teal-400 font-black text-lg flex items-center justify-center gap-1">
                      <Award size={18} /> {sub.score}
                    </div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">{sub.percentage}%</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-slate-400 font-medium italic">"{sub.feedback || 'Evaluation Complete'}"</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-slate-200 font-black text-sm">
                        <Clock size={14} className="text-teal-500" />
                        {new Date(sub.submissionDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">
                        {new Date(sub.submissionDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .min-h-screen { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default SubmissionsPage;