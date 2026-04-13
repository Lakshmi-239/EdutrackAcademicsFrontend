import React, { useState } from 'react';
import { Save, X, Loader2, Info, CheckCircle2, List, AlignLeft } from 'lucide-react';
import { api } from '../../services/Api';

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
    setIsSaving(true);
    try {
      // Data normalization
      const payload = { ...formData };
      if (payload.questionType === 'True/False') {
        payload.optionA = 'True'; payload.optionB = 'False';
        payload.optionC = ''; payload.optionD = '';
      } else if (payload.questionType === 'Subjective') {
        payload.optionA = ''; payload.optionB = '';
        payload.optionC = ''; payload.optionD = '';
        payload.correctOption = 'N/A';
      }

      await api.addQuestion(payload);
      onRefresh();
      onClose();
    } catch (err) {
      alert("Maximum Marks limit exceeded");
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeIcon = () => {
    if (formData.questionType === 'MCQ') return <List size={18} className="text-success" />;
    if (formData.questionType === 'True/False') return <CheckCircle2 size={18} className="text-warning" />;
    return <AlignLeft size={18} className="text-primary" />;
  };

  return (
    <div className="p-4 bg-white">
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        
        {/* Step 1: Select Type */}
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-bold small text-muted text-uppercase mb-2">Question Type</label>
            <div className="d-flex gap-2 p-2 bg-light rounded-4 border">
              {['MCQ', 'True/False', 'Subjective'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`btn flex-fill py-2 rounded-3 border-0 fw-bold transition-all ${
                    formData.questionType === type 
                    ? 'bg-white shadow-sm text-dark' 
                    : 'text-muted'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setFormData({...formData, questionType: type})}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Question Input */}
        <div className="position-relative">
          <label className="form-label fw-bold small text-muted text-uppercase mb-2">Question Description</label>
          <textarea 
            className="form-control border-0 bg-light rounded-4 p-3 shadow-none focus-ring" 
            rows="3" 
            placeholder="Type your question content here..."
            value={formData.questionText}
            onChange={(e) => setFormData({...formData, questionText: e.target.value})}
            required
            style={{ resize: 'none' }}
          />
        </div>

        {/* Step 3: Options (Conditional) */}
        <div className="animate-fade-in">
          {formData.questionType === 'MCQ' && (
            <div className="row g-3 bg-light-subtle p-3 rounded-4 border">
              {['A', 'B', 'C', 'D'].map(l => (
                <div key={l} className="col-md-6">
                  <div className="input-group input-group-sm shadow-sm">
                    <span className="input-group-text bg-white border-0 fw-bold text-muted px-3">{l}</span>
                    <input 
                      type="text" 
                      className="form-control border-0 py-2" 
                      placeholder={`Option ${l}`}
                      value={formData[`option${l}`]}
                      onChange={(e) => setFormData({...formData, [`option${l}`]: e.target.value})}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.questionType === 'True/False' && (
            <div className="row g-2 text-center">
              <div className="col-6"><div className="p-3 border rounded-4 bg-light fw-bold text-success">Option A: True</div></div>
              <div className="col-6"><div className="p-3 border rounded-4 bg-light fw-bold text-danger">Option B: False</div></div>
            </div>
          )}

          {formData.questionType === 'Subjective' && (
            <div className="p-4 bg-primary-subtle rounded-4 text-center border border-primary-subtle border-dashed">
              <Info size={20} className="text-primary mb-2 d-block mx-auto" />
              <p className="small text-primary fw-medium mb-0">Description type: Students will provide a text-based answer.</p>
            </div>
          )}
        </div>

        {/* Step 4: Settings */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold small text-muted text-uppercase mb-2">Correct Key</label>
            <select 
              className="form-select border-0 bg-light rounded-4 shadow-none fw-bold"
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
          <div className="col-md-6">
            <label className="form-label fw-bold small text-muted text-uppercase mb-2">Points</label>
            <input 
              type="number" 
              className="form-control border-0 bg-light rounded-4 text-center fw-bold shadow-none"
              value={formData.marks}
              onChange={(e) => setFormData({...formData, marks: parseInt(e.target.value)})}
              required
            />
          </div>
        </div>

        {/* Step 5: Footer Actions */}
        <div className="d-flex gap-2 pt-3">
          <button type="button" className="btn btn-light flex-fill rounded-pill py-2 fw-bold border" onClick={onClose}>Discard</button>
          <button type="submit" className="btn btn-dark flex-fill rounded-pill py-2 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2" disabled={isSaving}>
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18}/> Create Question</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionPage;