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
        console.error("Failed to load courses", err);
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
      alert(`Sequence ${formData.sequenceOrder} is already taken.`);
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
    <div className="fixed inset-0 z-[1060] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      {/* max-w-4xl for width, but tightly packed vertically */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[1.5rem] shadow-2xl transform animate-in zoom-in-95 duration-300">
        
        {/* HEADER - Reduced Padding */}
        <div className="px-6 py-2 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center rounded-t-[1.5rem]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <PlusCircle size={20} />
            </div>
            <div>
              <h5 className="text-white font-black tracking-tight mb-0 text-base">New Module</h5>
              <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest mb-0">Configuration</p>
            </div>
          </div>
          <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            {/* ROW 1: Course Selection */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Active Course</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400">
                  {fetchingCourses ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16}/>}
                </span>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl ps-11 pe-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                >
                  <option value="" className="bg-slate-900">-- Choose Active Course --</option>
                  {courses.map(course => (
                    <option key={course.courseId} value={course.courseId} className="bg-slate-900">
                      {course.courseId} - {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROW 2: Name and Sequence (Side-by-Side) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Module Title</label>
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
                    placeholder="e.g. Advanced Data Structures"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Order</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400">
                    <CheckCircle size={16}/>
                  </span>
                  <input 
                    type="number" 
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl ps-11 pe-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all font-mono"
                    required 
                    min="1"
                    value={formData.sequenceOrder}
                    onChange={(e) => setFormData({...formData, sequenceOrder: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            {/* ROW 3: Learning Objectives - Smaller Textarea */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-1.5">Learning Objectives</label>
              <div className="relative group">
                <span className="absolute left-4 top-3 text-slate-500 group-focus-within:text-indigo-400">
                  <Target size={16}/>
                </span>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl ps-11 pe-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all min-h-[80px] max-h-[120px] resize-none"
                  rows="3"
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData({...formData, learningObjectives: e.target.value})}
                  placeholder="Achievement outcomes..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* FOOTER - Reduced Padding */}
          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800 flex justify-end gap-3 rounded-b-[1.5rem]">
            <button 
              type="button" 
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] uppercase tracking-widest rounded-lg border border-slate-700 transition-all" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
              disabled={loading || fetchingCourses}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}