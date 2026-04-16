import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import EditQuestionPage from './EditQuestionPage';
import AddQuestionPage from './AddQuestionPage';
import { 
  ChevronLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Save,
  X
} from 'lucide-react';

const ManageAssessmentPage = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Stores the questionId to delete

  // Unified function to load data
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestionsByAssessment(assessmentId);
      setQuestions(data || []);
    } catch (err) {
      setError("Failed to connect to the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assessmentId) loadData();
  }, [assessmentId]);

// 1. Function called by the Delete Button in your list
const handleDeleteClick = (questionId) => {
  setDeleteConfirm(questionId); // This opens the attractive popup
};

// 2. Function called when "Yes, Delete" is clicked in the popup
const confirmAndExecuteDelete = async (questionId) => {
  try {
    await api.deleteQuestion(questionId);
    
    // 1. Close the confirmation popup
    setDeleteConfirm(null);

    // 2. Remove from local state
    setQuestions(questions.filter(q => q.questionId !== questionId));

    // 3. Trigger the attractive success popup
    setDeleteSuccess(questionId);

  } catch (err) {
    console.error("Delete failed:", err);
    setDeleteConfirm(null);
    alert("Delete failed. This question might be linked to student responses.");
  }
};

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateQuestion(editingQuestion.questionId, editingQuestion);
      setQuestions(questions.map(q => 
        q.questionId === editingQuestion.questionId ? editingQuestion : q
      ));
      setEditingQuestion(null);
      alert("Question updated successfully!");
    } catch (err) {
      alert("Update failed. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Loader2 className="text-primary animate-spin mb-2" size={40} />
          <p className="text-muted fw-medium">Fetching Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        
        {/* Page Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 bg-white px-3 py-2 rounded-3 shadow-sm border">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" 
                    onClick={() => navigate(-1)} 
                    style={{ width: '40px', height: '40px' }}>
              <ChevronLeft size={20} />
            </button>
            <div className="d-flex flex-column align-items-start ms-2">
              <h5 className="fw-bold mb-0 text-dark">Manage Assessment</h5>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>
                Assessment ID: <span className="text-primary">{assessmentId}</span>
              </small>
            </div>
          </div>

          {/* FIXED: Open popup instead of navigating to blank page */}
          <button 
            className="btn btn-primary px-4 py-2 fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setShowAddPopup(true)}
          >
            <Plus size={18} /> <span>New Question</span>
          </button>
        </div>

        {error && <div className="alert alert-danger rounded-3 shadow-sm">{error}</div>}

        {/* Questions List */}
        <div className="row">
          {questions.map((q, idx) => (
            <div key={q.questionId || idx} className="col-12 mb-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="row g-0">
                  <div className="col-md-9 p-4 bg-white d-flex flex-column">
                    <div className="d-flex align-items-center mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-dark rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.8rem' }}>
                          Question {idx + 1}
                        </span>
                        <div className="text-muted border-start ps-3" style={{ fontSize: '0.7rem' }}>
                          <span className="fw-medium">ID: </span>
                          <span className="fw-bold text-primary">{q.questionId}</span>
                        </div>
                      </div>
                      <div className="ms-auto bg-success-subtle px-3 py-2 rounded-3 d-flex align-items-center gap-2 border border-success-subtle shadow-sm">
                        <CheckCircle2 size={16} className="text-success" />
                        <span className="badge bg-success px-2 py-1 rounded-pill">{q.correctOption}</span>
                      </div>
                    </div>
                    <h5 className="fw-bold mb-4 text-start text-dark pe-5" style={{ lineHeight: '1.6' }}>{q.questionText}</h5>
                    <div className="row g-3">
                      {['A', 'B', 'C', 'D'].map((letter) => {
                        const optionKey = `option${letter}`;
                        const isCorrect = q.correctOption === letter;
                        if (!q[optionKey]) return null;
                        return (
                          <div key={letter} className="col-md-6 text-start">
                            <div className={`p-3 rounded-3 border d-flex align-items-center gap-3 h-100 ${isCorrect ? 'border-success bg-success-subtle shadow-sm' : 'bg-light border-light-subtle'}`}>
                              <span className={`badge ${isCorrect ? 'bg-success' : 'bg-secondary text-white'} rounded-circle`} style={{width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'}}>{letter}</span>
                              <span className={`${isCorrect ? 'fw-bold text-success' : 'text-secondary'}`}>{q[optionKey]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-md-3 bg-light border-start p-4 d-flex flex-column justify-content-center text-center">
                    <div className="mb-3">
                      <span className="badge px-3 py-1 rounded-pill fw-bold text-uppercase shadow-sm" 
                        style={{ fontSize: '0.7rem', backgroundColor: '#f3e5f5', color: '#7b1fa2', border: '1px solid #e1bee7' }}>
                        {q.questionType}
                      </span>
                    </div>
                    <div className="mb-4">
                      <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '0.8rem'}}>Score</small>
                      <h3 className="fw-bold text-primary mb-0">{q.marks} <span className="fs-6 text-muted fw-normal">Marks</span></h3>
                    </div>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary btn-sm py-2 d-flex align-items-center justify-content-center gap-2 fw-medium rounded-3" onClick={() => setEditingQuestion(q)}>
                        <Pencil size={14} /> Edit
                      </button>
                      {/* Inside questions.map((q, idx) => ... ) */}
<button 
  className="btn btn-outline-danger btn-sm py-2 d-flex align-items-center justify-content-center gap-2 fw-medium rounded-3" 
  onClick={() => handleDeleteClick(q.questionId)} // Trigger the custom popup
>
  <Trash2 size={14} /> 
  <span>Delete</span>
</button>


                      {/* <button className="btn btn-outline-danger btn-sm py-2 d-flex align-items-center justify-content-center gap-2 fw-medium rounded-3" onClick={() => handleDelete(q.questionId)}>
                        <Trash2 size={14} /> Delete
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- ADD QUESTION MODAL --- */}
        {showAddPopup && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-5 overflow-hidden animate-slide-up">
                <div className="bg-dark p-4 d-flex align-items-center justify-content-between text-white">
                  <div>
                    <h5 className="fw-bold mb-0">New Question</h5>
                    <small className="text-white-50">Drafting for Assessment {assessmentId}</small>
                  </div>
                  <button className="btn btn-link text-white p-0 shadow-none" onClick={() => setShowAddPopup(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="modal-body p-0">
                  <AddQuestionPage 
                    assessmentId={assessmentId} 
                    onClose={() => setShowAddPopup(false)} 
                    onRefresh={loadData} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

{/* --- EDIT QUESTION MODAL --- */}
{editingQuestion && (
  <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}>
    <div className="modal-dialog modal-md modal-dialog-centered">
      <div className="modal-content border-0 shadow-lg rounded-5 overflow-hidden animate-slide-up">
        {/* Dark Header */}
        <div className="bg-dark p-4 d-flex align-items-center justify-content-between text-white">
          <div className="text-start">
            <h5 className="fw-bold mb-0">Update Question</h5>
            <small className="text-white-50">Editing ID: {editingQuestion.questionId}</small>
          </div>
          <button className="btn btn-link text-white p-0 shadow-none" onClick={() => setEditingQuestion(null)}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body p-0">
          <EditQuestionPage 
            questionData={editingQuestion} 
            onClose={() => setEditingQuestion(null)} 
            onRefresh={loadData} 
          />
        </div>
      </div>
    </div>
  </div>
)}
        {/* --- EDIT MODAL --- */}
        {/* {editingQuestion && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header border-0 pb-0 pt-3 px-3 bg-white">
                  <h6 className="fw-bold mb-0">Edit Question <span className="text-primary">{editingQuestion.questionId}</span></h6>
                  <button type="button" className="btn-close ms-auto" onClick={() => setEditingQuestion(null)}></button>
                </div>
                <div className="modal-body p-3 bg-white">
                  <form onSubmit={handleUpdateSubmit} className="d-flex flex-column gap-3">
                    <div className="border-start border-4 border-primary ps-3 pt-1">
                      <label className="form-label fw-bold small text-uppercase text-primary mb-1">Description</label>
                      <textarea className="form-control rounded-3 border-light-subtle shadow-none p-2" rows="2" style={{ fontSize: '0.9rem' }} value={editingQuestion.questionText} onChange={(e) => setEditingQuestion({...editingQuestion, questionText: e.target.value})} required />
                    </div>
                    <div className="row g-2 bg-light rounded-3 p-2 border">
                        {['A', 'B', 'C', 'D'].map(l => (
                          <div key={l} className="col-6 mb-1">
                            <label className="form-label fw-semibold mb-0" style={{ fontSize: '0.8rem', color: '#555' }}>Opt {l}</label>
                            <input type="text" className="form-control form-control-sm rounded-2 shadow-none" value={editingQuestion[`option${l}`]} onChange={(e) => setEditingQuestion({...editingQuestion, [`option${l}`]: e.target.value})} required />
                          </div>
                        ))}
                    </div>
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label fw-bold small text-muted text-uppercase mb-1">Correct</label>
                        <select className="form-select form-select-sm rounded-3 fw-medium" value={editingQuestion.correctOption} onChange={(e) => setEditingQuestion({...editingQuestion, correctOption: e.target.value})}>
                          {['A', 'B', 'C', 'D'].map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-bold small text-muted text-uppercase mb-1">Marks</label>
                        <input type="number" className="form-control form-control-sm rounded-3 text-center" value={editingQuestion.marks} onChange={(e) => setEditingQuestion({...editingQuestion, marks: parseInt(e.target.value)})} required />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-2 pt-2 border-top">
                      <button type="button" className="btn btn-sm btn-light px-3 rounded-pill border" onClick={() => setEditingQuestion(null)}>Cancel</button>
                      <button type="submit" className="btn btn-sm btn-primary px-4 rounded-pill fw-bold d-flex align-items-center gap-2" disabled={isSaving}>
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* --- IMPROVED ATTRACTIVE DELETE CONFIRMATION POPUP --- */}
{deleteConfirm && (
  <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)' }}>
    {/* Increased width to modal-md for better spacing */}
    <div className="modal-dialog modal-md modal-dialog-centered" style={{ maxWidth: '400px' }}>
      <div className="modal-content border-0 shadow-lg rounded-5 overflow-hidden animate-zoom-in">
        <div className="p-3 text-center bg-white">
          {/* Circular Trash Icon */}
          <div className="bg-danger-subtle text-danger rounded-circle d-inline-flex p-2 mb-2">
            <Trash2 size={20} />
          </div>

          <h3 className="fw-bold text-dark mb-1">Are you sure?</h3>
          
          <p className="text-muted mb-2 px-3" style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
            Do you really want to delete question <span className="fw-bold text-dark">{deleteConfirm}</span>? 
            You won't be able to get this question back again.
          </p>

          {/* Buttons with extended width and proper spacing */}
          <div className="d-flex gap-3 justify-content-center">
            <button 
              className="btn btn-light rounded-pill fw-bold border-0 py-2 shadow-sm" 
              style={{ width: '100px', fontSize: '0.9rem', backgroundColor: '#dfe2e6ff' }}
              onClick={() => setDeleteConfirm(null)}
            >
              No, Keep it
            </button>
            <button 
              className="btn btn-danger rounded-pill fw-bold py-2 shadow-lg" 
              style={{ width: '100px', fontSize: '0.9rem',backgroundColor: '#dc3545' }}
              onClick={() => confirmAndExecuteDelete(deleteConfirm)}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* --- ATTRACTIVE DELETE SUCCESS POPUP --- */}
{deleteSuccess && (
  <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)' }}>
    <div className="modal-dialog modal-md modal-dialog-centered" style={{ maxWidth: '300px' }}>
      <div className="modal-content border-0 shadow-lg rounded-5 overflow-hidden animate-zoom-in">
        <div className="p-3 text-center bg-white">
          
          {/* Animated Success Icon */}
          <div className="bg-success-subtle text-success rounded-circle d-inline-flex p-2 mb-2 shadow-sm">
            <CheckCircle2 size={20} />
          </div>

          <h3 className="fw-bold text-dark mb-1">Deleted!</h3>
          
          <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>
            Question with ID: <span className="fw-bold text-success">{deleteSuccess}</span> 
            <br /> has been deleted successfully.
          </p>

          <button 
            className="btn btn-dark w-50 rounded-pill fw-bold py-2 shadow-lg transition-all"
            style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}
            onClick={() => setDeleteSuccess(null)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {!loading && questions.length === 0 && (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <p className="text-muted mb-0 fw-medium">No questions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAssessmentPage;