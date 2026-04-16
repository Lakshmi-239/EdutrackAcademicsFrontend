import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService";

const QualificationManager = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // --- Edit Mode States ---
    const [isEdit, setIsEdit] = useState(false);
    const [oldName, setOldName] = useState('');
    
    // Updated form state to match Backend DTO
    const [form, setForm] = useState({ 
        qualificationName: '',
        qualificationsh: '',
        qualificationYears: '',
        qualificationDescription: ''
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await adminService.getQualifications();
            setData(res.data);
        } catch (err) {
            console.error("Error loading data", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---
    const handleEdit = (item) => {
        setIsEdit(true);
        setOldName(item.qualificationName);
        setForm({ 
            qualificationName: item.qualificationName,
            qualificationsh: item.qualificationsh || '',
            qualificationYears: item.qualificationYears || '',
            qualificationDescription: item.qualificationDescription || ''
        });
        setShow(true);
    };

    const handleAddNew = () => {
        setIsEdit(false);
        setForm({ 
            qualificationName: '',
            qualificationsh: '',
            qualificationYears: '',
            qualificationDescription: ''
        });
        setShow(true);
    };

    const handleSave = async () => {
        if (!form.qualificationName) return alert("Please enter a name");
        
        try {
            if (isEdit) {
                await adminService.editQualification(oldName, form);
            } else {
                // Sending the full object now matches the backend expectations
                await adminService.addQualification(form);
            }
            setShow(false);
            loadData();
        } catch (err) {
            console.error("Error saving data", err);
            alert("Action failed. Please check if the qualification name already exists.");
        }
    };

    const handleDelete = async (name) => {
        if (window.confirm(`Delete ${name}?`)) {
            try {
                await adminService.deleteQualification(name);
                loadData();
            } catch (err) { alert("Delete failed."); }
        }
    };

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Academic Qualifications</h5>
                    <Button variant="light" size="sm" onClick={handleAddNew} className="fw-bold">
                        + Add New
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Name</th>
                                    <th>Short Name</th>
                                    <th>Years</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="ps-4 align-middle fw-medium">{item.qualificationName}</td>
                                        <td className="align-middle">{item.qualificationsh}</td>
                                        <td className="align-middle">{item.qualificationYears}</td>
                                        <td className="text-end pe-4">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.qualificationName)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Update Qualification' : 'Add New Qualification'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Qualification Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.qualificationName}
                                onChange={(e) => setForm({ ...form, qualificationName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Short Name (sh)</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.qualificationsh}
                                onChange={(e) => setForm({ ...form, qualificationsh: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Duration (Years)</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.qualificationYears}
                                onChange={(e) => setForm({ ...form, qualificationYears: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={form.qualificationDescription}
                                onChange={(e) => setForm({ ...form, qualificationDescription: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>
                        {isEdit ? 'Update' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default QualificationManager;