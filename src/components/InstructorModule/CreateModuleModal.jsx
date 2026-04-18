import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/Api';
import { X, Save, BookOpen, Layers, Target, PlusCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function CreateModuleModal({ onClose, onRefresh, existingModules = [] }) {
  const [courses, setCourses] = useState([]);
  const [fetchingCourses, setFetchingCourses] = useState(false);
  const [loading, setLoading] = useState(false);
  const instructorId = localStorage.getItem("instructorId");
  
  const [formData, setFormData] = useState({
    courseId: '', 
    name: '',
    sequenceOrder: 1,
    learningObjectives: ''
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setFetchingCourses(true);
        const data = await api.getCoursesByInstructor(instructorId);
        const activeCourses = data.filter(c => c.isActive);
        setCourses(activeCourses);
        if (activeCourses.length > 0) {
          setFormData(prev => ({ ...prev, courseId: activeCourses[0].courseId }));
        }
      } catch (err) {
        toast.error("Could not load courses. Please try again.");
        console.error("Failed to load courses", err);
      } finally {
        setFetchingCourses(false);
      }
    };
    loadCourses();
  }, [instructorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDuplicate = existingModules.some(
      m => m.sequenceOrder === formData.sequenceOrder && m.courseId === formData.courseId
    );
    if (isDuplicate) {
      alert(`Sequence ${formData.sequenceOrder} is already taken.`);
      return;
    }
    setLoading(true);
    try {
      await api.createModule(formData);
      toast.success("Module created successfully!");
      onRefresh(); 
      onClose();   
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Failed to create module";
      toast.error("Error: " + errorMessage);
      console.error("Create module error:", error);
      // alert("Error: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      {/* Container restricted to 85% of viewport height */}
      <div className="modal-container animate-slide-up flex flex-column" style={{ maxHeight: '85vh' }}>
        
        {/* FIXED HEADER */}
        <div className="modal-header-enterprise shrink-0">
          <div className="d-flex align-items-center gap-3">
            <div className="header-icon-wrapper">
              <PlusCircle size={22} className="text-teal-400" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-white tracking-tight">New Module</h5>
              <p className="text-slate-400 mb-0 extra-small uppercase tracking-widest">Curriculum Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-enterprise"><X size={20} /></button>
        </div>

        {/* SCROLLABLE BODY - This ensures content doesn't get cut off */}
        <div className="overflow-y-auto p-4 bg-slate-900 custom-scrollbar" style={{ flex: 1 }}>
          <form id="moduleForm" onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Course Selection */}
              <div className="col-12">
                <label className="form-label-enterprise">Select Active Course</label>
                <div className="input-group-enterprise">
                  <span className="input-icon">
                      {fetchingCourses ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18}/>}
                  </span>
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

              {/* Module Name */}
              <div className="col-md-9">
                <label className="form-label-enterprise">Module Title</label>
                <div className="input-group-enterprise">
                  <span className="input-icon"><Layers size={18} /></span>
                  <input 
                    type="text" 
                    className="form-control-enterprise" 
                    placeholder="e.g. System Design Basics"
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* Sequence Order */}
              <div className="col-md-3">
                <label className="form-label-enterprise">Order</label>
                <div className="input-group-enterprise">
                  <span className="input-icon"><CheckCircle size={18} /></span>
                  <input 
                    type="number" 
                    className="form-control-enterprise text-center" 
                    required 
                    min="1"
                    value={formData.sequenceOrder}
                    onChange={(e) => setFormData({...formData, sequenceOrder: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="col-12">
                <label className="form-label-enterprise">Learning Objectives</label>
                <div className="input-group-enterprise align-items-start">
                  <span className="input-icon mt-2"><Target size={18} /></span>
                  <textarea 
                    className="form-control-enterprise" 
                    rows="4"
                    placeholder="Describe the expected outcomes..."
                    value={formData.learningObjectives}
                    onChange={(e) => setFormData({...formData, learningObjectives: e.target.value})}
                    style={{ minHeight: '120px', resize: 'none' }}
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FIXED FOOTER */}
        <div className="modal-footer-enterprise p-4 bg-slate-900 border-top border-slate-800 shrink-0">
          <div className="d-flex gap-3">
            <button type="button" onClick={onClose} className="btn-enterprise-secondary">
              Discard
            </button>
            <button 
              form="moduleForm"
              type="submit" 
              disabled={loading || fetchingCourses}
              className="btn-enterprise-primary"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Module</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(7, 10, 25, 0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 9999;
          padding: 20px;
        }
        .modal-container {
          background: #0f172a; width: 100%; max-width: 580px;
          border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }
        .modal-header-enterprise {
          background: #0f172a; padding: 1.25rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; justify-content: space-between; align-items: center;
        }
        .header-icon-wrapper {
          background: rgba(20, 184, 166, 0.1); padding: 8px; border-radius: 10px;
          border: 1px solid rgba(20, 184, 166, 0.2);
        }
        .form-label-enterprise {
          color: #94a3b8; font-size: 10px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;
        }
        .input-group-enterprise { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: #5eead4; z-index: 5; opacity: 0.8; }
        .form-control-enterprise {
          background: #1e293b !important; border: 1px solid #334155 !important;
          color: #f8fafc !important; padding: 10px 16px 10px 48px !important;
          border-radius: 12px !important; width: 100%; font-size: 14px;
        }
        .form-control-enterprise:focus { border-color: #14b8a6 !important; outline: none; }
        .btn-enterprise-primary {
          background: #14b8a6; color: #0f172a; border: none; padding: 10px 24px;
          border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; flex-grow: 2;
        }
        .btn-enterprise-secondary {
          background: transparent; color: #94a3b8; border: 1px solid #334155;
          padding: 10px 24px; border-radius: 12px; font-weight: 600; flex-grow: 1;
        }
        .btn-close-enterprise {
          background: rgba(255,255,255,0.05); border: none; color: #64748b;
          width: 32px; height: 32px; border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}