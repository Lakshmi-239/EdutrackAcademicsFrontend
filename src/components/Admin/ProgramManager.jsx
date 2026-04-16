import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService"; 

const ProgramManager = () => {
    // State management
    const [programs, setPrograms] = useState([]);
    const [qualifications, setQualifications] = useState([]); 
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [isEdit, setIsEdit] = useState(false);
    const [oldName, setOldName] = useState(''); // Tracking by name for the URL param
    
    const [form, setForm] = useState({
        qualificationId: '', 
        programName: ''
    });

    // Load data on component mount
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            // Promise.all ensures we get both datasets before rendering
            const [progRes, qualRes] = await Promise.all([
                adminService.getPrograms(),
                adminService.getQualifications()
            ]);
            
            setPrograms(progRes.data || []);
            setQualifications(qualRes.data || []);
        } catch (err) {
            console.error("Error loading data:", err);
            alert("Failed to load initial data. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation: Ensure ID is sent, not just text
        if (!form.qualificationId || !form.programName) {
            return alert("Please select a qualification and enter a program name");
        }

        try {
            if (isEdit) {
                // PUT /api/admin/program/{oldName}
                await adminService.editProgram(oldName, form);
            } else {
                // POST /api/admin/program
                await adminService.addProgram(form);
            }
            setShow(false);
            loadInitialData(); // Refresh table
        } catch (err) {
            console.error("Save error:", err);
            alert(err.response?.data?.Message || "Action failed. Check if Qualification ID is valid.");
        }
    };

    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete program: ${name}?`)) {
            try {
                await adminService.deleteProgram(name);
                loadInitialData();
            } catch (err) { 
                alert("Delete failed. This program might be linked to Academic Years."); 
            }
        }
    };

    const handleEditOpen = (item) => {
        setIsEdit(true);
        setOldName(item.programName);
        setForm({
            qualificationId: item.qualificationId, // This ID is now available thanks to your DTO fix
            programName: item.programName
        });
        setShow(true);
    };

    const handleAddNew = () => {
        setIsEdit(false);
        setForm({ qualificationId: '', programName: '' });
        setShow(true);
    };

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Program Management</h5>
                    <Button variant="light" size="sm" onClick={handleAddNew} className="fw-bold">
                        + Add Program
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Program ID</th>
                                    <th>Program Name</th>
                                    <th>Qualification ID</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.length > 0 ? programs.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="ps-4 align-middle">{item.programId}</td>
                                        <td className="align-middle fw-medium">{item.programName}</td>
                                        <td className="align-middle">{item.qualificationId}</td>
                                        <td className="text-end pe-4">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditOpen(item)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.programName)}>Delete</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center p-4">No programs found.</td></tr>
                                )}
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
                                value={form.qualificationId}
                                onChange={(e) => setForm({...form, qualificationId: e.target.value})}
                            >
                                <option value="">-- Select Qualification --</option>
                                {qualifications.map((q, i) => (
                                    <option key={i} value={q.qualificationId}>
                                        {q.qualificationName} ({q.qualificationId})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Program Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. CSE"
                                value={form.programName}
                                onChange={(e) => setForm({...form, programName: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>
                        {isEdit ? 'Update Program' : 'Save Program'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProgramManager;