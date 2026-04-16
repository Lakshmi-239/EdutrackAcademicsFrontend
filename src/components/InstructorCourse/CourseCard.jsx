import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/Api'; // Adjust path as needed
import { 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  CalendarCheck, 
  Hash, 
  AlertCircle, 
  CheckCircle,
  PartyPopper,
  Loader2
} from 'lucide-react';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [batchId, setBatchId] = useState(course.batchId || course.BatchId || null);
  const [isResolvingBatch, setIsResolvingBatch] = useState(false);

  // Mapping Backend DTO fields
  const cId = course.courseId || course.CourseId || 'N/A';
  const cName = course.courseName || course.CourseName || 'Untitled Course';
  const credits = course.credits ?? course.Credits ?? 0;
  const duration = course.durationInWeeks || course.DurationInWeeks || 0;
  const academicYear = course.academicYearId || course.AcademicYearId || 'N/A';
  
  // Capacity and Enrolled mapping
  const capacity = course.batchSize || course.BatchSize || 0;
  const enrolled = course.currentStudents || course.CurrentStudents || 0;

  // Logic: Active ONLY if Enrolled == Capacity
  const isActiveStatus = (enrolled === capacity && capacity > 0);
  const statusLabel = isActiveStatus ? 'ACTIVE' : 'INACTIVE';
  const statusColor = isActiveStatus ? 'success' : 'secondary';
  const StatusIcon = isActiveStatus ? CheckCircle : AlertCircle;

  // EFFECT: If BatchId is missing, fetch it using your new endpoint
  useEffect(() => {
  const fetchBatchId = async () => {
    // Only fetch if batchId is missing and we have a valid Course ID
    if (!batchId && cId !== 'N/A') {
      // CourseCard.jsx - Inside useEffect fetchBatchId
try {
  setIsResolvingBatch(true);
  const response = await api.getBatchByCourse(cId, cName);
  
  if (response.data && response.data.batchId) {
    setBatchId(response.data.batchId);
  } else {
    setBatchId("N/A"); // Explicitly set N/A if course exists but batch doesn't
  }
} catch (err) {
  // If the server returns 404, we catch it here
  if (err.response && err.response.status === 404) {
    console.warn(`Course ${cId} exists but no batch is assigned yet.`);
    setBatchId("N/A"); 
  } else {
    console.error("Connection Error:", err);
  }
} finally {
  setIsResolvingBatch(false);
}
    }
  };
  fetchBatchId();
}, [cId, cName, batchId]);

  return (
    <div className={`card h-100 shadow-sm rounded-4 border-4 position-relative overflow-hidden hover-shadow transition-all border-${statusColor}`}>
      
      {/* Centered Status Header */}
      <div className={`py-2 text-white text-center fw-bold bg-${statusColor} d-flex align-items-center justify-content-center gap-2 border-bottom border-white border-opacity-25`}>
        <StatusIcon size={18} />
        <span style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>{statusLabel}</span>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        {/* Batch & Year Badges */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-light text-dark border border-secondary border-opacity-25 px-2 py-1 extra-small fw-bold d-flex align-items-center">
            <Hash size={12} className="text-primary me-1" /> 
            Batch: {isResolvingBatch ? <Loader2 size={10} className="animate-spin ms-1" /> : (batchId || 'N/A')}
          </span>
          <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 px-2 py-1 extra-small fw-bold">
            {academicYear}
          </span>
        </div>

        {/* Course Name & ID */}
        <div className="text-center mb-3">
          <h5 className="fw-bold text-dark mb-0 text-truncate px-2">{cName}</h5>
          <small className="text-primary fw-bold font-monospace" style={{ fontSize: '0.7rem' }}>
            ({cId})
          </small>
          <div className="d-flex align-items-center justify-content-center gap-2 text-muted mt-2 extra-small">
            <Clock size={12} /> <span>{duration} Weeks</span>
            <span className="text-silver">|</span>
            <Award size={12} /> <span>{credits} Credits</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-2 mb-4">
          <div className="col-6">
            <div className="p-2 rounded-3 bg-light border border-secondary border-opacity-25 text-center h-100">
              <div className="text-muted mb-1 extra-small">Capacity</div>
              <div className="fw-bold text-dark h5 mb-0">{capacity}</div>
            </div>
          </div>
          <div className="col-6">
            <div className={`p-2 rounded-3 border text-center h-100 ${isActiveStatus ? 'bg-success-subtle border-success' : 'bg-light border-secondary border-opacity-25'}`}>
              <div className={`${isActiveStatus ? 'text-success' : 'text-muted'} mb-1 extra-small`}>Enrolled</div>
              <div className={`fw-bold h5 mb-0 ${isActiveStatus ? 'text-success' : 'text-dark'}`}>{enrolled}</div>
            </div>
          </div>
        </div>

        {/* Dynamic Message Area */}
        <div style={{ minHeight: '42px' }} className="mb-3">
          {isActiveStatus ? (
            <div className="alert alert-success py-2 px-3 m-0 border border-success border-opacity-50 rounded-3 d-flex align-items-center gap-2" style={{ fontSize: '0.7rem' }}>
              <PartyPopper size={14} className="text-success" />
              <span className="fw-bold text-success">Ready! Batch is fully enrolled.</span>
            </div>
          ) : (
            <div className="alert alert-warning py-2 px-3 m-0 border border-warning border-opacity-50 rounded-3 d-flex align-items-center gap-2" style={{ fontSize: '0.7rem' }}>
              <AlertCircle size={14} className="text-warning" />
              <span className="text-warning-emphasis">Waiting for enrollment ({enrolled}/{capacity})</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto d-flex flex-column gap-2">
          <button 
            className="btn btn-dark w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm border border-dark"
            disabled={!batchId}
            onClick={() => navigate(`/view-batch-students/${batchId}`)}
          >
            <Users size={18} /> View Students
          </button>

          <div className="d-flex gap-2">
            <button 
              className={`btn btn-outline-info flex-grow-1 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-1 border-2 ${!batchId ? 'disabled' : ''}`}
              style={{ fontSize: '0.75rem' }}
              onClick={() => batchId && navigate(`/Iattendances?batchId=${batchId}`)}
            >
              <CalendarCheck size={14} /> Attendance
            </button>
            <button 
              className="btn btn-outline-primary flex-grow-1 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-1 border-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => navigate(`/Imodules?courseId=${cId}`)}
            >
              <BookOpen size={14} /> Modules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;