import React from 'react';
import { BookOpen, Trash2, Edit3, ChevronRight } from 'lucide-react';
import { api } from '../../services/Api';

export default function ModuleCard({ module, onRefresh }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
          await api.deleteModule(module.ModuleID);
          onRefresh();
      } catch (err) { alert("Error deleting module"); }
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 transition-all hover-shadow overflow-hidden">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-light text-muted border px-2 py-1 rounded-pill" style={{ fontSize: '0.7rem' }}>
            ID: {module.ModuleID}
          </span>
          <span className="badge bg-success-subtle text-success rounded-pill px-3">
            Seq: {module.SequenceOrder}
          </span>
        </div>

        <h5 className="fw-bold text-dark mb-1">{module.Name || "Untitled Module"}</h5>
        <p className="text-muted small mb-3">Course: {module.CourseId}</p>

        <div className="bg-light rounded-3 p-3 mb-3" style={{ minHeight: '80px' }}>
          <div className="d-flex align-items-center gap-2 mb-2 text-primary font-monospace" style={{ fontSize: '0.8rem' }}>
            <BookOpen size={14} /> <span>LEARNING OBJECTIVES</span>
          </div>
          <p className="small text-secondary mb-0 line-clamp-2">
            {module.LearningObjectives || "No objectives defined."}
          </p>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-dark flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2">
            <Edit3 size={16} /> Manage
          </button>
          <button className="btn btn-outline-primary d-flex align-items-center justify-content-center rounded-3 px-3">
            <ChevronRight size={18} />
          </button>
        </div>

        <button 
          onClick={handleDelete}
          className="btn btn-link text-danger text-decoration-none w-100 mt-3 small d-flex align-items-center justify-content-center gap-1"
        >
          <Trash2 size={14} /> Delete Module
        </button>
      </div>
    </div>
  );
}