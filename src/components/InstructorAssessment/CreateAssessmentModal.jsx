import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { X, Save, BookOpen, Calendar, Award, Layers, ChevronRight } from 'lucide-react';

export default function CreateAssessmentModal({ isOpen, onClose, onRefresh }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const instructorId = localStorage.getItem("instructorId");
  const [formData, setFormData] = useState({
    courseId: '',
    type: 'Quiz',
    maxMarks: 10,
    dueDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      const loadCourses = async () => {
        try {
          const data = await api.getCoursesByInstructor(instructorId);
          setCourses(data.filter(c => c.isActive));
        } catch (err) {
          console.error("Failed to load courses", err);
        }
      };
      loadCourses();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Added loading state trigger for UX
    const payload = { ...formData, dueDate: formData.dueDate };
    try {
      await api.createAssessment(payload);
      onRefresh();
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container animate-slide-up">
        {/* Premium Header with Glassmorphism Accent */}
        <div className="modal-header-enterprise">
          <div className="d-flex align-items-center gap-3">
            <div className="header-icon-wrapper">
              <Layers size={22} className="text-teal-400" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-white tracking-tight">Create Assessment</h5>
              <p className="text-slate-400 mb-0 extra-small uppercase tracking-widest">EduTrack Academics • Management</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-enterprise"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-slate-900">
          <div className="row g-4">
            
            {/* Course Selection */}
            <div className="col-12">
              <label className="form-label-enterprise">Select Course</label>
              <div className="input-group-enterprise">
                <span className="input-icon"><BookOpen size={18} /></span>
                <select 
                  className="form-control-enterprise"
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                >
                  <option value="" className="bg-slate-800">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course.courseId} value={course.courseId} className="bg-slate-800">
                      {course.courseId} — {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assessment Type */}
            <div className="col-md-6">
              <label className="form-label-enterprise">Assessment Type</label>
              <select 
                className="form-control-enterprise"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Quiz" className="bg-slate-800">Quiz</option>
                <option value="Assignment" className="bg-slate-800">Assignment</option>
                <option value="Exam" className="bg-slate-800">Exam</option>
              </select>
            </div>

            {/* Max Marks */}
            <div className="col-md-6">
              <label className="form-label-enterprise">Maximum Marks</label>
              <div className="input-group-enterprise">
                <span className="input-icon"><Award size={18} /></span>
                <input 
                  type="number" 
                  className="form-control-enterprise" 
                  required 
                  min="1"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({...formData, maxMarks: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="col-12">
              <label className="form-label-enterprise">Submission Deadline</label>
              <div className="input-group-enterprise">
                <span className="input-icon"><Calendar size={18} /></span>
                <input 
                  type="datetime-local" 
                  className="form-control-enterprise" 
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-5">
            <button type="button" onClick={onClose} className="btn-enterprise-secondary">
              Discard
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-enterprise-primary"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <>
                  <span>Create Assessment</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        input[type="datetime-local"].form-control-enterprise {
  color-scheme: dark; /* This tells the browser to use a dark calendar picker */
}
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(7, 10, 25, 0.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
        }
        .modal-container {
          background: #0f172a; width: 100%; max-width: 520px;
          border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        .modal-header-enterprise {
          background: linear-gradient(to right, #1e293b, #0f172a);
          padding: 1.75rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; justify-content: space-between; align-items: center;
        }
        .header-icon-wrapper {
          background: rgba(20, 184, 166, 0.1);
          padding: 10px; border-radius: 12px;
          border: 1px solid rgba(20, 184, 166, 0.2);
        }
        .extra-small { font-size: 10px; font-weight: 700; }
        .form-label-enterprise {
          color: #94a3b8; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;
        }
        .input-group-enterprise {
          position: relative; display: flex; align-items: center;
        }
        .input-icon {
          position: absolute; left: 16px; color: #5eead4; z-index: 5;
          opacity: 0.8;
        }
        .form-control-enterprise {
          background: #1e293b !important; border: 1px solid #334155 !important;
          color: #f8fafc !important; padding: 12px 16px 12px 48px !important;
          border-radius: 12px !important; width: 100%; transition: all 0.2s;
          font-size: 14px;
        }
          .form-control-enterprise::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.8) sepia(50%) saturate(1000%) hue-rotate(130deg); /* Adjusts icon to match teal */
  margin-right: 5px;
}

/* Ensure the background is forced even on focus */
.form-control-enterprise, 
.form-control-enterprise:focus {
  background-color: #1e293b !important;
  color: #f8fafc !important;
}
  
        select.form-control-enterprise { padding-left: 48px !important; appearance: none; }
        .form-control-enterprise:focus {
          border-color: #14b8a6 !important; box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1) !important;
          outline: none;
        }
        .btn-enterprise-primary {
          background: #14b8a6; color: #0f172a; border: none;
          padding: 12px 24px; border-radius: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          flex-grow: 2; transition: all 0.2s;
        }
        .btn-enterprise-primary:hover { background: #2dd4bf; transform: translateY(-1px); }
        .btn-enterprise-secondary {
          background: transparent; color: #94a3b8; border: 1px solid #334155;
          padding: 12px 24px; border-radius: 12px; font-weight: 600;
          flex-grow: 1; transition: all 0.2s;
        }
        .btn-enterprise-secondary:hover { background: rgba(255,255,255,0.05); color: #f8fafc; }
        .btn-close-enterprise {
          background: rgba(255,255,255,0.05); border: none; color: #64748b;
          width: 36px; height: 36px; border-radius: 10px; transition: 0.2s;
        }
        .btn-close-enterprise:hover { background: #ef4444; color: white; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}