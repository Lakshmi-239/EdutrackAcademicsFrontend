import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import { FaGraduationCap, FaBook, FaBalanceScale, FaCalendarAlt, FaThLarge } from 'react-icons/fa';
// import { api } from '../App'; // Ensure this points to your axios instance

// Import your components
import PostQualification from '../components/AdminDashBoard/PostQualification';
import PostPrograms from '../components/AdminDashBoard/PostPrograms';
import PostAcademicYear from '../components/AdminDashBoard/PostAcademicYear';
import PostRules from '../components/AdminDashBoard/PostRules';
import api from '../services/api';
const AdminDashboardPage = () => { // Removed props
    // Define state locally
    const [qualifications, setQualifications] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [academicYearsList, setAcademicYearsList] = useState([]);
    const [rules, setRules] = useState([]);
    
    const [currentView, setCurrentView] = useState('dashboard');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [qualData, progData, yearData, ruleData] = await Promise.all([
                    api.getQualifications(), 
                    api.getPrograms(),
                    api.getAcademicYears(),
                    api.getRules()
                ]);

                setQualifications(qualData);
                setPrograms(progData);
                setAcademicYearsList(yearData);
                setRules(ruleData);
            } catch (error) {
                console.error("Dashboard Sync Error:", error);
            }
        };
        fetchAllData();
    }, []);

    // ... rest of your code

    const renderContent = () => {
        switch (currentView) {
            case 'qualifications': 
                return <PostQualification 
                            qualifications={qualifications} 
                            setQualifications={setQualifications} 
                        />;
            case 'programs': 
                return <PostPrograms 
                            programs={programs} 
                            setPrograms={setPrograms} 
                            qualifications={qualifications} 
                        />;
            case 'academicYears': 
                return <PostAcademicYear 
                            academicYearsList={academicYearsList} 
                            setAcademicYearsList={setAcademicYearsList}
                            programs={programs}
                            qualifications={qualifications}
                        />;
            case 'academicRules': 
                return <PostRules 
                            rules={rules} 
                            setRules={setRules} 
                            programs={programs}
                        />;
            default:
                return (
                    <div className="animate__animated animate__fadeIn">
                        <header className="mb-5">
                            <h1 className="fw-bold text-white shadow-sm d-inline-block p-2 rounded" style={{ background: 'rgba(0,0,0,0.1)' }}>
                                System Overview
                            </h1>
                            <p className="text-white opacity-75 fs-5">Management Dashboard for EduTrack Operations</p>
                        </header>

                        <Row className="g-4">
                            <Col xs={12} md={6}>
                                <Card className="border-0 shadow-lg p-4 text-white" 
                                      style={{ 
                                          background: 'linear-gradient(135deg, #6610f2 0%, #6f42c1 100%)', 
                                          minHeight: '180px',
                                          borderRadius: '20px' 
                                      }}>
                                    <div className="d-flex justify-content-between align-items-center h-100 px-4">
                                        <div>
                                            <div className="opacity-75 text-uppercase fw-bold ls-1 mb-2">Total Qualifications</div>
                                            <h1 className="display-3 mb-0 fw-bold">{qualifications?.length || 0}</h1>
                                        </div>
                                        <FaGraduationCap style={{ fontSize: '6rem' }} className="opacity-25" />
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={12} md={6}>
                                <Card className="border-0 shadow-lg p-4 text-white" 
                                      style={{ 
                                          background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa2c0 100%)', 
                                          minHeight: '180px',
                                          borderRadius: '20px' 
                                      }}>
                                    <div className="d-flex justify-content-between align-items-center h-100 px-4">
                                        <div>
                                            <div className="opacity-75 text-uppercase fw-bold ls-1 mb-2">Active Programs</div>
                                            <h1 className="display-3 mb-0 fw-bold">{programs?.length || 0}</h1>
                                        </div>
                                        <FaBook style={{ fontSize: '6rem' }} className="opacity-25" />
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={12} md={6}>
                                <Card className="border-0 shadow-lg p-4 text-white" 
                                      style={{ 
                                          background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', 
                                          minHeight: '180px',
                                          borderRadius: '20px' 
                                      }}>
                                    <div className="d-flex justify-content-between align-items-center h-100 px-4">
                                        <div>
                                            <div className="opacity-75 text-uppercase fw-bold ls-1 mb-2">Academic Mappings</div>
                                            <h1 className="display-3 mb-0 fw-bold">{academicYearsList?.length || 0}</h1>
                                        </div>
                                        <FaCalendarAlt style={{ fontSize: '6rem' }} className="opacity-25" />
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={12} md={6}>
                                <Card className="border-0 shadow-lg p-4 text-white" 
                                      style={{ 
                                          background: 'linear-gradient(135deg, #fd7e14 0%, #e65100 100%)', 
                                          minHeight: '180px',
                                          borderRadius: '20px' 
                                      }}>
                                    <div className="d-flex justify-content-between align-items-center h-100 px-4">
                                        <div>
                                            <div className="opacity-75 text-uppercase fw-bold ls-1 mb-2">Active Rules</div>
                                            <h1 className="display-3 mb-0 fw-bold">{rules?.length || 0}</h1>
                                        </div>
                                        <FaBalanceScale style={{ fontSize: '6rem' }} className="opacity-25" />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                );
        }
    };

    return (
        <div className="d-flex" style={{ 
            background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', 
            minHeight: '100vh',
            fontFamily: "'Segoe UI', Roboto, sans-serif"
        }}>
            
            <div className="bg-dark text-white p-3 shadow" style={{ width: '260px', position: 'fixed', height: '100vh', zIndex: 1000 }}>
                <div className="text-center p-3 border-bottom border-secondary mb-4">
                    <h4 className="fw-bold m-0 text-primary"><FaGraduationCap className="me-2"/>EduTrack</h4>
                </div>
                
                <Nav className="flex-column gap-2">
                    <Nav.Link 
                        className={`text-white p-3 rounded d-flex align-items-center ${currentView === 'dashboard' ? 'bg-primary shadow-sm' : 'opacity-75'}`}
                        onClick={() => setCurrentView('dashboard')}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaThLarge className="me-3"/> Dashboard
                    </Nav.Link>
                    
                    <Nav.Link 
                        className={`text-white p-3 rounded d-flex align-items-center ${currentView === 'qualifications' ? 'bg-primary shadow-sm' : 'opacity-75'}`}
                        onClick={() => setCurrentView('qualifications')}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaGraduationCap className="me-3"/> Qualifications
                    </Nav.Link>

                    <Nav.Link 
                        className={`text-white p-3 rounded d-flex align-items-center ${currentView === 'programs' ? 'bg-primary shadow-sm' : 'opacity-75'}`}
                        onClick={() => setCurrentView('programs')}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaBook className="me-3"/> Programs
                    </Nav.Link>

                    <Nav.Link 
                        className={`text-white p-3 rounded d-flex align-items-center ${currentView === 'academicYears' ? 'bg-primary shadow-sm' : 'opacity-75'}`}
                        onClick={() => setCurrentView('academicYears')}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaCalendarAlt className="me-3"/> Academic Year
                    </Nav.Link>

                    <Nav.Link 
                        className={`text-white p-3 rounded d-flex align-items-center ${currentView === 'academicRules' ? 'bg-primary shadow-sm' : 'opacity-75'}`}
                        onClick={() => setCurrentView('academicRules')}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaBalanceScale className="me-3"/> Academic Rules
                    </Nav.Link>
                </Nav>
            </div>

            <div className="flex-grow-1" style={{ 
                marginLeft: '260px', 
                padding: '4rem',
                background: currentView === 'dashboard' ? 'linear-gradient(to bottom right, #4facfe 0%, #00f2fe 100%)' : 'transparent' 
            }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboardPage;