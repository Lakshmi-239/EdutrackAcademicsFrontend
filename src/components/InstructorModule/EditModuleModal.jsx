import React, { useState } from 'react';
import { api } from '../../services/Api';
import { Save, Edit3, X, Layers, Hash, Book, Target, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast'; // <--- ADD THIS IMPORT

export default function EditModuleModal({ module, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    courseId: module?.courseId || '',
    name: module?.name || '',
    sequenceOrder: module?.sequenceOrder ?? 1, 
    learningObjectives: module?.learningObjectives || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Send the update
      const response = await api.updateModule(module.moduleID, formData);
      
      // 2. Success Notification (This won't crash now!)
      toast.success("Module updated successfully");
      
      // 3. Refresh the parent list
      if (typeof onRefresh === 'function') {
        await onRefresh(); 
      }
      
      // 4. Close the modal
      onClose();   
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      toast.error("Save failed: " + (error.response?.data?.message || "Internal Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1060] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[1.5rem] shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="px-6 py-2 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <Edit3 size={20} />
            </div>
            <div>
              <h5 className="text-white font-black tracking-tight mb-0">Edit Module</h5>
              <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest mb-0">Module ID: {module?.moduleID}</p>
            </div>
          </div>
          <button type="button" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Module Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400">
                  <Layers size={16}/>
                </span>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl ps-11 pe-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all"
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Sequence Order</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400">
                    <Hash size={16}/>
                  </span>
                  <input 
                    type="number" 
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl ps-11 pe-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all font-mono"
                    required 
                    value={formData.sequenceOrder}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFormData({...formData, sequenceOrder: isNaN(val) ? 0 : val});
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1.5 text-opacity-50">Course ID (ReadOnly)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                    <Book size={16}/>
                  </span>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-800 text-slate-500 text-sm rounded-xl ps-11 pe-4 py-2.5 cursor-not-allowed" 
                    value={formData.courseId} 
                    disabled 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Learning Objectives</label>
              <div className="relative group">
                <span className="absolute left-4 top-3 text-slate-500 group-focus-within:text-indigo-400">
                  <Target size={16}/>
                </span>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl ps-11 pe-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all min-h-[100px] max-h-[150px] resize-none"
                  rows="3"
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData({...formData, learningObjectives: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800 flex justify-end gap-3">
            <button type="button" className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] uppercase tracking-widest rounded-pill border border-slate-700" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] uppercase tracking-widest rounded-pill shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}