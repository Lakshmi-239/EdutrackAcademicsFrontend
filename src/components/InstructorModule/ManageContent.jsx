import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageContent({ moduleId, moduleName, onClose, onRefresh, editData = null, editingContentId = null }) {
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'Video',
    contentURI: '',
  });

  // Watch for changes in editData to populate the form
  useEffect(() => {
    if (editingContentId && editData) {
      setFormData({
        title: editData.title || '',
        contentType: editData.contentType || 'Video',
        contentURI: editData.contentURI || '',
      });
    } else {
      // Clear form for "Add" mode
      setFormData({ title: '', contentType: 'Video', contentURI: '' });
    }
  }, [editingContentId, editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        moduleId: moduleId,
        title: formData.title,
        contentType: formData.contentType,
        contentURI: formData.contentURI
      };

      if (editingContentId) {
        await api.updateContent(editingContentId, payload);
        toast.success("Resource updated successfully!");
      } else {
        await api.createContent(payload);
        toast.success("Resource added successfully!");
      }
      
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Error saving resource");
      console.error("Save error:", error);
    }
  };

  return (
    <div className="p-3 border rounded-3 bg-white shadow-sm border-primary">
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div>
          <h6 className="fw-bold mb-0 text-primary">
            {editingContentId ? 'Edit Resource' : 'Add New Resource'}
          </h6>
          <small className="text-muted">Module: {moduleName}</small>
        </div>
        <button type="button" className="btn btn-sm" onClick={onClose}><X size={18}/></button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="small fw-bold">Title</label>
            <input 
              type="text" className="form-control form-control-sm" 
              value={formData.title} required
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <label className="small fw-bold">Type</label>
            <select 
              className="form-select form-select-sm"
              value={formData.contentType}
              onChange={(e) => setFormData({...formData, contentType: e.target.value})}
            >
              <option value="Video">Video</option>
              <option value="PDF">PDF</option>
              <option value="Slide">Slide</option>
              <option value="Lab">Lab</option>
            </select>
          </div>
          <div className="col-12">
            <label className="small fw-bold">URL</label>
            <input 
              type="text" className="form-control form-control-sm" 
              value={formData.contentURI} required
              onChange={(e) => setFormData({...formData, contentURI: e.target.value})}
            />
          </div>
          <div className="col-12 mt-3">
            <button type="submit" className="btn btn-primary btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2">
              <Save size={14}/> {editingContentId ? 'Update' : 'Save'} Resource
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}