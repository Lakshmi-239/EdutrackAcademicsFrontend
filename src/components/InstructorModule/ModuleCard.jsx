import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import ManageContent from './ManageContent';
import EditModuleModal from './EditModuleModal';
import toast from 'react-hot-toast';
import { 
  Edit3, Trash2, ChevronDown, ChevronUp, 
  Video, FileText, ExternalLink,
  PlayCircle, PlusCircle, Target, 
  BookOpen, Layers, Box, CheckCircle2
} from 'lucide-react';

export default function ModuleCard({ module, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const [showManager, setShowManager] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // State to track what we are editing
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
    setEditFormData(content); // Pass the whole object
    setIsOpen(true);
    setShowManager(true);
  };

  const handlePublish = async (contentId) => {
    try {
      // Show a loading toast or just proceed with the call
      await api.publishContent(contentId); 
      toast.success("Content is now LIVE!");
      fetchContent(); // This refreshes the list to show the 'LIVE' status
    } catch (error) {
      toast.error("Failed to publish content");
      console.error("Publish error:", error);
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
        className={`mb-4 rounded-4 transition-all overflow-hidden border ${isOpen ? 'shadow-lg border-primary border-2 ring-1 ring-primary ring-opacity-10' : 'shadow-sm border-light'}`} 
        style={{ backgroundColor: '#fff', cursor: isOpen ? 'default' : 'pointer' }}
      >
        {/* TOP BAR */}
        <div className="px-4 py-2 d-flex justify-content-between align-items-center border-bottom border-light">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className={`p-1 rounded ${isOpen ? 'bg-primary text-white' : 'bg-primary bg-opacity-10 text-primary'}`}><Box size={14} /></div>
              <span className="text-muted fw-bold" style={{ fontSize: '0.65rem' }}>MOD-{module.moduleID}</span>
            </div>
          </div>
          <div className={`d-flex align-items-center gap-2 px-3 py-1 rounded-pill border shadow-sm ${isOpen ? 'bg-primary text-white border-primary' : 'bg-white text-primary'}`}>
            <Layers size={13} />
            <span className="fw-bolder text-uppercase" style={{ fontSize: '0.6rem' }}>Sequence {module.sequenceOrder}</span>
          </div>
        </div>

        {/* BODY */}
        {/* <div className="row g-0 align-items-center bg-white">
          <div className="col-md-5 py-4 px-4">
            <h5 className={`mb-1 fw-bolder ${isOpen ? 'text-primary' : 'text-dark'}`}>{module.name}</h5>
            <div className="mt-2">
              <div className="d-flex align-items-center gap-2 bg-primary bg-opacity-10 px-3 py-1 rounded-pill" style={{width:'fit-content'}}>
                <PlayCircle size={14} className="text-primary"/><span className="small fw-bold text-primary">{contents.length} Resources</span>
              </div>
            </div>
          </div> */}

           {/* MIDDLE INTERFACE - Alignment Adjusted */}

        <div className="row g-0 align-items-center bg-white">

          {/* Module Identity */}

          <div className="col-md-5 py-4 px-4">

            <div className="d-flex flex-column align-items-start">

              <h5 className={`mb-1 fw-bolder transition-colors ${isOpen ? 'text-primary' : 'text-dark'}`}

                  style={{ fontSize: '1.25rem', letterSpacing: '-0.2px', lineHeight: '1.2' }}>

                {module.name}

              </h5>

              <div className="mt-2">

                <div className="d-flex align-items-center gap-2 bg-primary bg-opacity-10 px-3 py-1 rounded-pill">

                  <PlayCircle size={14} className="text-primary"/>

                  <span className="small fw-bold text-primary" style={{ fontSize: '0.72rem' }}>

                    {contents.length} Resources

                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="col-md-5 px-4 py-3 border-start border-light d-none d-md-flex align-items-center">
            <div className="d-flex gap-3 align-items-start">
              <div className={`p-2 rounded-circle shadow-sm ${isOpen ? 'bg-primary text-white' : 'bg-light text-primary'}`}><Target size={18} /></div>
              <div>
                <span className="text-uppercase fw-bold text-muted d-block mb-1" style={{ fontSize: '0.55rem' }}>Objectives</span>
                <p className="mb-0 text-secondary lh-sm small opacity-75">{module.learningObjectives || "No objectives defined."}</p>
              </div>
            </div>
          </div>

          <div className="col-md-2 py-3 pe-5 d-flex justify-content-end align-items-center">
            <div className="d-inline-flex gap-2 p-1 bg-light rounded-pill border shadow-sm">
              <button onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }} className="btn btn-white shadow-sm rounded-circle p-2 border-0 bg-white"><Edit3 size={16} className="text-primary" /></button>
              <button onClick={(e) => { e.stopPropagation(); handleAddResource(); }} className="btn btn-primary shadow-sm rounded-circle p-2 border-0"><PlusCircle size={16} /></button>
              <button onClick={(e) => { e.stopPropagation(); window.confirm("Delete module?") && api.deleteModule(module.moduleID).then(onRefresh); }} className="btn btn-white shadow-sm rounded-circle p-2 border-0 bg-white"><Trash2 size={16} className="text-danger" /></button>
            </div>
          </div>
        </div>

        {/* TOGGLE */}
        <div className="px-4 pb-3">
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className={`btn w-100 rounded-3 d-flex justify-content-between align-items-center px-4 py-2 ${isOpen ? 'bg-primary text-white shadow-md' : 'bg-light text-primary fw-bold'}`}>
            <span>{isOpen ? 'Close Content Panel' : 'Manage Content & Resources'}</span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* DRAWER */}
        {isOpen && (
          <div className="p-4 bg-light bg-opacity-25 border-top border-light">
            {showManager && (
              <div className="mb-4">
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

            <div className="vstack gap-2">
              {contents.map((item) => (
                <div key={item.contentID} className="p-3 bg-white border border-light shadow-sm rounded-3 hover-shadow transition-all border-start border-4 border-primary border-opacity-25">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3" style={{ backgroundColor: item.contentType === 'Video' ? '#EEF2FF' : '#ECFDF5' }}>
                        {item.contentType === 'Video' ? <Video size={18} className="text-primary" /> : <FileText size={18} className="text-success" />}
                      </div>
                      <div>
                        <span className="fw-bold text-dark d-block">{item.title}</span>
                        <div className="text-muted d-flex align-items-center gap-1 mt-1" style={{ cursor: 'pointer' }} onClick={() => handleLinkClick(item.contentURI)}>
                          <ExternalLink size={11} className="text-primary" /><small className="text-truncate opacity-75 d-inline-block" style={{maxWidth: '200px'}}>{item.contentURI}</small>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {/* Change this part in your map function */}
{item.status === 'Draft' ? (
  <div className="d-flex align-items-center gap-1 p-1 pe-2 bg-warning bg-opacity-10 border border-warning rounded-pill">
    <span className="badge bg-warning text-dark rounded-pill fw-bolder px-2" style={{fontSize: '0.6rem'}}>DRAFT</span>
    <button 
      onClick={(e) => { 
        e.stopPropagation(); 
        handlePublish(item.contentID); // ADD THIS CALL
      }} 
      className="btn btn-sm btn-success py-0 px-2 rounded-pill fw-bold" 
      style={{fontSize: '0.65rem'}}
    >
      Go Live
    </button>
  </div>
) : (
  <div className="d-flex align-items-center gap-2 px-3 py-1 bg-success bg-opacity-10 border border-success rounded-pill text-success">
    <CheckCircle2 size={12} /><span className="fw-bolder" style={{ fontSize: '0.65rem' }}>LIVE</span>
  </div>
)}
                      
                      <div className="d-flex gap-1 border-start ps-3 border-light">
                        <button className="btn btn-sm btn-light p-1" onClick={(e) => { e.stopPropagation(); handleEditContent(item); }}><Edit3 size={14} className="text-primary"/></button>
                        <button className="btn btn-sm btn-light p-1 text-danger" onClick={(e) => { e.stopPropagation(); window.confirm("Remove?") && api.deleteContent(item.contentID).then(fetchContent); }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}