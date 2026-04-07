// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
// import axios from 'axios';

// const ExamPage = ({ examData, studentId, onClose }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState("");
//     const [showFeedback, setShowFeedback] = useState(false);
//     const [showScore, setShowScore] = useState(false);
//     const [submissionId, setSubmissionId] = useState("");
//     const [finalResults, setFinalResults] = useState(null);

//     const currentQuestion = examData.questions[currentIndex];

//     // 1. Save Answer & Move Next
//     const handleSaveAndNext = async () => {
//         await axios.post(`https://localhost:7157/api/Submission/answer`, {
//             studentId,
//             assessmentId: examData.assessmentId,
//             questionId: currentQuestion.questionId,
//             answer: selectedAnswer
//         });
        
//         if (currentIndex < examData.questions.length - 1) {
//             setCurrentIndex(currentIndex + 1);
//             setSelectedAnswer(""); // Reset for next question
//         }
//     };

//     // 2. Final Submit
//     const handleFinalSubmit = async () => {
//         const res = await axios.post(`https://localhost:7157/api/Submission/submit`, {
//             studentId,
//             assessmentId: examData.assessmentId
//         });
//         setSubmissionId(res.data.submissionId);
//         setShowFeedback(true); // Open Feedback Popup
//     };

//     // 3. Submit Feedback & View Score
//     const handleFeedbackSubmit = async (feedbackData) => {
//         await axios.put(`https://localhost:7157/api/Submission/UpdateFeedback`, {
//             submissionId,
//             feedback: feedbackData
//         });

//         const scoreRes = await axios.get(`https://localhost:7157/api/Submission/Score`, {
//             params: { studentId, assessmentId: examData.assessmentId }
//         });
//         setFinalResults(scoreRes.data);
//         setShowFeedback(false);
//         setShowScore(true); // Open Score Popup
//     };

//     return (
//         <div style={{
//             position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
//             backgroundColor: 'white', zIndex: 9999, overflowY: 'auto'
//         }}>
//             <Container className="py-5">
//                 <h2 className="border-bottom pb-3 mb-4">{examData.courseName}</h2>
//                 <Row>
//                     <Col md={8}>
//                         <Card className="p-4 shadow-sm border-0 bg-light mb-4">
//                             <div className="d-flex justify-content-between fw-bold">
//                                 <span>Q{currentIndex + 1}.</span>
//                                 <span>Marks: {currentQuestion.marks}</span>
//                             </div>
//                             <p className="fs-5 my-4">{currentQuestion.questionText}</p>
//                             <Form>
//                                 {['OptionA', 'OptionB', 'OptionC', 'OptionD'].map((opt, i) => (
//                                     <Form.Check 
//                                         type="radio" 
//                                         key={i}
//                                         label={currentQuestion[opt]} 
//                                         name="examOption"
//                                         className="mb-3 p-2 border rounded bg-white"
//                                         onChange={() => setSelectedAnswer(currentQuestion[opt])}
//                                     />
//                                 ))}
//                             </Form>
//                         </Card>
//                         <div className="d-flex justify-content-between">
//                             <Button variant="secondary" onClick={() => setCurrentIndex(prev => prev - 1)} disabled={currentIndex === 0}>Previous</Button>
//                             <Button variant="primary" onClick={handleSaveAndNext}>Save & Next</Button>
//                         </div>
//                     </Col>

//                     <Col md={4}>
//                         <Card className="p-3 bg-light border-0 text-center">
//                             <h5>Question Palette</h5>
//                             <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
//                                 {examData.questions.map((_, i) => (
//                                     <Button key={i} variant={i === currentIndex ? "primary" : "outline-dark"} size="sm" style={{width:'40px'}}>{i+1}</Button>
//                                 ))}
//                             </div>
//                             <Button variant="success" className="w-100 py-2" onClick={handleFinalSubmit}>Finish</Button>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>

//             {/* FEEDBACK MODAL */}
//             <Modal show={showFeedback} centered backdrop="static">
//                 <Modal.Body className="p-4 text-center">
//                     <div className="bg-light p-3 mb-4">Your Assessment submitted successfully</div>
//                     <h5 className="text-start mb-3">Provide your feedback</h5>
//                     <Form.Control as="textarea" rows={3} placeholder="Your Comments" id="feedbackInput" className="mb-3"/>
//                     <Button variant="primary" onClick={() => handleFeedbackSubmit(document.getElementById('feedbackInput').value)}>Submit</Button>
//                 </Modal.Body>
//             </Modal>

//             {/* SCORE MODAL */}
//             <Modal show={showScore} centered backdrop="static">
//                 <Modal.Body className="p-5 text-center bg-light">
//                     <h4>Result</h4>
//                     <p>Student Name: {studentId}</p>
//                     <div className="bg-white p-4 my-3 border shadow-sm">
//                         <div className="text-muted">Your Score</div>
//                         <h2 className="display-4 fw-bold text-primary">{finalResults?.score}</h2>
//                         <hr />
//                         <p className="fw-bold mb-0">Percentage: {finalResults?.percentage}%</p>
//                     </div>
//                     <Button variant="danger" className="px-5 rounded-pill" onClick={onClose}>Close</Button>
//                 </Modal.Body>
//             </Modal>
//         </div>
//     );
// };



import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal ,Badge} from 'react-bootstrap';
import axios from 'axios';

