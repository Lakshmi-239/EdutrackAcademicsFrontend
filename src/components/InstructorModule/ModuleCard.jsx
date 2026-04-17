import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import ManageContent from './ManageContent';
import EditModuleModal from './EditModuleModal';
import toast from 'react-hot-toast';
import { 
  Edit3, Trash2, ChevronDown, ChevronUp, 
  Video, FileText, ExternalLink,
  PlayCircle, PlusCircle, Target, 
  Layers, Box, CheckCircle2
} from 'lucide-react';

export default function ModuleCard({ module, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const [showManager, setShowManager] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [editingContentId, setEditingContentId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const fetchContent = async () => {
    try {
      const response = await api.getContentByModule(module.moduleID);
      const data = response.data?.data || response.data || [];
      setContents(Array.isArray(data) ? data.sort((a, b) => a.sequenceOrder - b.sequenceOrder) : []);
    } catch (error) {
      setContents([]);
    }
  };

  useEffect(() => { fetchContent(); }, []);
  useEffect(() => { if (isOpen) fetchContent(); }, [isOpen]);

  const handleAddResource = () => {
    setEditingContentId(null);
    setEditFormData(null);
    setIsOpen(true);
    setShowManager(true);
  };

  const handleEditContent = (content) => {
    setEditingContentId(content.contentID);
    setEditFormData(content);
    setIsOpen(true);
    setShowManager(true);
  };

  const handlePublish = async (contentId) => {
    try {
      await api.publishContent(contentId); 
      toast.success("Content is now LIVE!");
      fetchContent(); 
    } catch (error) {
      toast.error("Failed to publish content");
    }
  };

  const handleLinkClick = (url) => {
    if (!url) return toast.error("Invalid URL");
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {showEditModal && (
        <EditModuleModal module={module} onClose={() => setShowEditModal(false)} onRefresh={onRefresh} />
      )}

      <div 
        onClick={() => !isOpen && setIsOpen(true)} 
        className={`mb-6 rounded-[2rem] transition-all duration-500 overflow-hidden border ${
          isOpen 
          ? 'shadow-2xl border-teal-500/50 bg-slate-900/80' 
          : 'shadow-lg border-slate-800 bg-slate-900/40 hover:border-slate-700'
        }`} 
        style={{ cursor: isOpen ? 'default' : 'pointer', backdropFilter: 'blur(12px)' }}
      >
        {/* TOP BAR - Meta Data */}
        <div className="px-8 py-4 d-flex justify-content-between align-items-center border-bottom border-white/5 bg-black/20">
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              <span className="text-indigo-400 font-black uppercase tracking-tighter" style={{fontSize: '10px'}}>
                Course: {module.courseId || "N/A"}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 text-slate-500 font-mono" style={{fontSize: '10px'}}>
              <Box size={12} />
              <span className="tracking-widest uppercase">MOD-{module.moduleID}</span>
            </div>
          </div>

          <div className={`d-flex align-items-center gap-2 px-4 py-1.5 rounded-full border shadow-inner transition-all ${
            isOpen ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-slate-900 text-slate-400 border-slate-700'
          }`}>
            <Layers size={13} />
            <span className="font-black text-uppercase tracking-tighter" style={{ fontSize: '0.65rem' }}>
              Sequence {module.sequenceOrder}
            </span>
          </div>
        </div>

        {/* MAIN BODY SECTION - 3 Pane Grid */}
        <div className="p-8 row g-0 align-items-center">
          
          {/* Left: Title & Resource Count */}
          <div className="col-lg-4">
            <h3 className="text-white font-bold mb-4 tracking-tight" style={{fontSize: '1.85rem'}}>
              {module.name}
            </h3>
            <div className="d-inline-flex align-items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-full">
              <PlayCircle size={14} className="text-teal-400" />
              <span className="text-teal-400 font-black uppercase tracking-widest" style={{fontSize: '10px'}}>
                {contents.length} Resources
              </span>
            </div>
          </div>

          {/* Center: Learning Objectives */}
          <div className="col-lg-5 d-flex align-items-center border-start border-slate-700/50 ps-lg-5">
            <div className="d-flex gap-4 align-items-center">
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <Target size={24} className="text-teal-400" />
              </div>
              <div>
                <span className="d-block text-slate-500 font-black uppercase tracking-[0.2em] mb-1" style={{fontSize: '10px'}}>
                  Learning Objectives
                </span>
                <p className="text-slate-300 font-semibold mb-0" style={{fontSize: '1rem'}}>
                  {module.learningObjectives || "No objectives defined."}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="col-lg-3 d-flex justify-content-end align-items-center">
            <div className="d-inline-flex gap-3 p-2 bg-slate-950/50 rounded-full border border-slate-800 shadow-xl">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }} 
                className="btn btn-dark rounded-circle p-2 border-slate-700 hover:text-teal-400 transition-all shadow-sm"
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleAddResource(); }} 
                className="btn btn-teal rounded-circle p-2 border-0 bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20"
              >
                <PlusCircle size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); window.confirm("Delete module?") && api.deleteModule(module.moduleID).then(onRefresh); }} 
                className="btn btn-dark rounded-circle p-2 border-slate-700 hover:text-red-400 transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* DRAWER TOGGLE */}
