import React from 'react';
import { Calendar, Monitor, User, Trash2 } from 'lucide-react';
import { api } from '../../services/Api';

export default function AttendanceCard({ attendance, onRefresh }) {
  const isPresent = attendance.status === 'Present';

  const handleDelete = async () => {
    if (window.confirm("Delete this attendance record?")) {
      await api.deleteAttendance(attendance.attendanceID, "User Request");
      onRefresh();
    }
  };

  return (
    <div className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative border-bottom border-4 ${isPresent ? 'border-success' : 'border-danger'}`}>
      <div className="card-body p-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-light text-dark border px-2 py-1 rounded-pill small fw-bold">
            ID: {attendance.attendanceID}
          </span>
          <span className={`badge rounded-pill px-3 py-1 ${isPresent ? 'bg-success' : 'bg-danger'}`}>
            {attendance.status}
          </span>
        </div>

        {/* Student/Batch Info */}
        <h5 className="card-title fw-bold mb-1 text-truncate">{attendance.studentName}</h5>
        <p className="text-muted small mb-3">{attendance.batchId} — {attendance.courseName}</p>

        {/* Meta Info Bar */}
        <div className="bg-light rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 small text-muted">
            <Calendar size={14} className="text-primary" />
            <span>{new Date(attendance.sessionDate).toLocaleDateString()}</span>
          </div>
          <div className="d-flex align-items-center gap-2 small text-muted">
            <Monitor size={14} className="text-info" />
            <span>{attendance.mode}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="d-flex gap-2 pt-2">
          <button className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-semibold">
            <User size={14} /> View Student
          </button>
          <button 
            onClick={handleDelete}
            className="btn btn-outline-danger btn-sm rounded-circle p-2 shadow-none border-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}