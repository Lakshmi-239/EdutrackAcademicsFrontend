import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { X, Save, Link, Type, FileText, Video, Presentation, Microscope } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageContent({ moduleId, moduleName, onClose, onRefresh, editData = null, editingContentId = null }) {
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'Video',
    contentURI: '',
  });

  useEffect(() => {
    if (editingContentId && editData) {
      setFormData({
        title: editData.title || '',
        contentType: editData.contentType || 'Video',
        contentURI: editData.contentURI || '',
      });
    } else {
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

  // Helper to get type-specific icon
  const getTypeIcon = () => {
    switch (formData.contentType) {
      case 'Video': return <Video size={16} />;
      case 'PDF': return <FileText size={16} />;
      case 'Slide': return <Presentation size={16} />;
      case 'Lab': return <Microscope size={16} />;
      default: return <Link size={16} />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* COMPACT HEADER */}
      <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
            {editingContentId ? <Save size={16}/> : <Link size={16}/>}
          </div>
          <div>
            <h6 className="text-white font-black text-sm mb-0 tracking-tight">
              {editingContentId ? 'Edit Resource' : 'Add New Resource'}
            </h6>
            <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest mb-0">Module: {moduleName}</p>
          </div>
        </div>
        <button 
          type="button" 
          className="p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors" 
          onClick={onClose}
        >
          <X size={16}/>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* TITLE INPUT */}
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Resource Title</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Type size={14} />
              </span>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl ps-9 pe-4 py-2 outline-none focus:border-indigo-500/50 transition-all"
                placeholder="Enter title..."
                value={formData.title} 
                required
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          {/* TYPE SELECT */}
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Content Type</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400">
                {getTypeIcon()}
              </span>
              <select 
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl ps-9 pe-4 py-2 outline-none focus:border-indigo-500/50 appearance-none cursor-pointer transition-all"
                value={formData.contentType}
                onChange={(e) => setFormData({...formData, contentType: e.target.value})}
              >
                <option value="Video" className="bg-slate-900">Video</option>
                <option value="PDF" className="bg-slate-900">PDF</option>
                <option value="Slide" className="bg-slate-900">Slide</option>
                <option value="Lab" className="bg-slate-900">Lab</option>
              </select>
            </div>
          </div>

          {/* URL INPUT (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Resource URL (URI)</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400">
                <Link size={14} />
              </span>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl ps-9 pe-4 py-2 outline-none focus:border-indigo-500/50 transition-all font-mono"
                placeholder="https://example.com/resource"
                value={formData.contentURI} 
                required
                onChange={(e) => setFormData({...formData, contentURI: e.target.value})}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="md:col-span-2 mt-2">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest py-2.5 rounded-pill shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Save size={14}/> 
              {editingContentId ? 'Update' : 'Confirm'} Resource
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}