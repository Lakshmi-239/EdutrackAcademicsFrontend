 
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService";
 
const AcademicRulesManager = () => {
    const [rules, setRules] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalRuleName, setOriginalRuleName] = useState('');
 
    const [form, setForm] = useState({
        ruleName: '',
        ruleValue: '',
        description: ''
    });
 
    useEffect(() => {
        loadRules();
    }, []);
 
    const loadRules = async () => {
        setLoading(true);
        try {
            const res = await adminService.getRules();
            // Backend nundi data vachaka console lo keys chudandi (Capital R vs small r)
            setRules(res.data);
        } catch (err) {
            console.error("Rules load failure:", err);
        } finally {
            setLoading(false);
        }
    };
 
    const handleEdit = (rule) => {
        setIsEditMode(true);
        setOriginalRuleName(rule.ruleName); // Identifier ga vaadutham
        setForm({
            ruleName: rule.ruleName,
            ruleValue: rule.ruleValue,
            description: rule.description || ''
        });
        setShow(true);
    };
 
    const handleClose = () => {
        setShow(false);
        setIsEditMode(false);
        setForm({ ruleName: '', ruleValue: '', description: '' });
    };
 
    const handleSave = async () => {
        if (!form.ruleName || !form.ruleValue) return alert("Rule Name and Value are required!");
 
        try {
            if (isEditMode) {
                // /api/admin/rule/{name} endpoint ki velthundi
                await adminService.editRule(originalRuleName, form);
                alert("Rule Updated Successfully!");
            } else {
                await adminService.addRule(form);
                alert("Rule Added Successfully!");
            }
            handleClose();
            loadRules();
        } catch (err) {
            alert(err.response?.data?.Message || "Operation failed. Check Console.");
        }
    };
 
    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete rule: ${name}?`)) {
            try {
                await adminService.deleteRule(name);
                loadRules();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };
 
    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Academic Rules Management</h5>
                    <Button variant="light" size="sm" onClick={() => { setIsEditMode(false); setShow(true); }} className="fw-bold">
                        + Add New Rule
                    </Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center p-5"><Spinner animation="border" variant="dark" /></div>
                    ) : (
                        <Table hover responsive className="mb-0 text-center">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4 text-start">Rule Name</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.length > 0 ? rules.map((rule, idx) => (
                                    <tr key={idx}>
                                        <td className="ps-4 text-start">{rule.ruleName}</td>
                                        <td><strong>{rule.ruleValue}</strong></td>
                                        <td>{rule.description || "No description"}</td>
                                        <td className="text-end pe-4">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(rule)}>
                                                Edit
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(rule.ruleName)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-muted">No rules found. Add some to get started!</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
 
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Rule' : 'Add New Rule'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Rule Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Min_Attendance"
                                value={form.ruleName}
                                onChange={(e) => setForm({...form, ruleName: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Rule Value</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. 75%"
                                value={form.ruleValue}
                                onChange={(e) => setForm({...form, ruleValue: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Details about this rule..."
                                value={form.description}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="dark" onClick={handleSave}>
                        {isEditMode ? 'Update Rule' : 'Save Rule'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
 
export default AcademicRulesManager;