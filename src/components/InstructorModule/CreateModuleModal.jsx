import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { X, Save, BookOpen, Layers, Target, PlusCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function CreateModuleModal({ onClose, onRefresh, existingModules = [] }) {
  const [courses, setCourses] = useState([]);
  const [fetchingCourses, setFetchingCourses] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
        const data = await api.getCoursesByInstructor('I003');
        const activeCourses = data.filter(c => c.isActive);
        setCourses(activeCourses);
        
        if (activeCourses.length > 0) {
          setFormData(prev => ({ ...prev, courseId: activeCourses[0].courseId }));
        }
      } catch (err) {
        console.error("Failed to load courses for dropdown", err);
      } finally {
        setFetchingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isDuplicate = existingModules.some(
      m => m.sequenceOrder === formData.sequenceOrder && m.courseId === formData.courseId
    );
    
    if (isDuplicate) {
      alert(`Module Sequence ${formData.sequenceOrder} is already taken for this course.`);
      return;
    }

    setLoading(true);
    try {
      await api.createModule(formData);
      onRefresh(); 
      onClose();   
    } catch (error) {
      alert("Error: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* Header */}
          <div className="modal-header border-0 p-4 pb-0">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 bg-primary rounded-circle text-white shadow-sm">
                <PlusCircle size={20} />
              </div>
              <h5 className="modal-title fw-bold" style={{ color: '#1B2559' }}>New Course Module</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              
              {/* Course Selection */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Select Course</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-primary">
                    {fetchingCourses ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16}/>}
                  </span>
                  <select 
                    className="form-select border-start-0 ps-0 shadow-none bg-light"
                    required
                    value={formData.courseId}
                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  >
                    <option value="">-- Choose Active Course --</option>
                    {courses.map(course => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.courseId} - {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Row for Name and Sequence */}
              <div className="row g-3 mb-3">
                <div className="col-md-8">
                  <label className="form-label small fw-bold text-muted text-uppercase">Module Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-primary"><Layers size={16}/></span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 ps-0 bg-light shadow-none" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Introduction to Python"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Sequence</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-primary"><CheckCircle size={16}/></span>
                    <input 
                      type="number" 
                      className="form-control border-start-0 ps-0 bg-light shadow-none" 
                      required 
                      min="1"
                      value={formData.sequenceOrder}
                      onChange={(e) => setFormData({...formData, sequenceOrder: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="mb-0">
                <label className="form-label small fw-bold text-muted text-uppercase">Learning Objectives</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 pt-2 align-items-start text-primary"><Target size={16}/></span>
                  <textarea 
                    className="form-control border-start-0 ps-0 bg-light shadow-none" 
                    rows="3"
                    value={formData.learningObjectives}
                    onChange={(e) => setFormData({...formData, learningObjectives: e.target.value})}
                    placeholder="Describe what students will achieve..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 p-4 pt-0 d-flex gap-2">
              <button type="button" className="btn btn-light rounded-pill px-4 flex-grow-1 fw-bold" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn text-white rounded-pill px-4 flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #4318FF 0%, #5E3BFF 100%)' }}
                disabled={loading || fetchingCourses}
              >
                {loading ? <span className="spinner-border spinner-border-sm"></span> : <Save size={18} />}
                Save Module
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}