<div className="px-8 pb-6">
  <button 
    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
    className={`btn w-100 rounded-2xl d-flex justify-content-between align-items-center px-6 py-3 transition-all font-black text-[11px] uppercase tracking-widest shadow-lg ${
      isOpen 
        ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20' 
        : 'bg-slate-700 text-white border border-slate-600 hover:bg-slate-600 hover:text-teal-400'
    }`}
  >
    <div className="d-flex align-items-center gap-3">
      <div className={`p-1 rounded-md ${isOpen ? 'bg-slate-950/20' : 'bg-white/10'}`}>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
      <span>{isOpen ? 'Collapse Resource Deck' : 'Expand Module Contents'}</span>
    </div>
    
    <span className={`px-2 py-0.5 rounded-md text-[9px] ${isOpen ? 'bg-slate-950/20' : 'bg-black/30 text-slate-400'}`}>
      {contents.length} ITEMS
    </span>
  </button>
</div>

        {/* CONTENT DRAWER */}
        {isOpen && (
          <div className="p-6 bg-slate-950/40 border-top border-slate-800/50 animate-slide-down">
            {showManager && (
              <div className="mb-8 p-6 rounded-[2rem] bg-slate-900 border border-teal-500/20 shadow-2xl">
                <ManageContent 
                  moduleId={module.moduleID} 
                  moduleName={module.name}
                  editingContentId={editingContentId}
                  editData={editFormData}
                  onClose={() => { setShowManager(false); setEditingContentId(null); }} 
                  onRefresh={fetchContent}
                />
              </div>
            )}

            <div className="vstack gap-3">
              {contents.length > 0 ? contents.map((item) => (
                <div key={item.contentID} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-[1.5rem] hover:border-teal-500/30 transition-all group border-start border-4 border-teal-500/20 shadow-sm">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-4">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        {item.contentType === 'Video' 
                          ? <Video size={20} className="text-teal-400" /> 
                          : <FileText size={20} className="text-emerald-400" />}
                      </div>
                      <div>
                        <span className="font-black text-slate-100 d-block text-lg tracking-tight mb-1">{item.title}</span>
                        <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => handleLinkClick(item.contentURI)}>
                          <ExternalLink size={12} className="text-teal-500" />
                          <small className="text-slate-500 font-bold text-truncate d-inline-block" style={{maxWidth: '250px'}}>{item.contentURI}</small>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                      {item.status === 'Draft' ? (
                        <div className="d-flex align-items-center gap-3 p-1 pe-3 bg-amber-500/5 border border-amber-500/20 rounded-full">
                          <span className="badge bg-amber-500 text-slate-950 rounded-full font-black px-3 py-1" style={{fontSize: '0.6rem'}}>DRAFT</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handlePublish(item.contentID); }} 
                            className="btn btn-sm btn-teal py-1 px-4 rounded-full font-black uppercase tracking-tighter hover:bg-teal-400" 
                            style={{fontSize: '0.65rem'}}
                          >
                            Go Live
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                          <CheckCircle2 size={12} />
                          <span className="font-black uppercase tracking-widest" style={{ fontSize: '0.65rem' }}>Live</span>
                        </div>
                      )}
                      
                      <div className="d-flex gap-2 border-start ps-4 border-slate-800">
                        <button className="btn btn-dark p-2 rounded-circle border-slate-700 hover:text-teal-400" onClick={(e) => { e.stopPropagation(); handleEditContent(item); }}><Edit3 size={14} /></button>
                        <button className="btn btn-dark p-2 rounded-circle border-slate-700 hover:text-red-400" onClick={(e) => { e.stopPropagation(); window.confirm("Remove?") && api.deleteContent(item.contentID).then(fetchContent); }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 rounded-[2rem] bg-slate-900/30 border border-dashed border-slate-800">
                   <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">No resources uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .btn-teal { background-color: #2dd4bf; color: #020617; }
        .btn-teal:hover { background-color: #14b8a6; color: #020617; transform: scale(1.05); }
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}