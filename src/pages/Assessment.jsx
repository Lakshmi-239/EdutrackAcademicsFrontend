import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { ClipboardList, Award, ChevronRight, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import ExamPage from "./ExamPage"; 
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentAssessmentPage = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeExam, setActiveExam] = useState(null); 
    
    // Student ID should ideally come from your Auth Context
    const studentId = "S001"; 
    
    const SUB_API = "https://localhost:7157/api/Submission";
    const ENROLL_API = "https://localhost:7157/api/Enrollment"; 

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            
            // 1. Fetch Assessments from Submission API
            const res = await axios.get(`${SUB_API}/view-assessments?StudentId=${studentId}`);
            const assessmentsList = res.data.data || [];

            // 2. Fetch Enrollment Status for each course to check for "Dropped"
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

        // Priority 1: Enrollment Table Status
        if (item.currentEnrollmentStatus === "Dropped" || item.currentEnrollmentStatus === "Dropout") {
            return { 
                label: "Disabled", 
                theme: "bg-red-500/10 text-red-400 border-red-500/20", 
                disabled: true, 
                icon: <Lock size={14} className="me-1" />,
                btnText: "Locked"
            };
        }

        // Priority 2: Submission Table Status (isSubmitted flag)
        if (item.isSubmitted || item.status === "Completed") {
            return { 
                label: "Completed", 
                theme: "bg-green-500/10 text-green-400 border-green-500/20", 
                disabled: true, 
                icon: <CheckCircle size={14} className="me-1" />,
                btnText: "Submitted"
            };
        }

        // Priority 3: Date Comparison
        if (now > dueDate) {
            return { 
                label: "Closed", 
                theme: "bg-slate-800 text-slate-500 border-slate-700", 
                disabled: true, 
                icon: <AlertCircle size={14} className="me-1" />,
                btnText: "Expired"
            };
        }

        // Default: Open
        return { 
            label: "Open", 
            theme: "bg-blue-500/10 text-blue-400 border-blue-500/20", 
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
            setActiveExam({
                details: item,
                questions: res.data.data
            });
        } catch (err) {
            alert(err.response?.data?.message || "Unable to start assessment.");
        }
    };

    if (activeExam) {
        return (
            <ExamPage 
                examData={activeExam} 
                studentId={studentId} 
                onExit={() => {
                    setActiveExam(null);
                    fetchAssessments(); 
                }} 
            />
        );
    }

    return (
        <div className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-slate-950 text-slate-200 custom-scrollbar">
            <Container fluid className="max-w-7xl mx-auto px-6 py-10">
                
                <header className="mb-12">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ClipboardList className="text-blue-500" size={32} />
                        Available Assessments
                    </h2>
                    <p className="text-slate-400 mt-2">Manage your assessments and track your progress.</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Spinner animation="border" variant="primary" />
                        <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Loading Records...</span>
                    </div>
                ) : assessments.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-[2rem]">
                        <p className="text-slate-500">No assessments available at this time.</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {assessments.map((item) => {
                            const ui = getUIState(item);
                            return (
                                <Col lg={12} key={item.assessmentID}>
                                    {/* Card stays fully visible (no opacity/grayscale) */}
                                    <div className="group relative bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] transition-all duration-300 hover:bg-slate-900/60 hover:border-blue-500/50">
                                        <Row className="align-items-center">
                                            {/* Course Details */}
                                            <Col md={4}>
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-slate-950/60 rounded-3xl p-3 border border-slate-800 flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
                                                        <Award className="text-blue-400" size={28} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold mb-1 text-white">{item.courseName}</h4>
                                                        <div className="flex gap-2">
                                                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase">{item.type}</span>
                                                            <span className="text-slate-700 text-[10px]">•</span>
                                                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase">ID: {item.assessmentID}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>

                                            {/* Metadata Section */}
                                            <Col md={5}>
                                                <div className="flex justify-around items-center border-l border-r border-slate-800/50 px-4">
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Max Marks</p>
                                                        <span className="text-lg font-bold">{item.maxMarks}</span>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Due Date</p>
                                                        <span className={`text-lg font-bold ${ui.label === 'Closed' ? 'text-red-500' : 'text-slate-200'}`}>
                                                            {new Date(item.dueDate).toLocaleDateString('en-GB')}
                                                        </span>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Status</p>
                                                        <Badge className={`flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${ui.theme}`}>
                                                            {ui.icon}{ui.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Col>

                                            {/* Action Button - Only this part reflects the disabled state */}
                                            <Col md={3} className="text-end">
                                                <button 
                                                    onClick={() => handleStart(item)}
                                                    disabled={ui.disabled}
                                                    className={`w-full md:w-auto px-8 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border ${
                                                        !ui.disabled 
                                                        ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-900/20" 
                                                        : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-40"
                                                    }`}
                                                >
                                                    {ui.btnText}
                                                    {!ui.disabled && <ChevronRight size={18} />}
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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default StudentAssessmentPage;