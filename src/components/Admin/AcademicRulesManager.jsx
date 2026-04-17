 
// // import React, { useState, useEffect } from 'react';
// // import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
// // import { adminService } from "../../services/AdminService";
 
// // const AcademicRulesManager = () => {
// //     const [rules, setRules] = useState([]);
// //     const [show, setShow] = useState(false);
// //     const [loading, setLoading] = useState(false);
// //     const [isEditMode, setIsEditMode] = useState(false);
// //     const [originalRuleName, setOriginalRuleName] = useState('');
 
// //     const [form, setForm] = useState({
// //         ruleName: '',
// //         ruleValue: '',
// //         description: ''
// //     });
 
// //     useEffect(() => {
// //         loadRules();
// //     }, []);
 
// //     const loadRules = async () => {
// //         setLoading(true);
// //         try {
// //             const res = await adminService.getRules();
// //             // Backend nundi data vachaka console lo keys chudandi (Capital R vs small r)
// //             setRules(res.data);
// //         } catch (err) {
// //             console.error("Rules load failure:", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
 
// //     const handleEdit = (rule) => {
// //         setIsEditMode(true);
// //         setOriginalRuleName(rule.ruleName); // Identifier ga vaadutham
// //         setForm({
// //             ruleName: rule.ruleName,
// //             ruleValue: rule.ruleValue,
// //             description: rule.description || ''
// //         });
// //         setShow(true);
// //     };
 
// //     const handleClose = () => {
// //         setShow(false);
// //         setIsEditMode(false);
// //         setForm({ ruleName: '', ruleValue: '', description: '' });
// //     };
 
// //     const handleSave = async () => {
// //         if (!form.ruleName || !form.ruleValue) return alert("Rule Name and Value are required!");
 
// //         try {
// //             if (isEditMode) {
// //                 // /api/admin/rule/{name} endpoint ki velthundi
// //                 await adminService.editRule(originalRuleName, form);
// //                 alert("Rule Updated Successfully!");
// //             } else {
// //                 await adminService.addRule(form);
// //                 alert("Rule Added Successfully!");
// //             }
// //             handleClose();
// //             loadRules();
// //         } catch (err) {
// //             alert(err.response?.data?.Message || "Operation failed. Check Console.");
// //         }
// //     };
 
// //     const handleDelete = async (name) => {
// //         if (window.confirm(`Are you sure you want to delete rule: ${name}?`)) {
// //             try {
// //                 await adminService.deleteRule(name);
// //                 loadRules();
// //             } catch (err) {
// //                 alert("Delete failed");
// //             }
// //         }
// //     };
 
// //     return (
// //         <Container className="mt-4">
// //             <Card className="shadow-sm border-0">
// //                 <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center p-3">
// //                     <h5 className="mb-0">Academic Rules Management</h5>
// //                     <Button variant="light" size="sm" onClick={() => { setIsEditMode(false); setShow(true); }} className="fw-bold">
// //                         + Add New Rule
// //                     </Button>
// //                 </Card.Header>
// //                 <Card.Body className="p-0">
// //                     {loading ? (
// //                         <div className="text-center p-5"><Spinner animation="border" variant="dark" /></div>
// //                     ) : (
// //                         <Table hover responsive className="mb-0 text-center">
// //                             <thead className="table-light">
// //                                 <tr>
// //                                     <th className="ps-4 text-start">Rule Name</th>
// //                                     <th>Value</th>
// //                                     <th>Description</th>
// //                                     <th className="text-end pe-4">Actions</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 {rules.length > 0 ? rules.map((rule, idx) => (
// //                                     <tr key={idx}>
// //                                         <td className="ps-4 text-start">{rule.ruleName}</td>
// //                                         <td><strong>{rule.ruleValue}</strong></td>
// //                                         <td>{rule.description || "No description"}</td>
// //                                         <td className="text-end pe-4">
// //                                             <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(rule)}>
// //                                                 Edit
// //                                             </Button>
// //                                             <Button variant="outline-danger" size="sm" onClick={() => handleDelete(rule.ruleName)}>
// //                                                 Delete
// //                                             </Button>
// //                                         </td>
// //                                     </tr>
// //                                 )) : (
// //                                     <tr>
// //                                         <td colSpan="4" className="p-4 text-muted">No rules found. Add some to get started!</td>
// //                                     </tr>
// //                                 )}
// //                             </tbody>
// //                         </Table>
// //                     )}
// //                 </Card.Body>
// //             </Card>
 
// //             <Modal show={show} onHide={handleClose} centered>
// //                 <Modal.Header closeButton>
// //                     <Modal.Title>{isEditMode ? 'Edit Rule' : 'Add New Rule'}</Modal.Title>
// //                 </Modal.Header>
// //                 <Modal.Body>
// //                     <Form>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label className="fw-bold">Rule Name</Form.Label>
// //                             <Form.Control
// //                                 type="text"
// //                                 placeholder="e.g. Min_Attendance"
// //                                 value={form.ruleName}
// //                                 onChange={(e) => setForm({...form, ruleName: e.target.value})}
// //                             />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label className="fw-bold">Rule Value</Form.Label>
// //                             <Form.Control
// //                                 type="text"
// //                                 placeholder="e.g. 75%"
// //                                 value={form.ruleValue}
// //                                 onChange={(e) => setForm({...form, ruleValue: e.target.value})}
// //                             />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label className="fw-bold">Description</Form.Label>
// //                             <Form.Control
// //                                 as="textarea"
// //                                 rows={3}
// //                                 placeholder="Details about this rule..."
// //                                 value={form.description}
// //                                 onChange={(e) => setForm({...form, description: e.target.value})}
// //                             />
// //                         </Form.Group>
// //                     </Form>
// //                 </Modal.Body>
// //                 <Modal.Footer>
// //                     <Button variant="secondary" onClick={handleClose}>Cancel</Button>
// //                     <Button variant="dark" onClick={handleSave}>
// //                         {isEditMode ? 'Update Rule' : 'Save Rule'}
// //                     </Button>
// //                 </Modal.Footer>
// //             </Modal>
// //         </Container>
// //     );
// // };
 
// // export default AcademicRulesManager;
// import React, { useState, useEffect } from 'react';
// import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
// import { adminService } from "../../services/AdminService";
// import { Edit2, Trash2, Plus, Award } from 'lucide-react';

// const AcademicRulesManager = () => {
//     const [rules, setRules] = useState([]);
//     const [show, setShow] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [originalRuleName, setOriginalRuleName] = useState('');

//     const [form, setForm] = useState({
//         ruleName: '',
//         ruleValue: '',
//         description: ''
//     });

//     useEffect(() => {
//         loadRules();
//     }, []);

//     const loadRules = async () => {
//         setLoading(true);
//         try {
//             const res = await adminService.getRules();
//             setRules(res.data);
//         } catch (err) {
//             console.error("Rules load failure:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (rule) => {
//         setIsEditMode(true);
//         setOriginalRuleName(rule.ruleName);
//         setForm({
//             ruleName: rule.ruleName,
//             ruleValue: rule.ruleValue,
//             description: rule.description || ''
//         });
//         setShow(true);
//     };

//     const handleClose = () => {
//         setShow(false);
//         setIsEditMode(false);
//         setForm({ ruleName: '', ruleValue: '', description: '' });
//     };

//     const handleSave = async () => {
//         if (!form.ruleName || !form.ruleValue) return alert("Rule Name and Value are required!");
//         try {
//             if (isEditMode) {
//                 await adminService.editRule(originalRuleName, form);
//                 alert("Rule Updated Successfully!");
//             } else {
//                 await adminService.addRule(form);
//                 alert("Rule Added Successfully!");
//             }
//             handleClose();
//             loadRules();
//         } catch (err) {
//             alert(err.response?.data?.Message || "Operation failed.");
//         }
//     };

//     const handleDelete = async (name) => {
//         if (window.confirm(`Are you sure you want to delete rule: ${name}?`)) {
//             try {
//                 await adminService.deleteRule(name);
//                 loadRules();
//             } catch (err) {
//                 alert("Delete failed");
//             }
//         }
//     };

//     return (
//         <Container fluid className="p-4" style={{ backgroundColor: '#0b0f19', minHeight: '100vh', color: '#ffffff' }}>
//             {/* Page Header Section */}
//             <div className="mb-4">
//                 <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
//                     ~ ACADEMIC STRUCTURE
//                 </span>
//                 <div className="d-flex justify-content-between align-items-center mt-1">
//                     <h2 className="fw-bold m-0">
//                         Academic Rule <span style={{ color: '#10b981' }}>Management</span>
//                     </h2>
//                     <Button 
//                         onClick={() => { setIsEditMode(false); setShow(true); }}
//                         style={{ backgroundColor: '#10b981', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '600' }}
//                     >
//                         + Add New Rule
//                     </Button>
//                 </div>
//                 <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '5px' }}>
//                     Manage and organize global academic guidelines and constraints.
//                 </p>
//             </div>

