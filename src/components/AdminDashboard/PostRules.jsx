import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, Row, Col } from 'react-bootstrap';
import { FaBalanceScale, FaTrashAlt, FaEdit, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const PostRules = () => {
    const [rules, setRules] = useState([]);
    const [ruleName, setRuleName] = useState('');
    const [ruleValue, setRuleValue] = useState(''); 
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    
    // editId stores the ORIGINAL rule name before it was modified in the input box
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const API_BASE = "https://localhost:7157/api/admin";

    const fetchRules = async () => {
        try {
            const response = await axios.get(`${API_BASE}/rules`);
            setRules(response.data);
        } catch (error) {
            console.error("Error fetching rules:", error);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleSaveRule = async (e) => {
        e.preventDefault();
        if (!ruleName || !ruleValue) return alert("Please fill in Rule Name and Value");

        setLoading(true);

        // LOGIC FIX: Payload must use 'ruleValue' to satisfy the backend
        const payload = {
            ruleName: ruleName.trim(),
            ruleValue: ruleValue.toString().trim(), 
            description: description.trim()
        };

        try {
            if (isEditing) {
                // LOGIC FIX: Use editId (the original name) in the URL so FirstOrDefault finds it
                // and the payload contains the new values
                await axios.put(`${API_BASE}/rule/${editId}`, payload);
                alert("Rule updated successfully!");
            } else {
                await axios.post(`${API_BASE}/rules`, payload);
                alert("Rule saved successfully!");
            }
            
            resetForm();
            fetchRules();
        } catch (error) {
            // LOGIC FIX: Parsing error object to avoid showing [object Object]
            const errorObj = error.response?.data?.errors;
            const message = errorObj 
                ? Object.values(errorObj).flat().join(", ") 
                : (error.response?.data || "Server connection failed");
            
            alert("Error: " + message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await axios.delete(`${API_BASE}/rule/${name}`);
                fetchRules();
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    const handleEdit = (rule) => {
        setIsEditing(true);
        // CRITICAL: We save the current name as the ID for the PUT URL
        setEditId(rule.ruleName); 
        setRuleName(rule.ruleName);
        setRuleValue(rule.ruleValue || rule.value); 
        setDescription(rule.description);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setRuleName('');
        setRuleValue('');
        setDescription('');
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="p-2">
            {/* Header section with total records count */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)' }}>
                <Card.Body className="p-4 d-flex justify-content-between align-items-center text-white">
                    <div>
                        <h2 className="fw-bold d-flex align-items-center gap-2">
                            <FaBalanceScale /> Academic Rules
                        </h2>
                        <p className="mb-0 opacity-75">Define system-wide logic and eligibility criteria</p>
                    </div>
                    <div className="bg-white bg-opacity-25 p-3 rounded text-center">
                        <h3 className="mb-0 fw-bold">{rules?.length || 0}</h3>
                        <small className="fw-bold" style={{ fontSize: '10px' }}>SQL RECORDS</small>
                    </div>
                </Card.Body>
            </Card>

            {/* Input Form Card */}
            <Card className="border-0 shadow-sm mb-4 p-4" style={{ borderRadius: '20px' }}>
                <Form onSubmit={handleSaveRule}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-secondary">{isEditing ? "Edit Rule" : "Add New Rule"}</h5>
                        {isEditing && <Button variant="link" className="text-muted" onClick={resetForm}><FaTimes /> Cancel</Button>}
                    </div>
                    <Row className="align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-secondary small">RULE NAME</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-light border-0 p-3"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-secondary small">VALUE</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-light border-0 p-3"
                                    value={ruleValue}
                                    onChange={(e) => setRuleValue(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-secondary small">DESCRIPTION</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-light border-0 p-3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button 
                                type="submit"
                                className="w-100 border-0 fw-bold p-3" 
                                style={{ background: isEditing ? '#2ecc71' : '#ffb300', color: 'white' }}
                                disabled={loading}
                            >
                                {loading ? "PROCESSING..." : isEditing ? "UPDATE RULE" : "SAVE RULE"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* Data Table */}
            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
                <Table responsive hover className="text-center align-middle">
                    <thead>
                        <tr>
                            <th className="text-secondary small fw-bold">#</th>
                            <th className="text-secondary small fw-bold">RULE NAME</th>
                            <th className="text-secondary small fw-bold">VALUE</th>
                            <th className="text-secondary small fw-bold">DESCRIPTION</th>
                            <th className="text-secondary small fw-bold">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map((rule, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="fw-bold">{rule.ruleName}</td>
                                <td>{rule.ruleValue || rule.value}</td>
                                <td className="text-muted small">{rule.description}</td>
                                <td>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button variant="link" className="text-warning p-0" onClick={() => handleEdit(rule)}>
                                            <FaEdit size={18} />
                                        </Button>
                                        <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(rule.ruleName)}>
                                            <FaTrashAlt size={18} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default PostRules;

// import React, { useState, useEffect } from 'react';
// import { Card, Table, Form, Button, Row, Col } from 'react-bootstrap';
// import { FaBalanceScale, FaTrashAlt, FaEdit, FaTimes } from 'react-icons/fa';
// // import { api } from '../api'; // Adjust the path to your api.js

// const PostRules = () => {
//     const [rules, setRules] = useState([]);
//     const [ruleName, setRuleName] = useState('');
//     const [ruleValue, setRuleValue] = useState(''); 
//     const [description, setDescription] = useState('');
//     const [loading, setLoading] = useState(false);
    
//     // editId stores the ORIGINAL rule name before it was modified in the input box
//     const [isEditing, setIsEditing] = useState(false);
//     const [editId, setEditId] = useState(null);

//     // 1. GET: Fetch rules using centralized API
//     const fetchRules = async () => {
//         try {
//             const data = await api.getRules();
//             setRules(data);
//         } catch (error) {
//             console.error("Error fetching rules:", error);
//         }
//     };

//     useEffect(() => {
//         fetchRules();
//     }, []);

//     // 2. POST & PUT: Handle Save
//     const handleSaveRule = async (e) => {
//         e.preventDefault();
//         if (!ruleName || !ruleValue) return alert("Please fill in Rule Name and Value");

//         setLoading(true);

//         const payload = {
//             ruleName: ruleName.trim(),
//             ruleValue: ruleValue.toString().trim(), 
//             description: description.trim()
//         };

//         try {
//             if (isEditing) {
//                 // CALL PUT API: Use editId (the original name) for the URL
//                 await api.updateRule(editId, payload);
//                 alert("✅ Rule updated successfully!");
//             } else {
//                 // CALL POST API
//                 await api.postRule(payload);
//                 alert("✅ Rule saved successfully!");
//             }
            
//             resetForm();
//             fetchRules();
//         } catch (error) {
//             const errorObj = error.response?.data?.errors;
//             const message = errorObj 
//                 ? Object.values(errorObj).flat().join(", ") 
//                 : (error.response?.data || "Server connection failed");
            
//             alert("Error: " + message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 3. DELETE: Handle removal
//     const handleDelete = async (name) => {
//         if (window.confirm(`Are you sure you want to delete ${name}?`)) {
//             try {
//                 await api.deleteRule(name);
//                 fetchRules();
//             } catch (error) {
//                 alert("Delete failed");
//             }
//         }
//     };

//     // Helper: Prepare for Edit
//     const handleEdit = (rule) => {
//         setIsEditing(true);
//         // Save the current name as the ID for the URL in case the name itself is edited
//         setEditId(rule.ruleName); 
//         setRuleName(rule.ruleName);
//         setRuleValue(rule.ruleValue || rule.value); 
//         setDescription(rule.description);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const resetForm = () => {
//         setRuleName('');
//         setRuleValue('');
//         setDescription('');
//         setIsEditing(false);
//         setEditId(null);
//     };

//     return (
//         <div className="p-2">
//             {/* Header section */}
//             <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)' }}>
//                 <Card.Body className="p-4 d-flex justify-content-between align-items-center text-white">
//                     <div>
//                         <h2 className="fw-bold d-flex align-items-center gap-2">
//                             <FaBalanceScale /> Academic Rules
//                         </h2>
//                         <p className="mb-0 opacity-75">Define system-wide logic and eligibility criteria</p>
//                     </div>
//                     <div className="bg-white bg-opacity-25 p-3 rounded text-center">
//                         <h3 className="mb-0 fw-bold">{rules?.length || 0}</h3>
//                         <small className="fw-bold" style={{ fontSize: '10px' }}>SQL RECORDS</small>
//                     </div>
//                 </Card.Body>
//             </Card>

//             {/* Input Form Card */}
//             <Card className="border-0 shadow-sm mb-4 p-4" style={{ borderRadius: '20px' }}>
//                 <Form onSubmit={handleSaveRule}>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5 className="fw-bold text-secondary">{isEditing ? "Edit Rule" : "Add New Rule"}</h5>
//                         {isEditing && <Button variant="link" className="text-muted" onClick={resetForm}><FaTimes /> Cancel</Button>}
//                     </div>
//                     <Row className="align-items-end">
//                         <Col md={3}>
//                             <Form.Group>
//                                 <Form.Label className="fw-bold text-secondary small">RULE NAME</Form.Label>
//                                 <Form.Control 
//                                     type="text" 
//                                     className="bg-light border-0 p-3"
//                                     value={ruleName}
//                                     onChange={(e) => setRuleName(e.target.value)}
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={2}>
//                             <Form.Group>
//                                 <Form.Label className="fw-bold text-secondary small">VALUE</Form.Label>
//                                 <Form.Control 
//                                     type="text" 
//                                     className="bg-light border-0 p-3"
//                                     value={ruleValue}
//                                     onChange={(e) => setRuleValue(e.target.value)}
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={4}>
//                             <Form.Group>
//                                 <Form.Label className="fw-bold text-secondary small">DESCRIPTION</Form.Label>
//                                 <Form.Control 
//                                     type="text" 
//                                     className="bg-light border-0 p-3"
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={3}>
//                             <Button 
//                                 type="submit"
//                                 className="w-100 border-0 fw-bold p-3" 
//                                 style={{ background: isEditing ? '#2ecc71' : '#ffb300', color: 'white' }}
//                                 disabled={loading}
//                             >
//                                 {loading ? "PROCESSING..." : isEditing ? "UPDATE RULE" : "SAVE RULE"}
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Card>

//             {/* Data Table */}
//             <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
//                 <Table responsive hover className="text-center align-middle">
//                     <thead>
//                         <tr>
//                             <th className="text-secondary small fw-bold">#</th>
//                             <th className="text-secondary small fw-bold">RULE NAME</th>
//                             <th className="text-secondary small fw-bold">VALUE</th>
//                             <th className="text-secondary small fw-bold">DESCRIPTION</th>
//                             <th className="text-secondary small fw-bold">ACTIONS</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {rules.map((rule, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td className="fw-bold">{rule.ruleName}</td>
//                                 <td>{rule.ruleValue || rule.value}</td>
//                                 <td className="text-muted small">{rule.description}</td>
//                                 <td>
//                                     <div className="d-flex justify-content-center gap-2">
//                                         <Button variant="link" className="text-warning p-0" onClick={() => handleEdit(rule)}>
//                                             <FaEdit size={18} />
//                                         </Button>
//                                         <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(rule.ruleName)}>
//                                             <FaTrashAlt size={18} />
//                                         </Button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </Card>
//         </div>
//     );
// };

// export default PostRules;