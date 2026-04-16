import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Search, Clock, 
  CheckCircle, Filter, Fingerprint, Award 
} from 'lucide-react';
import { api } from '../../services/Api';

const SubmissionsPage = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
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
    };
    if (assessmentId) loadData();
  }, [assessmentId]);

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
    <div className="container-fluid py-4 px-4 bg-light/30 min-vh-100">
      {/* --- HEADER SECTION --- */}
      <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-4 shadow-sm border border-slate-200">
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-white rounded-circle p-2 border shadow-sm hover-scale"
            style={{ transition: 'all 0.2s' }}
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h4 className="fw-black mb-0 text-slate-900 tracking-tight">Assessment Results</h4>
            <div className="mt-1 d-flex align-items-center gap-2">
               <span className="badge bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-1 rounded-2 fw-bold" style={{ fontSize: '0.7rem' }}>
                 REFERENCE: {assessmentId}
               </span>
               <span className="text-slate-400 small fw-medium">| &nbsp; Management Portal</span>
            </div>
          </div>
        </div>

        {/* --- SEARCH BOX --- */}
        <div className="d-flex align-items-center gap-3 w-50">
          <div className="input-group shadow-sm rounded-pill overflow-hidden border-slate-200 border bg-white transition-all focus-within-ring">
            <span className="input-group-text bg-white border-0 ps-3">
              <Search size={18} className="text-slate-400"/>
            </span>
            <input 
              type="text" 
              className="form-control border-0 ps-2 shadow-none text-slate-700" 
              style={{ fontSize: '0.9rem' }}
              placeholder="Search by student, ID, or date..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="d-flex align-items-center pe-2">
              <span className="badge rounded-pill bg-slate-900 text-white fw-bold px-3 py-2" style={{ fontSize: '0.7rem' }}>
                {filtered.length} RECORDS
              </span>
            </div>
          </div>
          <button className="btn btn-light rounded-circle border p-2 text-slate-600">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden border border-slate-200">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-slate-50 border-bottom">
              <tr>
                <th className="ps-4 py-3 text-slate-500 small fw-black uppercase tracking-wider" style={{ width: '25%' }}>STUDENT DETAILS</th>
                <th className="py-3 text-slate-500 small fw-black uppercase tracking-wider text-center" style={{ width: '15%' }}>SUBMISSION ID</th>
                <th className="py-3 text-slate-500 small fw-black uppercase tracking-wider text-center" style={{ width: '15%' }}>PERFORMANCE</th>
                <th className="py-3 text-slate-500 small fw-black uppercase tracking-wider" style={{ width: '30%' }}>FEEDBACK & REMARKS</th>
                <th className="pe-4 py-3 text-slate-500 small fw-black uppercase tracking-wider text-center" style={{ width: '50%' }}>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-indigo-600 me-3"></div>
                    <span className="text-slate-500 fw-medium">Accessing Database...</span>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((sub) => (
                  <tr key={sub.submissionId} className="transition-all hover-bg-indigo-50">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-gradient-indigo text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '42px', height: '42px', flexShrink: 0, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div className="fw-black text-slate-900 mb-0" style={{ fontSize: '0.95rem' }}>{sub.studentName}</div>
                          <div className="text-slate-500 small fw-bold uppercase tracking-tighter" style={{ fontSize: '0.75rem' }}>ID: {sub.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-3 bg-slate-100 text-slate-700 border border-slate-200 fw-bold" style={{ fontSize: '0.8rem' }}>
                        <Fingerprint size={14} className="text-slate-400" />
                        {sub.submissionId}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-block">
                        <div className="fw-black text-indigo-600 mb-0 fs-5 d-flex align-items-center justify-content-center gap-1">
                          <Award size={18} />
                          {sub.score}
                        </div>
                        <div className="text-slate-400 small fw-bold tracking-widest uppercase" style={{ fontSize: '0.6rem' }}>Grade: {sub.percentage}%</div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="p-1.5 rounded-circle bg-emerald-50 border border-emerald-100">
                          <CheckCircle size={14} className="text-emerald-500" />
                        </div>
                        <span className="text-slate-600 fw-medium italic" style={{ fontSize: '0.85rem' }}>
                          "{sub.feedback || 'Final evaluation complete'}"
                        </span>
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex flex-column align-items-end gap-1">
                        <div className="d-flex align-items-center gap-2 text-slate-900 fw-black" style={{ fontSize: '0.85rem' }}>
                          <Clock size={14} className="text-indigo-500" />
                          <span>
                            {new Date(sub.submissionDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </span>
                        </div>
                        <div className="text-slate-400 fw-bold uppercase" style={{ fontSize: '0.65rem' }}>
                          {new Date(sub.submissionDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="text-slate-300 mb-2"><Search size={40} /></div>
                    <div className="text-slate-500 fw-bold">No results matching your query</div>
                    <div className="text-slate-400 small">Try searching by student name or exact ID</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        
        .container-fluid { font-family: 'Inter', sans-serif; }
        .fw-black { font-weight: 900; }
        
        .hover-scale:hover { transform: scale(1.1); }
        
        .hover-bg-indigo-50:hover {
          background-color: #f5f7ff !important;
          transition: background-color 0.2s ease;
        }

        .focus-within-ring:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
        }

        .bg-indigo-50 { background-color: #eef2ff; }
        .text-indigo-600 { color: #4f46e5; }
        .text-indigo-500 { color: #6366f1; }
        .bg-slate-50 { background-color: #f8fafc; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .border-slate-200 { border-color: #e2e8f0 !important; }
      `}</style>
    </div>
  );
};

export default SubmissionsPage;