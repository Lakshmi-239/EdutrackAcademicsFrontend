import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService";
import { FiPlus, FiEdit, FiTrash2, FiActivity, FiAward } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';

const QualificationManager = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [isEdit, setIsEdit] = useState(false);
    const [oldName, setOldName] = useState('');
    
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
                await adminService.addQualification(form);
            }
            setShow(false);
            loadData();
        } catch (err) {
            console.error("Error saving data", err);
            alert("Action failed. Check for duplicate names.");
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
        <div className="course-mgmt-dark min-vh-100">
            <Container className="py-5">
                {/* --- HEADER SECTION --- */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
                    <div>
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" 
                             style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
                            <FiActivity className="text-teal" />
                            <span className="text-teal fw-bold small uppercase tracking-wider">Academic Structure</span>
                        </div>
                        <h1 className="display-6 fw-bold text-white mb-1">Qualification <span className="text-teal">Manager</span></h1>
                        <p className="text-slate-400 mb-0">Manage and organize available academic qualification levels.</p>
                    </div>

                    <button 
                        className="btn-teal-action shadow-lg"
                        onClick={handleAddNew}
                    >
                        <FiPlus size={20} /> Create Qualification
                    </button>
                </div>

                {/* --- DATA TABLE CARD --- */}
                <Card className="selection-card-dark p-0 border-0 shadow-2xl overflow-hidden">
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" className="text-teal" />
                                <p className="text-slate-500 mt-2">Retrieving catalog...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover variant="dark" className="mb-0 custom-table-dark">
                                    <thead>
                                        <tr>
                                            <th className="ps-4 py-4 text-slate-500 text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Qualification Name</th>
                                            <th className="py-4 text-slate-500 text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Short Code</th>
                                            <th className="py-4 text-slate-500 text-uppercase tracking-widest text-center" style={{ fontSize: '11px' }}>Years</th>
                                            <th className="text-end pe-4 py-4 text-slate-500 text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-0">
                                        {data.map((item, idx) => (
                                            <tr key={idx} className="align-middle border-bottom border-slate-800">
                                                <td className="ps-4 py-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="pulse-icon-dark-static">
                                                            <LuGraduationCap size={18} className="text-teal" />
                                                        </div>
                                                        <span className="fw-bold text-white">{item.qualificationName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="px-3 py-1 rounded-pill fw-bold text-teal" style={{ background: "rgba(20, 184, 166, 0.1)", fontSize: '12px' }}>
                                                        {item.qualificationsh}
                                                    </span>
                                                </td>
                                                <td className="text-center py-4">
                                                    <div className="text-slate-300">
                                                        <FiAward className="me-1 text-teal"/> {item.qualificationYears}
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4 py-4">
                                                    <button className="btn-icon-dark me-3" onClick={() => handleEdit(item)}>
                                                        <FiEdit size={18} className="text-warning" />
                                                    </button>
                                                    <button className="btn-icon-dark" onClick={() => handleDelete(item.qualificationName)}>
                                                        <FiTrash2 size={18} className="text-danger" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
                            {isEdit ? 'Update' : 'Register'} <span className="text-teal">Qualification</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="px-4">
                        <Form>
                            <Form.Group className="mb-4">
                                <label className="selection-label-dark">Full Name</label>
                                <Form.Control
                                    className="form-select-dark px-3 py-2 rounded-3"
                                    style={{ border: "1px solid #1e293b", background: "#020617" }}
                                    type="text"
                                    placeholder="e.g. Bachelor of Technology"
                                    value={form.qualificationName}
                                    onChange={(e) => setForm({ ...form, qualificationName: e.target.value })}
                                />
                            </Form.Group>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-4">
                                        <label className="selection-label-dark">Short Code</label>
                                        <Form.Control
                                            className="form-select-dark px-3 py-2 rounded-3"
                                            style={{ border: "1px solid #1e293b", background: "#020617" }}
                                            type="text"
                                            placeholder="B.Tech"
                                            value={form.qualificationsh}
                                            onChange={(e) => setForm({ ...form, qualificationsh: e.target.value })}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-4">
                                        <label className="selection-label-dark">Duration (Yrs)</label>
                                        <Form.Control
                                            className="form-select-dark px-3 py-2 rounded-3"
                                            style={{ border: "1px solid #1e293b", background: "#020617" }}
                                            type="number"
                                            value={form.qualificationYears}
                                            onChange={(e) => setForm({ ...form, qualificationYears: e.target.value })}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <Form.Group className="mb-3">
                                <label className="selection-label-dark">Description</label>
                                <Form.Control
                                    className="form-select-dark px-3 py-2 rounded-3"
                                    style={{ border: "1px solid #1e293b", background: "#020617" }}
                                    as="textarea"
                                    rows={3}
                                    placeholder="Brief details about this level..."
                                    value={form.qualificationDescription}
                                    onChange={(e) => setForm({ ...form, qualificationDescription: e.target.value })}
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

export default QualificationManager;