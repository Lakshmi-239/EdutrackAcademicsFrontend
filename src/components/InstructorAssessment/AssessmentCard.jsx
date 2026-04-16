import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Award, 
  Trash2, 
  Settings, 
  FileText,
  Users,
  Loader2
} from 'lucide-react';
import { api } from '../../services/Api';

const AssessmentCard = ({ assessment, onRefresh }) => {
  const navigate = useNavigate();
  
  // Local state to store the counts from your new API endpoint
  const [stats, setStats] = useState({
    submittedCount: 0,
    totalStudents: 0,
    isLoading: true
  });

  const {
    assessmentId = 'N/A',
    type = 'Assessment',
    courseId = 'N/A',
    courseName = 'Course Name',
    maxMarks = 0,
    dueDate,
    status: backendStatus = 'Open',
  } = assessment;

  // 1. CONNECT TO UI: Fetch status counts on load
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getAssessmentStatusCount(assessmentId);
        setStats({
          submittedCount: data.submittedCount,
          totalStudents: data.totalStudents,
          isLoading: false
        });
      } catch (err) {
        console.error("Error fetching assessment status:", err);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (assessmentId !== 'N/A') fetchStatus();
  }, [assessmentId]);

  const isClosed = backendStatus?.toLowerCase() === 'closed';
  const statusColor = isClosed ? '#64748b' : '#198754'; 
  const pillBg = isClosed ? '#f1f5f9' : '#e6f4ea'; 
  
  // Calculate completion rate using fetched stats
  const completionRate = stats.totalStudents > 0 
    ? Math.round((stats.submittedCount / stats.totalStudents) * 100) 
    : 0;

  const getProgressColor = () => {
    if (isClosed) return '#94a3b8';
    if (completionRate < 35) return '#dc3545';
    if (completionRate < 75) return '#ffc107';
    return '#198754';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { d: "No Date", t: "No Time" };
    const dt = new Date(dateString);
    return {
      d: dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      t: dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const { d, t } = formatDateTime(dueDate);

  return (
    <div className="position-relative pt-2 mb-4">
      {/* COMPACT PILL TABS */}
      <div className="d-flex justify-content-between position-absolute w-100 px-3" style={{ top: '0', zIndex: '1' }}>
        <div className="px-3 py-1 rounded-pill fw-bold text-white shadow-sm" 
             style={{ background: statusColor, fontSize: '0.65rem', textTransform: 'uppercase' }}>
          {isClosed ? 'Inactive' : 'Active'}
        </div>
        
        <div className="d-flex gap-2">
          <div className="px-3 py-1 rounded-pill fw-bold shadow-sm d-flex align-items-center" 
               style={{ background: pillBg, color: statusColor, fontSize: '0.65rem' }}>
            <Award size={12} className="me-1" style={{ color: '#f59e0b' }} />
            {maxMarks} Pts
          </div>
          <div className="px-3 py-1 rounded-pill fw-bold shadow-sm" 
               style={{ background: pillBg, color: statusColor, fontSize: '0.65rem' }}>
            ID: {assessmentId}
          </div>
        </div>
      </div>

      <div className="card border-4 shadow-sm rounded-4 overflow-hidden" style={{ borderColor: statusColor }}>
        <div className="card-body p-0">
          <div className="d-flex align-items-center">
            
            {/* 1. IDENTITY */}
            <div className="p-4" style={{ flex: '0 0 200px' }}>
              <h4 className="fw-bolder text-dark mb-1">{type}</h4>
              <div className="d-flex align-items-center gap-2 text-truncate">
                <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>{courseId}</span>
                <span className="text-muted small">|</span>
                <span className="text-muted fw-medium small text-truncate">{courseName}</span>
              </div>
            </div>

            {/* 2. DEADLINE */}
            <div className="p-4 border-start bg-light-subtle d-flex align-items-center gap-3" style={{ flex: '0 0 200px' }}>
              <Calendar size={18} className="text-info" />
              <div>
                <small className="text-muted d-block fw-bold" style={{ fontSize: '0.55rem' }}>DEADLINE</small>
                <span className="fw-bold text-dark d-block" style={{ fontSize: '0.8rem' }}>{d}</span>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>{t}</span>
              </div>
            </div>

            {/* 3. PROGRESS SECTION (The part you wanted connected) */}
            <div className="p-4 border-start flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Users size={14} />
                  {stats.isLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <span className="fw-bold" style={{ fontSize: '0.7rem' }}>
                      {stats.submittedCount} / {stats.totalStudents} Submissions
                    </span>
                  )}
                </div>
                <span className="fw-bold" style={{ color: getProgressColor(), fontSize: '0.7rem' }}>
                  {completionRate}% Complete
                </span>
              </div>

              <div className="progress rounded-pill shadow-none" style={{ height: '8px', background: '#f1f5f9' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  style={{ 
                    width: `${completionRate}%`, 
                    background: getProgressColor(), 
                    transition: 'width 0.8s ease' 
                  }}
                />
              </div>
            </div>

            {/* 4. ACTIONS */}
            <div className="p-4 border-start bg-white d-flex flex-column align-items-center gap-2" style={{ width: '160px' }}>
              <button 
                className="btn btn-outline-dark btn-xs fw-bold w-100 py-1 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={() => navigate(`/manage-questions/${assessmentId}`)}
              >
                <Settings size={14} /> Manage
              </button>
              <button 
                className="btn btn-sm text-white fw-bold w-100 py-1 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{ background: statusColor, border: 'none', fontSize: '0.75rem' }}
                onClick={() => navigate(`/submissions/${assessmentId}`)}
              >
                <FileText size={14} /> Results
              </button>
              <button 
                className="btn btn-link text-danger p-0 d-flex align-items-center gap-1 opacity-50 hover-100 text-decoration-none"
                onClick={() => window.confirm("Delete assessment?") && api.deleteAssessment(assessmentId).then(onRefresh)}
              >
                <Trash2 size={12} /> <small className="fw-bold" style={{ fontSize: '0.65rem' }}>Delete</small>
              </button>
            </div>

          </div>
        </div>
      </div>
      <style>{`
        .hover-100:hover { opacity: 1 !important; }
        .bg-light-subtle { background-color: #fafbfc; }
        .btn-xs { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default AssessmentCard;