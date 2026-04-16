import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService"; // Path check chesko
 
const ProgramManager = () => {
    const [programs, setPrograms] = useState([]);
    const [qualifications, setQualifications] = useState([]); // Dropdown kosam
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
   
    const [isEdit, setIsEdit] = useState(false);
    const [oldName, setOldName] = useState('');
   
    // Form lo qualificationName mariyu programName rendu undali
    const [form, setForm] = useState({
        qualificationName: '',
        programName: ''
    });
 
    useEffect(() => {
        loadInitialData();
    }, []);
 
    const loadInitialData = async () => {
        setLoading(true);
        try {
            // Rendu API calls okesaari chestunnam
            const [progRes, qualRes] = await Promise.all([
                adminService.getPrograms(),
                adminService.getQualifications()
            ]);
            setPrograms(progRes.data);
            setQualifications(qualRes.data);
        } catch (err) {
            console.error("Error loading data", err);
        } finally {
            setLoading(false);
        }
    };
 
    const handleSave = async () => {
        if (!form.qualificationName || !form.programName) {
            return alert("Please select qualification and enter program name");
        }
        try {
            if (isEdit) {
                await adminService.editProgram(oldName, form);
            } else {
                await adminService.addProgram(form);
            }
            setShow(false);
            loadInitialData(); // Refresh list
        } catch (err) {
            alert("Action failed. Check if program already exists.");
        }
    };
 
    const handleDelete = async (name) => {
        if (window.confirm(`Delete program: ${name}?`)) {
            try {
                await adminService.deleteProgram(name);
                loadInitialData();
            } catch (err) { alert("Delete failed"); }
        }
    };
 
    const handleEditOpen = (item) => {
        setIsEdit(true);
        setOldName(item.programName);
        setForm({
            qualificationName: item.qualificationName,
            programName: item.programName
        });
        setShow(true);
    };
 
    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Program Management</h5>
                    <Button variant="light" size="sm" onClick={() => { setIsEdit(false); setForm({qualificationName: '', programName: ''}); setShow(true); }}>
                        + Add Program
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div> : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Qualification</th>
                                    <th>Program Name</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="ps-4">{item.qualificationName}</td>
                                        <td>{item.programName}</td>
                                        <td className="text-end pe-4">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditOpen(item)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.programName)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
 
            {/* Modal for Add/Edit */}
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Update Program' : 'Add New Program'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Qualification</Form.Label>
                            <Form.Select
                                value={form.qualificationName}
                                onChange={(e) => setForm({...form, qualificationName: e.target.value})}
                            >
                                <option value="">-- Select Qualification --</option>
                                {qualifications.map((q, i) => (
                                    <option key={i} value={q.qualificationName}>
                                        {q.qualificationName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
 
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Program Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Computer Science"
                                value={form.programName}
                                onChange={(e) => setForm({...form, programName: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>
                        {isEdit ? 'Update' : 'Save Program'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
 
export default ProgramManager;