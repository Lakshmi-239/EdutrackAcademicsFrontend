import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Award, Trash2, Settings, 
  FileText, Users
} from 'lucide-react';
import { api } from '../../services/Api';

const AssessmentCard = ({ assessment, onRefresh }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ submittedCount: 0, totalStudents: 0, isLoading: true });

  const {
    assessmentId = 'N/A',
    type = 'Assessment',
    courseId = 'N/A',
    courseName = 'Course Name',
    maxMarks = 0,
    dueDate,
    status: backendStatus = 'Open',
    // Taking the displayStatus passed from the parent component
    displayStatus = 'Active' 
  } = assessment;
  

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getAssessmentStatusCount(assessmentId);
        setStats({ submittedCount: data.submittedCount, totalStudents: data.totalStudents, isLoading: false });
      } catch (err) {
        console.error("Error fetching status:", err);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };
    if (assessmentId !== 'N/A') fetchStatus();
  }, [assessmentId]);

  const isClosed = displayStatus === 'Inactive';
  
  const theme = {
    color: isClosed ? '#94a3b8' : '#14b8a6', 
    glow: isClosed ? 'rgba(148, 163, 184, 0.15)' : 'rgba(20, 184, 166, 0.25)',
    border: isClosed ? '#1e293b' : '#6366f1', 
    badgeBg: '#0f172a'
  };

  const completionRate = stats.totalStudents > 0 
    ? Math.round((stats.submittedCount / stats.totalStudents) * 100) 
    : 0;

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
    /* Added 'relative' and 'bg-slate-900/50' to the outer wrapper to contain the badge */
    <div className="premium-card-outer relative bg-slate-900/50" style={{ '--state-color': theme.color, '--state-glow': theme.glow, '--border-accent': theme.border }}>
      
      {/* STATUS BADGE: Now inside the relative container. 
          This ensures it stays with the card and doesn't bleed into the Page Header.
      */}
      <div className="status-label" style={{ color: theme.color, borderColor: theme.border, backgroundColor: theme.badgeBg }}>
        {displayStatus.toUpperCase()}
      </div>
      
      <div className="card-frame">
        {/* Left Section */}
        <div className="card-panel identity-panel">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h4 className="title-text">{type}</h4>
            <div className="points-pill">
              <Award size={10} /> {maxMarks} PTS
            </div>
          </div>
          <span className="course-code-text">{courseId}</span>
          <p className="course-title-text">{courseName}</p>
        </div>

        {/* Middle Section: Progress */}
        <div className="card-panel progress-panel">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <span className="info-label"><Users size={12} /> SUBMISSIONS</span>
            <span className="percentage-text" style={{ color: theme.color }}>{completionRate}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${completionRate}%`, backgroundColor: theme.color }}></div>
          </div>
          <p className="student-count-text">
            {stats.isLoading ? '...' : `${stats.submittedCount} / ${stats.totalStudents} students`}
          </p>
        </div>

        {/* Date Section */}
        <div className="card-panel date-panel">
          <p className="info-label">DUE DATE</p>
          <div className="date-content">
            <div className="calendar-icon-wrap" style={{ color: theme.color, borderColor: 'rgba(255,255,255,0.1)' }}>
              <Calendar size={14} />
            </div>
            <div>
              <span className="date-string">{d}</span>
              <span className="time-string">{t}</span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="card-panel actions-panel">
          <button className="action-btn main-btn" style={{ backgroundColor: theme.color }} onClick={() => navigate(`/submissions/${assessmentId}`)}>
             <FileText size={14} /> <span>Results</span>
          </button>
          <button className="action-btn alt-btn" onClick={() => navigate(`/manage-questions/${assessmentId}`)}>
             <Settings size={14} /> <span>Manage</span>
          </button>
          
          <button 
            className="delete-link-btn" 
            onClick={() => window.confirm("Permanently delete?") && api.deleteAssessment(assessmentId).then(onRefresh)}
          >
            <Trash2 size={12} />
            <span>DELETE</span>
          </button>
        </div>
      </div>

      <style>{`
        .premium-card-outer {
          position: relative;
          margin: 32px auto;
          max-width: 1100px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 30px;
          background: #0f172a;
          border: 2px solid #1e293b !important; 
        }

        .premium-card-outer:hover {
          transform: translateY(-5px);
          filter: drop-shadow(0 15px 30px var(--state-glow));
        }

        .status-label {
          position: absolute;
          top: -12px;
          left: 32px;
          z-index: 10;
          padding: 3px 16px;
          border-radius: 12px;
          border: 1.5px solid var(--border-accent);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          box-shadow: 0 8px 16px rgba(0,0,0,0.5);
          text-transform: uppercase;
        }

        .card-frame {
          background: #0f172a;
          border: 3px solid var(--border-accent);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05); 
          border-radius: 24px;
          display: grid;
          grid-template-columns: 1.2fr 1.4fr 0.8fr 190px;
          overflow: hidden;
          position: relative;
        }

        .card-panel { 
          padding: 28px; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          position: relative;
        }

        .identity-panel::after,
        .progress-panel::after,
        .date-panel::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
        }

        .progress-panel { background: rgba(255,255,255,0.01); }
        .actions-panel { padding: 20px; background: rgba(2, 6, 23, 0.5); gap: 10px; align-items: center; }

        .title-text { color: #fff; font-size: 20px; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .course-code-text { color: var(--state-color); font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
        .course-title-text { color: #64748b; font-size: 13px; margin: 6px 0 0 0; font-weight: 500; }
        
        .points-pill { 
          background: rgba(251, 191, 36, 0.05); border: 1px solid rgba(251, 191, 36, 0.2);
          color: #fbbf24; padding: 4px 10px; border-radius: 8px; font-size: 9px; font-weight: 900;
          display: flex; align-items: center; gap: 6px;
        }

        .info-label { color: #475569; font-size: 9px; font-weight: 900; letter-spacing: 0.1em; display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .percentage-text { font-size: 18px; font-weight: 900; font-variant-numeric: tabular-nums; }
        
        .progress-track { height: 8px; background: #1e293b; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .progress-fill { height: 100%; transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 20px; }
        .student-count-text { color: #475569; font-size: 11px; margin-top: 10px; font-weight: 700; }

        .date-content { display: flex; align-items: center; gap: 14px; margin-top: 8px; }
        .calendar-icon-wrap { background: #020617; border: 1px solid; padding: 10px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .date-string { display: block; color: #f1f5f9; font-weight: 800; font-size: 14px; }
        .time-string { color: #475569; font-size: 11px; font-weight: 700; margin-top: 2px; display: block; }

        .action-btn {
          width: 100%; border: none; border-radius: 14px; padding: 12px; font-size: 12px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .main-btn { color: #020617; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2); }
        .alt-btn { background: #0f172a; color: #f1f5f9; border: 1px solid #1e293b; }
        
        .action-btn:hover { transform: translateY(-3px); filter: brightness(1.15); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
        .alt-btn:hover { border-color: #6366f1; color: #818cf8; }
        
        .delete-link-btn {
          background: transparent; border: none; color: #475569; font-size: 9px; font-weight: 900;
          letter-spacing: 0.15em; padding: 8px 0; display: flex; align-items: center; gap: 6px; transition: 0.2s;
        }
        .delete-link-btn:hover { color: #f43f5e; transform: scale(1.05); }

        @media (max-width: 992px) {
          .card-frame { grid-template-columns: 1fr; }
          .identity-panel::after, .progress-panel::after, .date-panel::after { display: none; }
          .card-panel { border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </div>
  );
};

export default AssessmentCard;