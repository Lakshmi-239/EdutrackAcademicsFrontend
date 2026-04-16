import React, { useState, useEffect } from 'react';
import { Save, Loader2, Info, CheckCircle2, List, AlignLeft, Target, X } from 'lucide-react';
import { api } from '../../services/Api';

const EditQuestionPage = ({ questionData, onClose, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ ...questionData });

  useEffect(() => {
    setFormData({ ...questionData });
  }, [questionData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData };
      if (payload.questionType === 'True/False') {
        payload.optionA = 'True'; payload.optionB = 'False';
        payload.optionC = ''; payload.optionD = '';
      } else if (payload.questionType === 'Subjective') {
        payload.optionA = ''; payload.optionB = '';
        payload.optionC = ''; payload.optionD = '';
        payload.correctOption = 'N/A';
      }

      await api.updateQuestion(formData.questionId, payload);
      onRefresh();
      onClose();
    } catch (err) {
      alert("Error updating question.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="premium-edit-container">
      <form onSubmit={handleSubmit} className="premium-edit-form">
        
        {/* --- MINIMAL ID BAR --- */}
        <div className="id-strip-premium d-flex justify-content-between align-items-center px-4 py-1 border-slate-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="id-label text-slate-500">Question ID:</span>
            <span className="id-value text-indigo-400 fw-black">{formData.questionId}</span>
          </div>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div className="edit-body-scroll px-4 py-4">
          
          {/* Section 1: Classification */}
          <div className="section-container border-slate mb-4">
            <label className="premium-label mb-3 text-indigo-400">CLASSIFICATION</label>
            <div className="d-flex gap-2 p-2 bg-slate-900 rounded-4 border-slate">
              {['MCQ', 'True/False', 'Subjective'].map((type) => {
                const isActive = formData.questionType === type;
                return (
                  <div
                    key={type}
                    className={`flex-fill py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all ${
                      isActive 
                      ? 'bg-indigo-600 text-white shadow-indigo border-indigo' 
                      : 'text-slate-500 opacity-40'
                    }`}
                    style={{ fontSize: '0.75rem', cursor: 'not-allowed' }}
                  >
                    {type === 'MCQ' && <List size={14} />}
                    {type === 'True/False' && <CheckCircle2 size={14} />}
                    {type === 'Subjective' && <AlignLeft size={14} />}
                    {type}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Question Description */}
          <div className="section-container border-slate mb-4">
            <label className="premium-label mb-3 text-slate-400">QUESTION SPECIFICATION</label>
            <textarea 
              className="premium-textarea border-slate focus-indigo" 
              rows="4" 
              value={formData.questionText}
              onChange={(e) => setFormData({...formData, questionText: e.target.value})}
              required
              placeholder="Describe the assessment objective..."
            />
          </div>

          {/* Section 3: Response Options */}
          <div className="section-container border-slate mb-4">
            <label className="premium-label mb-3 text-slate-400">RESPONSE MATRIX</label>
            {formData.questionType === 'MCQ' && (
              <div className="row g-3">
                {['A', 'B', 'C', 'D'].map(l => (
                  <div key={l} className="col-md-6">
                    <div className="premium-input-group border-slate">
                      <span className="input-group-label border-end-slate text-indigo-400">{l}</span>
                      <input 
                        type="text" 
                        className="premium-input" 
                        value={formData[`option${l}`] || ''}
                        onChange={(e) => setFormData({...formData, [`option${l}`]: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.questionType === 'True/False' && (
              <div className="row g-3">
                <div className="col-6">
                  <div className="status-pill border-teal text-teal bg-teal-faded">A: TRUE</div>
                </div>
                <div className="col-6">
                  <div className="status-pill border-slate text-slate-500 bg-slate-900">B: FALSE</div>
                </div>
              </div>
            )}

            {formData.questionType === 'Subjective' && (
              <div className="info-box-premium border-indigo">
                <Info size={18} className="text-indigo-400 mb-2" />
                <p className="small text-slate-300 mb-0 px-2">Extended response enabled. Manual grading required.</p>
              </div>
            )}
          </div>

          {/* Section 4: Scoring Logic */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="section-container border-slate h-100">
                <label className="premium-label mb-2 text-slate-400">CORRECT KEY</label>
                <select 
                  className="premium-select border-slate focus-teal"
                  disabled={formData.questionType === 'Subjective'}
                  value={formData.correctOption}
                  onChange={(e) => setFormData({...formData, correctOption: e.target.value})}
                >
                  <option value="A">Choice A</option>
                  <option value="B">Choice B</option>
                  {formData.questionType === 'MCQ' && (
                    <>
                      <option value="C">Choice C</option>
                      <option value="D">Choice D</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="section-container border-slate h-100">
                <label className="premium-label mb-2 text-slate-400">
                  <Target size={14} className="text-teal-400 me-1" /> POINT VALUE
                </label>
                <input 
                  type="number" 
                  className="premium-input-styled border-slate focus-teal text-center"
                  value={formData.marks}
                  onChange={(e) => setFormData({...formData, marks: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- STICKY FOOTER --- */}
        <div className="edit-footer-sticky p-4 border-slate-top">
          <div className="d-flex gap-3">
            <button type="button" className="btn-premium-outline flex-fill border-slate" onClick={onClose}>
              Discard
            </button>
            <button type="submit" className="btn-premium-solid flex-fill border-indigo shadow-indigo" disabled={isSaving}>
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <><Save size={18}/> Update Record</>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .premium-edit-container {
          background-color: #0f172a;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 0 0 32px 32px;
        }

        .premium-edit-form {
          display: flex;
          flex-direction: column;
          max-height: 85vh;
        }

        .id-strip-premium { background: #0b1120; }
        .id-label { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px; }
        .id-value { font-size: 0.85rem; letter-spacing: 1px; }

        .edit-footer-sticky { background: #0b1120; z-index: 20; }
        
        .edit-body-scroll {
          overflow-y: auto;
          flex-grow: 1;
        }

        .edit-body-scroll::-webkit-scrollbar { width: 5px; }
        .edit-body-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }

        .section-container {
          background: rgba(30, 41, 59, 0.25);
          padding: 24px;
          border-radius: 24px;
        }

        .premium-label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .border-slate { border: 1px solid #1e293b !important; }
        .border-slate-bottom { border-bottom: 1px solid #1e293b !important; }
        .border-slate-top { border-top: 1px solid #1e293b !important; }
        .border-indigo { border: 1px solid #6366f1 !important; }
        .border-teal { border: 1px solid #14b8a6 !important; }

        .premium-textarea {
          background: #020617;
          color: #f8fafc;
          border-radius: 16px;
          padding: 18px;
          width: 100%;
          font-weight: 500;
          border: 1px solid #1e293b;
          outline: none;
          transition: 0.3s;
          resize: none;
        }

        .premium-input-group {
          display: flex;
          background: #020617;
          border-radius: 14px;
          overflow: hidden;
        }

        .input-group-label {
          background: #1e293b;
          padding: 10px 18px;
          font-weight: 900;
          font-size: 0.85rem;
        }

        .premium-input {
          background: transparent;
          color: white;
          padding: 10px 15px;
          width: 100%;
          border: none;
          outline: none;
        }

        .status-pill {
          padding: 14px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.8rem;
          text-align: center;
        }

        .bg-teal-faded { background: rgba(20, 184, 166, 0.05); }

        .premium-select, .premium-input-styled {
          background: #020617;
          color: white;
          border-radius: 14px;
          padding: 12px;
          width: 100%;
          font-weight: 700;
          outline: none;
          transition: 0.3s;
        }

        .focus-indigo:focus { border-color: #6366f1 !important; }
        .focus-teal:focus { border-color: #14b8a6 !important; }

        .btn-premium-outline {
          background: #1e293b;
          color: #94a3b8;
          padding: 14px;
          border-radius: 18px;
          font-weight: 800;
          transition: 0.3s;
          border: 1px solid #1e293b;
        }

        .btn-premium-solid {
          background: #6366f1;
          color: white;
          padding: 14px;
          border-radius: 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.3s;
          border: none;
        }
        .btn-premium-solid:hover { background: #4f46e5; transform: translateY(-2px); }
        .shadow-indigo { box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3); }

        .close-minimal-btn { background: #1e293b; color: #94a3b8; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .close-minimal-btn:hover { background: #f43f5e; color: white; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default EditQuestionPage;