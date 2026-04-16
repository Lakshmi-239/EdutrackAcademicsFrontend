import React, { useState } from 'react';
import { api } from '../../services/Api';
import { Save, BookOpen, Layers, Target, Edit3 } from 'lucide-react';

export default function EditModuleModal({ module, onClose, onRefresh }) {
  // Initialize state with existing module data
  const [formData, setFormData] = useState({
    courseId: module.courseId,
    name: module.name,
    sequenceOrder: module.sequenceOrder,
    learningObjectives: module.learningObjectives
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calls your [HttpPut("module/{moduleId}")] endpoint
      await api.updateModule(module.moduleID, formData);
      onRefresh(); 
      onClose();   
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      alert("Update failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-primary text-white rounded-top-4">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Edit3 size={20} /> Edit Module: {module.moduleID}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">MODULE NAME</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-muted">SEQUENCE ORDER</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    required 
                    value={formData.sequenceOrder}
                    onChange={(e) => setFormData({...formData, sequenceOrder: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-muted">COURSE ID</label>
                  <input type="text" className="form-control bg-light" value={formData.courseId} disabled />
                </div>
              </div>

              <div className="mb-0">
                <label className="form-label small fw-bold text-muted">LEARNING OBJECTIVES</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData({...formData, learningObjectives: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-0 p-4 pt-0">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}