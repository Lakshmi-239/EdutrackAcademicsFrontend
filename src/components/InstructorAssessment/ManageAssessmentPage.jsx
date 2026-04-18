import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import EditQuestionPage from './EditQuestionPage';
import AddQuestionPage from './AddQuestionPage';
import { 
  ChevronLeft, Plus, Pencil, Trash2, 
  CheckCircle2, Loader2, X, HelpCircle, 
  Target, Layers, AlertCircle, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageAssessmentPage = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestionsByAssessment(assessmentId);
      setQuestions(data || []);
    } catch (err) {
      setError("Synchronisation with the EduTrack database failed.");
      toast.error("Database sync failed. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assessmentId) loadData();
  }, [assessmentId]);

  const handleDeleteClick = (e, questionId) => {
    e.stopPropagation(); 
    setDeleteConfirm(questionId);
  };

  const confirmAndExecuteDelete = async (questionId) => {
    // 1. Initialize the loading toast
    const t = toast.loading("Purging question record...");
    
    try {
      await api.deleteQuestion(questionId);
      
      // 2. Success toast
      toast.success("Question deleted successfully.", { id: t });
      
      setDeleteConfirm(null);
      setQuestions(prev => prev.filter(q => q.questionId !== questionId));
      
      // Optional: No longer need setDeleteSuccess(questionId) as toast replaces that UI
    } catch (err) {
      // 3. Error toast with specific detail
      toast.error("Removal failed. Question may be referenced in student logs.", { id: t });
      console.error("Delete failed:", err);
      setDeleteConfirm(null);
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 manage-assessment-root">
        <div className="text-center p-5 glass-card border-indigo animate-pulse">
          <Loader2 className="text-teal mb-3 rotate-icon" size={48} />
          <p className="text-slate-300 fw-bold tracking-widest small">SECURE DATA SYNC...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-assessment-root min-vh-100 py-5">
      <div className="container">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="glass-header d-flex align-items-center justify-content-between mb-5 p-4 border-slate shadow-lg">
          <div className="d-flex align-items-center gap-4">
            <button className="premium-icon-btn border-slate" onClick={() => navigate(-1)}>
              <ChevronLeft size={22} />
            </button>
            <div>
              <h4 className="fw-black text-white mb-1 tracking-tight">Assessment Manager</h4>
              <div className="d-flex align-items-center gap-2">
                <span className="badge-premium border-indigo">Assessment ID: {assessmentId}</span>
                <span className="text-slate-500 small fw-bold uppercase tracking-wider">EduTrack Academics</span>
              </div>
            </div>
          </div>

          <button className="btn-premium-teal border-teal" onClick={() => setShowAddPopup(true)}>
            <Plus size={20} /> <span>Add Question</span>
          </button>
        </div>

        {error && (
          <div className="alert-premium-danger d-flex align-items-center gap-3 mb-4 border-danger">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* --- QUESTIONS LIST --- */}
        <div className="d-flex flex-column gap-4">
          {questions.length > 0 ? (
            questions.map((q, idx) => (
              <div key={q.questionId || idx} className="premium-card-outer border-slate">
                <div className="row g-0 h-100">
                  {/* Main Content Area */}
                  <div className="col-lg-9 p-4 bg-slate-950 border-end-slate">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="index-box border-indigo">Q{idx + 1}</div>
                        <div className="meta-stack">
                          <span className="label-xs">Question ID</span>
                          <span className="value-sm text-indigo-400">{q.questionId}</span>
                        </div>
                      </div>
                      <div className="correct-badge border-teal">
                        <CheckCircle2 size={14} className="text-teal" />
                        <span className="text-teal fw-black">KEY: {q.correctOption || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-3 mb-4">
                      <HelpCircle className="text-slate-600 flex-shrink-0" size={24} />
                      <h5 className="text-white fw-bold lh-base">{q.questionText}</h5>
                    </div>

                    {/* --- OPTIONS AREA --- */}
                    <div className="row g-3">
                      {q.questionType === 'Subjective' ? (
                        <div className="col-12">
                          <div className="subjective-notice-box border-indigo animate-pulse-subtle">
                            <Info size={18} className="text-indigo-400" />
                            <span className="text-slate-400 fw-medium">
                              Descriptive response required. No fixed options available.
                            </span>
                          </div>
                        </div>
                      ) : (
                        ['A', 'B', 'C', 'D'].map((l) => {
                          const text = q[`option${l}`];
                          if (!text) return null;
                          const isCorrect = q.correctOption === l;
                          return (
                            <div key={l} className="col-md-6">
                              <div className={`option-item border-slate ${isCorrect ? 'is-correct border-teal' : ''}`}>
                                <div className="option-letter">{l}</div>
                                <div className="option-text text-slate-300">{text}</div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Sidebar Actions */}
                  <div className="col-lg-3 sidebar-glass p-4 d-flex flex-column bg-slate-900">
                    <div className="mb-auto">
                      <div className="sidebar-meta-row border-slate-bottom pb-3 mb-3">
                        <Layers size={18} className="text-indigo-400 flex-shrink-0" />
                        <div className="meta-stack">
                          <p className="label-xs mb-0">TYPE</p>
                          <p className="value-sm text-white fw-bold uppercase">{q.questionType}</p>
                        </div>
                      </div>
                      <div className="sidebar-meta-row">
                        <Target size={16} className="text-teal-400" />
                        <div>
                          <p className="label-xs">WEIGHTAGE</p>
                          <p className="value-lg text-white">{q.marks} <span className="small text-slate-500">Pts</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                      <button className="action-btn-edit border-slate" onClick={() => setEditingQuestion(q)}>
                        <Pencil size={15} /> <span>Modify</span>
                      </button>
                      <button className="action-btn-delete border-danger" onClick={(e) => handleDeleteClick(e, q.questionId)}>
                        <Trash2 size={15} /> <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-5 glass-card border-slate opacity-75">
               <HelpCircle size={48} className="text-slate-700 mb-3" />
               <h5 className="text-slate-400 fw-bold">No Questions Found</h5>
               <p className="text-slate-600 small">Start by adding a new question to this assessment.</p>
            </div>
          )}
        </div>

        {/* --- MODALS --- */}
        {(showAddPopup || editingQuestion) && (
          <div className="premium-overlay">
            <div className="modal-container-premium border-slate animate-in shadow-2xl">
              <div className="modal-header-premium border-slate-bottom p-4 d-flex justify-content-between align-items-center bg-slate-900">
                <div className="d-flex align-items-center gap-3">
                  <div className="modal-icon-glow bg-indigo border-indigo">
                    {showAddPopup ? <Plus /> : <Pencil />}
                  </div>
                  <h5 className="text-white fw-black mb-0 tracking-tight">{showAddPopup ? "CREATE QUESTION" : "UPDATE QUESTION"}</h5>
                </div>
                <button className="close-circle-btn" onClick={() => { setShowAddPopup(false); setEditingQuestion(null); }}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body-premium p-0 max-vh-75 overflow-auto">
                {showAddPopup ? (
                  <AddQuestionPage assessmentId={assessmentId} onClose={() => setShowAddPopup(false)} onRefresh={loadData} />
                ) : (
                  <EditQuestionPage questionData={editingQuestion} onClose={() => setEditingQuestion(null)} onRefresh={loadData} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="premium-overlay-dark">
            <div className="confirm-modal border-danger animate-zoom">
              <div className="trash-icon-ring border-danger mb-3">
                <Trash2 size={32} />
              </div>
              <h4 className="text-white fw-black mb-2">Confirm Removal</h4>
              <p className="text-slate-400 small mb-4 px-3">
                You are about to delete <strong>Question #{deleteConfirm}</strong>. 
                This action is irreversible and may affect existing assessment data.
              </p>
              <div className="d-flex gap-3 px-2">
                <button className="btn-slate-outline w-100 border-slate" onClick={() => setDeleteConfirm(null)}>Keep</button>
                <button className="btn-danger-solid w-100 shadow-danger" onClick={() => confirmAndExecuteDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        
        .manage-assessment-root {
          background-color: #020617;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #94a3b8;
        }

        .border-slate { border: 1px solid #1e293b !important; }
        .border-slate-bottom { border-bottom: 1px solid #1e293b !important; }
        .border-end-slate { border-right: 1px solid #1e293b !important; }
        .border-indigo { border: 1px solid #6366f1 !important; }
        .border-teal { border: 1px solid #14b8a6 !important; }
        .border-danger { border: 1px solid #f43f5e !important; }

        .glass-header { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(16px); 
          border-radius: 28px; 
        }

        .premium-icon-btn { 
          background: #0f172a; 
          color: white; 
          width: 48px; 
          height: 48px; 
          border-radius: 14px; 
          transition: 0.3s; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border: 1px solid #1e293b;
        }
        .premium-icon-btn:hover { background: #6366f1; transform: translateX(-3px); border-color: #818cf8; }

        .badge-premium { background: rgba(99, 102, 241, 0.1); color: #818cf8; padding: 6px 14px; border-radius: 12px; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.5px; }
        
        .btn-premium-teal { 
          background: #14b8a6; 
          color: #020617; 
          padding: 12px 28px; 
          border-radius: 16px; 
          font-weight: 900; 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          transition: 0.3s; 
          cursor: pointer; 
          border: none; 
          font-size: 0.9rem;
        }
        .btn-premium-teal:hover { background: #2dd4bf; box-shadow: 0 0 30px rgba(20, 184, 166, 0.4); transform: translateY(-2px); }

        .premium-card-outer {
          border-radius: 30px;
          background: #0f172a;
          transition: 0.3s ease;
        }
        .premium-card-outer:hover { transform: translateY(-5px); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }

        .index-box { background: #020617; color: #818cf8; font-weight: 900; padding: 10px 18px; border-radius: 14px; font-size: 0.95rem; }
        .label-xs { display: block; font-size: 0.6rem; font-weight: 800; color: #475569; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 2px; }
        .value-sm { font-weight: 800; font-size: 0.85rem; }
        .value-lg { font-weight: 900; font-size: 1.6rem; line-height: 1; }

        .correct-badge { background: rgba(20, 184, 166, 0.08); padding: 8px 16px; border-radius: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.7rem; }

        .option-item { background: #020617; padding: 16px; border-radius: 18px; display: flex; align-items: center; gap: 16px; height: 100%; }
        .option-letter { background: #1e293b; color: #94a3b8; width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; }
        .is-correct { background: rgba(20, 184, 166, 0.06); }
        .is-correct .option-letter { background: #14b8a6; color: #020617; }
        .option-text { font-weight: 600; font-size: 0.9rem; line-height: 1.4; }

        .sidebar-meta-row { display: flex; align-items: center; gap: 14px; }

        .action-btn-edit { background: #020617; color: white; padding: 12px; border-radius: 14px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s; cursor: pointer; border: 1px solid #1e293b; width: 100%; }
        .action-btn-edit:hover { background: #6366f1; border-color: #6366f1; transform: translateY(-2px); }
        
        .action-btn-delete { background: rgba(244, 63, 94, 0.05); color: #f43f5e; padding: 12px; border-radius: 14px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s; cursor: pointer; border: 1px solid rgba(244, 63, 94, 0.2); width: 100%; }
        .action-btn-delete:hover { background: #f43f5e; color: white; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(244, 63, 94, 0.2); }

        .premium-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .modal-container-premium { background: #0f172a; width: 95%; max-width: 850px; border-radius: 36px; overflow: hidden; }
        .modal-icon-glow { width: 50px; height: 50px; border-radius: 18px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .bg-indigo { background: #6366f1; box-shadow: 0 0 25px rgba(99, 102, 241, 0.5); }
        
        .close-circle-btn { background: #1e293b; color: #94a3b8; border: none; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .close-circle-btn:hover { background: #f43f5e; color: white; transform: rotate(90deg); }

        .premium-overlay-dark { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.9); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 10000; }
        .confirm-modal { background: #0f172a; width: 90%; max-width: 420px; border-radius: 36px; text-align: center; padding: 45px 35px; border: 1px solid rgba(244, 63, 94, 0.2); }
        .trash-icon-ring { width: 85px; height: 85px; border-radius: 50%; color: #f43f5e; background: rgba(244, 63, 94, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; border: 1px solid rgba(244, 63, 94, 0.2); }
        .success-icon-ring { width: 85px; height: 85px; border-radius: 50%; color: #14b8a6; background: rgba(20, 184, 166, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; border: 1px solid rgba(20, 184, 166, 0.2); }

        .btn-slate-outline { background: #1e293b; color: white; border-radius: 16px; padding: 14px; font-weight: 800; transition: 0.3s; border: 1px solid #334155; }
        .btn-slate-outline:hover { background: #334155; }
        .btn-danger-solid { background: #f43f5e; color: white; border: none; border-radius: 16px; padding: 14px; font-weight: 800; transition: 0.3s; }
        .btn-danger-solid:hover { background: #fb7185; transform: scale(1.02); }
        .btn-teal-solid { background: #14b8a6; color: #020617; border: none; border-radius: 16px; padding: 14px; font-weight: 900; transition: 0.3s; }
        .btn-teal-solid:hover { background: #2dd4bf; transform: scale(1.02); }

        .subjective-notice-box { background: rgba(99, 102, 241, 0.05); border: 1px dashed rgba(99, 102, 241, 0.4); padding: 18px 24px; border-radius: 20px; display: flex; align-items: center; gap: 14px; }

        .animate-in { animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-zoom { animation: zoomInPopup 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        @keyframes modalIn { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoomInPopup { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-pulse-subtle { animation: pulse-subtle 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default ManageAssessmentPage;