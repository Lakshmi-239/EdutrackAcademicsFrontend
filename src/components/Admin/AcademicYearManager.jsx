// import React, { useState, useEffect } from 'react';
// import { Table, Button, Modal, Form, Container, Card, Spinner, Alert } from 'react-bootstrap';
// import { adminService } from "../../services/AdminService";

// const AcademicYearManager = () => {
//     const [academicYears, setAcademicYears] = useState([]);
//     const [qualifications, setQualifications] = useState([]);
//     const [programs, setPrograms] = useState([]);
//     const [show, setShow] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [oldYearNum, setOldYearNum] = useState(null);

//     const [form, setForm] = useState({
//         qualificationId: '', 
//         programId: '',
//         yearNumber: ''
//     });

//     useEffect(() => {
//         loadInitialData();
//     }, []);

//     const loadInitialData = async () => {
//         setLoading(true);
//         try {
//             const [yearRes, qualRes, progRes] = await Promise.all([
//                 adminService.getAcademicYears(),
//                 adminService.getQualifications(),
//                 adminService.getPrograms()
//             ]);
//             setAcademicYears(yearRes.data || []);
//             setQualifications(qualRes.data || []);
//             setPrograms(progRes.data || []);
//         } catch (err) {
//             console.error("Data load failure:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Filtered Programs logic: Matches the Program's qualificationId with the selected one
//     const filteredPrograms = programs.filter(p => {
//         const qId = p.qualificationId || p.QualificationId;
//         return qId === form.qualificationId;
//     });

//     const handleEdit = (item) => {
//         setIsEditMode(true);
//         // Normalize data for editing (handle PascalCase vs camelCase)
//         const currentProgramId = item.programId || item.ProgramId;
//         const currentYearNum = item.yearNumber || item.YearNumber;
        
//         setOldYearNum(currentYearNum);
        
//         // Find parent qualification to pre-populate dropdown
//         const parentProgram = programs.find(p => (p.programId || p.ProgramId) === currentProgramId);
        
//         setForm({
//             qualificationId: parentProgram ? (parentProgram.qualificationId || parentProgram.QualificationId) : '',
//             programId: currentProgramId,
//             yearNumber: currentYearNum
//         });
//         setShow(true);
//     };

//     const handleClose = () => {
//         setShow(false);
//         setIsEditMode(false);
//         setForm({ qualificationId: '', programId: '', yearNumber: '' });
//     };

//     const handleSave = async () => {
//         if (!form.programId || !form.yearNumber) {
//             return alert("Please select a program and enter a year number!");
//         }

//         const payload = {
//             programId: form.programId,
//             yearNumber: parseInt(form.yearNumber)
//         };

//         try {
//             if (isEditMode) {
//                 await adminService.editAcademicYear(oldYearNum, payload);
//             } else {
//                 await adminService.addAcademicYear(payload);
//             }
//             handleClose();
//             loadInitialData();
//         } catch (err) {
//             console.error("Operation Error:", err.response?.data);
//             alert("Operation failed: " + (err.response?.data?.Message || "Check Console"));
//         }
//     };

//     const handleDelete = async (yearNum) => {
//         if (window.confirm(`Delete academic year ${yearNum}?`)) {
//             try {
//                 await adminService.deleteAcademicYear(yearNum);
//                 loadInitialData();
//             } catch (err) { 
//                 alert("Delete failed. This record might be referenced elsewhere."); 
//             }
//         }
//     };

//     return (
//         <Container className="mt-4">
//             <Card className="shadow-sm border-0">
//                 <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
//                     <h5 className="mb-0">Academic Year Management</h5>
//                     <Button variant="light" size="sm" onClick={() => setShow(true)} className="fw-bold">
//                         + Add New Year
//                     </Button>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                     {loading ? (
//                         <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
//                     ) : (
//                         <Table hover responsive className="mb-0">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th className="ps-4">Program Name</th>
//                                     <th>Year Number</th>
//                                     <th className="text-end pe-4">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {academicYears.length > 0 ? academicYears.map((item, idx) => (
//                                     <tr key={idx}>
//                                         <td className="ps-4">
//                                             {/* Priority: ProgramName -> ProgramId */}
//                                             <strong>{item.programName || item.ProgramName || item.programId || item.ProgramId}</strong>
//                                         </td>
//                                         <td>{item.yearNumber || item.YearNumber}</td>
//                                         <td className="text-end pe-4">
//                                             <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
//                                             <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.yearNumber || item.YearNumber)}>Delete</Button>
//                                         </td>
//                                     </tr>
//                                 )) : (
//                                     <tr><td colSpan="3" className="text-center p-4">No academic years found.</td></tr>
//                                 )}
//                             </tbody>
//                         </Table>
//                     )}
//                 </Card.Body>
//             </Card>

