import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { ClipboardList, Award, ChevronRight, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useOutletContext } from "react-router-dom";
import axios from 'axios';
import ExamPage from "./ExamPage"; 
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentAssessmentPage = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeExam, setActiveExam] = useState(null); 
    
   
    const { setIsExamActive } = useOutletContext();
    
    const studentId = localStorage.getItem("studentId"); 
    const SUB_API = "https://localhost:7157/api/Submission";
    const ENROLL_API = "https://localhost:7157/api/Enrollment"; 

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${SUB_API}/view-assessments?StudentId=${studentId}`);
            const assessmentsList = res.data.data || [];

            const enrichedData = await Promise.all(assessmentsList.map(async (item) => {
                try {
                    const statusRes = await axios.get(`${ENROLL_API}/status`, {
                        params: { StudentId: studentId, CourseId: item.courseID }
                    });
                    return { ...item, currentEnrollmentStatus: statusRes.data.currentStatus };
                } catch (err) {
                    return { ...item, currentEnrollmentStatus: "Active" }; 
                }
            }));
            setAssessments(enrichedData);
        } catch (error) {
            console.error("Failed to load assessments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, [studentId]);

    const getUIState = (item) => {
        const now = new Date();
        const dueDate = new Date(item.dueDate);

        if (item.currentEnrollmentStatus === "Dropped" || item.currentEnrollmentStatus === "Dropout") {
            return { 
                label: "Disabled", 
                theme: "bg-red-500/10 text-red-400 border-red-500/20", 
                disabled: true, 
                icon: <Lock size={14} className="me-1" />,
                btnText: "Locked"
            };
        }

        if (item.isSubmitted || item.status === "Completed") {
            return { 
                label: "Completed", 
                theme: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", 
                disabled: true, 
                icon: <CheckCircle size={14} className="me-1" />,
                btnText: "Submitted"
            };
        }

        if (now > dueDate) {
            return { 
                label: "Closed", 
                theme: "bg-slate-800 text-slate-500 border-slate-700", 
                disabled: true, 
                icon: <AlertCircle size={14} className="me-1" />,
                btnText: "Expired"
            };
        }

        return { 
            label: "Open", 
            theme: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", 
            disabled: false, 
            icon: null,
            btnText: "Start Test"
        };
    };

    const handleStart = async (item) => {
        const state = getUIState(item);
        if (state.disabled) return;
        try {
            const res = await axios.get(`${SUB_API}/start-assessment?studentId=${studentId}&assessmentId=${item.assessmentID}`);
            
            
            setIsExamActive(true); 

            setActiveExam({
                details: item,
                questions: res.data.data
            });
        } catch (err) {
            alert(err.response?.data?.message || "Unable to start assessment.");
        }
    };

    // --- Exam Mode Rendering ---
    if (activeExam) {
        return (
            <ExamPage 
                examData={activeExam} 
                studentId={studentId} 
                onExit={() => {
                    
                    setIsExamActive(false); 
                    setActiveExam(null);
                    fetchAssessments(); 
                }} 
            />
        );
    }

    // --- Normal List Rendering ---
    return (
        <div className="h-full w-full overflow-y-auto bg-transparent text-slate-200 custom-scrollbar">
            <Container fluid className="max-w-7xl mx-auto px-6 py-10">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                            <ClipboardList className="text-emerald-400" size={28} />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Academic Assessments
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium ml-14">Precision tracking for your technical evaluations.</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-10 h-10 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Syncing Records</span>
                    </div>
                ) : assessments.length === 0 ? (
                    <div className="text-center py-24 bg-[#020617]/40 border border-dashed border-slate-800 rounded-[3rem]">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active assessments found.</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {assessments.map((item) => {
                            const ui = getUIState(item);
                            return (
                                <Col lg={12} key={item.assessmentID}>
                                    <div className="group relative bg-[#020617]/40 border border-slate-800/60 p-8 rounded-[2.5rem] transition-all duration-500 hover:bg-[#020617]/60 hover:border-emerald-500/30 shadow-xl">
                                        <Row className="align-items-center">
                                            <Col md={4}>
                                                <div className="flex items-center gap-5">
                                                    <div className="bg-slate-950/80 rounded-[1.5rem] p-4 border border-slate-800 flex items-center justify-center shadow-inner" style={{ width: '72px', height: '72px' }}>
                                                        <Award className="text-emerald-400" size={32} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black mb-1 text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                                                            {item.courseName}
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-500 text-[9px] font-black tracking-[0.2em] uppercase">{item.type}</span>
                                                            <span className="text-slate-800 text-[9px]">•</span>
                                                            <span className="text-emerald-500/60 text-[9px] font-black tracking-[0.2em] uppercase">ID: {item.assessmentID}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={5}>
                                                <div className="flex justify-around items-center border-l border-r border-slate-800/40 px-6">
                                                    <div className="text-center">
                                                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-2">Max Marks</p>
                                                        <span className="text-xl font-bold text-slate-300">{item.maxMarks}</span>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-2">Due Date</p>
                                                        <span className={`text-xl font-bold ${ui.label === 'Closed' ? 'text-red-500' : 'text-slate-300'}`}>
                                                            {new Date(item.dueDate).toLocaleDateString('en-GB')}
                                                        </span>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-2">Status</p>
                                                        <Badge className={`flex items-center px-4 py-1.5 rounded-lg text-[9px] font-black tracking-[0.15em] uppercase border shadow-sm ${ui.theme}`}>
                                                            {ui.icon}{ui.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={3} className="text-end">
                                                <button 
                                                    onClick={() => handleStart(item)}
                                                    disabled={ui.disabled}
                                                    className={`w-full md:w-auto px-10 py-3.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 border-0 uppercase tracking-widest text-[11px] ${
                                                        !ui.disabled 
                                                        ? "bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-slate-950 shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-95" 
                                                        : "bg-slate-800/50 text-slate-600 cursor-not-allowed opacity-30"
                                                    }`}
                                                >
                                                    {ui.btnText}
                                                    {!ui.disabled && <ChevronRight size={16} strokeWidth={3} />}
                                                </button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default StudentAssessmentPage;