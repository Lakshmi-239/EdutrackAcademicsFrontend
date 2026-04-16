import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner, Alert } from 'react-bootstrap';
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

    // Filtered Programs logic: Matches the Program's qualificationId with the selected one
    const filteredPrograms = programs.filter(p => {
        const qId = p.qualificationId || p.QualificationId;
        return qId === form.qualificationId;
    });

    const handleEdit = (item) => {
        setIsEditMode(true);
        // Normalize data for editing (handle PascalCase vs camelCase)
        const currentProgramId = item.programId || item.ProgramId;
        const currentYearNum = item.yearNumber || item.YearNumber;
        
        setOldYearNum(currentYearNum);
        
        // Find parent qualification to pre-populate dropdown
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

        const payload = {
            programId: form.programId,
            yearNumber: parseInt(form.yearNumber)
        };

        try {
            if (isEditMode) {
                await adminService.editAcademicYear(oldYearNum, payload);
            } else {
                await adminService.addAcademicYear(payload);
            }
            handleClose();
            loadInitialData();
        } catch (err) {
            console.error("Operation Error:", err.response?.data);
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
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Academic Year Management</h5>
                    <Button variant="light" size="sm" onClick={() => setShow(true)} className="fw-bold">
                        + Add New Year
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Program Name</th>
                                    <th>Year Number</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicYears.length > 0 ? academicYears.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="ps-4">
                                            {/* Priority: ProgramName -> ProgramId */}
                                            <strong>{item.programName || item.ProgramName || item.programId || item.ProgramId}</strong>
                                        </td>
                                        <td>{item.yearNumber || item.YearNumber}</td>
                                        <td className="text-end pe-4">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.yearNumber || item.YearNumber)}>Delete</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="text-center p-4">No academic years found.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Academic Year' : 'Add Academic Year'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Qualification</Form.Label>
                            <Form.Select 
                                value={form.qualificationId} 
                                onChange={(e) => setForm({...form, qualificationId: e.target.value, programId: ''})}
                            >
                                <option value="">-- Select Qualification --</option>
                                {qualifications.map((q, i) => {
                                    const qId = q.qualificationId || q.QualificationId;
                                    const qName = q.qualificationName || q.QualificationName;
                                    return (
                                        <option key={i} value={qId}>
                                            {qName} {qId ? `(${qId})` : ''}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Program</Form.Label>
                            <Form.Select 
                                value={form.programId} 
                                onChange={(e) => setForm({...form, programId: e.target.value})} 
                                disabled={!form.qualificationId}
                            >
                                <option value="">-- Select Program --</option>
                                {filteredPrograms.map((p, i) => {
                                    const pId = p.programId || p.ProgramId;
                                    const pName = p.programName || p.ProgramName;
                                    return (
                                        <option key={i} value={pId}>
                                            {pName} {pId ? `(${pId})` : ''}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                            {!form.qualificationId && <small className="text-danger">Please select a qualification first</small>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Year Number</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter Year (e.g. 1)"
                                value={form.yearNumber} 
                                onChange={(e) => setForm({...form, yearNumber: e.target.value})} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>
                        {isEditMode ? 'Update Changes' : 'Save Year'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AcademicYearManager;