//             {/* Content Card Styling - Exact match to image_f76ff1 */}
//             <Card className="border-0" style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '20px' }}>
//                 <Card.Body className="p-0">
//                     {loading ? (
//                         <div className="text-center p-5"><Spinner animation="border" variant="success" /></div>
//                     ) : (
//                         <Table responsive borderless className="m-0 custom-rules-table">
//                             <thead>
//                                 <tr style={{ color: '#9ca3af', fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #1f2937' }}>
//                                     <th className="pb-3 fw-bold">RULE NAME</th>
//                                     <th className="pb-3 fw-bold text-center">VALUE</th>
//                                     <th className="pb-3 fw-bold">DESCRIPTION</th>
//                                     <th className="pb-3 fw-bold text-end">ACTIONS</th>
//                                 </tr>
//                             </thead>
//                             <tbody style={{ color: '#f3f4f6' }}>
//                                 {rules.length > 0 ? rules.map((rule, idx) => (
//                                     <tr key={idx} style={{ verticalAlign: 'middle' }}>
//                                         <td className="py-4">
//                                             <div className="d-flex align-items-center">
//                                                 <div className="me-3 d-flex align-items-center justify-content-center" 
//                                                      style={{ width: '40px', height: '40px', backgroundColor: '#1f2937', borderRadius: '50%' }}>
//                                                     <Award size={18} style={{ color: '#10b981' }} />
//                                                 </div>
//                                                 <span className="fw-bold" style={{ fontSize: '1.1rem' }}>{rule.ruleName}</span>
//                                             </div>
//                                         </td>
//                                         <td className="py-4 text-center">
//                                             <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1rem' }}>
//                                                 {rule.ruleValue}
//                                             </span>
//                                         </td>
//                                         <td className="py-4" style={{ color: '#9ca3af' }}>
//                                             {rule.description || "—"}
//                                         </td>
//                                         <td className="py-4 text-end">
//                                             <Button variant="link" className="p-2" onClick={() => handleEdit(rule)} style={{ color: '#f59e0b' }}>
//                                                 <Edit2 size={18} />
//                                             </Button>
//                                             <Button variant="link" className="p-2" onClick={() => handleDelete(rule.ruleName)} style={{ color: '#ef4444' }}>
//                                                 <Trash2 size={18} />
//                                             </Button>
//                                         </td>
//                                     </tr>
//                                 )) : (
//                                     <tr>
//                                         <td colSpan="4" className="text-center py-5 text-muted">No rules available.</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </Table>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Dark Themed Modal */}
//             <Modal show={show} onHide={handleClose} centered contentClassName="border-0 shadow-lg">
//                 <Modal.Header closeButton style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', color: 'white' }}>
//                     <Modal.Title style={{ fontSize: '1.1rem' }}>{isEditMode ? 'Edit Academic Rule' : 'Add New Rule'}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body style={{ backgroundColor: '#111827', color: 'white' }}>
//                     <Form>
//                         <Form.Group className="mb-4">
//                             <Form.Label style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600' }}>RULE NAME</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: 'white' }}
//                                 value={form.ruleName}
//                                 onChange={(e) => setForm({...form, ruleName: e.target.value})}
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-4">
//                             <Form.Label style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600' }}>VALUE</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: 'white' }}
//                                 value={form.ruleValue}
//                                 onChange={(e) => setForm({...form, ruleValue: e.target.value})}
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-2">
//                             <Form.Label style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600' }}>DESCRIPTION</Form.Label>
//                             <Form.Control
//                                 as="textarea" rows={3}
//                                 style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: 'white' }}
//                                 value={form.description}
//                                 onChange={(e) => setForm({...form, description: e.target.value})}
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer style={{ backgroundColor: '#111827', borderTop: '1px solid #1f2937' }}>
//                     <Button variant="outline-secondary" onClick={handleClose} className="border-0 text-white">Cancel</Button>
//                     <Button style={{ backgroundColor: '#10b981', border: 'none', padding: '8px 20px' }} onClick={handleSave}>
//                         {isEditMode ? 'Update Rule' : 'Save Rule'}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <style>{`
//                 .custom-rules-table tbody tr {
//                     border-bottom: 1px solid #1f2937;
//                 }
//                 .custom-rules-table tbody tr:last-child {
//                     border-bottom: none;
//                 }
//                 .btn-close {
//                     filter: invert(1);
//                 }
//             `}</style>
//         </Container>
//     );
// };