//             <Modal show={show} onHide={handleClose} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>{isEditMode ? 'Edit Academic Year' : 'Add Academic Year'}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Select Qualification</Form.Label>
//                             <Form.Select 
//                                 value={form.qualificationId} 
//                                 onChange={(e) => setForm({...form, qualificationId: e.target.value, programId: ''})}
//                             >
//                                 <option value="">-- Select Qualification --</option>
//                                 {qualifications.map((q, i) => {
//                                     const qId = q.qualificationId || q.QualificationId;
//                                     const qName = q.qualificationName || q.QualificationName;
//                                     return (
//                                         <option key={i} value={qId}>
//                                             {qName} {qId ? `(${qId})` : ''}
//                                         </option>
//                                     );
//                                 })}
//                             </Form.Select>
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Select Program</Form.Label>
//                             <Form.Select 
//                                 value={form.programId} 
//                                 onChange={(e) => setForm({...form, programId: e.target.value})} 
//                                 disabled={!form.qualificationId}
//                             >
//                                 <option value="">-- Select Program --</option>
//                                 {filteredPrograms.map((p, i) => {
//                                     const pId = p.programId || p.ProgramId;
//                                     const pName = p.programName || p.ProgramName;
//                                     return (
//                                         <option key={i} value={pId}>
//                                             {pName} {pId ? `(${pId})` : ''}
//                                         </option>
//                                     );
//                                 })}
//                             </Form.Select>
//                             {!form.qualificationId && <small className="text-danger">Please select a qualification first</small>}
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Year Number</Form.Label>
//                             <Form.Control 
//                                 type="number" 
//                                 placeholder="Enter Year (e.g. 1)"
//                                 value={form.yearNumber} 
//                                 onChange={(e) => setForm({...form, yearNumber: e.target.value})} 
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>Cancel</Button>
//                     <Button variant="primary" onClick={handleSave}>
//                         {isEditMode ? 'Update Changes' : 'Save Year'}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default AcademicYearManager;


import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService";

