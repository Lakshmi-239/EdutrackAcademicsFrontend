import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { api } from '../../services/Api';

export default function CreateAssessmentModal({ isOpen, onClose, onRefresh }) {
    const [activeTab, setActiveTab] = useState('details');
    const [courses, setCourses] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(false);

    // Consolidated Form State
    const [formData, setFormData] = useState({
        assessmentName: '',
        academicYearId: '',
        courseId: '',
        assessmentType: 'Quiz',
        dueDate: '',
        maxMarks: '',
        instructions: ''
    });

    // Questions State
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        type: 'MCQ',
        text: '',
        points: 10,
        options: ['', '', '', ''],
        correctOptionIndex: 0
    });

    // Load Academic Years on Open
    useEffect(() => {
        if (isOpen) {
            const fetchYears = async () => {
                try {
                    const data = await api.getAllAcademicYears();
                    setAcademicYears(data || []);
                } catch (err) {
                    console.error("Failed to load academic years", err);
                }
            };
            fetchYears();
        }
    }, [isOpen]);

    // Handle Year Change -> Fetch Courses
    const handleYearChange = async (e) => {
        const yearId = e.target.value;
        setFormData({ ...formData, academicYearId: yearId, courseId: '' });
        if (yearId) {
            try {
                const courseData = await api.getCoursesByYear(yearId);
                setCourses(courseData || []);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setCourses([]);
            }
        } else {
            setCourses([]);
        }
    };

    const handleAddQuestion = () => {
        if (!newQuestion.text) return alert("Please enter question text");
        let finalQuestion = { ...newQuestion, id: Date.now() };
        if (newQuestion.type === 'True/False') finalQuestion.options = ['True', 'False'];

        setQuestions([...questions, finalQuestion]);
        setNewQuestion({
            type: 'MCQ', text: '', points: 10, options: ['', '', '', ''], correctOptionIndex: 0
        });
    };

    const handleSubmit = async () => {
        if (!formData.assessmentName || !formData.courseId) return alert("Fill required fields.");
        if (questions.length === 0) return alert("Add at least one question.");

        const payload = {
            ...formData,
            maxMarks: parseInt(formData.maxMarks) || 0,
            questions: questions.map(q => ({
                questionText: q.text,
                questionType: q.type,
                points: parseInt(q.points) || 0,
                options: q.type === 'Description' ? "" : q.options.join('|'),
                correctAnswer: q.type === 'Description' ? "" : q.options[q.correctOptionIndex]
            }))
        };

        try {
            await api.createAssessment(payload);
            alert("Assessment Created!");
            onRefresh();
            onClose();
        } catch (err) {
            alert("Failed to save.");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Custom Backdrop */}
            <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}></div>
            
            <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        
                        {/* Header */}
                        <div className="modal-header border-bottom-0 p-4 pb-0">
                            <div>
                                <h4 className="modal-title fw-bold">Create New Assessment</h4>
                                <p className="text-muted small mb-0">Define details and add questions for your assessment.</p>
                            </div>
                            <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="px-4 mt-3">
                            <ul className="nav nav-pills nav-fill bg-light p-1 rounded-3">
                                <li className="nav-item">
                                    <button className={`nav-link rounded-3 fw-semibold ${activeTab === 'details' ? 'active bg-dark' : 'text-secondary'}`} onClick={() => setActiveTab('details')}>
                                        1. Assessment Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link rounded-3 fw-semibold ${activeTab === 'questions' ? 'active bg-dark' : 'text-secondary'}`} onClick={() => setActiveTab('questions')}>
                                        2. Questions ({questions.length})
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Body */}
                        <div className="modal-body p-4">
                            {activeTab === 'details' ? (
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-secondary text-uppercase">Assessment Name</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0 rounded-3 shadow-sm" value={formData.assessmentName} placeholder="e.g., Midterm Exam" onChange={e => setFormData({...formData, assessmentName: e.target.value})} />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-secondary text-uppercase">Academic Year</label>
                                        <select className="form-select bg-light border-0 rounded-3 shadow-sm" value={formData.academicYearId} onChange={handleYearChange}>
                                            <option value="">-- Select Year --</option>
                                            {academicYears.map(y => <option key={y.academicYearId} value={y.academicYearId}>{y.yearName}</option>)}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-secondary text-uppercase">Course</label>
                                        <select className="form-select bg-light border-0 rounded-3 shadow-sm" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} disabled={!formData.academicYearId}>
                                            <option value="">-- Select Course --</option>
                                            {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small text-secondary text-uppercase">Type</label>
                                        <select className="form-select bg-light border-0 rounded-3 shadow-sm" value={formData.assessmentType} onChange={e => setFormData({...formData, assessmentType: e.target.value})}>
                                            <option value="Quiz">Quiz</option>
                                            <option value="Assignment">Assignment</option>
                                            <option value="Exam">Exam</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small text-secondary text-uppercase">Due Date</label>
                                        <input type="date" className="form-control bg-light border-0 rounded-3 shadow-sm" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold small text-secondary text-uppercase">Max Marks</label>
                                        <input type="number" className="form-control bg-light border-0 rounded-3 shadow-sm" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: e.target.value})} />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold small text-secondary text-uppercase">Instructions</label>
                                        <textarea className="form-control bg-light border-0 rounded-3 shadow-sm" rows="3" placeholder="Guidelines for students..." value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})}></textarea>
                                    </div>
                                </div>
                            ) : (
                                <div className="questions-form">
                                    <div className="card border-0 bg-light rounded-4 p-3 mb-4">
                                        <h6 className="fw-bold mb-3">Add New Question</h6>
                                        <div className="row g-3">
                                            <div className="col-md-8">
                                                <label className="form-label small fw-bold">Type</label>
                                                <select className="form-select border-0 shadow-sm" value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value, options: e.target.value === 'MCQ' ? ['', '', '', ''] : []})}>
                                                    <option value="MCQ">Multiple Choice</option>
                                                    <option value="True/False">True/False</option>
                                                    <option value="Description">Short Answer</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold">Points</label>
                                                <input type="number" className="form-control border-0 shadow-sm" value={newQuestion.points} onChange={e => setNewQuestion({...newQuestion, points: e.target.value})} />
                                            </div>
                                            <div className="col-12">
                                                <textarea className="form-control border-0 shadow-sm" placeholder="Question Text" value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}></textarea>
                                            </div>

                                            {/* MCQ Options */}
                                            {newQuestion.type === 'MCQ' && (
                                                <div className="col-12">
                                                    {newQuestion.options.map((opt, i) => (
                                                        <div key={i} className="input-group mb-2 shadow-sm rounded-3 overflow-hidden">
                                                            <input type="text" className="form-control border-0" value={opt} placeholder={`Option ${i+1}`} onChange={e => {
                                                                const newOpts = [...newQuestion.options];
                                                                newOpts[i] = e.target.value;
                                                                setNewQuestion({...newQuestion, options: newOpts});
                                                            }} />
                                                            <button className={`btn ${newQuestion.correctOptionIndex === i ? 'btn-dark' : 'btn-white border-start'}`} onClick={() => setNewQuestion({...newQuestion, correctOptionIndex: i})}>
                                                                {newQuestion.correctOptionIndex === i ? <Check size={16}/> : <span className="small">Correct?</span>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* True/False Options */}
                                            {newQuestion.type === 'True/False' && (
                                                <div className="col-12 d-flex gap-2">
                                                    <button className={`btn w-100 py-3 fw-bold rounded-3 ${newQuestion.correctOptionIndex === 0 ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setNewQuestion({...newQuestion, correctOptionIndex: 0})}>True</button>
                                                    <button className={`btn w-100 py-3 fw-bold rounded-3 ${newQuestion.correctOptionIndex === 1 ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setNewQuestion({...newQuestion, correctOptionIndex: 1})}>False</button>
                                                </div>
                                            )}

                                            <button className="btn btn-dark w-100 py-2 rounded-3 mt-2 fw-bold d-flex align-items-center justify-content-center gap-2" onClick={handleAddQuestion}>
                                                <Plus size={18}/> Add to List
                                            </button>
                                        </div>
                                    </div>

                                    {/* Added Questions List */}
                                    <div className="mt-4">
                                        <h6 className="fw-bold mb-3 border-bottom pb-2">Questions Added ({questions.length})</h6>
                                        {questions.map((q, i) => (
                                            <div key={q.id} className="d-flex align-items-center justify-content-between p-3 bg-white border rounded-3 mb-2 shadow-sm">
                                                <span className="small text-truncate me-3"><strong>{i+1}.</strong> {q.text} ({q.type})</span>
                                                <button className="btn btn-sm btn-outline-danger border-0" onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}>
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0 p-4 pt-0">
                            <button className="btn btn-light px-4 fw-bold rounded-3" onClick={onClose}>Cancel</button>
                            <button className="btn btn-dark px-4 fw-bold rounded-3" onClick={handleSubmit}>Create Assessment</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}