// export default AcademicRulesManager;




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

    // Unified Styles from AcademicYearManager
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
        loadRules();
    }, []);

    const loadRules = async () => {
        setLoading(true);
        try {
            const res = await adminService.getRules();
            setRules(res.data || []);
        } catch (err) {
            console.error("Rules load failure:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (rule) => {
        setIsEditMode(true);
        setOriginalRuleName(rule.ruleName);
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
                await adminService.editRule(originalRuleName, form);
                alert("Rule Updated Successfully!");
            } else {
                await adminService.addRule(form);
                alert("Rule Added Successfully!");
            }
            handleClose();
            loadRules();
        } catch (err) {
            alert(err.response?.data?.Message || "Operation failed.");
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
        <Container fluid className="p-4" style={{ backgroundColor: '#0b0e14', minHeight: '100vh' }}>
            {/* Header Section Matches AcademicYear */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <span style={{ color: '#1abc9c', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 'bold' }}>
                        ~ ACADEMIC STRUCTURE
                    </span>
                    <h1 style={styles.headerText}>Academic Rule <span style={styles.managerText}>Management</span></h1>
                    <p className="text-muted">Manage and organize global academic guidelines and constraints.</p>
                </div>
                <Button style={styles.addButton} onClick={() => { setIsEditMode(false); setShow(true); }}>
                    + Add New Rule
                </Button>
            </div>

            {/* Main Card Matches AcademicYear */}
            <Card style={styles.card} className="p-4">
                {loading ? (
                    <div className="text-center p-5"><Spinner animation="border" variant="info" /></div>
                ) : (
                    <Table responsive variant="dark" style={{ backgroundColor: 'transparent' }}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Rule Name</th>
                                <th style={styles.tableHeader}>Value</th>
                                <th style={styles.tableHeader}>Description</th>
                                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.length > 0 ? rules.map((rule, idx) => (
                                <tr key={idx} style={styles.tableRow}>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center">
                                            <div style={{ backgroundColor: '#2d3748', padding: '8px', borderRadius: '50%', marginRight: '15px' }}>
                                                🔖
                                            </div>
                                            <strong>{rule.ruleName}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: '#1abc9c', marginRight: '8px' }}>🏷️</span>
                                        {rule.ruleValue}
                                    </td>
                                    <td style={{ color: '#6c757d' }}>
                                        {rule.description || "—"}
                                    </td>
                                    <td className="text-end">
                                        <button style={styles.editIcon} onClick={() => handleEdit(rule)}>✏️</button>
                                        <button style={styles.deleteIcon} onClick={() => handleDelete(rule.ruleName)}>🗑️</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center p-4 text-muted">No rules found.</td></tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card>

            {/* Modal Styled to match AcademicYear Modal */}
            <Modal show={show} onHide={handleClose} centered contentClassName="bg-dark text-white">
                <Modal.Header closeButton className="border-secondary">
                    <Modal.Title>{isEditMode ? 'Edit Academic Rule' : 'Add New Rule'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Rule Name</Form.Label>
                            <Form.Control
                                type="text"
                                className="bg-secondary text-white border-0"
                                placeholder="e.g. Min_Attendance"
                                value={form.ruleName}
                                onChange={(e) => setForm({...form, ruleName: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Rule Value</Form.Label>
                            <Form.Control
                                type="text"
                                className="bg-secondary text-white border-0"
                                placeholder="e.g. 75%"
                                value={form.ruleValue}
                                onChange={(e) => setForm({...form, ruleValue: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control
                                as="textarea" rows={3}
                                className="bg-secondary text-white border-0"
                                placeholder="Details about this rule..."
                                value={form.description}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button variant="outline-light" onClick={handleClose}>Cancel</Button>
                    <Button style={{ backgroundColor: '#1abc9c', border: 'none', color: '#000', fontWeight: 'bold' }} onClick={handleSave}>
                        {isEditMode ? 'Update Rule' : 'Save Rule'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AcademicRulesManager;