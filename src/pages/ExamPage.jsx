import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';

import { Award, ChevronRight, ChevronLeft, Send, CheckCircle } from 'lucide-react';

const ExamPage = ({ examData, studentId, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); 
    const [showFeedback, setShowFeedback] = useState(false);
    const [showScore, setShowScore] = useState(false);
    const [submissionId, setSubmissionId] = useState("");
    const [scoreResult, setScoreResult] = useState(null);
    const [feedback, setFeedback] = useState("");

   

    const questions = examData.questions;
    const currentQ = questions[currentIndex];
    const API_URL = "https://localhost:7157/api/Submission";

    // --- LOGIC (UNTOUCHED) ---
    const handleOptionChange = async (optKey) => {
        const letter = optKey.replace("option", "").replace("Option", "");
        setAnswers({ ...answers, [currentQ.questionId]: letter });
        try {
            await axios.post(`${API_URL}/answer`, {
                studentId, assessmentId: examData.details.assessmentID,
                questionId: currentQ.questionId, answer: letter 
            });
        } catch (err) { console.error("Failed to save answer"); }
    };

    const handleSubmitAssessment = async () => {
        try {
            const res = await axios.post(`${API_URL}/submit`, {
                studentId, assessmentId: examData.details.assessmentID
            });
            setSubmissionId(res.data.submissionId);
            setShowFeedback(true); 
        } catch (err) { alert("Error submitting assessment"); }
    };

    const handleFeedbackSubmit = async () => {
        try {
            const feedbackPayload = {
                StudentId: studentId, AssessmentId: examData.details.assessmentID,
                submissionId: submissionId, Feedback: feedback 
            };
            await axios.put(`${API_URL}/UpdateFeedback`, feedbackPayload);
            const res = await axios.get(`${API_URL}/Score`, {
                params: { studentId, assessmentId: examData.details.assessmentID }
            });
            setScoreResult(res.data);
            setShowFeedback(false);
            setShowScore(true); 
        } catch (err) { alert("Error updating feedback"); }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#f8fafc', zIndex: 1050, overflowY: 'auto' }}>
            <Container fluid className="max-w-7xl mx-auto px-6 py-8">
                <header className="mb-8 flex justify-between items-center border-b border-slate-800/60 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                            <Award className="text-emerald-400" size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-0">{examData.details.courseName}</h2>
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{examData.details.type}</span>
                        </div>
                    </div>
                </header>

                <Row className="g-4">
                    <Col lg={8}>
                        <div className="bg-[#020617]/40 border border-slate-800/60 p-8 rounded-[2.5rem] shadow-2xl min-h-[450px]">
                            <div className="flex justify-between items-center mb-8">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg font-black tracking-widest text-[10px]">QUESTION {currentIndex + 1} OF {questions.length}</Badge>
                                <span className="text-slate-500 text-[10px] font-black tracking-widest">MARKS: {currentQ.marks}</span>
                            </div>
                            <p className="text-xl font-bold text-slate-200 mb-10 leading-relaxed">{currentQ.questionText}</p>
                            <Form className="space-y-4">
                                {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey) => {
                                    const optionLabel = currentQ[optKey] || currentQ[optKey.charAt(0).toUpperCase() + optKey.slice(1)];
                                    const letter = optKey.replace("option", "").replace("Option", "");
                                    const isSelected = answers[currentQ.questionId] === letter;
                                    return (
                                        <div key={optKey} onClick={() => handleOptionChange(optKey)}
                                            className={`p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${isSelected ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-950/50 border-slate-800/60 hover:border-slate-600'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-500'}`}>{letter}</div>
                                            <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{optionLabel}</span>
                                        </div>
                                    );
                                })}
                            </Form>
                        </div>
                        <div className="flex justify-between mt-8">
                            <button onClick={() => setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0} className="px-8 py-3 rounded-2xl font-black bg-slate-900 text-slate-400 border border-slate-800 disabled:opacity-20 uppercase text-[11px]">Previous</button>
                            <button onClick={() => setCurrentIndex(currentIndex + 1)} disabled={currentIndex === questions.length - 1} className="px-8 py-3 rounded-2xl font-black bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 disabled:opacity-20 uppercase text-[11px]">Next</button>
                        </div>
                    </Col>

                    <Col lg={4}>
                        <div className="bg-[#020617]/40 border border-slate-800/60 p-6 rounded-[2.5rem] shadow-xl sticky top-8 text-center">
                            <h6 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-6">EXAMINATION GRID</h6>
                            <div className="grid grid-cols-5 gap-3 mb-8">
                                {questions.map((_, i) => (
                                    <button key={i} onClick={() => setCurrentIndex(i)}
                                        className={`h-12 rounded-xl font-black transition-all border ${i === currentIndex ? 'bg-emerald-500 border-emerald-400 text-slate-950' : answers[questions[i].questionId] ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-600'}`}>{i + 1}</button>
                                ))}
                            </div>
                            <button onClick={handleSubmitAssessment} className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl">Finish Exam</button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* MODAL 1: FEEDBACK - TEXT COLOR BLACK FIXED */}
            <Modal show={showFeedback} centered backdrop="static" contentClassName="bg-white border-0 rounded-[2.5rem] shadow-2xl">
                <Modal.Body className="p-10 text-center">
                    <div className="bg-emerald-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <CheckCircle className="text-emerald-500" size={40} />
                    </div>
                    <h4 className="text-slate-900 font-black uppercase tracking-tighter mb-2">Submission Successful</h4>
                    <p className="text-slate-500 text-sm mb-8">Your answers are secured in our systems.</p>
                    <Form.Group className="text-start mb-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">ASSESSMENT FEEDBACK</label>
                        <Form.Control 
                            as="textarea" rows={3} value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Type your feedback here..."
                            // FIX: TEXT COLOR SET TO BLACK FOR VISIBILITY
                            style={{ backgroundColor: '#f8fafc', color: '#000000', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}
                        />
                    </Form.Group>
                    <button onClick={handleFeedbackSubmit} className="w-full py-4 rounded-2xl bg-[#10b981] text-white font-black uppercase tracking-widest text-[11px] shadow-lg">POST FEEDBACK & VIEW SCORE</button>
                </Modal.Body>
            </Modal>

            {/* MODAL 2: SCORE - COURSE NAME COLOR BLACK FIXED */}
            <Modal show={showScore} centered backdrop="static" contentClassName="bg-white border-0 rounded-[3rem] shadow-2xl">
                <Modal.Body className="p-12 text-center">
                    <h6 className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-8">PERFORMANCE REPORT</h6>
                    <div className="relative inline-block mb-10">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full"></div>
                        <div className="relative bg-slate-900 w-44 h-44 rounded-full flex flex-col items-center justify-center border-4 border-white shadow-2xl">
                            <span className="text-5xl font-black text-white">{scoreResult?.score}</span>
                            <div className="w-12 h-1 bg-emerald-500 my-2 rounded-full"></div>
                            <span className="text-emerald-500 font-black text-xs tracking-widest">{scoreResult?.percentage}% ACCURACY</span>
                        </div>
                    </div>
                    {/* FIX: COURSE NAME TEXT COLOR SET TO BLACK */}
                    <h3 className="text-black font-black uppercase tracking-tighter mb-2">{examData.details.courseName}</h3>
                    <p className="text-slate-400 text-[10px] font-black tracking-widest mb-10 uppercase">RESULT FOR SID: {studentId}</p>
                    <button onClick={onExit} className="px-12 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all">EXIT WORKSPACE</button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ExamPage;