const ExamPage = ({ examData, studentId, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // Stores local selections
    const [showFeedback, setShowFeedback] = useState(false);
    const [showScore, setShowScore] = useState(false);
    const [submissionId, setSubmissionId] = useState("");
    const [scoreResult, setScoreResult] = useState(null);
    const [feedback, setFeedback] = useState("");

    const questions = examData.questions;
    const currentQ = questions[currentIndex];
    const API_URL = "https://localhost:7157/api/Submission";

    // Handle Option Selection & API Save
    const handleOptionChange = async (optionValue) => {
        setAnswers({ ...answers, [currentQ.questionId]: optionValue });
        
        try {
            await axios.post(`${API_URL}/answer`, {
                studentId,
                assessmentId: examData.details.assessmentID,
                questionId: currentQ.questionId,
                answer: optionValue
            });
        } catch (err) {
            console.error("Failed to save answer");
        }
    };

    // Final Submit Assessment
    const handleSubmitAssessment = async () => {
        try {
            const res = await axios.post(`${API_URL}/submit`, {
                studentId,
                assessmentId: examData.details.assessmentID
            });
            setSubmissionId(res.data.submissionId);
            setShowFeedback(true); // Open Feedback Modal
        } catch (err) {
            alert("Error submitting assessment");
        }
    };

    // Submit Feedback & Fetch Final Score
    const handleFeedbackSubmit = async () => {
        try {
            await axios.put(`${API_URL}/UpdateFeedback`, {
                submissionId,
                feedback
            });

            const res = await axios.get(`${API_URL}/Score`, {
                params: { studentId, assessmentId: examData.details.assessmentID }
            });
            setScoreResult(res.data);
            setShowFeedback(false);
            setShowScore(true); // Open Score Modal
        } catch (err) {
            alert("Error updating feedback");
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#fff', zIndex: 1050, overflowY: 'auto' }}>
            <Container className="py-5">
                <div className="d-flex justify-content-between border-bottom pb-3 mb-4">
                    <h3 className="fw-bold">{examData.details.courseName}</h3>
                    <h5 className="text-muted">{examData.details.type}</h5>
                </div>

                <Row>
                    <Col md={8}>
                        <Card className="border-0 shadow-sm p-4 mb-4" style={{ minHeight: '300px' }}>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="fw-bold fs-5">Q{currentIndex + 1}.</span>
                                <Badge bg="light" text="dark" className="border">Marks: {currentQ.marks}</Badge>
                            </div>
                            <p className="fs-5 mb-4">{currentQ.questionText}</p>
                            <Form>
                                {['OptionA', 'OptionB', 'OptionC', 'OptionD'].map((opt) => (
                                    <Form.Check 
                                        type="radio"
                                        key={opt}
                                        name="examOption"
                                        id={opt}
                                        label={currentQ[opt]}
                                        className="mb-3 p-3 border rounded shadow-sm"
                                        checked={answers[currentQ.questionId] === currentQ[opt]}
                                        onChange={() => handleOptionChange(currentQ[opt])}
                                        style={{ cursor: 'pointer', backgroundColor: answers[currentQ.questionId] === currentQ[opt] ? '#e7f1ff' : 'white' }}
                                    />
                                ))}
                            </Form>
                        </Card>

                        <div className="d-flex justify-content-between">
                            <Button variant="outline-dark" className="px-4" disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}>Previous</Button>
                            <Button variant="dark" className="px-4" onClick={() => currentIndex < questions.length - 1 ? setCurrentIndex(currentIndex + 1) : null}>Save & Next</Button>
                        </div>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 shadow-sm p-3 bg-light text-center">
                            <h6 className="fw-bold mb-3">Navigation</h6>
                            <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                                {questions.map((_, i) => (
                                    <Button key={i} size="sm" variant={i === currentIndex ? "primary" : answers[questions[i].questionId] ? "success" : "outline-secondary"} style={{ width: '35px' }} onClick={() => setCurrentIndex(i)}>
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>
                            <Button variant="success" className="w-100 fw-bold py-2" onClick={handleSubmitAssessment}>Finish Exam</Button>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* FEEDBACK MODAL */}
            <Modal show={showFeedback} centered backdrop="static">
                <Modal.Body className="p-4">
                    <div className="bg-light p-3 rounded mb-4 text-center fw-bold text-success">
                        Your Assessment submitted successfully
                    </div>
                    <h5 className="mb-3">Provide your feedback</h5>
                    <Form.Group className="mb-4">
                        <Form.Label>Your Comments</Form.Label>
                        <Form.Control as="textarea" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="primary" className="px-5 py-2 fw-bold" onClick={handleFeedbackSubmit}>Submit</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* SCORE MODAL */}
            <Modal show={showScore} centered backdrop="static">
                <Modal.Body className="p-5 text-center bg-light">
                    <h3 className="border-bottom pb-3 mb-4">Result</h3>
                    <p className="mb-1 text-muted">Student Name: {studentId}</p>
                    <p className="fw-bold mb-4">{examData.details.courseName}</p>
                    
                    <Card className="border-0 shadow-sm p-4 mb-4 mx-auto" style={{ maxWidth: '250px' }}>
                        <small className="text-uppercase text-muted">Your Score</small>
                        <h1 className="display-4 fw-bold text-primary">{scoreResult?.score}</h1>
                        <hr />
                        <p className="fw-bold mb-0">Percentage: {scoreResult?.percentage}%</p>
                    </Card>

                    <Button variant="danger" className="px-5 rounded-pill fw-bold shadow" onClick={onExit}>Close</Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ExamPage;