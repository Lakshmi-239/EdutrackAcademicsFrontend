// import React, { useState, useEffect } from 'react';
// import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
// import { adminService } from "../../services/AdminService"; 

// const ProgramManager = () => {
//     // State management
//     const [programs, setPrograms] = useState([]);
//     const [qualifications, setQualifications] = useState([]); 
//     const [show, setShow] = useState(false);
//     const [loading, setLoading] = useState(false);
    
//     const [isEdit, setIsEdit] = useState(false);
//     const [oldName, setOldName] = useState(''); // Tracking by name for the URL param
    
//     const [form, setForm] = useState({
//         qualificationId: '', 
//         programName: ''
//     });

//     // Load data on component mount
//     useEffect(() => {
//         loadInitialData();
//     }, []);

//     const loadInitialData = async () => {
//         setLoading(true);
//         try {
//             // Promise.all ensures we get both datasets before rendering
//             const [progRes, qualRes] = await Promise.all([
//                 adminService.getPrograms(),
//                 adminService.getQualifications()
//             ]);
            
//             setPrograms(progRes.data || []);
//             setQualifications(qualRes.data || []);
//         } catch (err) {
//             console.error("Error loading data:", err);
//             alert("Failed to load initial data. Check backend connection.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSave = async () => {
//         // Validation: Ensure ID is sent, not just text
//         if (!form.qualificationId || !form.programName) {
//             return alert("Please select a qualification and enter a program name");
//         }

//         try {
//             if (isEdit) {
//                 // PUT /api/admin/program/{oldName}
//                 await adminService.editProgram(oldName, form);
//             } else {
//                 // POST /api/admin/program
//                 await adminService.addProgram(form);
//             }
//             setShow(false);
//             loadInitialData(); // Refresh table
//         } catch (err) {
//             console.error("Save error:", err);
//             alert(err.response?.data?.Message || "Action failed. Check if Qualification ID is valid.");
//         }
//     };

//     const handleDelete = async (name) => {
//         if (window.confirm(`Are you sure you want to delete program: ${name}?`)) {
//             try {
//                 await adminService.deleteProgram(name);
//                 loadInitialData();
//             } catch (err) { 
//                 alert("Delete failed. This program might be linked to Academic Years."); 
//             }
//         }
//     };

//     const handleEditOpen = (item) => {
//         setIsEdit(true);
//         setOldName(item.programName);
//         setForm({
//             qualificationId: item.qualificationId, // This ID is now available thanks to your DTO fix
//             programName: item.programName
//         });
//         setShow(true);
//     };

//     const handleAddNew = () => {
//         setIsEdit(false);
//         setForm({ qualificationId: '', programName: '' });
//         setShow(true);
//     };

//     return (
//         <Container className="mt-4">
//             <Card className="shadow-sm border-0">
//                 <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
//                     <h5 className="mb-0">Program Management</h5>
//                     <Button variant="light" size="sm" onClick={handleAddNew} className="fw-bold">
//                         + Add Program
//                     </Button>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                     {loading ? (
//                         <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
//                     ) : (
//                         <Table hover responsive className="mb-0">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th className="ps-4">Program ID</th>
//                                     <th>Program Name</th>
//                                     <th>Qualification ID</th>
//                                     <th className="text-end pe-4">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {programs.length > 0 ? programs.map((item, idx) => (
//                                     <tr key={idx}>
//                                         <td className="ps-4 align-middle">{item.programId}</td>
//                                         <td className="align-middle fw-medium">{item.programName}</td>
//                                         <td className="align-middle">{item.qualificationId}</td>
//                                         <td className="text-end pe-4">
//                                             <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditOpen(item)}>Edit</Button>
//                                             <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.programName)}>Delete</Button>
//                                         </td>
//                                     </tr>
//                                 )) : (
//                                     <tr><td colSpan="4" className="text-center p-4">No programs found.</td></tr>
//                                 )}
//                             </tbody>
//                         </Table>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Modal for Add/Edit */}
//             <Modal show={show} onHide={() => setShow(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>{isEdit ? 'Update Program' : 'Add New Program'}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Select Qualification</Form.Label>
//                             <Form.Select
//                                 value={form.qualificationId}
//                                 onChange={(e) => setForm({...form, qualificationId: e.target.value})}
//                             >
//                                 <option value="">-- Select Qualification --</option>
//                                 {qualifications.map((q, i) => (
//                                     <option key={i} value={q.qualificationId}>
//                                         {q.qualificationName} ({q.qualificationId})
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Program Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder="e.g. CSE"
//                                 value={form.programName}
//                                 onChange={(e) => setForm({...form, programName: e.target.value})}
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
//                     <Button variant="primary" onClick={handleSave}>
//                         {isEdit ? 'Update Program' : 'Save Program'}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default ProgramManager;


