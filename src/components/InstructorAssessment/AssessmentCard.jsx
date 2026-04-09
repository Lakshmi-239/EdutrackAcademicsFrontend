import React, { useState } from 'react'; // FIXED: Added useState here
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Award, 
  Trash2, 
  Settings, 
  FileText, 
} from 'lucide-react';
import { api } from '../../services/Api'; // FIXED: Ensure this path matches your file structure

const AssessmentCard = ({ assessment, onDelete }) => {
  const navigate = useNavigate();
  
  // NOTE: If you aren't using isViewOpen for a Modal, you can remove this line entirely.
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Destructure with safe defaults
  const {
    assessmentID = 'N/A',
    assessmentName = 'Untitled Assessment',
    courseId = 'N/A',
    courseName = 'General Course',
    maxMarks = 0,
    date,
    displayStatus = 'Open',
    submittedCount = 0,
    totalStudents = 0
  } = assessment;

  // Logic for UI stats
  const pendingCount = Math.max(0, totalStudents - submittedCount);
  const completionRate = totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;

  // FIXED: Handle Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete "${assessmentName}"?`)) {
      try {
        await api.deleteAssessment(id);
        if (onDelete) onDelete(); // Calls the refresh function in the parent component
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete assessment.");
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return { bg: 'bg-success', light: 'bg-success-subtle', text: 'text-success', label: 'Active' };
      case 'closed':
        return { bg: 'bg-secondary', light: 'bg-secondary-subtle', text: 'text-secondary', label: 'Closed' };
      default:
        return { bg: 'bg-primary', light: 'bg-primary-subtle', text: 'text-primary', label: status };
    }
  };

  const status = getStatusConfig(displayStatus);

  return (
    <div 
      className="card h-100 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow"
      style={{ 
        border: `4px solid var(--bs-${status.text.replace('text-', '')})` 
      }}
    >
      <div className="card-body p-4 d-flex flex-column">
        {/* Header: ID & Name */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-start mb-1">
             <span className="badge rounded-pill bg-light text-dark border small">ID: {assessmentID}</span>
             <span className={`badge rounded-pill ${status.light} ${status.text} fw-bold`}>{status.label}</span>
          </div>
          <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={assessmentName}>
            {assessmentName}
          </h5>
          <small className="text-muted fw-semibold">{courseId} - {courseName}</small>
        </div>

        {/* Info Grid: Date & Marks */}
        <div className="row g-2 mb-4 bg-light rounded-3 p-2 mx-0">
          <div className="col-6 border-end">
            <div className="d-flex align-items-center gap-2 text-muted extra-small">
              <Calendar size={14} className="text-primary" />
              <span>Due: {date ? new Date(date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
          <div className="col-6 ps-3">
            <div className="d-flex align-items-center gap-2 text-muted extra-small">
              <Award size={14} className="text-warning" />
              <span>{maxMarks} Marks</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row text-center mb-3 g-2">
          <div className="col-4">
            <div className="p-2 rounded-3 border bg-white shadow-xs">
              <div className="text-muted mb-1 extra-small">Total</div>
              <div className="fw-bold text-dark h6 mb-0">{totalStudents}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 rounded-3 border bg-white shadow-xs">
              <div className="text-success mb-1 extra-small">Submitted</div>
              <div className="fw-bold text-success h6 mb-0">{submittedCount}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 rounded-3 border bg-white shadow-xs">
              <div className="text-danger mb-1 extra-small">Pending</div>
              <div className="fw-bold text-danger h6 mb-0">{pendingCount}</div>
            </div>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted fw-bold extra-small">Completion Rate</small>
            <small className="text-dark fw-bold extra-small">{completionRate}%</small>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div 
              className={`progress-bar ${status.bg}`} 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-2 d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <button 
              className="btn btn-dark flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 small fw-bold"
              onClick={() => navigate(`/manage-questions/${assessmentID}`)}
            >
              <Settings size={16} /> Manage
            </button>
            <button 
              className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 small fw-bold"
              onClick={() => navigate(`/submissions/${assessmentID}`)}
            >
              <FileText size={16} /> Submissions
            </button>
          </div>
          
          {/* FIXED: Delete button now calls handleDelete instead of navigate */}
          <button 
            className="btn btn-link text-danger text-decoration-none small d-flex align-items-center justify-content-center gap-1 opacity-75 hover-opacity-100"
            onClick={() => handleDelete(assessmentID)}
          >
            <Trash2 size={16} /> Delete Assessment
          </button>
        </div>
      </div>

      <style>{`
        .extra-small { font-size: 0.75rem; }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.08) !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AssessmentCard;