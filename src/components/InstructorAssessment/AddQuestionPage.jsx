import React, { useState } from 'react';
import { Save, Loader2, Info, CheckCircle2, List, AlignLeft, Target, Hash, PlusCircle } from 'lucide-react';
import { api } from '../../services/Api';
import toast from 'react-hot-toast';

const AddQuestionPage = ({ assessmentId, onClose, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    assessmentId: assessmentId,
    questionType: 'MCQ',
    questionText: '',
    optionA: '', optionB: '', optionC: '', optionD: '',
    correctOption: 'A',
    marks: 5
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Initialize the loading toast
    const isSubjective = formData.questionType === 'Subjective';

    // Rule: Subjective >= 0, Others > 0
    if (isSubjective) {
      if (formData.marks < 0) {
        return toast.error("Subjective marks must be 0 or greater.");
      }
    } else {
      if (formData.marks <= 0) {
        return toast.error(`${formData.questionType} marks must be greater than zero.`);
      }
    }
    if (formData.marks > 100) {
      return toast.error("Marks cannot exceed the maximum limit of 100");
    }

    // 1. Initialize loading toast
    const t = toast.loading("Committing question to database...");
    setIsSaving(true);

    try {
      const payload = { ...formData };

      // Formatting payload based on type
      if (payload.questionType === 'True/False') {
        payload.optionA = 'True';
        payload.optionB = 'False';
        payload.optionC = '';
        payload.optionD = '';
      } else if (payload.questionType === 'Subjective') {
        payload.optionA = '';
        payload.optionB = '';
        payload.optionC = '';
        payload.optionD = '';
        payload.correctOption = 'N/A';
      }

      // 2. Execute API Call
      await api.addQuestion(payload);

      // 3. Success notification
      toast.success("Question added to assessment!", { id: t });

      onRefresh();
      onClose();
    } catch (err) {
      // 4. Detailed error notification
      const errorMessage = err.response?.data?.message || err.response?.data || "Maximum Marks limit exceeded or network error.";
      toast.error(errorMessage, { id: t, duration: 4000 });
      console.error("Submission error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="premium-add-container">
      <form onSubmit={handleSubmit} className="premium-add-form">

        {/* --- MINIMAL INFO BAR --- */}
        <div className="id-strip-premium d-flex align-items-center px-4 py-2 border-slate-bottom bg-slate-900">
          <PlusCircle size={14} className="text-teal-400 me-2" />
          <span className="id-label text-slate-500">NEW QUESTION FOR ASSESSMENT:</span>
          <span className="id-value text-teal-400 fw-black ms-2">{assessmentId}</span>
        </div>

        {/* --- SCROLLABLE BODY --- */}
        <div className="add-body-scroll px-4 py-4">

          {/* Section 1: Type Selection */}
          <div className="section-container border-slate mb-4">
            <label className="premium-label mb-3 text-indigo-400"><Hash size={14} /> CATEGORY SELECTION</label>
            <div className="d-flex gap-2 p-2 bg-slate-900 rounded-4 border-slate">
              {['MCQ', 'True/False', 'Subjective'].map((type) => {
                const isActive = formData.questionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    className={`flex-fill py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all border-0 ${isActive
                        ? 'bg-indigo-600 text-white shadow-indigo border-indigo'
                        : 'bg-transparent text-slate-500 hover-slate'
                      }`}
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setFormData({ ...formData, questionType: type })}
                  >
                    {type === 'MCQ' && <List size={14} />}
                    {type === 'True/False' && <CheckCircle2 size={14} />}
                    {type === 'Subjective' && <AlignLeft size={14} />}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Question Input */}
          <div className="section-container border-slate mb-4">
            <label className="premium-label mb-3 text-slate-400">CONTENT SPECIFICATION</label>
            <textarea
              className="premium-textarea border-slate focus-indigo shadow-none"
              rows="4"
              placeholder="Draft the core question content..."
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              required
            />
          </div>

          {/* Section 3: Options Matrix */}
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
                        className="premium-input border-0"
                        placeholder={`Option ${l} value`}
                        value={formData[`option${l}`]}
                        onChange={(e) => setFormData({ ...formData, [`option${l}`]: e.target.value })}
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
                <p className="small text-slate-300 mb-0 px-2">Extended text-response mode. System will bypass auto-key validation</p>
                <div className="small text-slate-400 mt-1 px-2">
                  <strong>Note:</strong> Marks can be 0 for descriptive-only tasks.
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Scoring & Key */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="section-container border-slate h-100">
                <label className="premium-label mb-2 text-slate-400">VALIDATION KEY</label>
                <select
                  className="premium-select border-slate focus-teal"
                  disabled={formData.questionType === 'Subjective'}
                  value={formData.correctOption}
                  onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
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
                  <Target size={14} className="text-teal-400 me-1" /> WEIGHTAGE (PTS)
                </label>
                <input
                  type="number"
                  className="premium-input-styled border-slate focus-teal text-center"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- STICKY FOOTER --- */}
        <div className="add-footer-sticky p-4 border-slate-top">
          <div className="d-flex gap-3">
            <button type="button" className="btn-premium-outline flex-fill border-slate" onClick={onClose}>
              Discard
            </button>
            <button type="submit" className="btn-premium-solid flex-fill border-teal shadow-teal" disabled={isSaving}>
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <><Save size={18} /> Commit to Assessment</>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .premium-add-container {
          background-color: #0f172a;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 0 0 32px 32px;
        }

        .premium-add-form {
          display: flex;
          flex-direction: column;
          max-height: 80vh;
        }

        .add-body-scroll {
          overflow-y: auto;
          flex-grow: 1;
        }

        /* Custom Scrollbar */
        .add-body-scroll::-webkit-scrollbar { width: 5px; }
        .add-body-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }

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
        .border-slate-top { border-top: 1px solid #1e293b !important; }
        .border-slate-bottom { border-bottom: 1px solid #1e293b !important; }
        .border-indigo { border: 1px solid #6366f1 !important; }
        .border-teal { border: 1px solid #14b8a6 !important; }

        .premium-textarea {
          background: #020617;
          color: #f8fafc;
          border-radius: 16px;
          padding: 18px;
          width: 100%;
          font-weight: 500;
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
        }

        .premium-input {
          background: transparent;
          color: white;
          padding: 10px 15px;
          width: 100%;
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
        }

        .add-footer-sticky { background: #0b1120; z-index: 20; }

        .btn-premium-outline {
          background: #1e293b;
          color: #94a3b8;
          padding: 14px;
          border-radius: 18px;
          font-weight: 800;
          border: 1px solid #1e293b;
          transition: 0.3s;
        }

        .btn-premium-solid {
          background: #14b8a6;
          color: #020617;
          padding: 14px;
          border-radius: 18px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          transition: 0.3s;
        }
        .btn-premium-solid:hover { background: #2dd4bf; transform: translateY(-2px); }
        .shadow-teal { box-shadow: 0 10px 25px rgba(20, 184, 166, 0.3); }

        .hover-slate:hover { background: rgba(255,255,255,0.05); color: white; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AddQuestionPage;