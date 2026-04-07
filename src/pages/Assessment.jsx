// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const StudentAssessmentPage = () => {
//     const [assessments, setAssessments] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     // Replace with dynamic ID from your auth state/context
//     const studentId = "S001"; 
//     const API_URL = "https://localhost:7157/api/Submission";

//     useEffect(() => {
//         const fetchAssessments = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/view-assessments?StudentId=${studentId}`);
//                 console.log("Fetched Assessments:", response.data.data); // Debug log
//                 setAssessments(response.data.data);
//             } catch (error) {
//                 console.error("Error fetching assessments", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAssessments();
//     }, [studentId]);

//     const handleStart = async (assessmentId) => {
//         try {
//             const res = await axios.get(`${API_URL}/start-assessment?studentId=${studentId}&assessmentId=${assessmentId}`);
//             // Logic to open the quiz modal or navigate to a test route
//             console.log("Questions for test:", res.data.data);
//             alert("Assessment Started! Check console for question data.");
//         } catch (err) {
//             alert(err.response?.data?.message || "Assessment cannot be started.");
//         }
//     };

//     if (loading) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
//                 <Spinner animation="grow" variant="primary" />
//             </div>
//         );
//     }

//     return (
//         <Container fluid className="py-4 px-4">
//             {/* Page Title Section */}
//             <div className="mb-4 d-flex justify-content-between align-items-center">
//                 <h4 className="fw-bold text-dark m-0">My Assessments</h4>
//                 <Badge bg="primary">{assessments.length} Available</Badge>
//             </div>

//             <Row>
//                 {assessments.length > 0 ? (
//                     assessments.map((item) => (
//                         <Col lg={12} key={item.assessmentID} className="mb-3">
//                             <Card className="border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
//                                 <Card.Body className="p-4">
//                                     <Row className="align-items-center">
//                                         {/* Status Icon & Course Info */}
//                                         <Col md={6}>
//                                             <div className="d-flex align-items-center mb-2">
//                                                 <div className="bg-white rounded-circle p-2 shadow-sm me-3" style={{ width: '45px', height: '45px', textAlign: 'center' }}>
//                                                     📚
//                                                 </div>
//                                                 <div>
//                                                     <h5 className="mb-0 fw-bold text-dark">{item.courseName}</h5>
//                                                     <small className="text-mucted text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
//                                                         {item.type}
//                                                     </small>
//                                                 </div>
//                                             </div>
//                                         </Col>

//                                         {/* Assessment Meta Data */}
//                                         <Col md={4} className="text-secondary">
//                                             <div className="d-flex justify-content-around">
//                                                 <div className="text-center">
//                                                     <small className="d-block text-muted">Max Marks</small>
//                                                     <span className="fw-bold text-dark">{item.maxMarks}</span>
//                                                 </div>
//                                                 <div className="text-center">
//                                                     <small className="d-block text-muted">Due Date</small>
//                                                     <span className="fw-bold text-dark">
//                                                         {new Date(item.dueDate).toLocaleDateString('en-GB')}
//                                                     </span>
//                                                 </div>
//                                                 <div className="text-center">
//                                                     <small className="d-block text-muted">Status</small>
//                                                     <Badge pill bg={item.status === 'Open' ? 'success' : 'secondary'}>
//                                                         {item.status}
//                                                     </Badge>
//                                                 </div>
//                                             </div>
//                                         </Col>

//                                         {/* Action Button */}
//                                         <Col md={2} className="text-end">
//                                             <Button 
//                                                 variant={item.status === 'Open' ? 'primary' : 'outline-secondary'}
//                                                 className="px-4 py-2 fw-bold rounded-pill shadow-sm"
//                                                 onClick={() => handleStart(item.assessmentID)}
//                                                 disabled={item.status !== 'Open'}
//                                             >
//                                                 {item.status === 'Open' ? 'Start Now' : 'Closed'}
//                                             </Button>
//                                         </Col>
//                                     </Row>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     ))
//                 ) : (
//                     <Col className="text-center py-5">
//                         <div className="text-muted">No assessments found for your enrolled courses.</div>
//                     </Col>
//                 )}
//             </Row>
//         </Container>
//     );
// };

// export default StudentAssessmentPage;



import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import ExamPage from "./ExamPage";// We will create this next
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentAssessmentPage = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeExam, setActiveExam] = useState(null); // Holds data when exam starts
    
    const studentId = "S001"; 
    const API_URL = "https://localhost:7157/api/Submission";

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/view-assessments?StudentId=${studentId}`);
            setAssessments(response.data.data);
        } catch (error) {
            console.error("Error fetching assessments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, [studentId]);

    const handleStart = async (item) => {
        try {
            const res = await axios.get(`${API_URL}/start-assessment?studentId=${studentId}&assessmentId=${item.assessmentID}`);
            // Switch to Exam Mode
            setActiveExam({
                details: item,
                questions: res.data.data
            });
        } catch (err) {
            alert(err.response?.data?.message || "Assessment cannot be started.");
        }
    };

    // If an exam is active, render ONLY the ExamPage (Fullscreen)
    if (activeExam) {
        return (
            <ExamPage 
                examData={activeExam} 
                studentId={studentId} 
                onExit={() => {
                    setActiveExam(null);
                    fetchAssessments(); // Refresh to show "Closed" or "Completed"
                }} 
            />
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="grow" variant="primary" />
            </div>
        );
    }

    return (
        <Container fluid className="py-4 px-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold text-dark m-0">My Assessments</h4>
                <Badge bg="primary">{assessments.length} Available</Badge>
            </div>
            <Row>
                {assessments.map((item) => (
                    <Col lg={12} key={item.assessmentID} className="mb-3">
                        <Card className="border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                            <Card.Body className="p-4">
                                <Row className="align-items-center">
                                    <Col md={6}>
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="bg-white rounded-circle p-2 shadow-sm me-3 text-center" style={{ width: '45px', height: '45px' }}>📚</div>
                                            <div>
                                                <h5 className="mb-0 fw-bold text-dark">{item.courseName}</h5>
                                                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>{item.type}</small>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={4} className="text-secondary">
                                        <div className="d-flex justify-content-around text-center">
                                            <div><small className="d-block text-muted">Max Marks</small><span className="fw-bold text-dark">{item.maxMarks}</span></div>
                                            <div><small className="d-block text-muted">Due Date</small><span className="fw-bold text-dark">{new Date(item.dueDate).toLocaleDateString('en-GB')}</span></div>
                                            <div><small className="d-block text-muted">Status</small><Badge pill bg={item.status === 'Open' ? 'success' : 'secondary'}>{item.status}</Badge></div>
                                        </div>
                                    </Col>
                                    <Col md={2} className="text-end">
                                        <Button 
                                            variant={item.status === 'Open' ? 'primary' : 'outline-secondary'}
                                            className="px-4 py-2 fw-bold rounded-pill shadow-sm"
                                            onClick={() => handleStart(item)}
                                            disabled={item.status !== 'Open'}
                                        >
                                            {item.status === 'Open' ? 'Start Now' : 'Closed'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default StudentAssessmentPage;