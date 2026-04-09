import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Settings, Clock, CalendarCheck } from 'lucide-react';

const CourseCard = ({ course, onRefresh }) => {
  const navigate = useNavigate();

  // Normalize data from backend
  const bId = course.batchId || course.BatchId || 'N/A';
  const cName = course.courseName || course.CourseName || 'Unknown Course';
  const cId = course.courseId || course.CourseId || 'N/A';
  const isActive = course.isActive !== undefined ? course.isActive : true;
  const duration = course.duration || course.Duration || "TBD";
  const attendance = course.attendanceRate || 0;
  
  const studentCount = course.studentCount || course.currentStudents || 0;
  const moduleCount = course.moduleCount || 0;
  const completedModules = course.completedModules || 0;

  const statusColor = isActive ? 'success' : 'secondary';
  const progressRate = moduleCount > 0 ? Math.round((completedModules / moduleCount) * 100) : 0;

  return (
    <div 
      className="card h-100 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow"
      style={{ 
        border: `1px solid #e0e0e0`,
        borderTop: `6px solid var(--bs-${statusColor})` 
      }}
    >
      <div className="card-body p-4 d-flex flex-column">
        {/* Header */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <span className="badge rounded-pill bg-light text-dark border small">Batch: {bId}</span>
            <span className={`badge rounded-pill bg-${statusColor}-subtle text-${statusColor} fw-bold`}>
              {isActive ? 'Active' : 'Closed'}
            </span>
          </div>
          <h5 className="fw-bold text-dark mb-0 text-truncate">
            {cName} <span className="ms-1 fw-normal text-muted opacity-50" style={{ fontSize: '0.85rem' }}>- {cId}</span>
          </h5>
        </div>

        {/* Duration Box */}
        <div className="mb-4 bg-light rounded-3 p-2 d-flex align-items-center gap-2 text-muted small">
          <Clock size={14} className="text-primary" />
          <span className="fw-semibold">Duration: {duration}</span>
        </div>

        {/* Stats Row (2 Columns as discussed) */}
        <div className="row text-center mb-3 g-2">
          <div className="col-6 border-end">
            <div className="p-1">
              <div className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>Students</div>
              <div className="fw-bold text-dark h5 mb-0">{studentCount}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-1">
              <div className="text-primary mb-1" style={{ fontSize: '0.7rem' }}>Modules</div>
              <div className="fw-bold text-primary h5 mb-0">{moduleCount}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Progress</small>
            <small className="text-dark fw-bold" style={{ fontSize: '0.7rem' }}>{progressRate}%</small>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div className={`progress-bar bg-${statusColor}`} style={{ width: `${progressRate}%` }}></div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-auto d-flex flex-column gap-2">
          <button 
            className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 small fw-bold"
            onClick={() => navigate(`/Ibatches?batchId=${bId}`)}
          >
            <Users size={16} /> Students / Batch
          </button>
          <button 
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 small fw-bold"
            onClick={() => navigate(`/Imodules?courseId=${cId}`)}
          >
            <BookOpen size={16} /> Course Modules
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;