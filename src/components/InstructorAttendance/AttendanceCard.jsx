import React from 'react';
import { BookOpen, Users, ArrowRight, Calendar, Trash2, RotateCcw } from 'lucide-react';

export default function AttendanceCard({ item, onClick, onDelete, onRestore }) {
  // Check if this specific card is deleted
  const isDeleted = item.isDeleted || item.IsDeleted;

  const percentage = item.totalStudents > 0 
    ? Math.round((item.presentCount / item.totalStudents) * 100) 
    : 0;

  const getTheme = (pct) => {
    if (isDeleted) return { color: 'secondary', bg: 'bg-secondary-subtle' }; // Gray theme for deleted
    if (pct >= 80) return { color: 'success', bg: 'bg-success-subtle' };
    if (pct >= 50) return { color: 'warning', bg: 'bg-warning-subtle' };
    return { color: 'danger', bg: 'bg-danger-subtle' };
  };

  const theme = getTheme(percentage);

  return (
    <div 
  className={`card h-100 shadow-sm rounded-4 border border-2 border-bottom border-4 
    ${isDeleted ? 'border-secondary opacity-75' : `border-bottom-${theme.color} shadow-hover-card`} 
    overflow-hidden transition-all`}
  style={{ 
    filter: isDeleted ? 'grayscale(0.8)' : 'none',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Added transition here
    cursor: isDeleted ? 'default' : 'pointer'
  }}
  // Simple "Lifting" logic on the same line
  onMouseEnter={(e) => !isDeleted && (e.currentTarget.style.transform = 'translateY(-5px)', e.currentTarget.classList.replace('shadow-sm', 'shadow-lg'))}
  onMouseLeave={(e) => !isDeleted && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.classList.replace('shadow-lg', 'shadow-sm'))}
>
      {/* 🔴 "DELETED" Watermark Overlay */}
      {isDeleted && (
        <div 
          className="position-absolute top-50 start-50 translate-middle fw-bold text-secondary opacity-25"
          style={{ fontSize: '2rem', zIndex: 0, transform: 'translate(-50%, -50%) rotate(-15deg)' }}
        >
          DELETED
        </div>
      )}

      <div className="card-body p-4" style={{ zIndex: 1 }}>
        {/* TOP SECTION */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className={`bg-${theme.color} text-white p-2 rounded-3 shadow-sm`}>
              <Users size={22} />
            </div>
            
            <div className="d-flex flex-column">
              <span className="fw-bold text-dark fs-5 mb-0">{item.batchId}</span>
              <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                <Calendar size={12} />
                <span>{new Date(item.sessionDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <span className={`badge ${theme.bg} text-${theme.color} border border-${theme.color} rounded-pill px-3 py-2 fw-bold`}>
            {isDeleted ? 'Inactive' : `${percentage}%`}
          </span>
        </div>

        {/* MIDDLE SECTION */}
        <div className={`mb-4 p-3 rounded-3 ${theme.bg} border-start border-3 border-${theme.color}`}>
          <div className="d-flex align-items-center gap-2 text-truncate">
            <BookOpen size={16} className={`text-${theme.color}`} />
            <span className={`fw-bold small text-uppercase text-${theme.color}`}>{item.courseId}</span>
            <span className="text-muted">|</span>
            <span className="fw-bold text-dark text-truncate">{item.courseName}</span>
          </div>
        </div>

        {/* STATS SECTION (Disabled view if deleted) */}
        {/* STATS SECTION */}
<div className="row g-2 text-center mb-3">
  {/* TOTAL CARD */}
  <div className="col-4">
    <div className={`p-2 rounded-3 border bg-white border-primary border-opacity-25 ${isDeleted ? 'opacity-50' : ''}`}>
      <div className="fw-bold text-primary fs-5">{item.totalStudents}</div>
      <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.6rem' }}>Total</div>
    </div>
  </div>

  {/* PRESENT CARD */}
  <div className="col-4">
    <div className={`p-2 rounded-3 border bg-white border-success border-opacity-25 ${isDeleted ? 'opacity-50' : ''}`}>
      <div className="fw-bold text-success fs-5">{item.presentCount}</div>
      <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.6rem' }}>Present</div>
    </div>
  </div>

  {/* ABSENT CARD */}
  <div className="col-4">
    <div className={`p-2 rounded-3 border bg-white border-danger border-opacity-25 ${isDeleted ? 'opacity-50' : ''}`}>
      <div className="fw-bold text-danger fs-5">{item.absentCount}</div>
      <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.6rem' }}>Absent</div>
    </div>
  </div>
</div>

        {/* ACTION FOOTER */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3">
          <div className="d-flex gap-2">
            {/* Delete Button (Disabled if already deleted) */}
            <button 
              className={`btn btn-light text-danger btn-sm rounded-circle p-2 shadow-none border ${isDeleted ? 'disabled opacity-25' : ''}`}
              title="Delete Batch Attendance"
              onClick={(e) => {
                e.stopPropagation();
                if (!isDeleted) onDelete(item);
              }}
              disabled={isDeleted}
            >
              <Trash2 size={16} />
            </button>

            {/* Restore Button (Always available if deleted) */}
            <button 
              className={`btn ${isDeleted ? 'btn-success text-white' : 'btn-light text-success'} btn-sm rounded-circle p-2 shadow-none border`}
              title="Restore Attendance"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(item);
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* View Details (Disabled if deleted) */}
          <div 
            className={`fw-bold small d-flex align-items-center gap-1 ${isDeleted ? 'text-muted cursor-not-allowed' : 'text-primary pointer'}`} 
            onClick={(e) => {
              if (isDeleted) return;
              onClick();
            }}
          >
            View Details <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}