const AcademicYearManager = () => {
    const [academicYears, setAcademicYears] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [oldYearNum, setOldYearNum] = useState(null);

    const [form, setForm] = useState({
        qualificationId: '', 
        programId: '',
        yearNumber: ''
    });

    // Custom styles to match the screenshots
    const styles = {
        card: { backgroundColor: '#1a222b', borderRadius: '15px', color: '#fff', border: 'none' },
        headerText: { color: '#fff', fontSize: '2rem', fontWeight: 'bold' },
        managerText: { color: '#1abc9c' },
        tableHeader: { color: '#6c757d', textTransform: 'uppercase', fontSize: '0.8rem', borderBottom: '1px solid #2d3748' },
        tableRow: { borderBottom: '1px solid #2d3748', verticalAlign: 'middle', color: '#e2e8f0' },
        addButton: { backgroundColor: '#1abc9c', border: 'none', borderRadius: '8px', color: '#1a222b', fontWeight: 'bold', padding: '10px 20px' },
        editIcon: { color: '#f1c40f', cursor: 'pointer', marginRight: '15px', background: 'none', border: 'none' },
        deleteIcon: { color: '#e74c3c', cursor: 'pointer', background: 'none', border: 'none' }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [yearRes, qualRes, progRes] = await Promise.all([
                adminService.getAcademicYears(),
                adminService.getQualifications(),
                adminService.getPrograms()
            ]);
            setAcademicYears(yearRes.data || []);
            setQualifications(qualRes.data || []);
            setPrograms(progRes.data || []);
        } catch (err) {
            console.error("Data load failure:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrograms = programs.filter(p => {
        const qId = p.qualificationId || p.QualificationId;
        return qId === form.qualificationId;
    });

    const handleEdit = (item) => {
        setIsEditMode(true);
        const currentProgramId = item.programId || item.ProgramId;
        const currentYearNum = item.yearNumber || item.YearNumber;
        setOldYearNum(currentYearNum);
        const parentProgram = programs.find(p => (p.programId || p.ProgramId) === currentProgramId);
        
        setForm({
            qualificationId: parentProgram ? (parentProgram.qualificationId || parentProgram.QualificationId) : '',
            programId: currentProgramId,
            yearNumber: currentYearNum
        });
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setIsEditMode(false);
        setForm({ qualificationId: '', programId: '', yearNumber: '' });
    };

    const handleSave = async () => {
        if (!form.programId || !form.yearNumber) {
            return alert("Please select a program and enter a year number!");
        }
        const payload = { programId: form.programId, yearNumber: parseInt(form.yearNumber) };
        try {
            if (isEditMode) {
                await adminService.editAcademicYear(oldYearNum, payload);
            } else {
                await adminService.addAcademicYear(payload);
            }
            handleClose();
            loadInitialData();
        } catch (err) {
            alert("Operation failed: " + (err.response?.data?.Message || "Check Console"));
        }
    };

    const handleDelete = async (yearNum) => {
        if (window.confirm(`Delete academic year ${yearNum}?`)) {
            try {
                await adminService.deleteAcademicYear(yearNum);
                loadInitialData();
            } catch (err) { 
                alert("Delete failed. This record might be referenced elsewhere."); 
            }
        }
    };

    return (
        <Container fluid className="p-4" style={{ backgroundColor: '#0b0e14', minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <span style={{ color: '#1abc9c', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 'bold' }}>
                        ~ ACADEMIC STRUCTURE
                    </span>
                    <h1 style={styles.headerText}>Academic Year <span style={styles.managerText}>Management</span></h1>
                    <p className="text-muted">Manage and organize available academic year levels.</p>
                </div>
                <Button style={styles.addButton} onClick={() => setShow(true)}>
                    + Add New Year
                </Button>
            </div>

            <Card style={styles.card} className="p-4">
                {loading ? (
                    <div className="text-center p-5"><Spinner animation="border" variant="info" /></div>
                ) : (
                    <Table responsive variant="dark" style={{ backgroundColor: 'transparent' }}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Program Name</th>
                                <th style={styles.tableHeader}>Year Number</th>
                                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicYears.length > 0 ? academicYears.map((item, idx) => (
                                <tr key={idx} style={styles.tableRow}>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center">
                                            <div style={{ backgroundColor: '#2d3748', padding: '8px', borderRadius: '50%', marginRight: '15px' }}>
                                                🎓
                                            </div>
                                            <strong>{item.programName || item.ProgramName || item.programId || item.ProgramId}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: '#1abc9c', marginRight: '8px' }}>🏷️</span>
                                        {item.yearNumber || item.YearNumber}
                                    </td>
                                    <td className="text-end">
                                        <button style={styles.editIcon} onClick={() => handleEdit(item)}>✏️</button>
                                        <button style={styles.deleteIcon} onClick={() => handleDelete(item.yearNumber || item.YearNumber)}>🗑️</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3" className="text-center p-4 text-muted">No academic years found.</td></tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card>

            <Modal show={show} onHide={handleClose} centered contentClassName="bg-dark text-white">
                <Modal.Header closeButton className="border-secondary">
                    <Modal.Title>{isEditMode ? 'Edit Academic Year' : 'Add Academic Year'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Qualification</Form.Label>
                            <Form.Select 
                                className="bg-secondary text-white border-0"
                                value={form.qualificationId} 
                                onChange={(e) => setForm({...form, qualificationId: e.target.value, programId: ''})}
                            >
                                <option value="">-- Select Qualification --</option>
                                {qualifications.map((q, i) => (
                                    <option key={i} value={q.qualificationId || q.QualificationId}>
                                        {q.qualificationName || q.QualificationName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Program</Form.Label>
                            <Form.Select 
                                className="bg-secondary text-white border-0"
                                value={form.programId} 
                                onChange={(e) => setForm({...form, programId: e.target.value})} 
                                disabled={!form.qualificationId}
                            >
                                <option value="">-- Select Program --</option>
                                {filteredPrograms.map((p, i) => (
                                    <option key={i} value={p.programId || p.ProgramId}>
                                        {p.programName || p.ProgramName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Year Number</Form.Label>
                            <Form.Control 
                                type="number" 
                                className="bg-secondary text-white border-0"
                                value={form.yearNumber} 
                                onChange={(e) => setForm({...form, yearNumber: e.target.value})} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button variant="outline-light" onClick={handleClose}>Cancel</Button>
                    <Button style={{ backgroundColor: '#1abc9c', border: 'none', color: '#000' }} onClick={handleSave}>
                        {isEditMode ? 'Update Changes' : 'Save Year'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AcademicYearManager;