import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService"; 
import { FiPlus, FiEdit, FiTrash2, FiActivity, FiLayers } from 'react-icons/fi'; // Added icons

const ProgramManager = () => {
    // State management (Logic remains identical)
    const [programs, setPrograms] = useState([]);
    const [qualifications, setQualifications] = useState([]); 
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [isEdit, setIsEdit] = useState(false);
    const [oldName, setOldName] = useState(''); 
    
    const [form, setForm] = useState({
        qualificationId: '', 
        programName: ''
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
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
        if (!form.qualificationId || !form.programName) {
            return alert("Please select a qualification and enter a program name");
        }
        try {
            if (isEdit) {
                await adminService.editProgram(oldName, form);
            } else {
                await adminService.addProgram(form);
            }
            setShow(false);
            loadInitialData();
        } catch (err) {
            console.error("Save error:", err);
            alert(err.response?.data?.Message || "Action failed.");
        }
    };

    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete program: ${name}?`)) {
            try {
                await adminService.deleteProgram(name);
                loadInitialData();
            } catch (err) { 
                alert("Delete failed."); 
            }
        }
    };

    const handleEditOpen = (item) => {
        setIsEdit(true);
        setOldName(item.programName);
        setForm({
            qualificationId: item.qualificationId,
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
        <div className="course-mgmt-dark min-vh-100">
            <Container className="py-5">
                {/* --- HEADER SECTION (Matched to QualificationManager) --- */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
                    <div>
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" 
                             style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
                            <FiActivity className="text-teal" />
                            <span className="text-teal fw-bold small uppercase tracking-wider">Academic Structure</span>
                        </div>
                        <h1 className="display-6 fw-bold text-white mb-1">Program <span className="text-teal">Management</span></h1>
                        <p className="text-slate-400 mb-0">Manage and organize specific programs under qualifications.</p>
                    </div>

                    <button 
                        className="btn-teal-action shadow-lg"
                        onClick={handleAddNew}
                    >
                        <FiPlus size={20} /> Add Program
                    </button>
                </div>

                {/* --- DATA TABLE CARD --- */}
                <Card className="selection-card-dark p-0 border-0 shadow-2xl overflow-hidden">
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" className="text-teal" />
                                <p className="text-slate-500 mt-2">Retrieving programs...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover variant="dark" className="mb-0 custom-table-dark">
                                    <thead>
                                        <tr>
                                            <th className="ps-4 py-4 text-slate-500 text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Program ID</th>
                                            <th className="py-4 text-slate-500 text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Program Name</th>
                                            <th className="py-4 text-slate-500 text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Qualification ID</th>
                                            <th className="text-end pe-4 py-4 text-slate-500 text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-0">
                                        {programs.length > 0 ? programs.map((item, idx) => (
                                            <tr key={idx} className="align-middle border-bottom border-slate-800">
                                                <td className="ps-4 py-4">
                                                    <span className="text-slate-400">{item.programId}</span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="pulse-icon-dark-static">
                                                            <FiLayers size={18} className="text-teal" />
                                                        </div>
                                                        <span className="fw-bold text-white">{item.programName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="px-3 py-1 rounded-pill fw-bold text-teal" style={{ background: "rgba(20, 184, 166, 0.1)", fontSize: '12px' }}>
                                                        {item.qualificationId}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4 py-4">
                                                    <button className="btn-icon-dark me-3" onClick={() => handleEditOpen(item)}>
                                                        <FiEdit size={18} className="text-warning" />
                                                    </button>
                                                    <button className="btn-icon-dark" onClick={() => handleDelete(item.programName)}>
                                                        <FiTrash2 size={18} className="text-danger" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="text-center p-4 text-slate-500">No programs found.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* --- STYLED MODAL --- */}
                <Modal 
                    show={show} 
                    onHide={() => setShow(false)} 
                    centered 
                    contentClassName="modal-content-dark border-0 shadow-2xl"
                >
                    <Modal.Header closeButton closeVariant="white" className="border-0 px-4 pt-4">
                        <Modal.Title className="fw-bold text-white">
                            {isEdit ? 'Update' : 'Register'} <span className="text-teal">Program</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="px-4">
                        <Form>
                            <Form.Group className="mb-4">
                                <label className="selection-label-dark">Select Qualification</label>
                                <Form.Select
                                    className="form-select-dark px-3 py-2 rounded-3"
                                    style={{ border: "1px solid #1e293b", background: "#020617", color: "#f1f5f9" }}
                                    value={form.qualificationId}
                                    onChange={(e) => setForm({...form, qualificationId: e.target.value})}
                                >
                                    <option value="" style={{background: "#0f172a"}}>-- Select Qualification --</option>
                                    {qualifications.map((q, i) => (
                                        <option key={i} value={q.qualificationId} style={{background: "#0f172a"}}>
                                            {q.qualificationName} ({q.qualificationId})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <label className="selection-label-dark">Program Name</label>
                                <Form.Control
                                    className="form-select-dark px-3 py-2 rounded-3"
                                    style={{ border: "1px solid #1e293b", background: "#020617" }}
                                    type="text"
                                    placeholder="e.g. CSE"
                                    value={form.programName}
                                    onChange={(e) => setForm({...form, programName: e.target.value})}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="border-0 px-4 pb-4">
                        <Button variant="link" className="text-slate-500 text-decoration-none fw-bold" onClick={() => setShow(false)}>
                            Discard
                        </Button>
                        <button 
                            className="btn-teal-action px-5" 
                            style={{ background: isEdit ? 'linear-gradient(to right, #0ea5e9, #2563eb)' : '#14b8a6' }}
                            onClick={handleSave}
                        >
                            {isEdit ? 'Save Changes' : 'Confirm Save'}
                        </button>
                    </Modal.Footer>
                </Modal>
            </Container>

            {/* --- REPLICATED STYLES --- */}
            <style>{`
                .course-mgmt-dark { background-color: #020617; min-height: 100vh; font-family: 'Inter', sans-serif; }
                .text-teal { color: #14b8a6 !important; }
                .text-slate-400 { color: #94a3b8 !important; }
                .text-slate-500 { color: #475569 !important; }
                
                .btn-teal-action {
                    background: #14b8a6; color: white; border: none; padding: 10px 24px;
                    border-radius: 12px; font-weight: 600; display: flex; align-items: center;
                    gap: 8px; transition: 0.3s;
                }
                .btn-teal-action:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(20, 184, 166, 0.2); }

                .selection-card-dark {
                    background: #0f172a; border-radius: 20px; 
                    border: 1px solid #1e293b;
                }

                .selection-label-dark { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 8px; display: block; }

                .custom-table-dark thead tr { background-color: #0f172a; border-bottom: 2px solid #1e293b; }
                .custom-table-dark tbody tr:hover { background-color: #1e293b !important; }
                .border-slate-800 { border-color: #1e293b !important; }

                .pulse-icon-dark-static {
                    width: 40px; height: 40px; background: rgba(20, 184, 166, 0.1);
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                }

                .btn-icon-dark { background: none; border: none; transition: 0.2s; padding: 5px; cursor: pointer; }
                .btn-icon-dark:hover { transform: scale(1.2); }

                .modal-content-dark { background-color: #0f172a !important; border-radius: 24px !important; }
                
                .form-select-dark {
                    background-color: transparent; border: none; color: #f1f5f9; font-weight: 500;
                    outline: none; width: 100%;
                }
                .form-select-dark:focus { background-color: #020617; border-color: #14b8a6 !important; box-shadow: none; color: white; }
            `}</style>
        </div>
    );
};

export default ProgramManager;